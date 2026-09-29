"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, TransitionEvent } from "react";

import styles from "./IntroAnimation.module.css";
import {
  INTRO_ATTR,
  INTRO_END_GRACE_MS,
  INTRO_FALLBACK_HOLD_MS,
  INTRO_LEAD_MS,
  INTRO_LEAVE_MS,
  INTRO_START_TIMEOUT_MS,
  INTRO_STORAGE_KEY,
} from "./intro-config";

type Phase = "active" | "leaving" | "done";

const overlayVars = {
  "--intro-leave": `${INTRO_LEAVE_MS}ms`,
} as CSSProperties;

export default function IntroAnimation() {
  const [phase, setPhase] = useState<Phase>("active");
  const [videoMounted, setVideoMounted] = useState(false);
  const [fallback, setFallback] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const leavingRef = useRef(false);

  /** Begin the crossfade into the site. Idempotent. */
  const leave = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;

    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, String(Date.now()));
    } catch {
      /* storage unavailable — fine, worst case it replays next load */
    }
    setPhase("leaving");
  }, []);

  /** Crossfade finished: unlock scroll and remove the overlay from the DOM. */
  const finish = useCallback(() => {
    document.documentElement.setAttribute(INTRO_ATTR, "done");
    setPhase("done");
  }, []);

  // 1) The pre-paint script in <IntroBootstrap /> already decided play/skip.
  //    We only mount the <video> if we're actually going to play.
  useEffect(() => {
    const state = document.documentElement.getAttribute(INTRO_ATTR);
    if (state === "skip" || state === "done") {
      setPhase("done");
      return;
    }
    setVideoMounted(true);
  }, []);

  // 2) Playback lifecycle.
  useEffect(() => {
    if (!videoMounted) return;
    const video = videoRef.current;
    if (!video) return;

    let disposed = false;
    let started = false;
    let startTimer = 0;
    let raf = 0;
    const timers = new Set<number>();

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.add(id);
      return id;
    };

    // Video couldn't start (autoplay blocked, Low Power Mode, data-saver,
    // unsupported codec, very slow network…). Don't silently skip the brand
    // moment: hold the static logo briefly, then fade out the same way.
    const showFallback = () => {
      if (disposed || started || leavingRef.current) return;
      setFallback(true);
      later(leave, INTRO_FALLBACK_HOLD_MS);
    };

    // Start the crossfade slightly BEFORE the clip ends. The clip fades its
    // own logo out in its last ~0.4s; overlapping the two makes the logo
    // dissolve into the site instead of into a blank cream screen.
    const watchLead = () => {
      if (disposed || leavingRef.current) return;
      const d = video.duration;
      if (Number.isFinite(d) && video.currentTime >= d - INTRO_LEAD_MS / 1000) {
        leave();
        return;
      }
      raf = requestAnimationFrame(watchLead);
    };

    const onPlaying = () => {
      if (started) return;
      started = true;
      window.clearTimeout(startTimer);

      const seconds = Number.isFinite(video.duration) ? video.duration : 8;
      later(leave, seconds * 1000 + INTRO_END_GRACE_MS); // watchdog
      raf = requestAnimationFrame(watchLead);
    };

    const onError = () => (started ? leave() : showFallback());

    const start = () => {
      if (disposed) return;
      // Set as a property: React doesn't always reflect `muted` to the DOM
      // attribute, and un-muted autoplay is blocked everywhere.
      video.muted = true;
      startTimer = later(showFallback, INTRO_START_TIMEOUT_MS);
      video.play().catch(() => (started ? leave() : showFallback()));
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", leave);
    video.addEventListener("error", onError);

    // A tab opened in the background must not burn through the intro unseen.
    // Wait until it is actually visible before starting playback.
    let onVisible: (() => void) | null = null;
    if (document.visibilityState === "visible") {
      start();
    } else {
      onVisible = () => {
        if (document.visibilityState !== "visible" || !onVisible) return;
        document.removeEventListener("visibilitychange", onVisible);
        onVisible = null;
        start();
      };
      document.addEventListener("visibilitychange", onVisible);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      if (onVisible) document.removeEventListener("visibilitychange", onVisible);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", leave);
      video.removeEventListener("error", onError);
    };
  }, [videoMounted, leave]);

  // 3) Safety net in case `transitionend` never fires (e.g. tab throttled).
  useEffect(() => {
    if (phase !== "leaving") return;
    const id = window.setTimeout(finish, INTRO_LEAVE_MS + 250);
    return () => window.clearTimeout(id);
  }, [phase, finish]);

  const onTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.propertyName === "opacity") finish();
  };

  if (phase === "done") return null;

  return (
    <div
      className={styles.overlay}
      data-intro-overlay=""
      data-phase={phase}
      aria-hidden="true"
      translate="no"
      style={overlayVars}
      onTransitionEnd={onTransitionEnd}
    >
      {videoMounted && !fallback && (
        <video
          ref={videoRef}
          className={styles.media}
          muted
          autoPlay
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
        >
          {/* MP4 first: H.264 is hardware-decoded everywhere. VP9/WebM can be
              software-decoded (or unsupported) on older / low-end devices. */}
          <source src="/intro/logo-intro.mp4" type="video/mp4" />
          <source src="/intro/logo-intro.webm" type="video/webm" />
        </video>
      )}

      {fallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.media}
          src="/intro/logo-final.webp"
          alt=""
          decoding="async"
        />
      )}
    </div>
  );
}