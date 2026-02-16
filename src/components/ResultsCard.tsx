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
