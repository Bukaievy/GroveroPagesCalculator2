import { useLanguage } from '@/contexts/LanguageContext';
import { useFormatCurrency } from '@/hooks/useFormatCurrency';
import { useCalculator, RecommendationMode } from '@/hooks/useCalculator';
import { trackEvent } from '@/utils/tracking';
import { getCallUrl, SAVINGS_GUIDE_URL } from '@/utils/ctaLinks';

interface MobileResultsSummaryProps {
  results: ReturnType<typeof useCalculator>['results'];
  unitsModeled: number;
  isOverride: boolean;
  recommendationMode: RecommendationMode;
  setRecommendationMode: (mode: RecommendationMode) => void;
}

export function MobileResultsSummary({ results, unitsModeled, isOverride, recommendationMode, setRecommendationMode }: MobileResultsSummaryProps) {
  const { t, language } = useLanguage();
  const { formatCurrency, formatPaybackMonths, formatPercent } = useFormatCurrency();

  const paybackDisplay = (() => {
    if (results.roiMonths !== null) {
      const rounded = Math.round(results.roiMonths * 2) / 2;
      if (rounded < 1) return t('results.paybackLessThan1');
      return t('results.paybackValue').replace('{months}', formatPaybackMonths(results.roiMonths));
    }
    return t('results.noPayback');
  })();

  const unitsText = isOverride
    ? t('results.unitsManualLine').replace('{units}', String(unitsModeled))
    : t('results.unitsLine').replace('{units}', String(unitsModeled));

  return (
    <div>
      {/* Primary summary - net savings first */}
      <div className="bg-[hsl(var(--highlight-bg))] border border-[hsl(var(--highlight))] rounded-lg p-3 mb-2">
        <p className="text-xs text-muted-foreground">{t('results.netSavings')}</p>
        <p className="text-xl font-bold text-primary">
          {formatCurrency(results.savingsPerMonth, false)} <span className="text-xs font-medium">{t('results.perMonth')}</span>
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-foreground">
          <span>{t('results.payback')}: <strong>{paybackDisplay}</strong></span>
          <span>{unitsText}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          {t('results.coverage').replace('{coverage}', formatPercent(results.coverage))}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg bg-muted p-0.5 gap-0.5 mb-2">
        <button
          onClick={() => { setRecommendationMode('best_payback'); trackEvent('mode_changed', { mode: 'best_payback' }); }}
          className={`flex-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
            recommendationMode === 'best_payback'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          {t('results.modeBestPayback')}
        </button>
        <button
          onClick={() => { setRecommendationMode('full_coverage'); trackEvent('mode_changed', { mode: 'full_coverage' }); }}
          className={`flex-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
            recommendationMode === 'full_coverage'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          {t('results.modeFullCoverage')}
        </button>
      </div>

      {/* Supporting values */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-muted rounded-lg p-2">
          <p className="text-[10px] text-muted-foreground leading-tight truncate">
            {t('results.youPayPerMonth')}
          </p>
          <p className="text-xs font-bold text-foreground">
            {formatCurrency(results.paidSpendPerMonth, false)}
          </p>
        </div>
        <div className="bg-muted rounded-lg p-2">
          <p className="text-[10px] text-muted-foreground leading-tight truncate">
            {t('results.youUseAfterWaste')}
          </p>
          <p className="text-xs font-bold text-foreground">
            {formatCurrency(results.usedValuePerMonth, false)}
          </p>
        </div>
        <div className="bg-muted rounded-lg p-2">
          <p className="text-[10px] text-muted-foreground leading-tight truncate">
            {t('results.operatingCost')}
          </p>
          <p className="text-xs font-bold text-foreground">
            {formatCurrency(results.operatingCostPerMonth, false)}
          </p>
        </div>
      </div>

      {/* Mobile CTAs */}
      <div className="flex gap-2">
        <a
          href={getCallUrl(language)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('book_demo_clicked', { location: 'mobile_results' })}
          className="btn-primary text-xs py-1.5 flex-1 text-center block"
        >
          {t('cta.bookCall')}
        </a>
        <a
          href={SAVINGS_GUIDE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('savings_guide_clicked', { location: 'mobile_results' })}
          className="btn-outline text-xs py-1.5 flex-1 text-center block"
        >
          {t('cta.savingsGuide')}
        </a>
      </div>
    </div>
  );
}
