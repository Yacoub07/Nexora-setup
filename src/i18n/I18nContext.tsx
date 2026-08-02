import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'fr' | 'ar' | 'es' | 'pt' | 'bm';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan', flag: '🇲🇱', dir: 'ltr' },
];

export interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  missingKeys: string[];
}

const STORAGE_KEY = 'nexora_global_language';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Import translation namespaces
import { enTranslations } from './locales/en';
import { frTranslations } from './locales/fr';
import { arTranslations } from './locales/ar';
import { esTranslations } from './locales/es';
import { ptTranslations } from './locales/pt';
import { bmTranslations } from './locales/bm';

const TRANSLATION_MAP: Record<SupportedLanguage, Record<string, any>> = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations,
  es: esTranslations,
  pt: ptTranslations,
  bm: bmTranslations,
};

function getNestedValue(obj: any, path: string): string | undefined {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
    return 'en';
  });

  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const dir = langMeta.dir;
  const isRtl = dir === 'rtl';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language, dir]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // 1. Try target language dictionary
    let text = getNestedValue(TRANSLATION_MAP[language], key);

    // 2. Fallback to English
    if (text === undefined && language !== 'en') {
      text = getNestedValue(TRANSLATION_MAP['en'], key);
    }

    // 3. Fallback to raw key if missing
    if (text === undefined) {
      if (!missingKeys.includes(key)) {
        setMissingKeys((prev) => [...prev, key]);
      }
      const keyParts = key.split('.');
      text = keyParts[keyParts.length - 1].replace(/_/g, ' ');
    }

    // 4. Interpolate parameters {varName}
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text!.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        isRtl,
        t,
        missingKeys,
      }}
    >
      <div dir={dir} className={isRtl ? 'font-sans rtl-active' : 'font-sans'}>
        {children}
      </div>
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
