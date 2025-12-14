import { getCookie, setCookie } from "@/utils/cookie-utils";
import { createContext, useContext, useEffect, useState } from "react";

const SPONSORED_PREF_KEY = "show_sponsored_slider";

type FeaturedPreferenceContextType = {
  showFeatured: boolean;
  toggleFeatured: () => void;
  setFeatured: (value: boolean) => void;
};

const FeaturedPreferenceContext =
  createContext<FeaturedPreferenceContextType | null>(null);

export function FeaturedPreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showFeatured, setShowFeatured] = useState<boolean>(() => {
    try {
      const saved = getCookie(SPONSORED_PREF_KEY);
      if (saved === null || saved === undefined) return true;
      return Boolean(saved);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    setCookie(SPONSORED_PREF_KEY, showFeatured);
  }, [showFeatured]);

  const toggleFeatured = () => setShowFeatured(prev => !prev);

  return (
    <FeaturedPreferenceContext.Provider
      value={{ showFeatured, toggleFeatured, setFeatured: setShowFeatured }}
    >
      {children}
    </FeaturedPreferenceContext.Provider>
  );
}

export function useFeaturedPreference() {
  const ctx = useContext(FeaturedPreferenceContext);
  if (!ctx) {
    throw new Error(
      "useFeaturedPreference must be used within FeaturedPreferenceProvider"
    );
  }
  return ctx;
}
