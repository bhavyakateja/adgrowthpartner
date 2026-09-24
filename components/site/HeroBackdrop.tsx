"use client";

import { Suspense, lazy, useEffect, useState } from "react";

const HeroCanvas = lazy(() => import("./HeroCanvas"));

export function HeroBackdrop({
  className,
}: {
  className?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setReady(true);
    });

    return () => window.cancelAnimationFrame(id);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <HeroCanvas className={className} />
    </Suspense>
  );
}