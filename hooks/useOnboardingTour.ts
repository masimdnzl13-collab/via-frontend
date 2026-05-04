import { useState, useEffect } from 'react';

export function useOnboardingTour(key: string) {
  const [goster, setGoster] = useState(false);

  useEffect(() => {
    const goruldu = localStorage.getItem(key);
    if (!goruldu) setGoster(true);
  }, [key]);

  function kapat() {
    localStorage.setItem(key, 'true');
    setGoster(false);
  }

  return { goster, kapat };
}