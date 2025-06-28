import clsx from 'clsx';
import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

const baseStyles =
  'inline-flex items-center justify-center text-black font-medium rounded-xl border border-gray-300 px-3 py-1';

const Badge = ({ className, children }: BadgeProps) => {
  const classes = clsx(baseStyles, className);

  return <div className={classes}>{children}</div>;
};

export default Badge;
