import type { InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-zinc-200 bg-white px-3',
        'text-sm text-zinc-950',
        'placeholder:text-zinc-400',
        'outline-none transition',
        'focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100',
        'disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-70',
        className,
      )}
      {...props}
    />
  );
}
