"use client";

import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, useI18n, type LocaleCode } from "@/lib/i18n";

export function LanguageSelect({
  variant = "bar",
}: {
  variant?: "bar" | "block";
}) {
  const { locale, setLocale, t } = useI18n();

  const current =
    LOCALES.find((item) => item.code === locale) ?? LOCALES[0];

  const handleLanguageChange = (code: LocaleCode) => {
    // 1. Save state locally
    setLocale(code);

    // 2. Set Google Translate cookie for the root domain
    const googleLangCookie = code === "en" ? "/en/en" : `/en/${code}`;
    
    // Set cookie with explicit domain/path flags so Google reads it immediately on reload
    document.cookie = `googtrans=${googleLangCookie}; path=/; max-age=31536000;`;
    document.cookie = `googtrans=${googleLangCookie}; path=/; domain=${window.location.hostname}; max-age=31536000;`;

    // 3. Force reload so Google's initialization script parses the cookie and translates the page
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("nav.language")}
        className={
          variant === "bar"
            ? "label-mono inline-flex items-center gap-2 rounded-full border border-cream/25 px-3 py-2 text-cream/75 transition-colors hover:border-cream/60 hover:text-cream"
            : "label-mono inline-flex items-center gap-2 border-b border-border pb-1 transition-colors hover:text-sunset"
        }
      >
        <Globe aria-hidden className="size-3.5" />
        {current.native}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="max-h-80 overflow-y-auto z-[9999]"
      >
        {LOCALES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onSelect={() => handleLanguageChange(item.code)}
            className="flex items-center justify-between gap-6 text-sm cursor-pointer"
            aria-current={item.code === locale ? "true" : undefined}
          >
            <span>{item.native}</span>
            <span className="label-mono text-muted-foreground">
              {item.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}