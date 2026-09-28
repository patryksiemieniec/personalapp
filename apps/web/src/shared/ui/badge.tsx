import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'muted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1',
        'text-xs font-medium',
        variant === 'default' && 'bg-zinc-100 text-zinc-700',
        variant === 'success' && 'bg-emerald-100 text-emerald-700',
        variant === 'warning' && 'bg-amber-100 text-amber-700',
        variant === 'danger' && 'bg-red-100 text-red-700',
        variant === 'muted' && 'bg-zinc-100 text-zinc-500',
        className,
      )}
      {...props}
    />
  );
}
