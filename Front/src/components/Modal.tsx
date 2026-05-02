// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-100 overflow-y-auto bg-black/60 p-4 sm:p-6">
      <div className="min-h-full flex items-start justify-center py-8">
        <div
          role="dialog"
          aria-modal="true"
          className={`relative w-full max-w-2xl rounded-[14px] bg-slate-900 border border-white/10 shadow-2xl ${className}`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-2 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
          <div className="max-h-[calc(100vh-6rem)] overflow-y-auto p-6 pr-14">
            {title && (
              <h3 className="text-lg font-semibold text-white mb-4">
                {title}
              </h3>
            )}
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  , document.body);
}
