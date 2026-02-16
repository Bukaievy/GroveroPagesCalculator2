import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormatCurrency } from '@/hooks/useFormatCurrency';
import { RecommendationMode } from '@/hooks/useCalculator';

interface ResultsCardProps {
  results: any;
  unitsModeled: number;
  isOverride: boolean;
  recommendationMode: RecommendationMode;
  setRecommendationMode: (mode: RecommendationMode) => void;
}

export function ResultsCard({
  results,
  unitsModeled,
  isOverride,
  recommendationMode,
  setRecommendationMode,
}: ResultsCardProps) {
  const { t } = useLanguage();
  const { formatCurrency, formatPaybackMonths, formatPercent } = useFormatCurrency();
  const [showDetails, setShowDetails] = useState(false);

  const paybackDisplay = (() => {
    if (results.roiMonths !== null) {
      const rounded = Math.round(results.roiMonths * 2) / 2;

      if (rounded < 1) return t('results.paybackLessThan1');

      const label =
        rounded === 1 ? t('results.month') : t('results.months');

      return `${rounded} ${label}`;
    }

    return t('results.noPayback');
  })();

  const unitsText = isOverride
    ? t('results.unitsManualLine').replace('{units}', String(unitsModeled))
    : t('results.unitsLine').replace('{units}', String(unitsModeled));

  const lowCoverage =
    recommendationMode === 'best_payback' && results.coverage < 0.7;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="bg-[hsl(var(--highlight-bg))] border border-[hsl(var(--highlight))] rounded-xl p-8 space-y-4">
        <div className="text-sm text-muted-foreground">{t('results.netSavings')}</div>

        <div className="text-5xl font-semibold text-primary">
          {formatCurrency(results.savingsPerMonth, false)}
          <span className="text-lg text-muted-foreground"> {t('results.perMonth')}</span>
        </div>

        <div className="space-y-1 text-sm text-foreground">
          <div>
            {t('results.payback')}: <span className="font-semibold">{paybackDisplay}</span>
          </div>
          <div>
            {unitsText}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('results.coverage').replace('{coverage}', formatPercent(results.coverage))}
          </div>

          {lowCoverage && (
            <div className="text-xs text-amber-600">
              {t('results.lowCoverageHint')}
            </div>
          )}
        </div>
      </div>

      {/* MODE TOGGLE */}
      <div className="space-y-2">
        <div className="flex rounded-lg bg-muted p-1 gap-0.5 text-sm">
          <button
            onClick={() => setRecommendationMode('best_payback')}
            className={`flex-1 py-2 rounded-md ${
              recommendationMode === 'best_payback'
                ? 'bg-background shadow-sm font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {t('results.modeBestPayback')}
          </button>

          <button
            onClick={() => setRecommendationMode('full_coverage')}
            className={`flex-1 py-2 rounded-md ${
              recommendationMode === 'full_coverage'
                ? 'bg-background shadow-sm font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {t('results.modeFullCoverage')}
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          {recommendationMode === 'best_payback'
            ? t('results.modeBestPaybackDesc')
            : t('results.modeFullCoverageDesc')}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="text-xs text-muted-foreground">{t('results.payback')}</div>
          <div className="text-xl font-semibold">{paybackDisplay}</div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="text-xs text-muted-foreground">{t('results.unitsNeeded')}</div>
          <div className="text-xl font-semibold">{unitsModeled}</div>
        </div>
      </div>

      {/* PROOF CARDS */}
      <div className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="text-xs text-muted-foreground">{t('results.youPayPerMonth')}</div>
          <div className="font-semibold">{formatCurrency(results.paidSpendPerMonth, false)}</div>
          <div className="text-xs text-muted-foreground">{t('results.weeklyTimes433')}</div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="text-xs text-muted-foreground">{t('results.youUseAfterWaste')}</div>
          <div className="font-semibold">{formatCurrency(results.usedValuePerMonth, false)}</div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="text-xs text-muted-foreground">
            {t('results.operatingCostForUnits')
              .replace('{units}', String(unitsModeled))}
          </div>
          <div className="font-semibold">{formatCurrency(results.operatingCostPerMonth, false)}</div>
        </div>
      </div>

      {/* DETAILS */}
      <div>
        <button
          onClick={() => setShowDetails(v => !v)}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          {t('results.details')}
        </button>

        {showDetails && (
          <div className="mt-4 text-sm text-muted-foreground space-y-2">
            <div>
              {t('results.replacesValue')
                .replace('{value}', formatCurrency(results.maxReplacedValue, false))}
            </div>

            <div>{t('results.carePlan')}: {formatCurrency(results.carePlanCostTotal, false)}</div>
            <div>{t('results.electricity')}: {formatCurrency(results.electricityCostTotal, false)}</div>
            <div>{t('results.labour')}: {formatCurrency(results.labourCostTotal, false)}</div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        {t('results.footerVat')}<br />
        {t('results.footerEstimate')}
      </div>
    </div>
  );
}
