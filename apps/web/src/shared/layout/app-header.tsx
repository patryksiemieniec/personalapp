export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-zinc-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex w-full items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">Personal operations dashboard</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white">
            PO
          </div>
        </div>
      </div>
    </header>
  );
}
