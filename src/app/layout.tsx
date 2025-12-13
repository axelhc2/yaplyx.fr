// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Yaplyx – Cluster firewall nouvelle génération',
    template: '%s | Yaplyx',
  },
  description: 'Centralisez et automatisez la gestion de tous vos firewalls. Ajoutez des serveurs, configurez des règles, dormez tranquille.',
  metadataBase: new URL('https://yaplyx.com'),
  openGraph: {
    title: 'Yaplyx',
    description: 'Cluster firewall nouvelle génération',
    url: 'https://yaplyx.com',
    siteName: 'Yaplyx',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased relative overflow-x-hidden`}>
        {/* Particules globales subtiles */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[
            { left: 15, top: 20, delay: 2.1, duration: 12.3 },
            { left: 35, top: 45, delay: 5.4, duration: 10.8 },
            { left: 55, top: 15, delay: 1.7, duration: 14.2 },
            { left: 75, top: 60, delay: 3.9, duration: 11.6 },
            { left: 25, top: 80, delay: 6.2, duration: 13.1 },
            { left: 45, top: 35, delay: 0.8, duration: 12.9 },
            { left: 65, top: 70, delay: 4.5, duration: 10.4 },
            { left: 85, top: 25, delay: 2.8, duration: 14.7 },
            { left: 10, top: 55, delay: 7.1, duration: 11.8 },
            { left: 30, top: 10, delay: 3.2, duration: 13.5 },
            { left: 50, top: 75, delay: 1.4, duration: 12.2 },
            { left: 70, top: 40, delay: 5.7, duration: 10.9 },
            { left: 90, top: 65, delay: 0.5, duration: 14.1 },
            { left: 5, top: 30, delay: 4.1, duration: 11.3 },
            { left: 40, top: 85, delay: 6.8, duration: 13.7 },
            { left: 60, top: 5, delay: 2.6, duration: 12.5 },
            { left: 80, top: 50, delay: 3.7, duration: 10.6 },
            { left: 20, top: 90, delay: 1.9, duration: 14.4 },
            { left: 95, top: 12, delay: 5.3, duration: 11.7 },
            { left: 12, top: 68, delay: 4.8, duration: 13.2 },
            { left: 88, top: 32, delay: 0.2, duration: 12.8 },
            { left: 33, top: 88, delay: 6.5, duration: 10.1 },
            { left: 67, top: 22, delay: 3.4, duration: 14.6 },
            { left: 42, top: 57, delay: 2.3, duration: 11.9 },
            { left: 78, top: 8, delay: 7.4, duration: 13.8 }
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-gradient-to-r from-slate-400/20 to-slate-600/20 dark:from-gray-500/20 dark:to-gray-700/20 rounded-full animate-ping"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
          {[
            { left: 18, top: 28, delay: 1.2, duration: 13.5 },
            { left: 52, top: 12, delay: 4.7, duration: 11.8 },
            { left: 76, top: 67, delay: 2.9, duration: 14.2 },
            { left: 29, top: 43, delay: 6.1, duration: 12.6 },
            { left: 63, top: 81, delay: 0.8, duration: 13.9 },
            { left: 41, top: 34, delay: 3.6, duration: 11.3 },
            { left: 87, top: 56, delay: 5.4, duration: 14.7 },
            { left: 14, top: 72, delay: 2.1, duration: 12.4 },
            { left: 68, top: 19, delay: 4.2, duration: 13.1 },
            { left: 91, top: 47, delay: 1.7, duration: 11.5 },
            { left: 37, top: 89, delay: 5.9, duration: 14.3 },
            { left: 59, top: 23, delay: 3.3, duration: 12.7 }
          ].map((particle, i) => (
            <div
              key={`large-${i}`}
              className="absolute w-1 h-1 bg-gradient-to-r from-slate-300/10 to-slate-500/10 dark:from-gray-400/10 dark:to-gray-600/10 rounded-full animate-pulse"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>

        <ConditionalNavbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}