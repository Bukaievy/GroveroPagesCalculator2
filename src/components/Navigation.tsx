import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/utils/tracking";
import { getCallUrl, SAVINGS_GUIDE_URL } from "@/utils/ctaLinks";
import { useLocation, useNavigate } from "react-router-dom";

export function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCallClick = () => {
    trackEvent("book_demo_clicked", { location: "navigation" });
  };

  const handleSavingsGuideClick = () => {
    trackEvent("savings_guide_clicked", { location: "navigation" });
  };

  const switchLanguage = (nextLang: "nl" | "en" | "de") => {
    setLanguage(nextLang);

    const parts = location.pathname.split("/").filter(Boolean);

    // If path already starts with a language, replace it
    if (parts[0] === "en" || parts[0] === "de" || parts[0] === "nl") {
      parts[0] = nextLang;
      navigate("/" + parts.join("/"));
      return;
    }

    // Otherwise prefix the current path with the language
    navigate("/" + nextLang + location.pathname);
  };

  const goHome = () => {
    navigate(`/${language}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="section-container">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button type="button" onClick={goHome} className="flex items-center">
            <img
              src="/logo-grovero.svg"
              alt="Grovero"
              className="h-12 md:h-16 w-auto"
            />
          </button>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              {(["nl", "en", "de"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => switchLanguage(lang)}
                  className={`px-2 md:px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    language === lang
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              <a
                href={getCallUrl(language)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCallClick}
                className="btn-outline text-sm"
              >
                {t("nav.bookCall")}
              </a>
              <a
                href={SAVINGS_GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSavingsGuideClick}
                className="btn-primary text-sm"
              >
                {t("nav.savingsGuide")}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
