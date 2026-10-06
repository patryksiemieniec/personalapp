import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-500">404</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Page not found</h1>

        <p className="mt-3 text-sm text-zinc-500">The page you are looking for does not exist.</p>

        <Link
          href="/tasks"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Back to tasks
        </Link>
      </div>
    </main>
  );
}
