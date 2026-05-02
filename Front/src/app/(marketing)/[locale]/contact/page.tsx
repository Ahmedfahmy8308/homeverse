// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useParams } from "next/navigation";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
  HiOutlinePaperAirplane,
} from "react-icons/hi";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function ContactPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;

    if (locale) {
      i18n
        .changeLanguage(locale)
        .catch(() => {})
        .finally(() => {
          if (active) setMounted(true);
        });
    } else {
      const t = setTimeout(() => active && setMounted(true), 0);
      return () => clearTimeout(t);
    }

    return () => {
      active = false;
    };
  }, [locale]);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactInfo = [
    {
      icon: HiOutlineLocationMarker,
      label: t("contact_label_address"),
      value: t("address"),
    },
    {
      icon: HiOutlinePhone,
      label: t("contact_label_phone"),
      value: t("phone"),
    },
    { icon: HiOutlineMail, label: t("contact_label_email"), value: t("email") },
    {
      icon: HiOutlineClock,
      label: t("contact_label_hours"),
      value: t("working_hours"),
    },
  ];

  return (
    <>
      <section className="py-20 bg-linear-to-b from-slate-900/50 to-transparent">
        <div className="container text-center animate-fade-in-up">
          <p className="section-subtitle justify-center">
            {t("contact_subtitle")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            {t("contact_title")}
          </h1>
          <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
            {t("contact_text")}
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
            {contactInfo.map((item, idx) => (
              <div key={idx} className="card p-6 flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="card p-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-4 font-medium">
                {t("contact_follow_us")}
              </p>
              <div className="flex gap-3">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                  (Icon, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 animate-fade-in-up delay-200">
            <div className="card p-10">
              <h3 className="text-xl font-semibold text-white mb-8">
                {t("contact_send_message")}
              </h3>

              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center">
                    <HiOutlinePaperAirplane className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    {t("contact_success_title")}
                  </h4>
                  <p className="text-sm text-white/40">
                    {t("contact_success_text")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-white/50 mb-2 font-medium">
                        {t("contact_first_name")}
                      </label>
                      <input className="input" required />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-2 font-medium">
                        {t("contact_last_name")}
                      </label>
                      <input className="input" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2 font-medium">
                      {t("contact_label_email")}
                    </label>
                    <input type="email" className="input" required />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2 font-medium">
                      {t("contact_label_subject")}
                    </label>
                    <input className="input" required />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2 font-medium">
                      {t("contact_label_message")}
                    </label>
                    <textarea rows={5} className="input resize-none" required />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full justify-center py-4!"
                  >
                    <HiOutlinePaperAirplane className="w-4 h-4" />
                    {t("contact_send_button")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="pb-24">
        <div className="container">
          <div className="card overflow-hidden h-80 relative">
            <Image
              src="/images/imported/photo-1526778548025-fa2f459cd5c1-1da8f73f13.jpg"
              alt="Map location"
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-strong p-8 rounded-xl text-center">
                <HiOutlineLocationMarker className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <p className="text-white font-semibold text-lg">Cairo, Egypt</p>
                <p className="text-xs text-white/40 mt-2">
                  UFUQ Tech Headquarters
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
