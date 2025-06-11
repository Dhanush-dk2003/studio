
import type { ReactNode } from 'react';
import { SidebarNav } from "./sidebar-nav";
import { UserNav } from "./user-nav";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <SidebarNav />
      </aside>
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-4 border-b bg-background px-4 md:px-8 shadow-sm">
          {/* Add mobile nav toggle here if needed */}
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
