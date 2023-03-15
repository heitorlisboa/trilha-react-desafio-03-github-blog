export type AccessTokenResponse = {
  token: string;
};

export type GithubError = {
  message: string;
};

export type Installation = {
  id: number;
  account: {
    login: string;
  };
};

export type Issue = {
  html_url: string;
  number: number;
  title: string;
  body: string;
};

export type User = {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  bio: string;
  followers: number;
};
