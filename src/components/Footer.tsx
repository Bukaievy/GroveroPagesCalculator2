import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo-grovero.svg" alt="Grovero" className="h-8 w-auto" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://www.grovero.com/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.privacy")}
            </a>

            <a
              href="https://www.grovero.com/terms-and-conditions-of-sale-refunds-terms/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.terms")}
            </a>

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
