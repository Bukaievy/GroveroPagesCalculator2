import { useState, useMemo, useCallback } from 'react';
import { trackEvent, trackEventOnce } from '@/utils/tracking';

export type PresetType = 'typical' | 'low_waste' | 'high_waste' | 'custom';
export type RecommendationMode = 'best_payback' | 'full_coverage';

interface CalculatorInputs {
  weeklySpend: number;
  preset: PresetType;
  wastePercent: number;
  minutesPerWeekPerUnit: number;
  labourCostPerHour: number;
  electricityPerMonthPerUnit: number;
  carePlanOn: boolean;
  unitsOverride: number | null;
  purchasePricePerUnit: number;
}

export interface CalculatorResults {
  paidSpendPerMonth: number;
  usedValuePerMonth: number;
  unitsRecommended: number;
  unitsFull: number;
  unitsBestPayback: number;
  maxReplacedValue: number;
  avoidedSpend: number;
  operatingCostPerMonth: number;
  carePlanCostTotal: number;
  electricityCostTotal: number;
  labourCostTotal: number;
  savingsPerMonth: number;
  savingsPerYear: number;
  capexTotal: number;
  roiMonths: number | null;
  isPositiveRoi: boolean;
  coverage: number;
  spareCapacityValue: number;
  trueCostTodayPerMonth: number;
  inHouseCostPerMonth: number;
}

const WEEKS_PER_MONTH = 4.33;
const PURCHASE_PRICE_PER_UNIT_DEFAULT = 2290;
const UNIT_CAPACITY_PER_MONTH = 400;
const CARE_PLAN_COST_PER_UNIT = 60;

/**
 * 🔒 Guardrail for Best Payback
 * Best payback must cover at least this % of real usage.
 */
const MIN_COVERAGE_BEST_PAYBACK = 0.7; // 70%

const PRESET_VALUES: Record<
  Exclude<PresetType, 'custom'>,
  { waste: number; minutes: number }
> = {
  typical: { waste: 15, minutes: 30 },
  low_waste: { waste: 10, minutes: 20 },
  high_waste: { waste: 25, minutes: 30 },
};

const DEFAULT_INPUTS: CalculatorInputs = {
  weeklySpend: 120,
  preset: 'typical',
  wastePercent: 15,
  minutesPerWeekPerUnit: 30,
  labourCostPerHour: 25,
  electricityPerMonthPerUnit: 4,
  carePlanOn: true,
  unitsOverride: null,
  purchasePricePerUnit: PURCHASE_PRICE_PER_UNIT_DEFAULT,
};

