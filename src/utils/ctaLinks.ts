import { Language } from '@/contexts/LanguageContext';

export const getCallUrl = (language: Language): string => {
  return `https://call.go.grovero.com/${language}`;
};

export const SAVINGS_GUIDE_URL = 'https://minigro.grovero.com/';
