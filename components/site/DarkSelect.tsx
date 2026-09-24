"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = {
    value: string;
    label: string;
};

type DarkSelectProps = {
    id?: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    disabled?: boolean;
    "aria-label"?: string;
};

export function DarkSelect({
    id,
    value,
    options,
    onChange,
    disabled = false,
    "aria-label": ariaLabel,
}: DarkSelectProps) {
    const generatedId = useId();
    const listboxId = `${id ?? generatedId}-options`;
    const rootRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.value === value),
    );
    const selected = options[selectedIndex];

    useEffect(() => {
        function closeOnOutsideClick(event: MouseEvent) {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", closeOnOutsideClick);
        return () => document.removeEventListener("mousedown", closeOnOutsideClick);
    }, []);

    function selectOption(index: number) {
        const option = options[index];
        if (!option) return;
        onChange(option.value);
        setOpen(false);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        if (disabled) return;

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const direction = event.key === "ArrowDown" ? 1 : -1;
            const nextIndex =
                (selectedIndex + direction + options.length) % options.length;
            selectOption(nextIndex);
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((current) => !current);
            return;
        }

        if (event.key === "Escape") {
            setOpen(false);
        }
    }

    return (
        <div ref={rootRef} className="relative mt-2 w-full">
            <button
                id={id}
                type="button"
                disabled={disabled}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listboxId}
                onClick={() => setOpen((current) => !current)}
                onKeyDown={handleKeyDown}
                className="flex w-full items-center justify-between border-0 border-b border-input bg-transparent py-3 text-left text-base text-cream outline-none transition-colors focus:border-sunset disabled:cursor-not-allowed disabled:opacity-40"
            >
                <span className="truncate">{selected?.label ?? "Select"}</span>
                <span
                    aria-hidden="true"
                    className={`ml-3 text-xs text-cream/70 transition-transform ${open ? "rotate-180" : ""
                        }`}
                >
                    ▼
                </span>
            </button>

            {open && !disabled && (
                <ul
                    id={listboxId}
                    role="listbox"
                    aria-label={ariaLabel}
                    className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto border border-cream/20 bg-black py-1 text-white shadow-2xl"
                >
                    {options.map((option, index) => (
                        <li key={option.value} role="option" aria-selected={option.value === value}>
                            <button
                                type="button"
                                onClick={() => selectOption(index)}
                                className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-white/15 ${option.value === value ? "bg-white/20 text-white" : "text-white/90"
                                    }`}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
