import { useLanguage } from '@/contexts/LanguageContext';

export function useFormatCurrency() {
  const { language } = useLanguage();

  const getLocale = () => {
    if (language === 'nl') return 'nl-NL';
    if (language === 'de') return 'de-DE';
    return 'en-US';
  };

  const formatCurrency = (value: number | undefined | null, showDecimals = true): string => {
    const safeValue = value ?? 0;
    const absValue = Math.abs(safeValue);
    const isNegative = safeValue < 0;

    const formatter = new Intl.NumberFormat(getLocale(), {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    });

    const formatted = formatter.format(absValue);
    return isNegative ? `-${formatted}` : formatted;
  };

  /** Round to nearest 0.5 month. If < 1, return "< 1". */
  const formatPaybackMonths = (months: number | null | undefined): string => {
    if (months == null) return '';
    const rounded = Math.round(months * 2) / 2;
    if (rounded < 1) return '< 1';
    const str = rounded.toString();
    if (language === 'en') return str;
    return str.replace('.', ',');
  };

  const formatPercent = (ratio: number): string => {
    const pct = Math.round(ratio * 100);
    return `${pct}%`;
  };

  // Keep old name for backward compat if needed
  const formatRoiMonths = formatPaybackMonths;

  return { formatCurrency, formatPaybackMonths, formatRoiMonths, formatPercent };
}
