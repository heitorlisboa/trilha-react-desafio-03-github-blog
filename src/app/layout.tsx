import { Nunito } from 'next/font/google';
import { type FC, type PropsWithChildren } from 'react';

import '@/styles/globals.css';

const nunito = Nunito({
  variable: '--font-nunito',
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="pt-br" className={`${nunito.variable}`}>
    <body className="isolate bg-slate-950 leading-relaxed text-slate-300 [-moz-osx-font-smoothing:grayscale] [-webkit-font-smoothing:antialiased]">
      {children}
    </body>
  </html>
);

export default RootLayout;
