"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setError(null);

        try {
            const response = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode, email, password }),
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                setError(result.error || "Authentication failed.");
                return;
            }

            router.replace("/admin");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-5 py-24">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {mode === "signin" ? "Sign in" : "Create the first account"}
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Internal access for the Ad Growth Partner team.
                </p>

                <form onSubmit={onSubmit} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={8}
                            autoComplete={
                                mode === "signin" ? "current-password" : "new-password"
                            }
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-destructive">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
                    >
                        {busy
                            ? "Working..."
                            : mode === "signin"
                                ? "Sign in"
                                : "Create account"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMode(mode === "signin" ? "signup" : "signin");
                            setError(null);
                        }}
                        className="w-full text-center text-xs text-muted-foreground hover:underline"
                    >
                        {mode === "signin"
                            ? "First time? Create the admin account"
                            : "Back to sign in"}
                    </button>
                </form>
            </div>
        </main>
    );
}
