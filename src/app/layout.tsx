import { Nunito } from 'next/font/google';
import { type FC, type PropsWithChildren } from 'react';

import '@/styles/globals.css';

import { Logo } from './Logo';
import { HeaderLinesLeft } from './HeaderLinesLeft';
import { HeaderLinesRight } from './HeaderLinesRight';

const nunito = Nunito({
  variable: '--font-nunito',
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="pt-br" className={`${nunito.variable}`}>
    <body className="isolate bg-slate-950 leading-relaxed text-slate-300 [-moz-osx-font-smoothing:grayscale] [-webkit-font-smoothing:antialiased]">
      <header className="relative -z-10 -mb-24 flex h-72 items-center justify-center overflow-hidden bg-slate-900">
        <HeaderLinesLeft className="absolute left-0" aria-hidden />
        <h1>
          <span className="sr-only">GitHub Blog</span>
          <Logo className="absolute top-16 -translate-x-1/2" aria-hidden />
        </h1>
        <HeaderLinesRight
          className="absolute right-0 hidden md:block"
          aria-hidden
        />
        <div className="absolute bottom-0 mx-auto h-14 w-[calc(100%-2*var(--min-margin-x))] max-w-[60rem] bg-[#14589C] blur-[128px] [--min-margin-x:1rem]" />
      </header>

      {children}
    </body>
  </html>
);

export default RootLayout;
