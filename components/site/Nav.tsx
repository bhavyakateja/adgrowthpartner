"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { NAV_LINKS, SITE } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { LanguageSelect } from "./LanguageSelect";
import Image from "next/image";

function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center"
      aria-label={`${SITE.name} — home`}
    >
      <Image
        src="/assets/logo.png"
        alt={SITE.name}
        width={180}
        height={48}
        priority
        className="h-14 w-auto object-contain"
      />
    </Link>
  );
}

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const reduced = useReducedMotion();
  const pathname = usePathname();
  const { t } = useI18n();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last);
      last = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="border-b border-cream/10 bg-ink/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-375 items-center justify-between px-5 md:px-10">
            <Wordmark />

            <nav
              aria-label="Primary"
              className="hidden items-center gap-7 lg:flex"
            >
              {NAV_LINKS.slice(1, 6).map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`label-mono transition-colors hover:text-sunset ${
                    isActive(link.to)
                      ? "text-sunset"
                      : "text-cream/70"
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <LanguageSelect />
              </div>

              <Link
                href="/contact"
                className="label-mono group relative hidden overflow-hidden rounded-full bg-cream px-5 py-2.5 text-ink sm:inline-block"
              >
                <span className="relative z-10">{t("nav.contact")}</span>
                <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-300 group-hover:translate-y-0" />
              </Link>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="label-mono flex h-11 items-center gap-2 rounded-full border border-cream/25 px-4 text-cream lg:hidden"
              >
                {open ? t("nav.close") : t("nav.menu")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="menu"
            className="on-ink fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink pt-24 pb-10"
            initial={reduced ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, y: -16 }
            }
            transition={{
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            <div
              className="surface-horizon pointer-events-none absolute inset-0 opacity-70"
              aria-hidden
            />

            <nav
              aria-label="Mobile"
              className="relative flex flex-1 flex-col justify-center px-6"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.045,
                    duration: 0.5,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="border-b border-cream/10"
                >
                  <Link
                    href={link.to}
                    className={`font-display flex items-baseline justify-between py-4 text-[13vw] leading-none tracking-tight uppercase transition-colors hover:text-sunset ${
                      isActive(link.to)
                        ? "text-sunset"
                        : "text-cream"
                    }`}
                  >
                    {t(link.key)}

                    <span className="label-mono text-cream/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="relative mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6">
              <LanguageSelect />

              <a
                href={`mailto:${SITE.email}`}
                className="label-mono text-cream/60 break-all sm:break-normal text-xs sm:text-sm"
              >
                {SITE.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}