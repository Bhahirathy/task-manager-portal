"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login Failed");
                return;
            }

            localStorage.setItem("accessToken", data.accessToken);

            router.push("/tasks");
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8] px-4 py-10">
            <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2">

                {/* Brand panel - hidden on small screens */}
                <div className="relative hidden flex-col justify-between bg-[#3454D1] p-10 text-white lg:flex">
                    <div>
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-lg font-bold">
                            ✓
                        </div>
                        <h2 className="mt-8 text-3xl font-bold leading-tight tracking-tight">
                            Stay on top of
                            <br />
                            what matters.
                        </h2>
                        <p className="mt-4 max-w-xs text-sm text-white/70">
                            Sign in to pick up right where you left off, and keep
                            your tasks moving forward.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3">
                            <span className="h-2 w-2 rounded-full bg-[#E8A33D]" />
                            <span className="text-sm text-white/80">Track pending work</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3">
                            <span className="h-2 w-2 rounded-full bg-[#2FA66A]" />
                            <span className="text-sm text-white/80">Celebrate what's done</span>
                        </div>
                    </div>
                </div>

                {/* Form panel */}
                <div className="flex flex-col justify-center p-8 sm:p-10">
                    <h1 className="text-2xl font-bold tracking-tight text-[#1C2333] sm:text-3xl">
                        Welcome back
                    </h1>
                    <p className="mt-1 mb-6 text-sm text-slate-500">
                        Log in to your account to continue.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-slate-200 bg-[#F9FAFB] p-3 text-sm text-[#1C2333] placeholder:text-slate-400 focus:border-[#3454D1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3454D1]/20"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-slate-200 bg-[#F9FAFB] p-3 text-sm text-[#1C2333] placeholder:text-slate-400 focus:border-[#3454D1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3454D1]/20"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="rounded-lg bg-[#E1544C]/10 px-3 py-2 text-sm text-[#E1544C]">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-[#3454D1] p-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2c46b3] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="font-semibold text-[#3454D1] hover:text-[#2c46b3]"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}