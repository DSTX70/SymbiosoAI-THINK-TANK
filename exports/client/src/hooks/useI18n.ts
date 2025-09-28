import { createContext, useContext } from 'react';

export interface I18nContextType {
  locale: string;
  t: (key: string, params?: Record<string, any>) => string;
  setLocale: (locale: string) => void;
  availableLocales: string[];
}

export const I18nContext = createContext<I18nContextType | null>(null);

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}