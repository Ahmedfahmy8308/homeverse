// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

export default function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block text-[11px] font-medium tracking-wide px-3 py-1 rounded-full bg-white/6 text-white/90 ${className}`}
    >
      {children}
    </span>
  );
}