function computeForUnits(
  u: number,
  paidSpendPerMonth: number,
  usedValuePerMonth: number,
  perUnitOpCost: number,
  purchasePricePerUnit: number,
) {
  const maxReplaced = Math.min(
    usedValuePerMonth,
    u * UNIT_CAPACITY_PER_MONTH,
  );

  const avoided =
    usedValuePerMonth > 0
      ? paidSpendPerMonth * (maxReplaced / usedValuePerMonth)
      : 0;

  const opCost = u * perUnitOpCost;
  const savings = avoided - opCost;
  const capex = u * purchasePricePerUnit;
  const roi = savings > 0 ? capex / savings : null;
  const coverage =
    usedValuePerMonth > 0
      ? maxReplaced / usedValuePerMonth
      : 0;

  return { savings, roi, capex, coverage };
}

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [recommendationMode, setRecommendationMode] =
    useState<RecommendationMode>('best_payback');

  const isCustom = inputs.preset === 'custom';

  const effectiveWaste = isCustom
    ? inputs.wastePercent
    : PRESET_VALUES[inputs.preset].waste;

  const effectiveMinutes = isCustom
    ? inputs.minutesPerWeekPerUnit
    : PRESET_VALUES[inputs.preset].minutes;

  const results = useMemo((): CalculatorResults => {
    const wasteDecimal = effectiveWaste / 100;

    const paidSpendPerMonth =
      Math.max(0, inputs.weeklySpend) * WEEKS_PER_MONTH;

    const usedValuePerMonth =
      paidSpendPerMonth * (1 - wasteDecimal);

    const unitsFull =
      usedValuePerMonth > 0
        ? Math.ceil(
            usedValuePerMonth / UNIT_CAPACITY_PER_MONTH,
          )
        : 0;

    const planCostPerUnit = inputs.carePlanOn
      ? CARE_PLAN_COST_PER_UNIT
      : 0;

    const electricityCostPerUnit =
      Math.max(0, inputs.electricityPerMonthPerUnit);

    const labourCostPerUnit =
      (Math.max(0, effectiveMinutes) *
        WEEKS_PER_MONTH /
        60) *
      Math.max(0, inputs.labourCostPerHour);

    const perUnitOpCost =
      planCostPerUnit +
      electricityCostPerUnit +
      labourCostPerUnit;

    /**
     * 🧠 Best Payback with Minimum Coverage Guardrail
     */
    let unitsBestPayback = 0;

    if (usedValuePerMonth > 0) {
      const maxU = Math.max(1, unitsFull + 1);

      let bestRoi: number | null = null;
      let bestUnits: number | null = null;

      for (let u = 1; u <= maxU; u++) {
        const { roi, coverage } = computeForUnits(
          u,
          paidSpendPerMonth,
          usedValuePerMonth,
          perUnitOpCost,
          inputs.purchasePricePerUnit,
        );

        // Enforce minimum coverage
        if (coverage < MIN_COVERAGE_BEST_PAYBACK) continue;

        if (
          roi !== null &&
          (bestRoi === null || roi < bestRoi)
        ) {
          bestRoi = roi;
          bestUnits = u;
        }
      }

      if (bestUnits !== null) {
        unitsBestPayback = bestUnits;
      } else {
        // fallback to full coverage if guardrail eliminates all
        unitsBestPayback = unitsFull > 0 ? unitsFull : 1;
      }
    }

    const unitsRecommended =
      recommendationMode === 'best_payback'
        ? unitsBestPayback
        : unitsFull;

    const unitsModeled =
      inputs.unitsOverride ?? unitsRecommended;

    const maxReplacedValue = Math.min(
      usedValuePerMonth,
      unitsModeled * UNIT_CAPACITY_PER_MONTH,
    );

    const avoidedSpend =
      usedValuePerMonth > 0
        ? paidSpendPerMonth *
          (maxReplacedValue / usedValuePerMonth)
        : 0;

    const carePlanCostTotal =
      unitsModeled * planCostPerUnit;

    const electricityCostTotal =
      unitsModeled * electricityCostPerUnit;

    const labourCostTotal =
      unitsModeled * labourCostPerUnit;

    const operatingCostPerMonth =
      carePlanCostTotal +
      electricityCostTotal +
      labourCostTotal;

    const savingsPerMonth =
      avoidedSpend - operatingCostPerMonth;

    const savingsPerYear = savingsPerMonth * 12;

    const capexTotal =
      inputs.purchasePricePerUnit *
      unitsModeled;

    const isPositiveRoi =
      savingsPerMonth > 0;

    const roiMonths =
      isPositiveRoi
        ? capexTotal / savingsPerMonth
        : null;

    const coverage =
      usedValuePerMonth > 0
        ? maxReplacedValue /
          usedValuePerMonth
        : 0;

    const spareCapacityValue = Math.max(
      0,
      unitsModeled * UNIT_CAPACITY_PER_MONTH -
        usedValuePerMonth,
    );

    return {
      paidSpendPerMonth,
      usedValuePerMonth,
      unitsRecommended,
      unitsFull,
      unitsBestPayback,
      maxReplacedValue,
      avoidedSpend,
      operatingCostPerMonth,
      carePlanCostTotal,
      electricityCostTotal,
      labourCostTotal,
      savingsPerMonth,
      savingsPerYear,
      capexTotal,
      roiMonths,
      isPositiveRoi,
      coverage,
      spareCapacityValue,
      trueCostTodayPerMonth: paidSpendPerMonth,
      inHouseCostPerMonth: operatingCostPerMonth,
    };
  }, [
    inputs,
    effectiveWaste,
    effectiveMinutes,
    recommendationMode,
  ]);

  const unitsModeled =
    inputs.unitsOverride ?? results.unitsRecommended;

  const updateInput = useCallback(
    <K extends keyof CalculatorInputs>(
      key: K,
      value: CalculatorInputs[K],
    ) => {
      if (!hasInteracted) {
        setHasInteracted(true);
        trackEventOnce('calculator_started');
      }

      trackEvent('calculator_changed', {
        field: key,
        value: String(value),
      });

      setInputs(prev => {
        const newInputs = { ...prev, [key]: value };

        if (key ===
