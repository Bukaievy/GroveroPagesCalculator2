import { useLanguage } from '@/contexts/LanguageContext';
import { useCalculator } from '@/hooks/useCalculator';
import { InputsCard } from './InputsCard';
import { ResultsCard } from './ResultsCard';
import { MobileResultsSummary } from './MobileResultsSummary';

export function Calculator() {
  const { t } = useLanguage();
  const {
    inputs,
    results,
    effectiveWaste,
    effectiveMinutes,
    unitsModeled,
    updateInput,
    resetToDefaults,
    purchasePrice,
    recommendationMode,
    setRecommendationMode,
  } = useCalculator();

  const isOverride = inputs.unitsOverride !== null;

  return (
    <section id="calculator" className="py-8 md:py-16 lg:py-20">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Mobile: Compact sticky results summary */}
          <div className="lg:hidden sticky top-16 z-10 -mx-4 px-4 py-2 bg-background/95 backdrop-blur-sm border-b border-border">
            <MobileResultsSummary
              results={results}
              unitsModeled={unitsModeled}
              isOverride={isOverride}
              recommendationMode={recommendationMode}
              setRecommendationMode={setRecommendationMode}
            />
          </div>

          {/* Inputs Card */}
          <div className="order-2 lg:order-1">
            <InputsCard
              inputs={inputs}
              effectiveWaste={effectiveWaste}
              effectiveMinutes={effectiveMinutes}
              purchasePrice={purchasePrice}
              unitsModeled={unitsModeled}
              unitsRecommended={results.unitsRecommended}
              updateInput={updateInput}
              resetToDefaults={resetToDefaults}
              coverage={results.coverage}
            />
          </div>

          {/* Desktop: Results Card - Sticky */}
          <div className="hidden lg:block order-1 lg:order-2">
            <div className="sticky top-24">
              <ResultsCard
                results={results}
                unitsModeled={unitsModeled}
                isOverride={isOverride}
                recommendationMode={recommendationMode}
                setRecommendationMode={setRecommendationMode}
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted-foreground mt-6 md:mt-8">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}
