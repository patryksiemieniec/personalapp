import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4',
        'text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-zinc-900 text-white hover:bg-zinc-800',
        variant === 'secondary' &&
          'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100',
        variant === 'ghost' && 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        className,
      )}
      {...props}
    />
  );
}
