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
      className="flex shrink-0 items-center"
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
        {/* Main navbar */}
        <div className="border-b border-[#FF6F4C]/15 bg-[#0D0D0B]/95 shadow-[0_8px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-5 md:h-[72px] md:px-10">
            <Wordmark />

            {/* Desktop navigation */}
            <nav
              aria-label="Primary"
              className="hidden items-center gap-6 lg:flex xl:gap-8"
            >
              {NAV_LINKS.slice(1, 6).map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`group label-mono relative py-2 transition-colors ${
                    isActive(link.to)
                      ? "text-[#FF6F4C]"
                      : "text-[#F6F1E3]/65 hover:text-[#FF6F4C]"
                  }`}
                >
                  {t(link.key)}

                  {/* Coral active/hover line */}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-[#FF6F4C] transition-transform duration-300 ${
                      isActive(link.to)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language */}
              <div className="hidden sm:block">
                <LanguageSelect />
              </div>

              {/* Contact */}
              <Link
                href="/contact"
                className="label-mono group relative hidden overflow-hidden rounded-full border border-[#F6F1E3]/15 bg-[#F6F1E3] px-5 py-2.5 text-[#2B2A22] transition-colors sm:inline-block"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F6F1E3]">
                  {t("nav.contact")}
                </span>

                <span className="absolute inset-0 translate-y-full bg-[#FF6F4C] transition-transform duration-300 group-hover:translate-y-0" />
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className={`label-mono flex h-10 items-center gap-2 rounded-full border px-4 transition-all duration-300 lg:hidden ${
                  open
                    ? "border-[#FF6F4C] bg-[#FF6F4C] text-[#0D0D0B]"
                    : "border-[#F6F1E3]/20 text-[#F6F1E3]/80 hover:border-[#FF6F4C] hover:text-[#FF6F4C]"
                }`}
              >
                {open ? t("nav.close") : t("nav.menu")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="menu"
            className="on-ink fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[#0D0D0B] pt-24 pb-8 text-[#F6F1E3]"
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
            {/* Subtle coral atmosphere */}
            <div
              className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full bg-[#FF6F4C]/8 blur-3xl"
              aria-hidden
            />

            <div
              className="pointer-events-none absolute -left-40 bottom-20 h-72 w-72 rounded-full bg-[#2B2A22]/60 blur-3xl"
              aria-hidden
            />

            <nav
              aria-label="Mobile"
              className="relative flex flex-1 flex-col justify-center px-5 sm:px-8"
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
                  className="border-b border-[#F6F1E3]/10"
                >
                  <Link
                    href={link.to}
                    className={`group flex items-baseline justify-between py-4 font-display text-[12vw] leading-none tracking-tight uppercase transition-colors sm:text-[10vw] md:text-[8vw] ${
                      isActive(link.to)
                        ? "text-[#FF6F4C]"
                        : "text-[#F6F1E3] hover:text-[#FF6F4C]"
                    }`}
                  >
                    <span>{t(link.key)}</span>

                    <span
                      className={`label-mono text-xs transition-colors sm:text-sm ${
                        isActive(link.to)
                          ? "text-[#FF6F4C]"
                          : "text-[#F6F1E3]/25 group-hover:text-[#FF6F4C]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile bottom area */}
            <div className="relative mt-10 flex flex-col gap-5 border-t border-[#F6F1E3]/10 px-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <LanguageSelect />

              <a
                href={`mailto:${SITE.email}`}
                className="label-mono break-all text-xs text-[#F6F1E3]/45 transition-colors hover:text-[#FF6F4C] sm:break-normal sm:text-sm"
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