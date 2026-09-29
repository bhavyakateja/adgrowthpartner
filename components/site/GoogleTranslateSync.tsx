"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { reapplyStoredLanguage } from "@/lib/google-translate";

/**
 * Mount once near the root. Re-applies a previously chosen non-English
 * language:
 *  - on first client mount (covers the case where the widget was still
 *    loading when the user's choice was first stored), and
 *  - after every App Router client-side navigation, since Next.js swaps in
 *    new DOM without a full document reload, and Google's translation pass
 *    doesn't automatically revisit content that appears after its initial
 *    scan.
 * Renders nothing.
 */
export function GoogleTranslateSync() {
  const pathname = usePathname();

  useEffect(() => {
    void reapplyStoredLanguage();
  }, [pathname]);

  return null;
}