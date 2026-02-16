import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'nl' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // NAV
    'nav.bookCall': 'Book a call',
    'nav.savingsGuide': 'Get the savings guide',

    // CTA
    'cta.bookCall': 'Book a call',
    'cta.savingsGuide': 'Get the savings guide',

    // HERO
    'hero.title': 'Estimate your savings with MiniGro',
    'hero.subtitle': 'Estimate your monthly savings in 60 seconds.',

    // DISCLAIMER
    'disclaimer': 'Estimate only. Results depend on usage and purchasing patterns.',

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
    'inputs.carePlanHelperOn': 'Includes monthly seeds + Growmix + CleMix.',
    'inputs.carePlanHelperOff': 'Assumes you use your own seeds and supplies.',
    'inputs.carePlanWhatsIncluded': "What's included?",
    'inputs.carePlanInclude1': 'Monthly seed delivery',
    'inputs.carePlanInclude2': 'Growmix (1× per month)',
    'inputs.carePlanInclude3': 'CleMix (2× per month)',
    'inputs.carePlanInclude4': 'Priority support',

    'inputs.unitsLabel': 'Units',
    'inputs.overrideUnits': 'Override units',
    'inputs.unitsCoverageNote': 'With {units} units you cover {coverage} of your usage.',
    'inputs.advanced': 'Advanced',
    'inputs.purchasePrice': 'MiniGro purchase price (€/unit)',
    'inputs.reset': 'Reset to defaults',

    // RESULTS (shared)
    'results.netSavings': 'Net savings',
    'results.perMonth': '/ month',
    'results.payback': 'Payback',
    'results.noPayback': 'No payback',
    'results.paybackLessThan1': '< 1 month',
    'results.paybackValue': '{months}',
    'results.unitsNeeded': 'MiniGros needed',
    'results.unitsLine': 'Units: {units} MiniGros',
    'results.unitsManualLine': 'Units: {units} MiniGros (manual)',
    'results.coverage': 'Coverage: {coverage}',

    'results.modeBestPayback': 'Best payback',
    'results.modeFullCoverage': 'Full coverage',
    'results.modeBestPaybackDesc': 'Fastest payback while covering at least 70% of what you use.',
    'results.modeFullCoverageDesc': 'Replaces 100% of what you actually use.',
    'results.lowCoverageHint': 'Coverage is below 70%. Switch to Full coverage to replace most of your spend.',

    'results.youPayPerMonth': 'You pay per month',
    'results.youUseAfterWaste': 'You actually use (after waste)',
    'results.operatingCost': 'Monthly operating cost',
    'results.operatingCostForUnits': 'Monthly operating cost (for {units} units)',
    'results.weeklyTimes433': 'Weekly spend × 4.33',

    'results.details': 'Details',
    'results.replacesValue': 'Replaces {value} of your current usage.',
    'results.carePlan': 'Care plan',
    'results.electricity': 'Electricity',
    'results.labour': 'Labour',

    'results.footerVat': 'All amounts exclude VAT.',
    'results.footerEstimate': 'Estimates depend on crop mix and kitchen workflow.',

    // TESTIMONIALS
    'testimonials.title': 'What chefs say',
    'testimonial.1': '“We order less and hardly throw anything away anymore. That’s where the cost difference comes from.”',
    'testimonial.1.author': 'Restaurant owner (Amsterdam)',
    'testimonial.2': '“Harvesting on demand makes service easier. We always have what we need, without waste orders.”',
    'testimonial.2.author': 'Chef (The Hague)',

    // FOOTER
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
  },

  nl: {
    'nav.bookCall': 'Plan een call',
    'nav.savingsGuide': 'Download de besparingsgids',

    'cta.bookCall': 'Plan een call',
    'cta.savingsGuide': 'Download de besparingsgids',

    'hero.title': 'Bereken je besparing met MiniGro',
    'hero.subtitle': 'Bereken je maandelijkse besparing in 60 seconden.',

    'disclaimer': 'Schatting. Resultaten hangen af van gebruik en inkoop.',

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
    'inputs.carePlanHelperOn': 'Inclusief zaden + Growmix + CleMix per maand.',
    'inputs.carePlanHelperOff': 'We gaan uit van eigen zaden en supplies.',
    'inputs.carePlanWhatsIncluded': 'Wat is inbegrepen?',
    'inputs.carePlanInclude1': 'Maandelijkse zadenlevering',
    'inputs.carePlanInclude2': 'Growmix (1× per maand)',
    'inputs.carePlanInclude3': 'CleMix (2× per maand)',
    'inputs.carePlanInclude4': 'Priority support',

    'inputs.unitsLabel': 'Units',
    'inputs.overrideUnits': 'Units aanpassen',
    'inputs.unitsCoverageNote': 'Met {units} units dek je {coverage} van je gebruik.',
    'inputs.advanced': 'Geavanceerd',
    'inputs.purchasePrice': 'MiniGro aanschafprijs (€/unit)',
    'inputs.reset': 'Reset',

    'results.netSavings': 'Netto besparing',
    'results.perMonth': '/ maand',
    'results.payback': 'Terugverdientijd',
    'results.noPayback': 'Geen terugverdientijd',
    'results.paybackLessThan1': '< 1 maand',
    'results.paybackValue': '{months}',
    'results.unitsNeeded': 'MiniGros nodig',
    'results.unitsLine': 'Units: {units} MiniGros',
    'results.unitsManualLine': 'Units: {units} MiniGros (handmatig)',
    'results.coverage': 'Dekking: {coverage}',

    'results.modeBestPayback': 'Beste terugverdientijd',
    'results.modeFullCoverage': 'Volledige dekking',
    'results.modeBestPaybackDesc': 'Snelste terugverdientijd met minimaal 70% dekking.',
    'results.modeFullCoverageDesc': 'Vervangt 100% van wat je daadwerkelijk gebruikt.',
    'results.lowCoverageHint': 'Dekking is lager dan 70%. Schakel naar Volledige dekking.',

    'results.youPayPerMonth': 'Je betaalt per maand',
    'results.youUseAfterWaste': 'Je gebruikt daadwerkelijk (na waste)',
    'results.operatingCost': 'Maandelijkse kosten',
    'results.operatingCostForUnits': 'Maandelijkse kosten (voor {units} units)',
    'results.weeklyTimes433': 'Wekelijkse uitgaven × 4,33',

    'results.details': 'Details',
    'results.replacesValue': 'Vervangt {value} van je huidige gebruik.',
    'results.carePlan': 'Care plan',
    'results.electricity': 'Elektriciteit',
    'results.labour': 'Arbeid',

    'results.footerVat': 'Alle bedragen zijn excl. btw.',
    'results.footerEstimate': 'Schattingen hangen af van teeltmix en keukenworkflow.',

    'testimonials.title': 'Wat chefs zeggen',
    'testimonial.1': '“We bestellen minder en gooien bijna niets meer weg. Daar zit het verschil.”',
    'testimonial.1.author': 'Restaurant (Amsterdam)',
    'testimonial.2': '“Oogsten op aanvraag maakt service makkelijker. Altijd wat je nodig hebt, zonder waste.”',
    'testimonial.2.author': 'Chef (Den Haag)',

    'footer.privacy': 'Privacy',
    'footer.terms': 'Voorwaarden',
  },

  de: {
    'nav.bookCall': 'Call buchen',
    'nav.savingsGuide': 'Savings Guide erhalten',

    'cta.bookCall': 'Call buchen',
    'cta.savingsGuide': 'Savings Guide erhalten',

    'hero.title': 'Berechnen Sie Ihre Einsparungen mit MiniGro',
    'hero.subtitle': 'Berechnen Sie Ihre monatlichen Einsparungen in 60 Sekunden.',

    'disclaimer': 'Schätzung. Ergebnisse hängen von Nutzung und Einkauf ab.',

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

    'inputs.timePerWeekPerUnit': 'Zeit auf MiniGro (Min/Woche pro Unit)',
    'inputs.timePerWeekHelper': 'Skaliert linear mit Anzahl Units.',

    'inputs.electricityPerUnit': 'Strom (€/Monat pro Unit)',
    'inputs.electricityHelper': 'Ihre Schätzung oder Standardwert.',

    'inputs.carePlan': 'Care-Plan',
    'inputs.carePlanOn': 'AN (€60/Monat pro Unit)',
    'inputs.carePlanOff': 'AUS (€0/Monat pro Unit)',
    'inputs.carePlanHelperOn': 'Inkl. Saatgut + Growmix + CleMix monatlich.',
    'inputs.carePlanHelperOff': 'Wir gehen von eigenen Seeds/Supplies aus.',
    'inputs.carePlanWhatsIncluded': 'Was ist enthalten?',
    'inputs.carePlanInclude1': 'Monatliche Saatgutlieferung',
    'inputs.carePlanInclude2': 'Growmix (1× pro Monat)',
    'inputs.carePlanInclude3': 'CleMix (2× pro Monat)',
    'inputs.carePlanInclude4': 'Priority Support',

    'inputs.unitsLabel': 'Einheiten',
    'inputs.overrideUnits': 'Einheiten anpassen',
    'inputs.unitsCoverageNote': 'Mit {units} Einheiten decken Sie {coverage} Ihres Bedarfs.',
    'inputs.advanced': 'Erweitert',
    'inputs.purchasePrice': 'MiniGro Kaufpreis (€/Unit)',
    'inputs.reset': 'Zurücksetzen',

    'results.netSavings': 'Netto-Ersparnis',
    'results.perMonth': '/ Monat',
    'results.payback': 'Amortisation',
    'results.noPayback': 'Keine Amortisation',
    'results.paybackLessThan1': '< 1 Monat',
    'results.paybackValue': '{months}',
    'results.unitsNeeded': 'Benötigte MiniGros',
    'results.unitsLine': 'Einheiten: {units} MiniGros',
    'results.unitsManualLine': 'Einheiten: {units} MiniGros (manuell)',
    'results.coverage': 'Abdeckung: {coverage}',

    'results.modeBestPayback': 'Beste Amortisation',
    'results.modeFullCoverage': 'Volle Abdeckung',
    'results.modeBestPaybackDesc': 'Schnellste Amortisation bei mindestens 70% Abdeckung.',
    'results.modeFullCoverageDesc': 'Ersetzt 100% dessen, was Sie tatsächlich nutzen.',
    'results.lowCoverageHint': 'Abdeckung unter 70%. Wechseln Sie zu Volle Abdeckung.',

    'results.youPayPerMonth': 'Sie zahlen pro Monat',
    'results.youUseAfterWaste': 'Sie nutzen tatsächlich (nach Abfall)',
    'results.operatingCost': 'Monatliche Kosten',
    'results.operatingCostForUnits': 'Monatliche Kosten (für {units} Einheiten)',
    'results.weeklyTimes433': 'Wöchentliche Ausgaben × 4,33',

    'results.details': 'Details',
    'results.replacesValue': 'Ersetzt {value} Ihres aktuellen Verbrauchs.',
    'results.carePlan': 'Care-Plan',
    'results.electricity': 'Strom',
    'results.labour': 'Arbeit',

    'results.footerVat': 'Alle Beträge exkl. MwSt.',
    'results.footerEstimate': 'Schätzungen hängen von Anbaumix und Küchenworkflow ab.',

    'testimonials.title': 'Was Küchen sagen',
    'testimonial.1': '“Wir bestellen weniger und werfen kaum noch etwas weg. Das macht den Unterschied.”',
    'testimonial.1.author': 'Restaurant (Amsterdam)',
    'testimonial.2': '“Ernten auf Abruf macht den Service leichter. Immer verfügbar, ohne Waste.”',
    'testimonial.2.author': 'Chef (Den Haag)',

    'footer.privacy': 'Datenschutz',
    'footer.terms': 'AGB',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => translations[language][key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
