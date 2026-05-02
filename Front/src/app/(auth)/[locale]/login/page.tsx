// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GuestGuard } from "@/guards";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";

export default function LoginPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const currentUser = await login({ email, password });
      router.push(
        currentUser.role === "admin"
          ? `/${locale}/dashboard/admin`
          : `/${locale}/dashboard/user`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestGuard>
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="w-full max-w-md px-4">
          <div className="card p-8 md:p-10 animate-scale-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <HiOutlineLockClosed className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                {t("login_title")}
              </h1>
              <p className="text-white/40 text-sm mt-2">
                {t("login_subtitle")}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  {t("login_email")}
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-12!"
                    placeholder={t("login_email_placeholder")}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  {t("login_password")}
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-12! pr-12!"
                    placeholder={t("login_password_placeholder")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/50">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-white/5 text-orange-500"
                  />
                  {t("login_remember_me")}
                </label>
                <Link
                  href={`/${locale}/forgot-password`}
                  className="text-orange-400 hover:text-orange-300"
                >
                  {t("login_forgot")}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-3! disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  t("login_submit")
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              {t("login_no_account")}{" "}
              <Link
                href={`/${locale}/register`}
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                {t("login_register_link")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </GuestGuard>
  );
}
