import { useState } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonths(value: number | null) {
  if (value === null) return '—';
  if (value < 1) return '< 1 month';

  const rounded = Math.round(value * 2) / 2;
  return `${rounded} months`;
}

export default function ResultsCard() {
  const {
    results,
    unitsModeled,
    recommendationMode,
    setRecommendationMode,
    inputs,
  } = useCalculator();

  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  const isManual = inputs.unitsOverride !== null;

  const isFullCoverage = recommendationMode === 'full_coverage';

  const showSpareCapacity =
    isFullCoverage && results.spareCapacityValue > 0;

  const lowCoverage =
    results.coverage < 0.7 && !isFullCoverage;

  return (
    <div className="space-y-6">

      {/* ===================== */}
      {/* HERO CARD */}
      {/* ===================== */}
      <div className="bg-violet-50 border border-violet-400 rounded-xl p-8 space-y-4">
        <div className="text-sm text-gray-500">
          Net savings
        </div>

        <div className="text-5xl font-semibold text-violet-600">
          {formatCurrency(results.savingsPerMonth)}
          <span className="text-lg text-gray-500"> / month</span>
        </div>

        <div className="space-y-1 text-sm">
          <div>
            Payback:{' '}
            <span className="font-medium">
              {results.roiMonths !== null
                ? formatMonths(results.roiMonths)
                : 'No payback'}
            </span>
          </div>

          <div>
            Units:{' '}
            <span className="font-medium">
              {unitsModeled} MiniGros
            </span>
            {isManual && (
              <span className="ml-2 text-xs text-gray-500">
                (manual)
              </span>
            )}
          </div>

          <div>
            Coverage:{' '}
            <span className="font-medium">
              {Math.round(results.coverage * 100)}%
            </span>
          </div>

          {showSpareCapacity && (
            <div className="text-xs text-gray-600 mt-1">
              Spare capacity:{' '}
              {formatCurrency(results.spareCapacityValue)} / month
              <div>
                Extra capacity you could use to replace more spend
                (e.g. herbs or garnish).
              </div>
            </div>
          )}

          {lowCoverage && (
            <div className="text-xs text-amber-600 mt-1">
              Coverage is below 70%. Switch to Full coverage
              to replace most of your spend.
            </div>
          )}
        </div>
      </div>

      {/* ===================== */}
      {/* MODE TOGGLE */}
      {/* ===================== */}
      <div className="space-y-2">
        <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
          <button
            onClick={() =>
              setRecommendationMode('best_payback')
            }
            className={`flex-1 py-2 rounded-md ${
              recommendationMode === 'best_payback'
                ? 'bg-white shadow font-medium'
                : 'text-gray-500'
            }`}
          >
            Best payback
          </button>

          <button
            onClick={() =>
              setRecommendationMode('full_coverage')
            }
            className={`flex-1 py-2 rounded-md ${
              recommendationMode === 'full_coverage'
                ? 'bg-white shadow font-medium'
                : 'text-gray-500'
            }`}
          >
            Full coverage
          </button>
        </div>

        <div className="text-xs text-gray-500">
          {recommendationMode === 'best_payback'
            ? 'Fastest payback while covering at least 70% of what you use.'
            : 'Replaces 100% of what you actually use.'}
        </div>
      </div>

      {/* ===================== */}
      {/* STAT CARDS */}
      {/* ===================== */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-xs text-gray-500">
            Payback
          </div>
          <div className="text-xl font-semibold">
            {results.roiMonths !== null
              ? formatMonths(results.roiMonths)
              : 'No payback'}
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-xs text-gray-500">
            MiniGros needed
          </div>
          <div className="text-xl font-semibold">
            {unitsModeled}
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* PROOF CARDS */}
      {/* ===================== */}
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-xs text-gray-500">
            You pay per month
          </div>
          <div className="font-medium">
            {formatCurrency(results.paidSpendPerMonth)}
          </div>
          <div className="text-xs text-gray-500">
            Weekly spend × 4.33
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-xs text-gray-500">
            You actually use (after waste)
          </div>
          <div className="font-medium">
            {formatCurrency(results.usedValuePerMonth)}
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-xs text-gray-500">
            Monthly operating cost (for {unitsModeled}{' '}
            {unitsModeled === 1 ? 'unit' : 'units'})
          </div>
          <div className="font-medium">
            {formatCurrency(results.operatingCostPerMonth)}
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* DETAILS ACCORDION */}
      {/* ===================== */}
      <div>
        <button
          onClick={() =>
            setShowDetails(prev => !prev)
          }
          className="text-sm text-gray-600 underline"
        >
          Details
        </button>

        {showDetails && (
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <div>
              Replaces{' '}
              {formatCurrency(results.maxReplacedValue)}{' '}
              of your current usage.
            </div>

            <div>
              Care plan:{' '}
              {formatCurrency(results.carePlanCostTotal)}
            </div>

            <div>
              Electricity:{' '}
              {formatCurrency(results.electricityCostTotal)}
            </div>

            <div>
              Labour:{' '}
              {formatCurrency(results.labourCostTotal)}
            </div>

            <div className="pt-2 border-t text-xs text-gray-500">
              Paid per month = weekly spend × 4.33<br />
              Used value = paid × (1 − waste)<br />
              Each unit replaces up to €400/month of used value<br />
              If you replace 50% of what you use,
              we assume you avoid 50% of what you pay<br />
              Operating cost = care plan + electricity + labour
            </div>
          </div>
        )}
      </div>

      {/* ===================== */}
      {/* FOOTNOTES */}
      {/* ===================== */}
      <div className="text-xs text-gray-500">
        All amounts exclude VAT.<br />
        Estimates depend on crop mix and kitchen workflow.
      </div>
    </div>
  );
}
