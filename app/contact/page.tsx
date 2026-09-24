"use client";

import type { Metadata } from "next";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { City, Country, State } from "country-state-city";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { GOALS, SERVICES_HELP, SITE } from "@/lib/site";
import { PhoneField, validatePhone } from "@/components/site/PhoneField";
import { DarkSelect } from "@/components/site/DarkSelect";

const MAX_DESC = 1200;

const schema = z.object({
  organization_name: z.string().trim().min(2, "Organisation name is required"),
  full_name: z.string().trim().min(2, "Your name is required"),
  email: z.string().trim().email("Enter a valid work email"),
  country_code: z.string().min(1),
  phone: z.string().trim().min(4, "Enter a valid phone number"),
  country: z.string().min(1, "Select a country"),
  state: z.string(),
  city: z.string(),
  description: z
    .string()
    .trim()
    .min(20, "A couple of sentences helps us prepare")
    .max(MAX_DESC, "Please keep it under 1200 characters"),
  company_website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

const field =
  "mt-2 w-full border-0 border-b border-input bg-transparent px-0 py-3 text-base outline-none focus:border-sunset";

function Chip({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`label-mono min-w-0 max-w-full whitespace-normal break-words border px-5 py-3 text-left transition-colors ${selected
        ? "border-cream bg-cream text-ink"
        : "border-cream/25 text-cream/75 hover:border-sunset hover:text-sunset"
        }`}
    >
      {label}
    </button>
  );
}

export default function ContactPage() {
  const [goal, setGoal] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);

  const countries = useMemo(() => Country.getAllCountries(), []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      organization_name: "",
      full_name: "",
      email: "",
      country_code: "+91",
      phone: "",
      country: "IN",
      state: "",
      city: "",
      description: "",
      company_website: "",
    },
  });

  const countryIso = watch("country");
  const stateIso = watch("state");
  const description = watch("description") ?? "";

  const states = useMemo(
    () => State.getStatesOfCountry(countryIso),
    [countryIso],
  );

  const cities = useMemo(
    () =>
      stateIso
        ? City.getCitiesOfState(countryIso, stateIso)
        : [],
    [countryIso, stateIso],
  );

  const onSubmit = async (values: FormValues) => {
    if (values.company_website) return;

    if (Date.now() - lastSubmit < 15000) {
      toast.error("Please wait a few seconds before sending again.");
      return;
    }

    if (
      !validatePhone(
        values.country_code,
        values.phone,
        values.country,
      )
    ) {
      setError("phone", {
        message: "That phone number doesn't look valid",
      });
      return;
    }

    const countryName =
      countries.find((c) => c.isoCode === values.country)?.name ??
      values.country;

    const stateName =
      states.find((s) => s.isoCode === values.state)?.name ?? "";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationName: values.organization_name,
          fullName: values.full_name,
          email: values.email,
          countryCode: values.country_code,
          phone: values.phone,
          country: countryName,
          state: stateName,
          city: values.city,
          goal: goal ?? "",
          service: service ?? "",
          description: values.description,
          companyWebsite: values.company_website,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to send enquiry");
      }

      setLastSubmit(Date.now());
      setSent(true);
    } catch {
      toast.error(
        "We couldn't send that. Please try again in a moment.",
      );
    }
  };

  return (
    <div className="on-ink relative isolate min-h-screen bg-ink text-cream">
      <div
        className="surface-horizon absolute inset-0 -z-10 opacity-75"
        aria-hidden
      />

      <div className="mx-auto max-w-375 px-5 py-24 md:px-10 md:py-32">
        <p className="label-mono text-cream/55">Contact</p>

        <h1 className="font-display mt-6 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
          Start a
          <br />
          <span className="chrome-type">conversation</span>
        </h1>

        {sent ? (
          <div className="mt-16 max-w-[52ch]">
            <p className="text-2xl tracking-tight">
              Thank you — this is with us.
            </p>

            <p className="mt-4 text-cream/70">
              We read every enquiry ourselves and reply within two
              working days with a point of view, not a brochure. If
              it&apos;s urgent, write to{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="text-sunset"
              >
                {SITE.email}
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-12 gap-x-4 gap-y-14 md:gap-x-8 lg:gap-x-12">
            <div className="col-span-12 min-w-0 w-full max-w-full lg:col-span-5">
              <fieldset className="min-w-0">
                <legend className="text-2xl tracking-tight">
                  What would you like to achieve?
                </legend>

                <div className="mt-5 flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <Chip
                      key={g}
                      label={g}
                      selected={goal === g}
                      onSelect={() => setGoal(g)}
                    />
                  ))}
                </div>
              </fieldset>

              <AnimatePresence>
                {goal && (
                  <motion.fieldset
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-12"
                  >
                    <legend className="text-2xl tracking-tight">
                      What can we help you with?
                    </legend>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {SERVICES_HELP.map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          selected={service === s}
                          onSelect={() => setService(s)}
                        />
                      ))}
                    </div>
                  </motion.fieldset>
                )}
              </AnimatePresence>

              {goal && service && (
                <p className="font-display mt-12 text-4xl tracking-tight uppercase">
                  Let&apos;s talk about it.
                </p>
              )}
            </div>

            <div className="col-span-12 min-w-0 w-full max-w-full lg:col-span-7">
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="w-full max-w-full space-y-8"
              >
                <div className="grid min-w-0 gap-8 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="organization_name"
                      className="label-mono text-cream/55"
                    >
                      Organisation
                    </label>

                    <input
                      id="organization_name"
                      className={`${field} contact-select`}
                      {...register("organization_name")}
                    />

                    {errors.organization_name && (
                      <p className="mt-2 text-sm text-sunset">
                        {errors.organization_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="full_name"
                      className="label-mono text-cream/55"
                    >
                      Full name
                    </label>

                    <input
                      id="full_name"
                      className={`${field} contact-select`}
                      {...register("full_name")}
                    />

                    {errors.full_name && (
                      <p className="mt-2 text-sm text-sunset">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="label-mono text-cream/55"
                    >
                      Work email
                    </label>

                    <input
                      id="email"
                      type="email"
                      className={`${field} contact-select`}
                      {...register("email")}
                    />

                    {errors.email && (
                      <p className="mt-2 text-sm text-sunset">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <PhoneField
                    code={watch("country_code")}
                    phone={watch("phone")}
                    iso={countryIso}
                    onCodeChange={(value) =>
                      setValue("country_code", value, {
                        shouldValidate: true,
                      })
                    }
                    onPhoneChange={(value) =>
                      setValue("phone", value, {
                        shouldValidate: true,
                      })
                    }
                    error={errors.phone?.message}
                  />
                </div>

                <div className="grid min-w-0 gap-8 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="country"
                      className="label-mono text-cream/55"
                    >
                      Country
                    </label>

                    <input type="hidden" {...register("country")} />
                    <DarkSelect
                      id="country"
                      aria-label="Country"
                      value={countryIso}
                      options={countries.map((country) => ({
                        value: country.isoCode,
                        label: `${country.flag} ${country.name}`,
                      }))}
                      onChange={(value) => {
                        setValue("country", value, { shouldValidate: true });
                        setValue("state", "");
                        setValue("city", "");
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="label-mono text-cream/55"
                    >
                      State / region
                    </label>

                    <input type="hidden" {...register("state")} />
                    <DarkSelect
                      id="state"
                      aria-label="State or region"
                      value={stateIso}
                      options={[
                        { value: "", label: "Select" },
                        ...states.map((state) => ({
                          value: state.isoCode,
                          label: state.name,
                        })),
                      ]}
                      disabled={states.length === 0}
                      onChange={(value) => {
                        setValue("state", value, { shouldValidate: true });
                        setValue("city", "");
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="label-mono text-cream/55"
                    >
                      City
                    </label>

                    <input type="hidden" {...register("city")} />
                    <DarkSelect
                      id="city"
                      aria-label="City"
                      value={watch("city")}
                      options={[
                        { value: "", label: "Select" },
                        ...cities.map((city) => ({
                          value: city.name,
                          label: city.name,
                        })),
                      ]}
                      disabled={cities.length === 0}
                      onChange={(value) =>
                        setValue("city", value, { shouldValidate: true })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="label-mono text-cream/55"
                  >
                    Tell us what you&apos;re working on
                  </label>

                  <textarea
                    id="description"
                    rows={5}
                    maxLength={MAX_DESC}
                    className={field}
                    {...register("description")}
                  />

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-sunset">
                      {errors.description?.message ?? ""}
                    </p>

                    <p className="label-mono text-cream/40">
                      {description.length}/{MAX_DESC}
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="hidden"
                  {...register("company_website")}
                />

                <button
                  type="submit"
                  disabled={isSubmitting || !goal || !service}
                  className="label-mono group relative overflow-hidden bg-cream px-8 py-4 text-ink disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {isSubmitting
                      ? "Sending…"
                      : "Start the Conversation"}
                  </span>

                  <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-300 group-hover:translate-y-0" />
                </button>

                {(!goal || !service) && (
                  <p className="text-sm text-cream/50">
                    Answer the two questions on the left to send your
                    enquiry.
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}