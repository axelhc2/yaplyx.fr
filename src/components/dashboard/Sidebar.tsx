'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import DashboardIcon from '@/components/icons/DashboardIcon';
import ServicesIcon from '@/components/icons/ServicesIcon';
import InvoicesIcon from '@/components/icons/InvoicesIcon';
import SupportIcon from '@/components/icons/SupportIcon';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const isDark = true; // Vous pouvez détecter le thème si nécessaire

  const menuItems = [
    {
      name: t('dashboard_sidebar_dashboard'),
      href: '/dashboard',
      icon: DashboardIcon,
    },
    {
      name: t('dashboard_sidebar_services'),
      href: '/dashboard/services',
      icon: ServicesIcon,
    },
    {
      name: t('dashboard_sidebar_invoices'),
      href: '/dashboard/invoices',
      icon: InvoicesIcon,
    },
    {
      name: t('dashboard_sidebar_support'),
      href: '/dashboard/support',
      icon: SupportIcon,
    },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl border-r border-gray-200/50 dark:border-[#1A1A1A] flex flex-col z-50 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo avec bouton fermer sur mobile */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200/50 dark:border-[#1A1A1A]">
          <Link href="/dashboard" className="flex items-center" onClick={() => close()}>
            <Image
              src="https://digmma.fr/assets/img/logo/logo2.png"
              alt="Yaplyx Logo"
              width={120}
              height={40}
              className="h-8 w-auto dark:brightness-0 dark:invert"
            />
          </Link>
          <button
            onClick={close}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-[#1A1A1A] transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Pour /dashboard, on vérifie seulement l'égalité exacte
          // Pour les autres routes, on vérifie si le pathname commence par l'href
          const isActive = item.href === '/dashboard' 
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => close()}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white shadow-lg shadow-[#d23f26]/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <div className={cn(
                'w-5 h-5 flex-shrink-0 transition-colors',
                isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-[#d23f26]'
              )}>
                <Icon className="w-full h-full" onDark={isDark} />
              </div>
              <span 
                className={cn(
                  'font-medium text-sm',
                  isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200/50 dark:border-[#1A1A1A]">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          © 2025 Yaplyx
        </div>
      </div>
    </aside>
    </>
  );
}










