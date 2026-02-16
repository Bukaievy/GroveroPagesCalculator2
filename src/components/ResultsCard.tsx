import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormatCurrency } from '@/hooks/useFormatCurrency';
import { useCalculator, RecommendationMode } from '@/hooks/useCalculator';
import { trackEvent } from '@/utils/tracking';
import { getCallUrl, SAVINGS_GUIDE_URL } from '@/utils/ctaLinks';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ResultsCardProps {
  results: ReturnType<typeof useCalculator>['results'];
  unitsModeled: number;
  isOverride: boolean;
  recommendationMode: RecommendationMode;
  setRecommendationMode: (mode: RecommendationMode) => void;
}

export function ResultsCard({ results, unitsModeled, isOverride, recommendationMode, setRecommendationMode }: ResultsCardProps) {
  const { t, language } = useLanguage();
  const { formatCurrency, formatPaybackMonths, formatPercent } = useFormatCurrency();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleCallClick = () => {
    trackEvent('book_demo_clicked', { location: 'results' });
  };

  const handleSavingsGuideClick = () => {
    trackEvent('savings_guide_clicked', { location: 'results' });
  };

  // Payback display
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

  const coverageText = t('results.coverage').replace('{coverage}', formatPercent(results.coverage));
  const operatingLabel = t('results.operatingCostForUnits').replace('{units}', String(unitsModeled));
  const isFullCoverage = recommendationMode === 'full_coverage';
  const modeLabel = isFullCoverage ? t('results.modeFullCoverage') : t('results.modeBestPayback');

  return (
    <div className="card-elevated-lg p-6 md:p-8 h-fit space-y-5">
      {/* A) HERO CARD — Net savings is biggest, generous whitespace */}
      <div className="results-highlight py-7 px-6">
        <div className="space-y-3">
          {/* Net savings — largest */}
          <div>
            <p className="text-sm text-muted-foreground">{t('results.netSavings')}</p>
            <p className="text-3xl md:text-4xl font-bold text-primary mt-1">
              {formatCurrency(results.savingsPerMonth, false)} <span className="text-lg font-medium">{t('results.perMonth')}</span>
            </p>
          </div>

          {/* Payback — medium */}
          <p className="text-lg font-semibold text-foreground">
            {t('results.payback')}: {paybackDisplay}
          </p>

          {/* Units — medium */}
          <p className="text-lg font-semibold text-foreground">
            {unitsText}
          </p>
          {isOverride && (
            <p className="text-xs text-muted-foreground">
              {t('results.recommended').replace('{recommended}', String(results.unitsRecommended))}
            </p>
          )}

          {/* Coverage — small */}
          <p className="text-sm text-muted-foreground">
            {coverageText}
          </p>

          {/* Spare capacity (full coverage mode only) */}
          {isFullCoverage && results.spareCapacityValue > 0 && !isOverride && (
            <div className="pt-1">
              <p className="text-sm text-muted-foreground">
                {t('results.spareCapacity').replace('{value}', formatCurrency(results.spareCapacityValue, false))}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('results.spareCapacityHint')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Conditional negative savings hint */}
      {results.savingsPerMonth <= 0 && (
        <p className="text-xs text-muted-foreground bg-muted rounded-lg p-3">
          {t('results.negativeSavingsHint')}
        </p>
      )}

      {/* B) MODE TOGGLE + KEY STATS */}
      <div className="space-y-4">
        {/* Mode toggle */}
        <div>
          <div className="flex rounded-lg bg-muted p-1 gap-0.5">
            <button
              onClick={() => { setRecommendationMode('best_payback'); trackEvent('mode_changed', { mode: 'best_payback' }); }}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                recommendationMode === 'best_payback'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('results.modeBestPayback')}
            </button>
            <button
              onClick={() => { setRecommendationMode('full_coverage'); trackEvent('mode_changed', { mode: 'full_coverage' }); }}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                recommendationMode === 'full_coverage'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('results.modeFullCoverage')}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {isFullCoverage ? t('results.modeFullCoverageDesc') : t('results.modeBestPaybackDesc')}
          </p>
        </div>

        {/* Two stat cards side-by-side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-muted rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">{t('results.payback')}</p>
            <p className="text-lg font-bold text-foreground">{paybackDisplay}</p>
          </div>
          <div className="p-4 bg-muted rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">MiniGros</p>
            <p className="text-lg font-bold text-foreground">{unitsModeled}</p>
            {isOverride && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {t('results.recommended').replace('{recommended}', String(results.unitsRecommended))}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* C) PROOF CARDS — always visible, muted */}
      <div className="space-y-3">
        {/* You pay per month */}
        <div className="p-4 bg-muted/60 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">{t('results.youPayPerMonth')}</p>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(results.paidSpendPerMonth, false)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{t('results.weeklyTimesNote')}</p>
        </div>

        {/* You actually use */}
        <div className="p-4 bg-muted/60 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">{t('results.youUseAfterWaste')}</p>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(results.usedValuePerMonth, false)}
          </p>
        </div>

        {/* Operating cost */}
        <div className="p-4 bg-muted/60 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">{operatingLabel}</p>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(results.operatingCostPerMonth, false)}
          </p>
        </div>
      </div>

      {/* Yearly Estimate */}
      <p className="text-sm text-muted-foreground">
        {t('results.yearlyEstimate')}: <strong>{formatCurrency(results.savingsPerYear, false)}</strong>
      </p>

      {/* Footnotes */}
      <div className="text-xs text-muted-foreground space-y-0.5 pb-4 border-b border-border">
        <p>{t('results.footnote1')}</p>
        <p>{t('results.footnote2')}</p>
      </div>

      {/* D) DETAILS ACCORDION */}
      <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
          {t('results.detailsTitle')}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 text-xs text-muted-foreground space-y-3">
          {/* Mode info */}
          <p className="font-medium">{t('results.detailsMode').replace('{mode}', modeLabel)}</p>
          <p>{t('results.detailsUnitsNote')}</p>

          {/* Operating breakdown */}
          <div className="space-y-0.5">
            <p>{t('results.carePlanLabel')}: {formatCurrency(results.carePlanCostTotal, false)}</p>
            <p>{t('results.electricityLabel')}: {formatCurrency(results.electricityCostTotal, false)}</p>
            <p>{t('results.labourLabel')}: {formatCurrency(results.labourCostTotal, false)}</p>
          </div>

          {/* Replaces line */}
          {results.maxReplacedValue > 0 && (
            <p>{t('results.replacesValue').replace('{value}', formatCurrency(results.maxReplacedValue, false))}</p>
          )}

          {/* Transparency bullets */}
          <div className="pt-2 border-t border-border space-y-1">
            <p className="font-medium">{t('results.transparencyTitle')}</p>
            <p>• {t('results.transparencyBullet1')}</p>
            <p>• {t('results.transparencyBullet2')}</p>
            <p>• {t('results.transparencyBullet3')}</p>
            <p>• {t('results.transparencyBullet4')}</p>
            <p>• {t('results.transparencyBullet5')}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* CTAs */}
      <div className="space-y-3">
        <a
          href={getCallUrl(language)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCallClick}
          className="btn-primary w-full text-center block"
        >
          {t('cta.bookCall')}
        </a>
        <a
          href={SAVINGS_GUIDE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSavingsGuideClick}
          className="btn-ghost w-full text-center block"
        >
          {t('cta.savingsGuide')}
        </a>
      </div>
    </div>
  );
}
