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
      'custom-margin rounded-lg bg-slate-900 p-8 shadow-[0_2px_28px_0_rgb(0_0_0_/_0.05)] shadow-black/20' +
      (className ? ` ${className}` : '')
    }
  >
    {children}
  </header>
);
