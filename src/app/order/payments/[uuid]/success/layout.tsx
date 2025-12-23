'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { SidebarProvider } from '@/contexts/SidebarContext';

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-white dark:bg-black">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}












