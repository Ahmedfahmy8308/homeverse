// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";
import Link from "next/link";
import { HiOutlineHome, HiOutlineArrowLeft } from "react-icons/hi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="text-[160px] md:text-[200px] font-bold text-white/[0.03] leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center animate-pulse-glow">
              <HiOutlineHome className="w-12 h-12 text-orange-400" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/40 mb-8 leading-relaxed">
          The page you are looking for does not exist, has been moved, or is
          temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary !py-2.5 !px-6 !text-sm w-full sm:w-auto justify-center"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            href="/en"
            className="btn-primary !py-2.5 !px-6 !text-sm w-full sm:w-auto justify-center"
          >
            <HiOutlineHome className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
