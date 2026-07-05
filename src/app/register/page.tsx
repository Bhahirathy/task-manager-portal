"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration Successful");
            router.push("/login");
        } else {
            alert(data.message);
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
                            Get organized
                            <br />
                            in minutes.
                        </h2>
                        <p className="mt-4 max-w-xs text-sm text-white/70">
                            Create an account to start adding tasks and tracking
                            your progress.
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
                        Create your account
                    </h1>
                    <p className="mt-1 mb-6 text-sm text-slate-500">
                        It only takes a minute to get started.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Jane Doe"
                                className="w-full rounded-lg border border-slate-200 bg-[#F9FAFB] p-3 text-sm text-[#1C2333] placeholder:text-slate-400 focus:border-[#3454D1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3454D1]/20"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

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

                        <button
                            className="w-full rounded-lg bg-[#2FA66A] p-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#278f5b]"
                        >
                            Register
                        </button>

                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-semibold text-[#3454D1] hover:text-[#2c46b3]"
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}