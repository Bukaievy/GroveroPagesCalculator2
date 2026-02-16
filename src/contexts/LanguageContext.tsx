import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'nl' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'hero.title': 'Estimate your savings with MiniGro',
    'hero.subtitle': 'Estimate your monthly savings in 60 seconds.',

    'results.netSavings': 'Net savings',
    'results.payback': 'Payback',
    'results.units': 'Units',
    'results.coverage': 'Coverage',
    'results.bestPayback': 'Best payback',
    'results.fullCoverage': 'Full coverage',
  },

  nl: {
    'hero.title': 'Bereken je besparing met MiniGro',
    'hero.subtitle': 'Bereken je maandelijkse besparing in 60 seconden.',

    'results.netSavings': 'Netto besparing',
    'results.payback': 'Terugverdientijd',
    'results.units': 'Units',
    'results.coverage': 'Dekking',
    'results.bestPayback': 'Beste terugverdientijd',
    'results.fullCoverage': 'Volledige dekking',
  },

  de: {
    'hero.title': 'Berechnen Sie Ihre Einsparungen mit MiniGro',
    'hero.subtitle':
      'Berechnen Sie Ihre monatlichen Einsparungen in 60 Sekunden.',

    'results.netSavings': 'Netto-Ersparnis',
    'results.payback': 'Amortisation',
    'results.units': 'Einheiten',
    'results.coverage': 'Abdeckung',
    'results.bestPayback': 'Beste Amortisation',
    'results.fullCoverage': 'Volle Abdeckung',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: key => key,
});

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) =>
    translations[language][key] ?? key;

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () =>
  useContext(LanguageContext);
