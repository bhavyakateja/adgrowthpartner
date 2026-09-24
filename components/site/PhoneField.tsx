"use client";

import { useMemo } from "react";
import { Country } from "country-state-city";
import { AsYouType, isValidPhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { DarkSelect } from "./DarkSelect";

type Option = {
  iso: string;
  flag: string;
  dial: string;
  name: string;
};

export function useCountryDialOptions(): Option[] {
  return useMemo(
    () =>
      Country.getAllCountries()
        .filter((c) => c.phonecode)
        .map((c) => ({
          iso: c.isoCode,
          flag: c.flag,
          name: c.name,
          dial: c.phonecode.startsWith("+")
            ? c.phonecode
            : `+${c.phonecode}`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
}

export function validatePhone(dial: string, phone: string, iso?: string) {
  const full = `${dial}${phone.replace(/\D/g, "")}`;

  try {
    return isValidPhoneNumber(
      full,
      iso as CountryCode | undefined,
    );
  } catch {
    return false;
  }
}

export function PhoneField({
  code,
  phone,
  onCodeChange,
  onPhoneChange,
  error,
  iso,
}: {
  code: string;
  phone: string;
  onCodeChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  error?: string | undefined;
  iso?: string | undefined;
}) {
  const options = useCountryDialOptions();

  return (
    <div>
      <label htmlFor="phone" className="label-mono text-muted-foreground">
        Phone
      </label>

      <div className="mt-2 flex items-end gap-3">
        <div className="w-32 shrink-0">
          <DarkSelect
            aria-label="Country calling code"
            value={code}
            options={options.map((option) => ({
              value: option.dial,
              label: `${option.flag} ${option.dial}`,
            }))}
            onChange={onCodeChange}
          />
        </div>

        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) =>
            onPhoneChange(
              new AsYouType(
                iso as CountryCode | undefined,
              ).input(e.target.value),
            )
          }
          className="w-full border-0 border-b border-input bg-transparent py-3 text-base outline-none focus:border-sunset"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}