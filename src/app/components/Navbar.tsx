// app/components/Navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun, Monitor, Globe, ChevronDown, Check, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState<'light' | 'dark' | 'system'>('system');
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState('FR');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode === 'dark' || (darkMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const languages = [
    { code: 'FR', name: 'Français', flag: 'FR' },
    { code: 'EN', name: 'English', flag: 'GB' },
    { code: 'ES', name: 'Español', flag: 'ES' },
  ];

  return (
    <>
      {/* Top bar fixe avec effets */}
      <div className="fixed top-0 left-0 right-0 z-[99999] border-b border-gray-200/40 dark:border-gray-800/40 bg-white/30 dark:bg-[#050505] backdrop-blur-xl">
        {/* Ligne décorative subtile */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/50 dark:via-gray-600/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-9 text-xs">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition font-medium"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{lang}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/80 dark:border-gray-800 z-[999999] overflow-hidden">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => { setLang(item.code); setLangOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      <span className="text-lg">{item.flag}</span>
                      <span className="flex-1 text-left">{item.name}</span>
                      {lang === item.code && <Check className="w-4 h-4 text-[#d23f26]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-4">
              <div className="flex bg-gray-100 dark:bg-gray-900 rounded-full p-0.5">
                {[{ icon: Sun, mode: 'light' }, { icon: Moon, mode: 'dark' }, { icon: Monitor, mode: 'system' }].map(({ icon: Icon, mode }) => (
                  <button
                    key={mode}
                    onClick={() => setDarkMode(mode as any)}
                    className={`p-1.5 rounded-full transition ${darkMode === mode ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
              <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                Connexion
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 text-gray-700 dark:text-gray-300"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navbar principale */}
      <nav className={`fixed inset-x-0 top-9 z-[9999] transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-gray-200/30 dark:border-gray-800/30' : 'bg-white/70 dark:bg-black/70 backdrop-blur-xl'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image 
                src="https://digmma.fr/assets/img/logo/logo2.png" 
                alt="Logo" 
                width={120} 
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition">Accueil</Link>
              <Link href="/offres" className="hover:text-gray-900 dark:hover:text-white transition">Offres</Link>
              <Link href="/explications" className="hover:text-gray-900 dark:hover:text-white transition">Explications</Link>
              <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white transition">Contact</Link>
            </div>

            <Link
              href="/commencer"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#d23f26] hover:bg-[#b83220] rounded-full transition-all hover:scale-105 shadow-md hidden sm:block"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* MENU MOBILE – Slide-in élégant depuis la droite (le vrai style 2025) */}
      <div className={`fixed inset-0 z-[999999] pointer-events-none`}>
        <div className={`absolute inset-y-0 right-0 w-80 max-w-full pointer-events-auto transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Fond sombre semi-transparent */}
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />

          {/* Panel menu */}
          <div className="relative h-full bg-white dark:bg-gray-950 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-800">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <nav className="p-6 space-y-6">
              <Link href="/" onClick={() => setMobileOpen(false)} className="block text-lg font-medium text-gray-900 dark:text-white hover:text-[#d23f26] transition">
                Accueil
              </Link>
              <Link href="/offres" onClick={() => setMobileOpen(false)} className="block text-lg font-medium text-gray-900 dark:text-white hover:text-[#d23f26] transition">
                Offres
              </Link>
              <Link href="/explications" onClick={() => setMobileOpen(false)} className="block text-lg font-medium text-gray-900 dark:text-white hover:text-[#d23f26] transition">
                Explications
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="block text-lg font-medium text-gray-900 dark:text-white hover:text-[#d23f26] transition">
                Contact
              </Link>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/50 dark:border-gray-800 space-y-4">
              <Link
                href="/commencer"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 text-white bg-[#d23f26] hover:bg-[#b83220] rounded-xl font-semibold shadow-lg transition"
              >
                Commencer
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </>
  );
}