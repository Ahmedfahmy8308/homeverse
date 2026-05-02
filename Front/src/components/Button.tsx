// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-shadow duration-300";
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-br from-orange-500 to-orange-600 text-white px-5 py-3 shadow-btn hover:shadow-btn-hover",
    secondary: "bg-white/5 text-white px-4 py-2 hover:bg-white/10",
    ghost: "bg-transparent text-white/70 hover:text-white",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
