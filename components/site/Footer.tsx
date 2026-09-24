"use client";

import Link from "next/link";
import Image from "next/image";

import {
  NAV_LINKS,
  POLICY_LINKS,
  SITE,
  SOCIALS,
} from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { LanguageSelect } from "./LanguageSelect";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="on-ink bg-ink text-cream">
      <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <div className="flex flex-col items-start">
              <Image
                src="/assets/logo.png"
                alt={SITE.name}
                width={120}
                height={50}
                className="h-auto w-auto max-w-[140px]"
              />
            </div>

            <p className="mt-6 font-display text-2xl tracking-tight text-cream md:text-3xl">
              Your growth. Our strategy. Real results.
            </p>

            <p className="mt-4 max-w-[38ch] text-sm text-cream/60">
              {SITE.description}
            </p>

            <div className="mt-6 flex flex-col space-y-2">
              <a
                href={`mailto:${SITE.email}`}
                className="label-mono inline-block text-cream hover:text-sunset"
              >
                {SITE.email.toUpperCase()}
              </a>
            </div>
          </div>

          <div className="col-span-6 lg:col-span-2">
            <p className="label-mono text-cream/40">
              {t("footer.navigate")}
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className="transition-colors hover:text-sunset"
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 lg:col-span-2">
            <p className="label-mono text-cream/40">
              {t("footer.policies")}
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              {POLICY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className="transition-colors hover:text-sunset"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/sitemap"
                  className="transition-colors hover:text-sunset"
                >
                  {t("footer.sitemap")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <p className="label-mono text-cream/40">
              {t("footer.connect")}
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-colors hover:text-sunset"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <LanguageSelect />
            </div>
          </div>
        </div>

        <div className="label-mono mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-cream/45 md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {SITE.name}
          </span>

          <span>
            {t("footer.credit")}{" "}
            <a
              href={SITE.creditUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-cream transition-colors hover:text-sunset"
            >
              Bhavya Kateja
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}