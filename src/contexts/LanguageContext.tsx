import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'nl' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // HERO
    'hero.title': 'Estimate your savings with MiniGro',
    'hero.subtitle': 'Estimate your monthly savings in 60 seconds.',

    // INPUTS
    'inputs.blockA.title': 'Current spend',
    'inputs.weeklySpend': 'Weekly microgreens spend (€)',
    'inputs.weeklySpendHelper': 'What you pay on invoices (average week).',

    'inputs.blockB.title': 'Waste and time',
    'inputs.assumptions': 'Assumptions',
    'inputs.presetTypical': 'Typical',
    'inputs.presetLowWaste': 'Low waste',
    'inputs.presetHighWaste': 'High waste',
    'inputs.presetCustom': 'Custom',

    'inputs.wasteEstimate': 'Waste (%)',
    'inputs.wasteHelper': 'Share thrown away or loses quality before use.',

    'inputs.labourCost': 'Labour cost (€/hour)',
    'inputs.labourCostHelper': 'Fully loaded kitchen labour cost.',

    'inputs.timePerWeekPerUnit': 'Time spent on MiniGro (min/week per unit)',
    'inputs.timePerWeekHelper': 'Assumed to scale linearly with number of units.',

    'inputs.electricityPerUnit': 'Electricity (€/month per unit)',
    'inputs.electricityHelper': 'Your estimate, or use the default.',

    'inputs.carePlan': 'Care plan',
    'inputs.carePlanOn': 'ON (€60/month per unit)',
    'inputs.carePlanOff': 'OFF (€0/month per unit)',
    'inputs.carePlanWhatsIncluded': 'What’s included?',

    // RESULTS
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

    'inputs.blockA.title': 'Huidige uitgaven',
    'inputs.weeklySpend': 'Wekelijkse microgreens uitgaven (€)',
    'inputs.weeklySpendHelper': 'Wat je betaalt op facturen (gemiddelde week).',

    'inputs.blockB.title': 'Waste en tijd',
    'inputs.assumptions': 'Aannames',
    'inputs.presetTypical': 'Typisch',
    'inputs.presetLowWaste': 'Lage waste',
    'inputs.presetHighWaste': 'Hoge waste',
    'inputs.presetCustom': 'Aangepast',

    'inputs.wasteEstimate': 'Waste (%)',
    'inputs.wasteHelper': 'Wat wordt weggegooid of verliest kwaliteit.',

    'inputs.labourCost': 'Arbeidskosten (€/uur)',
    'inputs.labourCostHelper': 'Volledig geladen keukenloon.',

    'inputs.timePerWeekPerUnit': 'Tijd op MiniGro (min/week per unit)',
    'inputs.timePerWeekHelper': 'Schaalt lineair met aantal units.',

    'inputs.electricityPerUnit': 'Elektriciteit (€/maand per unit)',
    'inputs.electricityHelper': 'Eigen inschatting of standaardwaarde.',

    'inputs.carePlan': 'Care plan',
    'inputs.carePlanOn': 'AAN (€60/maand per unit)',
    'inputs.carePlanOff': 'UIT (€0/maand per unit)',
    'inputs.carePlanWhatsIncluded': 'Wat is inbegrepen?',

    'results.netSavings': 'Netto besparing',
    'results.payback': 'Terugverdientijd',
    'results.units': 'Units',
    'results.coverage': 'Dekking',
    'results.bestPayback': 'Beste terugverdientijd',
    'results.fullCoverage': 'Volledige dekking',
  },

  de: {
    'hero.title': 'Berechnen Sie Ihre Einsparungen mit MiniGro',
    'hero.subtitle': 'Berechnen Sie Ihre monatlichen Einsparungen in 60 Sekunden.',

    'inputs.blockA.title': 'Aktuelle Ausgaben',
    'inputs.weeklySpend': 'Wöchentliche Microgreens-Ausgaben (€)',
    'inputs.weeklySpendHelper': 'Was Sie pro Woche zahlen (Durchschnitt).',

    'inputs.blockB.title': 'Abfall und Zeit',
    'inputs.assumptions': 'Annahmen',
    'inputs.presetTypical': 'Typisch',
    'inputs.presetLowWaste': 'Wenig Abfall',
    'inputs.presetHighWaste': 'Viel Abfall',
    'inputs.presetCustom': 'Benutzerdefiniert',

    'inputs.wasteEstimate': 'Abfall (%)',
    'inputs.wasteHelper': 'Wird weggeworfen oder verliert Qualität.',

    'inputs.labourCost': 'Arbeitskosten (€/Stunde)',
    'inputs.labourCostHelper': 'Vollständige Küchenarbeitskosten.',

    'inputs.timePerWeekPerUnit': 'Zeit pro Woche (Minuten pro Unit)',
    'inputs.timePerWeekHelper': 'Skaliert linear mit Anzahl Units.',

    'inputs.electricityPerUnit': 'Strom (€/Monat pro Unit)',
    'inputs.electricityHelper': 'Ihre Schätzung oder Standardwert.',

    'inputs.carePlan': 'Care-Plan',
    'inputs.carePlanOn': 'AN (€60/Monat pro Unit)',
    'inputs.carePlanOff': 'AUS (€0/Monat pro Unit)',
    'inputs.carePlanWhatsIncluded': 'Was ist enthalten?',

    'results.netSavings': 'Netto-Ersparnis',
    'results.payback': 'Amortisation',
    'results.units': 'Einheiten',
    'results.coverage': 'Abdeckung',
    'results.bestPayback': 'Beste Amortisation',
    'results.fullCoverage': 'Volle Abdeckung',
  },
};

const LanguageContext = createContext({
  language: 'en' as Language,
  setLanguage: (_: Language) => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
