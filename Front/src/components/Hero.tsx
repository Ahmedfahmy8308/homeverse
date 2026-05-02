// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export default function Hero({
  title,
  subtitle,
  ctaLabel,
  ctaHref = "/properties",
  image,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
}) {
  return (
    <section className="relative min-h-[85vh] pt-20 flex items-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950/70 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(232,101,26,0.1),transparent)] z-20" />
        {image && (
          <Image
            src={image}
            alt="hero"
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            priority
            loading="eager"
          />
        )}
      </div>

      <div className="container relative z-30 grid lg:grid-cols-2 gap-16 items-center py-20">
        <div>
          <p className="section-subtitle mb-4">{subtitle}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {title}
          </h1>
          <div className="flex gap-4">
            <Link href={ctaHref || "/"}>
              <Button variant="primary" className="px-6">
                {ctaLabel || "Explore"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
