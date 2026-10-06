'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib/cn';

const navigation = [
  {
    label: 'Tasks',
    href: '/tasks',
  },
  {
    label: 'Fitness',
    href: '/fitness',
  },
  {
    label: 'Car',
    href: '/car',
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6">
        <Link href="/tasks" className="text-lg font-semibold tracking-tight text-zinc-950">
          Personal Ops
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
