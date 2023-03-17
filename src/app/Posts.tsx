'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { capitalizeFirstWord } from '@/utils/capitalize-first-word';
import { removeMarkdown } from '@/utils/remove-markdown';
import type { Issue, Search } from '@/types/github';

const searchFormSchema = z.object({
  query: z.string().refine((value) => {
    const hasQualifiers = z
      .string()
      .regex(/\S+:\S+/)
      .safeParse(value).success;
    return !hasQualifiers;
  }, 'Pesquisa não pode conter qualificadores (exemplo: "qualificador:valor")'),
});

type SearchFormSchema = z.infer<typeof searchFormSchema>;

type PostsProps = {
  initialPosts: Issue[];
};

export const Posts = ({ initialPosts }: PostsProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SearchFormSchema>({
    resolver: zodResolver(searchFormSchema),
  });
  const [posts, setPosts] = useState<Issue[]>(initialPosts);

  async function handleSearchPosts({ query }: SearchFormSchema) {
    const posts =
      query.length > 0
        ? (
            (await fetch(`/api/search-posts?q=${query}`).then((res) =>
              res.json()
            )) as Search<Issue>
          ).items
        : initialPosts;

    setPosts(posts);
  }

  return (
    <>
      <form
        className="custom-margin mt-[4.5rem]"
        /* This warning simply doesn't make sense. If the return type is `void`,
        then it doesn't matter if the function returns `Promise<void>` or any
        other type */
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(handleSearchPosts)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold leading-relaxed text-slate-200">
            Publicações
          </h2>
          <span className="text-sm leading-relaxed text-slate-400">
            {posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}
          </span>
        </div>

        <label htmlFor="search-input" className="sr-only">
          Buscar conteúdo
        </label>
        <input
          id="search-input"
          className="mt-3 w-full rounded-md border border-slate-800 bg-black px-4 py-3 [&:not(:placeholder-shown)]:border-brand-blue"
          type="text"
          placeholder="Buscar conteúdo"
          aria-describedby={
            errors.query?.message ? 'search-input-error' : undefined
          }
          {...register('query')}
        />
        {errors.query?.message && (
          <span id="search-input-error" className="mt-2 block text-red-500">
            {errors.query.message}
          </span>
        )}
      </form>

      <ul
        className="custom-margin mt-12 grid gap-8 sm:grid-cols-[repeat(auto-fill,minmax(22.5rem,1fr))]"
        aria-label="Posts"
      >
        {posts.map((post) => (
          <li key={post.number} className="min-w-0 rounded-lg bg-slate-850 p-8">
            <div className="flex flex-col items-baseline justify-between gap-x-4 lg:flex-row">
              <strong className="flex-1 text-xl leading-relaxed text-slate-50">
                <Link href={`/post/${post.number}`}>{post.title}</Link>
              </strong>
              <time
                className="text-sm leading-relaxed text-slate-400"
                dateTime={post.created_at}
              >
                {capitalizeFirstWord(
                  formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })
                )}
              </time>
            </div>

            <p className="mt-5 overflow-hidden text-ellipsis break-words [-webkit-line-clamp:4] [display:-webkit-box] [-webkit-box-orient:vertical]">
              {removeMarkdown(post.body.substring(0, 500))}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};
