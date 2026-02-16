import { useLanguage } from '@/contexts/LanguageContext';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="py-6 md:py-8 bg-gradient-to-b from-muted/50 to-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3">
            {t('hero.title')}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
