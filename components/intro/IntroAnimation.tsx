"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./IntroAnimation.module.css";
import {
  markIntroPlayed,
  useIntroAnimation,
} from "@/hooks/useIntroAnimation";

const FADE_MS = 500;
const SAFETY_TIMEOUT_MS = 10000;

export default function IntroAnimation() {
  const shouldPlay = useIntroAnimation();

  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  // Lock scrolling while the intro is visible.
  useEffect(() => {
    if (shouldPlay !== true) return;

    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [shouldPlay]);

  const finish = () => {
    // Prevent multiple calls from video events + timeout + errors.
    if (finishedRef.current) return;

    finishedRef.current = true;

    markIntroPlayed();

    // IMPORTANT:
    // Restore scrolling immediately.
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    setVisible(false);

    window.setTimeout(() => {
      setMounted(false);
    }, FADE_MS);
  };

  useEffect(() => {
    if (shouldPlay !== true) return;

    const video = videoRef.current;

    if (!video) {
      finish();
      return;
    }

    const safetyTimer = window.setTimeout(() => {
      finish();
    }, SAFETY_TIMEOUT_MS);

    video.play().catch(() => {
      finish();
    });

    return () => {
      window.clearTimeout(safetyTimer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay]);

  // Nothing to render once the intro has completed.
  if (shouldPlay === null || shouldPlay === false || !mounted) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      data-visible={visible}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
      >
        <source
          src="/intro/logo-intro.webm"
          type="video/webm"
        />

        <source
          src="/intro/logo-intro.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}