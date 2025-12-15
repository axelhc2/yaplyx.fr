'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Ne pas afficher la navbar sur les routes du dashboard et les pages avec layout dashboard
  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/order/payments') ||
    pathname?.startsWith('/invoices')
  ) {
    return null;
  }
  
  return <Navbar />;
}










