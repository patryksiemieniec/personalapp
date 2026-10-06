'use client';

import { Button } from '@/shared/ui/button';

interface AppErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <div className="mx-auto max-w-2xl py-20">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-700">Something went wrong</p>

        <h1 className="mt-2 text-xl font-semibold text-red-950">
          We could not load this part of Personal Ops.
        </h1>

        <p className="mt-2 text-sm text-red-700">Try the operation again.</p>

        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 overflow-auto rounded-lg bg-red-100 p-3 text-xs text-red-900">
            {error.message}
          </pre>
        )}

        <Button className="mt-5" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
