import Link from "next/link";
import type { ReactNode } from "react";

type LuxuryStatusPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
};

export function LuxuryStatusPage({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  children,
}: LuxuryStatusPageProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground md:px-8">
      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-[#dcc9ab] bg-[#f7eee2] px-8 py-16 shadow-[0_28px_80px_-52px_rgba(0,0,0,0.8)] md:px-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#d9c4a0]/35 blur-3xl" />
          <div className="absolute bottom-0 right-[-8%] h-64 w-64 rounded-full bg-[#8b6d44]/16 blur-3xl" />
        </div>

        <div className="relative max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">{eyebrow}</p>
          <h1
            className="mt-4 text-5xl leading-[0.94] text-[#1f1a14] md:text-7xl"
            style={{ fontFamily: "var(--font-lux-serif), serif" }}
          >
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#5f4f39] md:text-base">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-[#dbc49d] px-6 py-3 text-sm font-bold tracking-[0.08em] text-[#1a140d] transition hover:bg-[#ead6b3]"
            >
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-full border border-[#c9b189] bg-[#efe3d2] px-6 py-3 text-sm font-bold tracking-[0.08em] text-[#5c472f] transition hover:bg-[#e7d6bb]"
              >
                {secondaryLabel}
              </Link>
            ) : null}
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
