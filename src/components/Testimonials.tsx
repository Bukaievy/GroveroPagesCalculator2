import { useLanguage } from '@/contexts/LanguageContext';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      quote: t('testimonial.1'),
      author: t('testimonial.1.author'),
    },
    {
      quote: t('testimonial.2'),
      author: t('testimonial.2.author'),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="section-container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
          {t('testimonials.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-elevated p-6 flex flex-col"
            >
              <Quote className="w-6 h-6 text-primary mb-4 opacity-50" />
              <p className="text-foreground mb-4 flex-1 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
