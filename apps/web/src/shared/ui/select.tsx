import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-lg border border-zinc-200 bg-white px-3',
        'text-sm text-zinc-950',
        'outline-none transition',
        'focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100',
        className,
      )}
      {...props}
    />
  );
}
