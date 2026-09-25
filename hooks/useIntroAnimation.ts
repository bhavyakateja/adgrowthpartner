'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ad-intro-played';

/**
 * Decides whether the logo intro should play.
 *
 * - Plays once per browser tab session (sessionStorage). Change to
 *   localStorage below if you want "once ever per browser" instead.
 * - Never plays if the user has `prefers-reduced-motion: reduce`.
 * - Returns `null` while this is still undetermined (first paint / SSR)
 *   so the caller can render nothing until we know, avoiding a flash.
 */
export function useIntroAnimation(): boolean | null {
  const [shouldPlay, setShouldPlay] = useState<boolean | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // sessionStorage can throw in some privacy modes — fail open (no intro)
      alreadyPlayed = true;
    }

    setShouldPlay(!reducedMotion && !alreadyPlayed);
  }, []);

  return shouldPlay;
}

export function markIntroPlayed() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // ignore
  }
}