// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

export default function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[14px] bg-white/3 border border-white/5 p-6 shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
