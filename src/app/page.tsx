import Image from 'next/image';

import { fetchIssues, fetchUserData } from '@/lib/github';

import { ContentHeader } from '@/components/ContentHeader';
import { ArrowUpRightFromSquare } from '@/svgs/ArrowUpRightFromSquare';
import { GithubBrand } from '@/svgs/GithubBrand';
import { Building } from '@/svgs/Building';
import { UserGroup } from '@/svgs/UserGroup';
import { Posts } from './Posts';

export const metadata = {
  title: 'GitHub Blog',
  description: 'Blog que usa issues do GitHub como posts',
  icons: {
    icon: '/favicon.svg',
  },
};

const HomePage = async () => {
  const userData = await fetchUserData();
  const initialPosts = await fetchIssues();

  return (
    <main className="pb-48">
      <ContentHeader className="flex flex-col items-center gap-8 md:flex-row md:items-stretch">
        <Image
          className="rounded-lg object-cover"
          src={userData.avatar_url}
          alt="Foto de perfil do autor"
          width={148}
          height={148}
          priority
        />
        <div className="flex w-full flex-col">
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
            <h1 className="text-2xl font-bold leading-tight text-slate-50">
              {userData.name || userData.login}
            </h1>
            <a
              className="link-border flex items-center gap-2 text-xs font-bold uppercase leading-relaxed text-brand-blue"
              href={userData.html_url}
            >
              GitHub <ArrowUpRightFromSquare className="h-3 w-3" />
            </a>
          </div>

          <p className="mt-2">{userData.bio}</p>

          <ul
            className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 md:mt-auto"
            aria-label="Detalhes do usuário"
          >
            <li>
              <a
                className="flex items-center gap-2 [&>svg]:hover:text-slate-50"
                href={userData.html_url}
              >
                <GithubBrand
                  className="h-5 w-5 text-slate-600 transition-colors"
                  aria-label="GitHub"
                />{' '}
                <span className="text-slate-200">{userData.login}</span>
              </a>
            </li>
            {userData.company && (
              <li className="flex items-center gap-2">
                <Building
                  className="h-5 w-5 text-slate-600 transition-colors"
                  aria-label="Empresa"
                />{' '}
                <span className="text-slate-200">{userData.company}</span>
              </li>
            )}
            <li className="flex items-center gap-2">
              <UserGroup
                className="h-5 w-5 text-slate-600 transition-colors"
                aria-hidden
              />{' '}
              <span className="text-slate-200">
                {userData.followers}{' '}
                {userData.followers === 1 ? 'seguidor' : 'seguidores'}
              </span>
            </li>
          </ul>
        </div>
      </ContentHeader>

      <Posts initialPosts={initialPosts} />
    </main>
  );
};

export default HomePage;
