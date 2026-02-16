import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'nl' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Headings
    'headline.title': 'Estimate your savings with MiniGro',
    'headline.subtitle': 'Estimate your monthly savings in 60 seconds.',

    // Hero card
    'results.netSavings': 'Net savings',
    'results.payback': 'Payback',
    'results.units': 'Units',
    'results.unitsManual': 'Units (manual)',
    'results.coverage': 'Coverage',
    'results.noPayback': 'No payback',
    'results.spareCapacity': 'Spare capacity',
    'results.spareCapacityHint':
      'Extra capacity you could use to replace more spend (e.g. herbs or garnish).',
    'results.lowCoverageHint':
      'Coverage is below 70%. Switch to Full coverage to replace most of your spend.',

    // Mode toggle
    'results.bestPayback': 'Best payback',
    'results.fullCoverage': 'Full coverage',
    'results.bestPaybackDesc':
      'Fastest payback while covering at least 70% of what you use.',
    'results.fullCoverageDesc':
      'Replaces 100% of what you actually use.',

    // Proof cards
    'results.payPerMonth': 'You pay per month',
    'results.useAfterWaste': 'You actually use (after waste)',
    'results.operatingCost': 'Monthly operating cost',

    // Details
    'results.details': 'Details',
    'results.replaces': 'Replaces',
    'results.carePlan': 'Care plan',
    'results.electricity': 'Electricity',
    'results.labour': 'Labour',

    // Footer
    'results.footerVat': 'All amounts exclude VAT.',
    'results.footerEstimate':
      'Estimates depend on crop mix and kitchen workflow.',
  },

  nl: {
    'headline.title': 'Bereken je besparing met MiniGro',
    'headline.subtitle':
      'Bereken je maandelijkse besparing in 60 seconden.',

    'results.netSavings': 'Netto besparing',
    'results.payback': 'Terugverdientijd',
    'results.units': 'Units',
    'results.unitsManual': 'Units (handmatig)',
    'results.coverage': 'Dekking',
    'results.noPayback': 'Geen terugverdientijd',
    'results.spareCapacity': 'Overcapaciteit',
    'results.spareCapacityHint':
      'Extra capaciteit waarmee je meer kosten kunt vervangen (bijv. kruiden of garnish).',
    'results.lowCoverageHint':
      'Dekking is lager dan 70%. Schakel naar Volledige dekking om het meeste te vervangen.',

    'results.bestPayback': 'Beste terugverdientijd',
    'results.fullCoverage': 'Volledige dekking',
    'results.bestPaybackDesc':
      'Snelste terugverdientijd terwijl minimaal 70% wordt gedekt.',
    'results.fullCoverageDesc':
      'Vervangt 100% van wat je daadwerkelijk gebruikt.',

    'results.payPerMonth': 'Je betaalt per maand',
    'results.useAfterWaste': 'Je gebruikt daadwerkelijk (na waste)',
    'results.operatingCost': 'Maandelijkse gebruikskosten',

    'results.details': 'Details',
    'results.replaces': 'Vervangt',
    'results.carePlan': 'Care plan',
    'results.electricity': 'Elektriciteit',
    'results.labour': 'Arbeid',

    'results.footerVat': 'Alle bedragen zijn excl. btw.',
    'results.footerEstimate':
      'Schattingen hangen af van teeltmix en keukenworkflow.',
  },

  de: {
    'headline.title': 'Berechnen Sie Ihre Einsparungen mit MiniGro',
    'headline.subtitle':
      'Berechnen Sie Ihre monatlichen Einsparungen in 60 Sekunden.',

    'results.netSavings': 'Netto-Ersparnis',
    'results.payback': 'Amortisation',
    'results.units': 'Einheiten',
    'results.unitsManual': 'Einheiten (manuell)',
    'results.coverage': 'Abdeckung',
    'results.noPayback': 'Keine Amortisation',
    'results.spareCapacity': 'Freie Kapazität',
    'results.spareCapacityHint':
      'Zusätzliche Kapazität, um weitere Ausgaben zu ersetzen (z.B. Kräuter oder Garnitur).',
    'results.lowCoverageHint':
      'Abdeckung unter 70%. Wechseln Sie zu Volle Abdeckung.',

    'results.bestPayback': 'Beste Amortisation',
    'results.fullCoverage': 'Volle Abdeckung',
    'results.bestPaybackDesc':
      'Schnellste Amortisation bei mindestens 70% Abdeckung.',
    'results.fullCoverageDesc':
      'Ersetzt 100% von dem, was Sie tatsächlich nutzen.',

    'results.payPerMonth': 'Sie zahlen pro Monat',
    'results.useAfterWaste':
      'Sie nutzen tatsächlich (nach Abfall)',
    'results.operatingCost': 'Monatliche Betriebskosten',

    'results.details': 'Details',
    'results.replaces': 'Ersetzt',
    'results.carePlan': 'Care-Plan',
    'results.electricity': 'Strom',
    'results.labour': 'Arbeit',

    'results.footerVat':
      'Alle Beträge verstehen sich exkl. MwSt.',
    'results.footerEstimate':
      'Schätzungen hängen von Anbaumix und Küchenworkflow ab.',
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

  const t = (key: string) => {
    return translations[language][key] ?? key;
  };

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
