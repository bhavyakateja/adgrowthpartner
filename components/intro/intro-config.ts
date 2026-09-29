/**
 * Shared intro settings. No "use client" — this is imported by both the
 * server-rendered bootstrap script and the client component.
 */

/** Attribute on <html>: "play" | "skip" | "done". Drives overlay + scroll lock. */
export const INTRO_ATTR = "data-intro";

export const INTRO_STORAGE_KEY = "ad-intro-last-played";

/**
 * Don't replay within this window. Using a timestamp (instead of a bare flag)
 * means duplicated / restored tabs — which copy sessionStorage — still get
 * the intro again once it's stale.
 */
export const INTRO_REPLAY_AFTER_MS = 30 * 60 * 1000;

/**
 * Users with "reduce motion" enabled (very common on Android battery-saver,
 * Windows with animations off, macOS "Reduce motion") skip the intro.
 * Set to false if the brand moment matters more than that preference.
 */
export const INTRO_SKIP_ON_REDUCED_MOTION = true;

/** Start dissolving into the site this long BEFORE the clip ends. The clip
 *  itself fades its logo out over its last ~0.4s; overlapping the crossfade
 *  with that makes the logo dissolve into the site instead of into blank cream. */
export const INTRO_LEAD_MS = 600;

/** Crossfade duration. Keep in sync with nothing — it's passed to CSS as a var. */
export const INTRO_LEAVE_MS = 900;

/** If the video hasn't actually started playing by then → static-logo fallback. */
export const INTRO_START_TIMEOUT_MS = 3500;

/** Extra time allowed past the clip length before we force-finish. */
export const INTRO_END_GRACE_MS = 2500;

/** How long the static logo is held when the video can't autoplay. */
export const INTRO_FALLBACK_HOLD_MS = 1400;

/** Last-resort: if React never finishes the intro (JS error etc.), unlock the
 *  site after this much *visible* time. */
export const INTRO_FAILSAFE_MS = 16000;

/** Debug: add ?intro=replay to any URL to force the intro to play. */
export const INTRO_REPLAY_PARAM = "intro=replay";