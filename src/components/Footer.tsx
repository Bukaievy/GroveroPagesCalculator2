import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo-grovero.svg"
              alt="Grovero"
              className="h-12 w-auto"
            />
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.terms')}
            </Link>
            <a
              href="mailto:info@grovero.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              info@grovero.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
