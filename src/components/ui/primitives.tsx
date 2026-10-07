import Link from "next/link";
import type { ReactNode } from "react";
import type { BadgeTone } from "@/lib/present";

const TONE_CLASS: Record<BadgeTone, string> = {
  kadin: "bg-badge-kadin-bg text-badge-kadin-fg",
  erkek: "bg-badge-erkek-bg text-badge-erkek-fg",
  beden: "bg-badge-beden-bg text-badge-beden-fg",
  kumas: "bg-badge-kumas-bg text-badge-kumas-fg",
  stil: "bg-badge-stil-bg text-badge-stil-fg",
  marka: "bg-badge-marka-bg text-badge-marka-fg",
  alisveris: "bg-badge-alisveris-bg text-badge-alisveris-fg",
  trend: "bg-badge-trend-bg text-badge-trend-fg",
};

export function Badge({ tone, children, className = "" }: { tone: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-eyebrow font-bold uppercase tracking-[0.08em] leading-none ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  title,
  id,
  more,
  lead,
  as: As = "h2",
}: {
  title: string;
  id?: string;
  more?: { href: string; label: string };
  lead?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="min-w-0">
        <As id={id} className="text-h2 font-bold text-ink">
          {title}
        </As>
        {lead ? <p className="mt-1 text-muted">{lead}</p> : null}
      </div>
      {more ? (
        <Link
          href={more.href}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4"
        >
          {more.label} <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
}) {
  const v =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-hover"
      : variant === "light"
        ? "bg-white text-ink hover:bg-soft"
        : "border border-line-strong bg-white text-ink hover:border-primary hover:text-primary";
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${v} ${className}`}
    >
      {children}
    </Link>
  );
}

/** Yalnız izinli JSON-LD tipleri (src/lib/jsonld.ts üretir). */
export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container-page ${className}`}>{children}</div>;
}
