// app/components/Footer.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Phone, MapPin, Twitter, Github, Linkedin, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function Footer() {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const navigation = [
    { name: t('navbar_home'), href: '/' },
    { name: t('navbar_offers'), href: '/offres' },
    { name: t('navbar_explanations'), href: '/explications' },
    { name: t('navbar_contact'), href: '/contact' },
  ];

  const legal = [
    { name: t('footer_privacy'), href: '/privacy' },
    { name: t('footer_terms'), href: '/terms' },
    { name: t('footer_rgpd'), href: '/rgpd' },
  ];

  const social = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ];


  return (
    <footer className="relative overflow-hidden">

      {/* Footer classique avec informations */}
      <div className="relative bg-white dark:bg-black">
        {/* Fond avec gradient subtil */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20" />

        {/* Formes géométriques subtiles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-slate-100/15 to-purple-100/15 dark:from-slate-900/5 dark:to-purple-900/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-100/10 to-cyan-100/10 dark:from-indigo-900/5 dark:to-cyan-900/5 rounded-full blur-xl" />
        </div>

        {/* Motif de fond discret */}
        <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
          {/* Section principale */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Logo et description */}
            <div className={`lg:col-span-2 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d23f26] to-[#b83220] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">Yaplyx</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-400 max-w-md leading-relaxed mb-6">
                {t('footer_description')}
              </p>

              {/* Contact rapide */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 text-[#d23f26]" />
                  <span>contact@yaplyx.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 text-[#d23f26]" />
                  <span>+33 (0)1 XX XX XX XX</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-[#d23f26]" />
                  <span>Paris, France</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className={`transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                {t('footer_navigation')}
              </h3>
              <ul className="space-y-3">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-600 dark:text-gray-400 hover:text-[#d23f26] dark:hover:text-[#d23f26] transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal et réseaux sociaux */}
            <div className={`transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                {t('footer_legal')}
              </h3>
              <ul className="space-y-3 mb-6">
                {legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-600 dark:text-gray-400 hover:text-[#d23f26] dark:hover:text-[#d23f26] transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Réseaux sociaux */}
              <div className="flex gap-3">
                {social.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-black flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-[#d23f26] hover:text-white dark:hover:bg-[#d23f26] transition-all duration-200 hover:scale-110"
                      aria-label={item.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Barre de séparation avec effet */}
          <div className="relative mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-gray-700 to-transparent" />
          </div>

          {/* Copyright */}
          <div className={`text-center transition-all duration-1000 delay-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-sm text-slate-600 dark:text-gray-400">
              {t('footer_copyright')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
