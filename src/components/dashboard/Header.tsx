'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Mail, Lock, Settings, LogOut, ChevronDown, Sun, Moon, Monitor, Globe, Check, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getGravatarUrl } from '@/lib/gravatar';
import { useTranslation } from '@/lib/i18n';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Header() {
  const router = useRouter();
  const { language, setLanguage, t } = useTranslation();
  const { toggle } = useSidebar();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState<'light' | 'dark' | 'system'>('system');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'FR' as const, name: t('navbar_lang_fr'), flag: '🇫🇷' },
    { code: 'EN' as const, name: t('navbar_lang_en'), flag: '🇬🇧' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          // Générer l'URL Gravatar
          if (data.user?.email) {
            const gravatarUrl = await getGravatarUrl(data.user.email, 256, 'mp');
            setAvatarUrl(gravatarUrl);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Gestion du dark mode
  useEffect(() => {
    // Récupérer la préférence depuis localStorage si disponible
    const savedMode = localStorage.getItem('darkMode') as 'light' | 'dark' | 'system' | null;
    if (savedMode) {
      setDarkMode(savedMode);
    }
  }, []);

  useEffect(() => {
    // Sauvegarder la préférence
    localStorage.setItem('darkMode', darkMode);
    
    // Appliquer le mode
    if (darkMode === 'dark' || (darkMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      const { fetchWithCSRF } = await import('@/lib/csrf-client');
      await fetchWithCSRF('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };


  if (loading) {
    return (
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-2xl border-b border-gray-200/50 dark:border-[#1A1A1A]">
        <div className="px-8 py-2">
          <div className="flex items-center justify-end">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.name || t('dashboard_header_user');

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-2xl border-b border-gray-200/50 dark:border-[#1A1A1A]">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between lg:justify-end gap-4">
          {/* Bouton hamburger pour mobile */}
          <button
            onClick={toggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-[#1A1A1A] transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition font-medium rounded-lg hover:bg-gray-100/50 dark:hover:bg-[#1A1A1A]"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-semibold">{language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/80 dark:border-gray-800 z-[999999] overflow-hidden">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => { setLanguage(item.code); setLangOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      <span className="text-lg">{item.flag}</span>
                      <span className="flex-1 text-left">{item.name}</span>
                      {language === item.code && <Check className="w-4 h-4 text-[#d23f26]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Switch Dark Mode */}
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-full p-0.5">
              {[{ icon: Sun, mode: 'light' }, { icon: Moon, mode: 'dark' }, { icon: Monitor, mode: 'system' }].map(({ icon: Icon, mode }) => (
                <button
                  key={mode}
                  onClick={() => setDarkMode(mode as any)}
                  className={cn(
                    'p-1.5 rounded-full transition',
                    darkMode === mode ? 'bg-white dark:bg-gray-800 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                  )}
                  title={mode === 'light' ? t('dashboard_header_light') : mode === 'dark' ? t('dashboard_header_dark') : t('dashboard_header_system')}
                >
                  <Icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
              ))}
            </div>

            {/* Dropdown Utilisateur */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-[#1A1A1A] transition-colors">
                <div className="relative">
                  <img
                    src={user?.image || avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=40&background=d23f26&color=fff`}
                    alt={fullName}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback vers ui-avatars si l'image échoue
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=40&background=d23f26&color=fff`;
                    }}
                  />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {fullName}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-2xl border border-gray-200/50 dark:border-[#1A1A1A]">
              {/* En-tête avec nom et prénom */}
              <DropdownMenuLabel className="px-4 py-3 border-b border-gray-200/50 dark:border-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user?.image || avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=40&background=d23f26&color=fff`}
                      alt={fullName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=40&background=d23f26&color=fff`;
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || ''}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>


              {/* Mes informations */}
              <DropdownMenuItem
                className="px-4 py-3 cursor-pointer"
                onClick={() => router.push('/dashboard/settings')}
              >
                <User className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('dashboard_header_my_info')}</span>
              </DropdownMenuItem>

              {/* Mes courriels reçus */}
              <DropdownMenuItem
                className="px-4 py-3 cursor-pointer"
                onClick={() => router.push('/dashboard/emails')}
              >
                <Mail className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('dashboard_header_my_emails')}</span>
              </DropdownMenuItem>

              {/* Modifier mot de passe */}
              <DropdownMenuItem
                className="px-4 py-3 cursor-pointer"
                onClick={() => router.push('/dashboard/password')}
              >
                <Lock className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('dashboard_header_change_password')}</span>
              </DropdownMenuItem>

              {/* Paramètres de sécurité */}
              <DropdownMenuItem
                className="px-4 py-3 cursor-pointer"
                onClick={() => router.push('/dashboard/security')}
              >
                <Settings className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('dashboard_header_security')}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-[#1A1A1A]" />

              {/* Déconnexion */}
              <DropdownMenuItem
                className="px-4 py-3 cursor-pointer text-[#d23f26] hover:text-[#b83220] focus:text-[#b83220] focus:bg-red-50/50 dark:focus:bg-red-900/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="text-sm font-medium">{t('dashboard_header_logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

