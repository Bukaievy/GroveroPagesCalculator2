import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCalculator, PresetType } from '@/hooks/useCalculator';
import { useFormatCurrency } from '@/hooks/useFormatCurrency';
import { RotateCcw, ChevronDown, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface InputsCardProps {
  inputs: ReturnType<typeof useCalculator>['inputs'];
  effectiveWaste: number;
  effectiveMinutes: number;
  purchasePrice: number;
  unitsModeled: number;
  unitsRecommended: number;
  updateInput: ReturnType<typeof useCalculator>['updateInput'];
  resetToDefaults: () => void;
  coverage: number;
}

const PRESET_OPTIONS: { key: PresetType; translationKey: string }[] = [
  { key: 'typical', translationKey: 'inputs.presetTypical' },
  { key: 'low_waste', translationKey: 'inputs.presetLowWaste' },
  { key: 'high_waste', translationKey: 'inputs.presetHighWaste' },
  { key: 'custom', translationKey: 'inputs.presetCustom' },
];

export function InputsCard({
  inputs,
  effectiveWaste,
  effectiveMinutes,
  purchasePrice,
  unitsModeled,
  unitsRecommended,
  updateInput,
  resetToDefaults,
  coverage,
}: InputsCardProps) {
  const { t } = useLanguage();
  const { formatPercent } = useFormatCurrency();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const handleNumberInput = (
    key: keyof typeof inputs,
    value: string,
    min = 0,
    max?: number
  ) => {
    const numValue = parseFloat(value) || 0;
    const clampedValue = Math.max(min, max !== undefined ? Math.min(max, numValue) : numValue);
    updateInput(key, clampedValue);
  };

  const isOverride = inputs.unitsOverride !== null;
  const isCustom = inputs.preset === 'custom';

  const coverageNote = t('inputs.unitsCoverageNote')
    .replace('{units}', String(unitsModeled))
    .replace('{coverage}', formatPercent(coverage));

  return (
    <div className="card-elevated-lg p-5 md:p-8">
      {/* Block A: Current Spend */}
      <div className="mb-6 md:mb-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 md:mb-4">
          {t('inputs.blockA.title')}
        </h3>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t('inputs.weeklySpend')}
          </label>
          <p className="text-xs text-muted-foreground mb-2">{t('inputs.weeklySpendHelper')}</p>
          <input
            type="number"
            inputMode="decimal"
            autoFocus
            value={inputs.weeklySpend}
            onChange={(e) => handleNumberInput('weeklySpend', e.target.value)}
            min={0}
            className="input-field text-base"
          />
        </div>
      </div>

      {/* Block B: Waste, Time, Labour, Electricity */}
      <div className="mb-6 md:mb-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 md:mb-4">
          {t('inputs.blockB.title')}
        </h3>

        {/* Preset selector - segmented control */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            {t('inputs.assumptions')}
          </label>
          <div className="flex rounded-lg bg-muted p-1 gap-0.5">
            {PRESET_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => updateInput('preset', opt.key)}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                  inputs.preset === opt.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(opt.translationKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Waste */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('inputs.wasteEstimate')}
            </label>
            <p className="text-xs text-muted-foreground mb-2">{t('inputs.wasteHelper')}</p>
            {isCustom ? (
              <input
                type="number"
                inputMode="decimal"
                value={inputs.wastePercent}
                onChange={(e) => handleNumberInput('wastePercent', e.target.value, 0, 80)}
                min={0}
                max={80}
                className="input-field text-base"
              />
            ) : (
              <input
                type="text"
                value={`${effectiveWaste}%`}
                readOnly
                tabIndex={-1}
                className="input-field text-base bg-muted text-muted-foreground cursor-default"
              />
            )}
          </div>

          {/* Labour cost */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('inputs.labourCost')}
            </label>
            <p className="text-xs text-muted-foreground mb-2">{t('inputs.labourCostHelper')}</p>
            <input
              type="number"
              inputMode="decimal"
              value={inputs.labourCostPerHour}
              onChange={(e) => handleNumberInput('labourCostPerHour', e.target.value)}
              min={0}
              className="input-field text-base"
            />
          </div>

          {/* Time per week per unit */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('inputs.timePerWeekPerUnit')}
            </label>
            <p className="text-xs text-muted-foreground mb-2">{t('inputs.timePerWeekHelper')}</p>
            {isCustom ? (
              <input
                type="number"
                inputMode="numeric"
                value={inputs.minutesPerWeekPerUnit}
                onChange={(e) => handleNumberInput('minutesPerWeekPerUnit', e.target.value, 0, 300)}
                min={0}
                max={300}
                className="input-field text-base"
              />
            ) : (
              <input
                type="text"
                value={`${effectiveMinutes} min`}
                readOnly
                tabIndex={-1}
                className="input-field text-base bg-muted text-muted-foreground cursor-default"
              />
            )}
          </div>

          {/* Electricity per unit */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('inputs.electricityPerUnit')}
            </label>
            <p className="text-xs text-muted-foreground mb-2">{t('inputs.electricityHelper')}</p>
            <input
              type="number"
              inputMode="decimal"
              value={inputs.electricityPerMonthPerUnit}
              onChange={(e) => handleNumberInput('electricityPerMonthPerUnit', e.target.value)}
              min={0}
              className="input-field text-base"
            />
          </div>
        </div>
      </div>

      {/* Care Plan Toggle */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            {t('inputs.carePlan')}
          </label>
          <Switch
            checked={inputs.carePlanOn}
            onCheckedChange={(checked) => updateInput('carePlanOn', checked)}
          />
        </div>
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {inputs.carePlanOn ? t('inputs.carePlanOn') : t('inputs.carePlanOff')}
        </p>
        <p className="text-xs text-muted-foreground">
          {inputs.carePlanOn ? t('inputs.carePlanHelperOn') : t('inputs.carePlanHelperOff')}
        </p>
        {inputs.carePlanOn && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {t('inputs.carePlanWhatsIncluded')}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-sm" align="start">
              <ul className="space-y-1.5 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {t('inputs.carePlanInclude1')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {t('inputs.carePlanInclude2')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {t('inputs.carePlanInclude3')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {t('inputs.carePlanInclude4')}
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Units */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            {t('inputs.unitsLabel')}
          </label>
          <button
            onClick={() => {
              if (isOverride) {
                updateInput('unitsOverride', null);
              } else {
                updateInput('unitsOverride', unitsRecommended || 1);
              }
            }}
            className="text-xs text-primary hover:underline"
          >
            {isOverride ? t('inputs.reset') : t('inputs.overrideUnits')}
          </button>
        </div>

        {isOverride ? (
          <input
            type="number"
            inputMode="numeric"
            value={unitsModeled}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              updateInput('unitsOverride', Math.max(1, Math.min(50, val)));
            }}
            min={1}
            max={50}
            className="input-field text-base"
          />
        ) : (
          <input
            type="text"
            value={unitsRecommended}
            readOnly
            tabIndex={-1}
            className="input-field text-base bg-muted text-muted-foreground cursor-default"
          />
        )}

        {isOverride && (
          <p className="text-xs text-muted-foreground mt-1.5">{coverageNote}</p>
        )}
      </div>

      {/* Advanced (collapsed) */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="mb-5 md:mb-6">
        <CollapsibleTrigger className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
          <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
          {t('inputs.advanced')}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('inputs.purchasePrice')}
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={inputs.purchasePricePerUnit}
              onChange={(e) => handleNumberInput('purchasePricePerUnit', e.target.value, 0)}
              min={0}
              className="input-field text-base"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Reset Link */}
      <button
        onClick={resetToDefaults}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        {t('inputs.reset')}
      </button>
    </div>
  );
}
