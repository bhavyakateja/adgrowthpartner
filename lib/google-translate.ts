/**
 * Drives Google Translate's cookie-based widget without relying on a full
 * page reload for the common case.
 *
 * How this actually works:
 * - Google's translate script, once initialized inside the container div,
 *   builds a hidden <select class="goog-te-combo"> with one <option> per
 *   language. Selecting an option (and firing a native "change" event on
 *   it) is exactly what the widget's own UI does — so we can drive it
 *   programmatically instead of reimplementing translation ourselves.
 * - The container div MUST be laid out (not `display:none`) for that
 *   <select> to ever get created — see the visually-hidden style used in
 *   layout.tsx. That was the actual bug: a `display:none` container means
 *   the combo box never exists, so there is nothing to switch.
 * - We still set the `googtrans` cookie Google's script reads on init, so
 *   a hard refresh / a shared link / a new tab in the same browser keeps
 *   the chosen language without the user reselecting it.
 * - If the widget itself never loads (blocked by an ad blocker, CSP,
 *   offline, etc.), we fall back to the old cookie+reload approach so the
 *   feature still works in the worst case, just without the instant feel.
 */

export const SOURCE_LANG = "en";
const COOKIE_NAME = "googtrans";
const STORAGE_KEY = "site-lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>("select.goog-te-combo");
}

/** Poll for the widget's combo box. It initializes asynchronously (external
 *  script + its own internal render), so it usually isn't there on the very
 *  first click right after page load. */
function waitForCombo(timeoutMs = 6000, intervalMs = 120): Promise<HTMLSelectElement | null> {
  return new Promise((resolve) => {
    const existing = getCombo();
    if (existing) return resolve(existing);

    const start = Date.now();
    const timer = window.setInterval(() => {
      const combo = getCombo();
      if (combo || Date.now() - start >= timeoutMs) {
        window.clearInterval(timer);
        resolve(combo);
      }
    }, intervalMs);
  });
}

function setGoogTransCookie(targetCode: string) {
  const isSource = targetCode === SOURCE_LANG;
  const value = isSource ? "" : `/${SOURCE_LANG}/${targetCode}`;
  const host = window.location.hostname;

  const write = (domainSuffix: string, maxAge: number) => {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}${domainSuffix}`;
  };

  const maxAge = isSource ? 0 : COOKIE_MAX_AGE;
  write("", maxAge); // host-only
  write(`; domain=${host}`, maxAge); // explicit host (matches what Google itself sets)

  // Also clear on the registrable root domain (e.g. example.com when on
  // www.example.com) in case a previous visit set it there.
  const parts = host.split(".");
  if (parts.length > 2) {
    const root = parts.slice(-2).join(".");
    write(`; domain=.${root}`, maxAge);
  }
}

export function getStoredLanguage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeLanguage(code: string) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore — worst case the language resets on next visit */
  }
}

/** Try the fast, no-reload path. Returns true if it actually applied. */
async function applyViaCombo(code: string): Promise<boolean> {
  const combo = await waitForCombo();
  if (!combo) return false;

  // Selecting the source language on Google's own combo is the documented
  // way to make it show the original (untranslated) text again.
  combo.value = code;
  combo.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

/**
 * Switch the visible page language. Call this from a click handler.
 * Safe to call with the current language (no-ops nothing, just re-applies).
 */
export async function switchLanguage(code: string): Promise<void> {
  storeLanguage(code);
  setGoogTransCookie(code);

  const applied = await applyViaCombo(code);
  if (!applied) {
    // Widget never initialized (blocked script/CSP/offline) — the cookie
    // is already set, so a reload is the only way left to apply it.
    window.location.reload();
  }
}

/**
 * Re-apply a previously chosen language once the widget becomes available.
 * Used on first mount (in case the combo wasn't ready when the user first
 * picked a language on a slow connection) and after client-side route
 * changes, since Google's translation pass doesn't automatically re-scan
 * DOM nodes that Next.js swaps in during App Router navigation.
 */
export async function reapplyStoredLanguage(): Promise<void> {
  const code = getStoredLanguage();
  if (!code || code === SOURCE_LANG) return;
  await applyViaCombo(code);
}