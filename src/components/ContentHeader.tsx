import { type FC, type PropsWithChildren } from 'react';

type ContentHeaderProps = PropsWithChildren<{
  className?: string;
}>;

export const ContentHeader: FC<ContentHeaderProps> = ({
  children,
  className,
}) => (
  <header
    className={
      'mx-auto w-[calc(100%-2*var(--min-margin-x))] max-w-4xl rounded-lg bg-slate-900 p-8 shadow-[0_2px_28px_0_rgb(0_0_0_/_0.05)] shadow-black/20 [--min-margin-x:1rem] sm:[--min-margin-x:1.5rem]' +
      (className ? ` ${className}` : '')
    }
  >
    {children}
  </header>
);
