import 'server-only';
import { notFound } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { env } from '@/env.mjs';
import type {
  AccessTokenResponse,
  GithubError,
  Installation,
  Issue,
  Search,
  User,
} from '@/types/github';

let accessToken: string;

function generateGithubAppJwt() {
  return jwt.sign(
    {
      // 1. Converting the milliseconds to seconds then rounding it down
      // 2. Going 60 in the past to allow for clock drift
      iat: Math.floor(Date.now() / 1000) - 60,
      iss: env.GITHUB_APP_ID,
    },
    env.GITHUB_APP_PRIVATE_KEY,
    { algorithm: 'RS256', expiresIn: '10m' }
  );
}

async function getInstallationId(appToken: string) {
  const data = (await fetchGithub(
    '/app/installations',
    appToken
  )) as Installation[];

  const installation = data.find(
    (installation) => installation.account.login === env.GITHUB_USERNAME
  );

  if (!installation)
    throw new Error(
      'GitHub App installation not found for the username defined in the environment variables'
    );

  return installation.id;
}

async function setAccessToken() {
  const appToken = generateGithubAppJwt();
  const installationId = await getInstallationId(appToken);
  const data = (await fetchGithub(
    `/app/installations/${installationId}/access_tokens`,
    appToken,
    { method: 'POST' }
  )) as AccessTokenResponse;

  accessToken = data.token;
}

/**
 * Returns `true` if there's an error or `false` if there's not.
 */
function checkIsGithubError(data: unknown): data is GithubError {
  const githubErrorSchema = z.object({ message: z.string() });
  const parseResult = githubErrorSchema.safeParse(data);

  return parseResult.success;
}

async function fetchGithub(
  path: string,
  token: string,
  opts: RequestInit = {}
) {
  function createGithubRequest(
    path: string,
    token: string,
    opts: RequestInit = {}
  ) {
    return fetch(`https://api.github.com${path}`, {
      ...opts,
      headers: {
        ...opts.headers,
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  let res = await createGithubRequest(path, token, opts);

  if (res.status === 401) {
    /* Assuming the request is using a user access token, since the requests
    using a GitHub app JWT already generates a new one before doing the request
    */
    // Setting the access token then using it
    await setAccessToken();
    res = await createGithubRequest(path, accessToken, opts);
  }

  const data = (await res.json()) as unknown;

  const isError = checkIsGithubError(data);
  if (isError) throw new Error(data.message);

  return data;
}

export async function fetchUserData() {
  return (await fetchGithub(
    `/users/${env.GITHUB_USERNAME}`,
    accessToken
  )) as User;
}

export async function fetchIssues() {
  return (await fetchGithub(
    `/repos/${env.GITHUB_USERNAME}/${env.GITHUB_REPOSITORY}/issues` +
      `?creator=${env.GITHUB_USERNAME}&labels=blog`,
    accessToken
  )) as Issue[];
}

export async function queryIssues(query: string) {
  return (await fetchGithub(
    `/search/issues?q=${query} repo:${env.GITHUB_USERNAME}/${env.GITHUB_REPOSITORY} author:${env.GITHUB_USERNAME} label:blog in:title,body`,
    accessToken
  )) as Search<Issue>;
}

export async function fetchIssueData(issueNumber: string | number) {
  try {
    return (await fetchGithub(
      `/repos/${env.GITHUB_USERNAME}/${env.GITHUB_REPOSITORY}/issues/${issueNumber}`,
      accessToken
    )) as Issue;
  } catch (error) {
    // If the error is that the issue was not found, return status 404
    if (error instanceof Error && error.message === 'Not Found')
      return notFound();
    // Any other error should be thrown again
    throw error;
  }
}
