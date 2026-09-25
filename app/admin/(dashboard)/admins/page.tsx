"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminsManagementPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                setError(result.error || "Failed to create admin account.");
                return;
            }

            setSuccess(`Admin account successfully created for ${email}`);
            setEmail("");
            setPassword("");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="max-w-2xl py-6">
            <h1 className="text-2xl font-semibold tracking-tight">Admin Accounts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Provision new internal admin accounts with secure dashboard access.
            </p>

            <div className="mt-8 rounded-lg border border-border bg-background p-6 shadow-sm">
                <h2 className="text-lg font-medium">Create New Administrator</h2>
                
                <form onSubmit={onSubmit} className="mt-5 space-y-4">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="colleague@adgrowthpartner.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <div className="relative mt-1.5">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={8}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="At least 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-destructive">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={busy}
                        className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
                    >
                        {busy ? "Creating..." : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}