import { NextRequest } from 'next/server';
import FR from '@/locales/FR.json';
import EN from '@/locales/EN.json';

type Language = 'FR' | 'EN';
type Translations = typeof FR;

const translations: Record<Language, Translations> = {
  FR,
  EN,
};

// Fonction pour détecter la langue depuis la requête
export function getLanguageFromRequest(request: NextRequest): Language {
  // 1. Vérifier le cookie
  const cookieLang = request.cookies.get('locale')?.value?.toUpperCase();
  if (cookieLang === 'FR' || cookieLang === 'EN') {
    return cookieLang;
  }

  // 2. Vérifier l'header Accept-Language
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const langCode = acceptLanguage.split(',')[0].split('-')[0].toUpperCase();
    if (langCode === 'FR') {
      return 'FR';
    }
  }

  // 3. Par défaut FR
  return 'FR';
}

// Fonction pour obtenir une traduction côté serveur
export function t(request: NextRequest, key: string, params?: Record<string, string>): string {
  const language = getLanguageFromRequest(request);
  const translation = translations[language];
  
  if (!translation) {
    console.warn(`Translation not found for language: ${language}`);
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
  
  let result = typeof value === 'string' ? value : key;
  
  // Remplacer les paramètres si fournis
  if (params) {
    Object.keys(params).forEach(param => {
      result = result.replace(`{${param}}`, params[param]);
    });
  }
  
  return result;
}









