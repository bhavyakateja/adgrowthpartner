"use client";

import { Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LOCALES, useI18n } from "@/lib/i18n";

export function LanguageSelect({
  variant = "bar",
}: {
  variant?: "bar" | "block";
}) {
  const { locale, setLocale, t } = useI18n();

  const current =
    LOCALES.find((item) => item.code === locale) ?? LOCALES[0];

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
        className="max-h-80 overflow-y-auto"
      >
        {LOCALES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onSelect={() => setLocale(item.code)}
            className="flex items-center justify-between gap-6 text-sm"
            aria-current={
              item.code === locale ? "true" : undefined
            }
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