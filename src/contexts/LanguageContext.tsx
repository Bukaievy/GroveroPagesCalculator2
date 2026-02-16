import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'nl' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.bookCall': 'Book a call',
    'nav.savingsGuide': 'Get the savings guide',
    'hero.title': 'Estimate your savings with MiniGro',
    'hero.subtitle': 'Estimate your monthly savings in 60 seconds.',

    // Inputs
    'inputs.blockA.title': 'Current spend',
    'inputs.weeklySpend': 'Weekly microgreens spend (€)',
    'inputs.weeklySpendHelper': 'What you pay on invoices (average week).',
    'inputs.blockB.title': 'Waste and time',
    'inputs.assumptions': 'Assumptions',
    'inputs.wasteEstimate': 'Waste (%)',
    'inputs.wasteHelper': 'Share thrown away or loses quality before use.',
    'inputs.labourCost': 'Labour cost (€/hour)',
    'inputs.labourCostHelper': 'Fully loaded kitchen labour cost.',
    'inputs.timePerWeekPerUnit': 'Time spent on MiniGro (min/week per unit)',
    'inputs.timePerWeekHelper': 'Assumed to scale linearly with number of units.',
    'inputs.electricityPerUnit': 'Electricity (€/month per unit)',
    'inputs.electricityHelper': 'Your estimate, or use the default.',

    // Presets
    'inputs.presetTypical': 'Typical',
    'inputs.presetLowWaste': 'Low waste',
    'inputs.presetHighWaste': 'High waste',
    'inputs.presetCustom': 'Custom',

    // Care plan
    'inputs.carePlan': 'Care plan',
    'inputs.carePlanOn': 'ON (€60/month per unit)',
    'inputs.carePlanOff': 'OFF (€0/month per unit)',
    'inputs.carePlanHelperOn': 'Includes monthly seeds and cartridges (Growmix + CleMix).',
    'inputs.carePlanHelperOff': 'You supply your own seeds and consumables.',
    'inputs.carePlanWhatsIncluded': "What's included?",
    'inputs.carePlanInclude1': 'Monthly seeds delivery',
    'inputs.carePlanInclude2': '1× Growmix cartridge',
    'inputs.carePlanInclude3': '2× CleMix cartridges',
    'inputs.carePlanInclude4': 'Per unit, per month',

    // Units
    'inputs.overrideUnits': 'Override units',
    'inputs.unitsLabel': 'Units',
    'inputs.unitsCoverageNote': 'With {units} unit(s) you cover {coverage} of your current usage.',

    // Advanced
    'inputs.advanced': 'Advanced',
    'inputs.purchasePrice': 'Purchase price per unit (€)',
    'inputs.reset': 'Reset to defaults',

    // Results - mode toggle
    'results.modeBestPayback': 'Best payback',
    'results.modeFullCoverage': 'Full coverage',
    'results.modeBestPaybackDesc': 'Fastest payback based on your inputs.',
    'results.modeFullCoverageDesc': 'Replaces 100% of what you actually use.',

    // Results - primary summary
    'results.netSavings': 'Net savings',
    'results.perMonth': '/ month',
    'results.payback': 'Payback',
    'results.paybackValue': '{months} months',
    'results.paybackLessThan1': '< 1 month',
    'results.noPayback': 'No payback at these inputs',
    'results.unitsLine': 'Units: {units} MiniGros',
    'results.unitsManualLine': 'Units (manual): {units} MiniGros',
    'results.recommended': 'Recommended: {recommended}',
    'results.coverage': 'Coverage: {coverage}',
    'results.spareCapacity': 'Spare capacity: {value} / month',
    'results.spareCapacityHint': 'Extra capacity you could use to replace more spend (e.g., herbs or garnish).',
    'results.negativeSavingsHint': 'At these inputs, operating costs are higher than avoided spend. Try adjusting time per unit, waste %, plan setting, or units.',

    // Results - supporting
    'results.youPayPerMonth': 'You pay per month',
    'results.weeklyTimesNote': 'Weekly spend × 4.33',
    'results.youUseAfterWaste': 'You actually use (after waste)',
    'results.operatingCostForUnits': 'Monthly operating cost (for {units} units)',
    'results.operatingCost': 'Monthly operating cost',
    'results.carePlanLabel': 'Care plan',
    'results.electricityLabel': 'Electricity',
    'results.labourLabel': 'Labour',
    'results.replacesValue': 'Replaces {value} of your current usage',
    'results.yearlyEstimate': 'Estimated savings per year',

    // Details accordion
    'results.detailsTitle': 'Details',
    'results.detailsMode': 'Mode: {mode}',
    'results.detailsUnitsNote': 'Units chosen based on your selected mode (unless manually overridden).',

    // Footnotes
    'results.footnote1': 'All amounts exclude VAT.',
    'results.footnote2': 'Estimates depend on crop mix and kitchen workflow.',

    // Transparency
    'results.transparencyTitle': 'How we calculate (transparent)',
    'results.transparencyBullet1': 'Paid per month = weekly spend × 4.33',
    'results.transparencyBullet2': 'Used value = paid × (1 − waste)',
    'results.transparencyBullet3': 'Each unit replaces up to €400/month of used value',
    'results.transparencyBullet4': 'If you replace 50% of what you use, we assume you avoid 50% of what you pay',
    'results.transparencyBullet5': 'Operating cost = care plan + electricity + labour',

    // CTA
    'cta.bookCall': 'Book a call',
    'cta.savingsGuide': 'Get the savings guide',

    // Other
    'disclaimer': 'Estimate only. Results depend on usage and purchasing patterns.',
    'testimonials.title': 'What chefs say',
    'testimonial.1': "We order less and hardly throw anything away anymore. That's where the cost difference comes from.",
    'testimonial.1.author': '— Renata, owner-chef at Elo Food Based (Amsterdam)',
    'testimonial.2': 'Harvesting on demand makes service easier. We always have what we need, without extra orders.',
    'testimonial.2.author': '— Mitchell, chef at Parkoers (The Hague)',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
  },
  nl: {
    'nav.bookCall': 'Plan een belafspraak',
    'nav.savingsGuide': 'Ontvang de bespaargids',
    'hero.title': 'Bereken je besparing met MiniGro',
    'hero.subtitle': 'Bereken je maandelijkse besparing in 60 seconden.',

    'inputs.blockA.title': 'Huidige uitgaven',
    'inputs.weeklySpend': 'Wekelijkse inkoop microgroenten (€)',
    'inputs.weeklySpendHelper': 'Wat je betaalt op facturen (gemiddelde week).',
    'inputs.blockB.title': 'Verspilling en tijd',
    'inputs.assumptions': 'Aannames',
    'inputs.wasteEstimate': 'Verspilling (%)',
    'inputs.wasteHelper': 'Wat weggegooid wordt of kwaliteit verliest voor gebruik.',
    'inputs.labourCost': 'Arbeidskosten (€/uur)',
    'inputs.labourCostHelper': 'Volledige keukenarbeidskosten.',
    'inputs.timePerWeekPerUnit': 'Tijd aan MiniGro (min/week per unit)',
    'inputs.timePerWeekHelper': 'Schaalt lineair met aantal units.',
    'inputs.electricityPerUnit': 'Elektriciteit (€/maand per unit)',
    'inputs.electricityHelper': 'Jouw schatting, of gebruik de standaard.',

    'inputs.presetTypical': 'Typisch',
    'inputs.presetLowWaste': 'Lage waste',
    'inputs.presetHighWaste': 'Hoge waste',
    'inputs.presetCustom': 'Aangepast',

    'inputs.carePlan': 'Care plan',
    'inputs.carePlanOn': 'AAN (€60/maand per unit)',
    'inputs.carePlanOff': 'UIT (€0/maand per unit)',
    'inputs.carePlanHelperOn': 'Inclusief maandelijkse zaden en cartridges (Growmix + CleMix).',
    'inputs.carePlanHelperOff': 'Je levert zelf zaden en verbruiksmaterialen.',
    'inputs.carePlanWhatsIncluded': 'Wat is inbegrepen?',
    'inputs.carePlanInclude1': 'Maandelijkse levering zaden',
    'inputs.carePlanInclude2': '1× Growmix cartridge',
    'inputs.carePlanInclude3': '2× CleMix cartridges',
    'inputs.carePlanInclude4': 'Per unit, per maand',

    'inputs.overrideUnits': 'Units aanpassen',
    'inputs.unitsLabel': 'Units',
    'inputs.unitsCoverageNote': 'Met {units} unit(s) dek je {coverage} van je huidige gebruik.',

    'inputs.advanced': 'Geavanceerd',
    'inputs.purchasePrice': 'Aankoopprijs per unit (€)',
    'inputs.reset': 'Reset naar standaard',

    'results.modeBestPayback': 'Beste terugverdientijd',
    'results.modeFullCoverage': 'Volledige dekking',
    'results.modeBestPaybackDesc': 'Snelste terugverdientijd op basis van je inputs.',
    'results.modeFullCoverageDesc': 'Vervangt 100% van wat je daadwerkelijk gebruikt.',

    'results.netSavings': 'Netto besparing',
    'results.perMonth': '/ maand',
    'results.payback': 'Terugverdientijd',
    'results.paybackValue': '{months} maanden',
    'results.paybackLessThan1': '< 1 maand',
    'results.noPayback': 'Geen terugverdientijd met deze inputs',
    'results.unitsLine': 'Units: {units} MiniGros',
    'results.unitsManualLine': 'Units (handmatig): {units} MiniGros',
    'results.recommended': 'Aanbevolen: {recommended}',
    'results.coverage': 'Dekking: {coverage}',
    'results.spareCapacity': 'Overcapaciteit: {value} / maand',
    'results.spareCapacityHint': 'Extra capaciteit waarmee je meer kosten kunt vervangen (bijv. kruiden of garnish).',
    'results.negativeSavingsHint': 'Bij deze inputs zijn de gebruikskosten hoger dan de vermeden inkoop. Pas tijd per unit, waste %, plan of units aan.',

    'results.youPayPerMonth': 'Je betaalt per maand',
    'results.weeklyTimesNote': 'Wekelijkse inkoop × 4,33',
    'results.youUseAfterWaste': 'Je gebruikt daadwerkelijk (na waste)',
    'results.operatingCostForUnits': 'Maandelijkse gebruikskosten (voor {units} units)',
    'results.operatingCost': 'Maandelijkse gebruikskosten',
    'results.carePlanLabel': 'Care plan',
    'results.electricityLabel': 'Elektriciteit',
    'results.labourLabel': 'Arbeid',
    'results.replacesValue': 'Vervangt {value} van je huidige gebruik',
    'results.yearlyEstimate': 'Geschatte besparing per jaar',

    'results.detailsTitle': 'Details',
    'results.detailsMode': 'Modus: {mode}',
    'results.detailsUnitsNote': 'Units gekozen op basis van je geselecteerde modus (tenzij handmatig overschreven).',

    'results.footnote1': 'Alle bedragen zijn excl. btw.',
    'results.footnote2': 'Schattingen hangen af van het teeltmix en keukenworkflow.',

    'results.transparencyTitle': 'Zo rekenen we (transparant)',
    'results.transparencyBullet1': 'Betaald per maand = wekelijkse inkoop × 4,33',
    'results.transparencyBullet2': 'Gebruikswaarde = betaald × (1 − verspilling)',
    'results.transparencyBullet3': 'Elke unit vervangt tot €400/maand aan gebruikswaarde',
    'results.transparencyBullet4': 'Als je 50% vervangt van wat je gebruikt, vermijd je 50% van wat je betaalt',
    'results.transparencyBullet5': 'Gebruikskosten = care plan + elektriciteit + arbeid',

    'cta.bookCall': 'Plan een belafspraak',
    'cta.savingsGuide': 'Ontvang de bespaargids',

    'disclaimer': 'Schatting. Resultaten hangen af van gebruik en inkooppatroon.',
    'testimonials.title': 'Wat chefs zeggen',
    'testimonial.1': 'We bestellen minder en gooien vrijwel niets meer weg. Dat maakte het verschil in kosten.',
    'testimonial.1.author': '— Renata, owner-chef bij Elo Food Based (Amsterdam)',
    'testimonial.2': 'Oogsten op aanvraag maakt service makkelijker. We hebben altijd wat we nodig hebben, zonder extra bestellingen.',
    'testimonial.2.author': '— Mitchell, chef bij Parkoers (Den Haag)',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Voorwaarden',
  },
  de: {
    'nav.bookCall': 'Gespräch vereinbaren',
    'nav.savingsGuide': 'Sparleitfaden erhalten',
    'hero.title': 'Berechnen Sie Ihre Ersparnis mit MiniGro',
    'hero.subtitle': 'Berechnen Sie Ihre monatliche Ersparnis in 60 Sekunden.',

    'inputs.blockA.title': 'Aktuelle Ausgaben',
    'inputs.weeklySpend': 'Wöchentliche Ausgaben für Microgreens (€)',
    'inputs.weeklySpendHelper': 'Was Sie auf Rechnungen zahlen (durchschnittliche Woche).',
    'inputs.blockB.title': 'Verlust und Zeit',
    'inputs.assumptions': 'Annahmen',
    'inputs.wasteEstimate': 'Verlust (%)',
    'inputs.wasteHelper': 'Was weggeworfen wird oder vor Gebrauch Qualität verliert.',
    'inputs.labourCost': 'Arbeitskosten (€/Std)',
    'inputs.labourCostHelper': 'Vollständige Küchenarbeitskosten.',
    'inputs.timePerWeekPerUnit': 'Zeitaufwand MiniGro (Min/Woche pro Einheit)',
    'inputs.timePerWeekHelper': 'Skaliert linear mit der Anzahl der Einheiten.',
    'inputs.electricityPerUnit': 'Strom (€/Monat pro Einheit)',
    'inputs.electricityHelper': 'Ihre Schätzung, oder verwenden Sie den Standard.',

    'inputs.presetTypical': 'Typisch',
    'inputs.presetLowWaste': 'Wenig Abfall',
    'inputs.presetHighWaste': 'Viel Abfall',
    'inputs.presetCustom': 'Benutzerdefiniert',

    'inputs.carePlan': 'Care-Plan',
    'inputs.carePlanOn': 'AN (€60/Monat pro Einheit)',
    'inputs.carePlanOff': 'AUS (€0/Monat pro Einheit)',
    'inputs.carePlanHelperOn': 'Inkl. monatliche Samen und Kartuschen (Growmix + CleMix).',
    'inputs.carePlanHelperOff': 'Sie stellen eigene Samen und Verbrauchsmaterialien bereit.',
    'inputs.carePlanWhatsIncluded': 'Was ist enthalten?',
    'inputs.carePlanInclude1': 'Monatliche Samenlieferung',
    'inputs.carePlanInclude2': '1× Growmix Kartusche',
    'inputs.carePlanInclude3': '2× CleMix Kartuschen',
    'inputs.carePlanInclude4': 'Pro Einheit, pro Monat',

    'inputs.overrideUnits': 'Einheiten überschreiben',
    'inputs.unitsLabel': 'Einheiten',
    'inputs.unitsCoverageNote': 'Mit {units} Einheit(en) decken Sie {coverage} Ihres aktuellen Verbrauchs.',

    'inputs.advanced': 'Erweitert',
    'inputs.purchasePrice': 'Kaufpreis pro Einheit (€)',
    'inputs.reset': 'Zurücksetzen',

    'results.modeBestPayback': 'Beste Amortisation',
    'results.modeFullCoverage': 'Volle Abdeckung',
    'results.modeBestPaybackDesc': 'Schnellste Amortisation basierend auf Ihren Eingaben.',
    'results.modeFullCoverageDesc': 'Ersetzt 100% von dem, was Sie tatsächlich nutzen.',

    'results.netSavings': 'Netto-Ersparnis',
    'results.perMonth': '/ Monat',
    'results.payback': 'Amortisation',
    'results.paybackValue': '{months} Monate',
    'results.paybackLessThan1': '< 1 Monat',
    'results.noPayback': 'Keine Amortisation mit diesen Eingaben',
    'results.unitsLine': 'Einheiten: {units} MiniGros',
    'results.unitsManualLine': 'Einheiten (manuell): {units} MiniGros',
    'results.recommended': 'Empfohlen: {recommended}',
    'results.coverage': 'Abdeckung: {coverage}',
    'results.spareCapacity': 'Freie Kapazität: {value} / Monat',
    'results.spareCapacityHint': 'Zusätzliche Kapazität, um weitere Ausgaben zu ersetzen (z.B. Kräuter oder Garnitur).',
    'results.negativeSavingsHint': 'Bei diesen Eingaben sind die Betriebskosten höher als die vermiedenen Ausgaben. Passen Sie Zeit pro Einheit, Abfall %, Plan oder Einheiten an.',

    'results.youPayPerMonth': 'Sie zahlen pro Monat',
    'results.weeklyTimesNote': 'Wöchentliche Ausgaben × 4,33',
    'results.youUseAfterWaste': 'Sie nutzen tatsächlich (nach Abfall)',
    'results.operatingCostForUnits': 'Monatliche Betriebskosten (für {units} Einheiten)',
    'results.operatingCost': 'Monatliche Betriebskosten',
    'results.carePlanLabel': 'Care-Plan',
    'results.electricityLabel': 'Strom',
    'results.labourLabel': 'Arbeit',
    'results.replacesValue': 'Ersetzt {value} Ihres aktuellen Verbrauchs',
    'results.yearlyEstimate': 'Geschätzte Ersparnis pro Jahr',

    'results.detailsTitle': 'Details',
    'results.detailsMode': 'Modus: {mode}',
    'results.detailsUnitsNote': 'Einheiten basierend auf Ihrem gewählten Modus (es sei denn, manuell überschrieben).',

    'results.footnote1': 'Alle Beträge verstehen sich exkl. MwSt.',
    'results.footnote2': 'Schätzungen hängen von Anbaumix und Küchenworkflow ab.',

    'results.transparencyTitle': 'So rechnen wir (transparent)',
    'results.transparencyBullet1': 'Bezahlt pro Monat = wöchentliche Ausgaben × 4,33',
    'results.transparencyBullet2': 'Nutzwert = bezahlt × (1 − Verlust)',
    'results.transparencyBullet3': 'Jede Einheit ersetzt bis zu 400 €/Monat an Nutzwert',
    'results.transparencyBullet4': 'Wenn Sie 50% ersetzen, vermeiden Sie 50% Ihrer Ausgaben',
    'results.transparencyBullet5': 'Betriebskosten = Care-Plan + Strom + Arbeit',

    'cta.bookCall': 'Gespräch vereinbaren',
    'cta.savingsGuide': 'Sparleitfaden erhalten',

    'disclaimer': 'Schätzung. Ergebnisse hängen von Nutzung und Einkauf ab.',
    'testimonials.title': 'Was Köche sagen',
    'testimonial.1': 'Wir haben weniger bestellt und weniger weggeworfen. Die Einsparungen waren innerhalb weniger Wochen sichtbar.',
    'testimonial.1.author': '— Renata, Inhaberin & Chefköchin bei Elo Food Based (Amsterdam)',
    'testimonial.2': 'Ernte auf Abruf brachte mehr Konsistenz und weniger Einkaufsdruck.',
    'testimonial.2.author': '— Mitchell, Koch bei Parkoers (Den Haag)',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'Bedingungen',
  },
};

function getDefaultLanguage(): Language {
  const stored = localStorage.getItem('grovero-language');
  if (stored === 'en' || stored === 'nl' || stored === 'de') {
    return stored;
  }
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('nl')) return 'nl';
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setLanguageState(getDefaultLanguage());
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('grovero-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (!isInitialized) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
