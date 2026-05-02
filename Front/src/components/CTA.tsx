// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi";

interface CTAProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  secondaryIcon?: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

export default function CTA({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  secondaryIcon: SecondaryIcon,
  isExternal = false,
}: CTAProps) {
  return (
    <section className="py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 border border-white/5 p-12 md:p-20 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

          {/* Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <div className="max-w-2xl animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                {title}
              </h2>
              <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-5 shrink-0 w-full lg:w-auto animate-fade-in-up delay-200">
              <Link
                href={primaryHref}
                className="btn-primary w-full sm:w-auto !px-10 !py-5 text-lg shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                {primaryLabel} <HiOutlineArrowRight className="w-5 h-5" />
              </Link>

              {secondaryLabel &&
                secondaryHref &&
                (isExternal ? (
                  <a
                    href={secondaryHref}
                    className="btn-secondary w-full sm:w-auto !px-10 !py-5 text-lg bg-white/5 hover:bg-white/10 border-white/10 backdrop-blur-xl transition-all duration-300"
                  >
                    {SecondaryIcon && <SecondaryIcon className="w-5 h-5" />}
                    {secondaryLabel}
                  </a>
                ) : (
                  <Link
                    href={secondaryHref}
                    className="btn-secondary w-full sm:w-auto !px-10 !py-5 text-lg bg-white/5 hover:bg-white/10 border-white/10 backdrop-blur-xl transition-all duration-300"
                  >
                    {SecondaryIcon && <SecondaryIcon className="w-5 h-5" />}
                    {secondaryLabel}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
