import { useEffect, useState } from "react";

const STORAGE_KEY = "companyLogo";
const UPDATE_EVENT = "companyLogoUpdated";

export function useCompanyBranding() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadLogo = () => {
      if (typeof window === "undefined") return;
      const stored = localStorage.getItem(STORAGE_KEY);
      setLogoUrl(stored || null);
    };

    loadLogo();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === STORAGE_KEY) {
        loadLogo();
      }
    };

    const handleCustomUpdate = () => loadLogo();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(UPDATE_EVENT, handleCustomUpdate as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(UPDATE_EVENT, handleCustomUpdate as EventListener);
    };
  }, []);

  return {
    logoUrl,
    hasLogo: Boolean(logoUrl),
  };
}

export function notifyLogoChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(UPDATE_EVENT));
}
