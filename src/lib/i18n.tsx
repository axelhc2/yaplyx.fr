'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import FR from '@/locales/FR.json';
import EN from '@/locales/EN.json';

type Language = 'FR' | 'EN';

type Translations = typeof FR;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  FR,
  EN,
};

// Fonction pour détecter la langue du navigateur
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'FR';
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLang.split('-')[0].toUpperCase();
  
  // Si la langue est FR, retourner FR, sinon EN par défaut
  if (langCode === 'FR') {
    return 'FR';
  }
  return 'EN';
}

// Fonction pour récupérer la langue depuis les cookies
function getLanguageFromCookie(): Language | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'locale') {
      return (value.toUpperCase() as Language) || null;
    }
  }
  return null;
}

// Fonction pour sauvegarder la langue dans les cookies
function setLanguageCookie(lang: Language) {
  if (typeof document === 'undefined') return;
  
  // Cookie valide pour 1 an
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  
  document.cookie = `locale=${lang}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Utiliser 'FR' par défaut pour éviter les erreurs d'hydratation
    // La langue sera mise à jour après le montage si nécessaire
    return 'FR';
  });
  
  useEffect(() => {
    // Après le montage, détecter la langue réelle
    const cookieLang = getLanguageFromCookie();
    if (cookieLang && (cookieLang === 'FR' || cookieLang === 'EN')) {
      setLanguageState(cookieLang);
      return;
    }
    
    const detectedLang = detectBrowserLanguage();
    setLanguageState(detectedLang);
  }, []);

  useEffect(() => {
    // Sauvegarder dans le cookie à chaque changement
    setLanguageCookie(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLanguageCookie(lang);
  };

  const t = (key: string): string => {
    const translation = translations[language];
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
    
    const keys = key.split('.');
    let value: any = translation;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}






