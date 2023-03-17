import { type Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import '@/styles/dracula.css';

import { fetchIssueData } from '@/lib/github';
import { capitalizeFirstWord } from '@/utils/capitalize-first-word';

import { ContentHeader } from '@/components/ContentHeader';
import { ChevronLeft } from '@/svgs/ChevronLeft';
import { ArrowUpRightFromSquare } from '@/svgs/ArrowUpRightFromSquare';
import { GithubBrand } from '@/svgs/GithubBrand';
import { CalendarDay } from '@/svgs/CalendarDay';
import { Comment } from '@/svgs/Comment';

type PostPageParams = {
  number: string;
};

export async function generateMetadata({
  params,
}: {
  params: PostPageParams;
}): Promise<Metadata> {
  const post = await fetchIssueData(params.number);
  return { title: post.title };
}

const PostPage = async ({ params }: { params: PostPageParams }) => {
  const post = await fetchIssueData(params.number);

  return (
    <main className="pb-48">
      <ContentHeader>
        <div className="flex justify-between">
          <Link
            className="link-border flex items-center gap-2 text-xs font-bold uppercase leading-none text-brand-blue"
            href="/"
          >
            <ChevronLeft className="h-3 w-3" aria-hidden /> Voltar
          </Link>
          <a
            className="link-border flex items-center gap-2 text-xs font-bold uppercase leading-relaxed text-brand-blue"
            href={post.html_url}
          >
            Ver no GitHub{' '}
            <ArrowUpRightFromSquare className="h-3 w-3" aria-hidden />
          </a>
        </div>

        <h1 className="mt-5 text-2xl font-bold leading-tight text-slate-50">
          {post.title}
        </h1>

        <ul
          className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1"
          aria-label="Detalhes do post"
        >
          <li>
            <a
              className="flex items-center gap-2 [&>svg]:hover:text-slate-50"
              href={post.user.html_url}
            >
              <GithubBrand
                className="h-5 w-5 text-slate-600 transition-colors"
                aria-label="GitHub"
              />{' '}
              <span className="text-slate-400">{post.user.login}</span>
            </a>
          </li>
          <li className="flex items-center gap-2">
            <CalendarDay
              className="h-5 w-5 text-slate-600 transition-colors"
              aria-hidden
            />{' '}
            <time className="text-slate-400" dateTime={post.created_at}>
              {capitalizeFirstWord(
                formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })
              )}
            </time>
          </li>
          <li className="flex items-center gap-2">
            <Comment
              className="h-5 w-5 text-slate-600 transition-colors"
              aria-hidden
            />{' '}
            <span>
              {post.comments}{' '}
              {post.comments === 1 ? 'comentário' : 'comentários'}
            </span>
          </li>
        </ul>
      </ContentHeader>

      <div className="prose custom-margin mt-10 prose-headings:text-slate-50 prose-p:text-slate-300 prose-a:text-brand-blue prose-strong:text-slate-200 prose-pre:bg-slate-850 prose-li:text-slate-300 [&:not([class~='hljs'])]:prose-code:text-slate-200">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.body}
        </ReactMarkdown>
      </div>
    </main>
  );
};

export default PostPage;
