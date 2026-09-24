"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "agp.cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const decide = (value: "accepted" | "declined") => {
    localStorage.setItem(KEY, value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="on-ink fixed inset-x-3 bottom-3 z-50 flex flex-col gap-4 border border-cream/15 bg-ink/95 p-5 text-cream backdrop-blur md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md"
    >
      <p className="text-sm text-cream/75">
        We use essential cookies to run this site and optional analytics
        cookies to understand what people read.{" "}
        <Link
          href="/cookie-policy"
          className="text-sunset underline underline-offset-4"
        >
          Cookie policy
        </Link>
        .
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="label-mono bg-cream px-4 py-2.5 text-ink transition-colors hover:bg-gold"
        >
          Accept
        </button>

        <button
          type="button"
          onClick={() => decide("declined")}
          className="label-mono border border-cream/25 px-4 py-2.5 text-cream transition-colors hover:border-sunset hover:text-sunset"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}