import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function LanguageGate() {
  const { lang } = useParams();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const supported = ["en", "de", "nl"] as const;
    const safeLang = supported.includes(lang as any) ? (lang as "en" | "de" | "nl") : "en";
    setLanguage(safeLang);
  }, [lang, setLanguage]);

  if (lang !== "en" && lang !== "de" && lang !== "nl") {
    return <Navigate to="/en" replace />;
  }

  return <Outlet />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/en" replace />} />

            {/* Language-prefixed routes */}
            <Route path="/:lang" element={<LanguageGate />}>
              <Route index element={<Index />} />
              {/* Add more routes here later:
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="terms" element={<Terms />} />
              */}
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
