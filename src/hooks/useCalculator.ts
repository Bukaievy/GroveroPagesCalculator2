import { useState, useMemo, useCallback } from 'react';

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
}

const WEEKS_PER_MONTH = 4.33;
const UNIT_CAPACITY = 400;
const CARE_PLAN_COST = 60;
const DEFAULT_PURCHASE_PRICE = 2290;
const MIN_COVERAGE_BEST_PAYBACK = 0.7;

const PRESETS = {
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
  purchasePricePerUnit: DEFAULT_PURCHASE_PRICE,
};

export function useCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [recommendationMode, setRecommendationMode] =
    useState<RecommendationMode>('best_payback');

  const effectiveWaste =
    inputs.preset === 'custom'
      ? inputs.wastePercent
      : PRESETS[inputs.preset as keyof typeof PRESETS].waste;

  const effectiveMinutes =
    inputs.preset === 'custom'
      ? inputs.minutesPerWeekPerUnit
      : PRESETS[inputs.preset as keyof typeof PRESETS].minutes;

  const results = useMemo(() => {
    const paidSpendPerMonth =
      Math.max(0, inputs.weeklySpend) * WEEKS_PER_MONTH;

    const usedValuePerMonth =
      paidSpendPerMonth * (1 - effectiveWaste / 100);

    const unitsFull =
      usedValuePerMonth > 0
        ? Math.ceil(usedValuePerMonth / UNIT_CAPACITY)
        : 0;

    const planCostPerUnit = inputs.carePlanOn ? CARE_PLAN_COST : 0;

    const labourCostPerUnit =
      (Math.max(0, effectiveMinutes) *
        WEEKS_PER_MONTH /
        60) *
      Math.max(0, inputs.labourCostPerHour);

    const electricityCostPerUnit =
      Math.max(0, inputs.electricityPerMonthPerUnit);

    const perUnitOperatingCost =
      planCostPerUnit + labourCostPerUnit + electricityCostPerUnit;

    function compute(u: number) {
      const replaced = Math.min(
        usedValuePerMonth,
        u * UNIT_CAPACITY,
      );

      const avoided =
        usedValuePerMonth > 0
          ? paidSpendPerMonth * (replaced / usedValuePerMonth)
          : 0;

      const operating = u * perUnitOperatingCost;
      const savings = avoided - operating;
      const capex = u * inputs.purchasePricePerUnit;
      const roi =
        savings > 0 ? capex / savings : null;

      const coverage =
        usedValuePerMonth > 0
          ? replaced / usedValuePerMonth
          : 0;

      return { savings, roi, coverage };
    }

    let unitsBestPayback = 0;

    if (usedValuePerMonth > 0) {
      let bestRoi: number | null = null;
      let bestUnits = 1;

      for (let u = 1; u <= unitsFull + 1; u++) {
        const { roi, coverage } = compute(u);

        if (coverage < MIN_COVERAGE_BEST_PAYBACK) continue;

        if (roi !== null && (bestRoi === null || roi < bestRoi)) {
          bestRoi = roi;
          bestUnits = u;
        }
      }

      unitsBestPayback = bestUnits;
    }

    const unitsRecommended =
      recommendationMode === 'best_payback'
        ? unitsBestPayback
        : unitsFull;

    const units =
      inputs.unitsOverride ?? unitsRecommended;

    const replaced = Math.min(
      usedValuePerMonth,
      units * UNIT_CAPACITY,
    );

    const avoided =
      usedValuePerMonth > 0
        ? paidSpendPerMonth * (replaced / usedValuePerMonth)
        : 0;

    const operatingCostPerMonth =
      units * perUnitOperatingCost;

    const savingsPerMonth =
      avoided - operatingCostPerMonth;

    const capexTotal =
      units * inputs.purchasePricePerUnit;

    const roiMonths =
      savingsPerMonth > 0
        ? capexTotal / savingsPerMonth
        : null;

    return {
      paidSpendPerMonth,
      usedValuePerMonth,
      unitsRecommended,
      unitsFull,
      unitsBestPayback,
      maxReplacedValue: replaced,
      avoidedSpend: avoided,
      operatingCostPerMonth,
      carePlanCostTotal: units * planCostPerUnit,
      electricityCostTotal: units * electricityCostPerUnit,
      labourCostTotal: units * labourCostPerUnit,
      savingsPerMonth,
      savingsPerYear: savingsPerMonth * 12,
      capexTotal,
      roiMonths,
      isPositiveRoi: savingsPerMonth > 0,
      coverage:
        usedValuePerMonth > 0
          ? replaced / usedValuePerMonth
          : 0,
      spareCapacityValue: Math.max(
        0,
        units * UNIT_CAPACITY - usedValuePerMonth,
      ),
    };
  }, [inputs, effectiveWaste, effectiveMinutes, recommendationMode]);

  const updateInput = useCallback(
    (key: keyof CalculatorInputs, value: any) => {
      setInputs(prev => {
        const next = { ...prev, [key]: value };

        if (key === 'preset' && value !== 'custom') {
          const preset =
            PRESETS[value as keyof typeof PRESETS];
          next.wastePercent = preset.waste;
          next.minutesPerWeekPerUnit = preset.minutes;
        }

        return next;
      });
    },
    [],
  );

  const resetToDefaults = () => {
    setInputs(DEFAULT_INPUTS);
    setRecommendationMode('best_payback');
  };

  const unitsModeled =
    inputs.unitsOverride ?? results.unitsRecommended;

  return {
    inputs,
    results,
    updateInput,
    resetToDefaults,
    recommendationMode,
    setRecommendationMode,
    unitsModeled,
  };
}
