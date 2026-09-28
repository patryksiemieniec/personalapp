import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2',
        'text-sm text-zinc-950',
        'placeholder:text-zinc-400',
        'outline-none transition',
        'focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100',
        className,
      )}
      {...props}
    />
  );
}
