import type { Metadata } from "next";
import Link from "next/link";
import {
  getInquiryBackLink,
  normalizeInquiryEntity,
  normalizeInquiryId,
  normalizeInquiryLabel,
  normalizeSalesEmail,
  normalizeWhatsAppNumber,
} from "@/lib/inquiry";

export const metadata: Metadata = {
  title: "Booking Inquiry | 12 Seas Alliance",
  description: "Submit your luxury charter and cabin booking inquiry.",
};

type InquiryPageProps = {
  searchParams: Promise<{
    entity?: string | string[];
    id?: string | string[];
    name?: string | string[];
    boat?: string | string[];
  }>;
};

export default async function InquiryPage({ searchParams }: InquiryPageProps) {
  const resolved = await searchParams;
  const entity = normalizeInquiryEntity(resolved.entity);
  const id = normalizeInquiryId(resolved.id);
  const displayId = id ?? (entity === "general" ? "GENERAL" : "-");
  const name = normalizeInquiryLabel(
    resolved.name,
    entity === "cabin" ? "Selected cabin" : entity === "general" ? "Reservation inquiry" : "Selected boat"
  );
  const boat = normalizeInquiryLabel(resolved.boat, "");
  const salesEmail = normalizeSalesEmail(process.env.SALES_EMAIL);
  const whatsappNumber = normalizeWhatsAppNumber(process.env.SALES_WHATSAPP_NUMBER);
  const backLink = getInquiryBackLink(entity, id);

  const subject = encodeURIComponent(
    `[Booking Inquiry] ${entity.toUpperCase()} ${displayId} - ${name}`
  );
  const message = `Hello 12 Seas Alliance,\n\nI would like to inquire about the following:\n- Type: ${entity}\n- ID: ${displayId}\n- Name: ${name}${boat ? `\n- Boat: ${boat}` : ""}\n\nPlease share availability, pricing details, and booking process.\n\nThank you.`;
  const body = encodeURIComponent(message);
  const whatsappText = encodeURIComponent(message);
  const hasSalesChannel = Boolean(salesEmail || whatsappNumber);
  const emailHref = salesEmail
    ? `mailto:${salesEmail}?subject=${subject}&body=${body}`
    : undefined;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappText}`
    : undefined;

  const contactButtonClass =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold tracking-[0.08em] transition";
  const disabledButtonClass =
    "inline-flex items-center justify-center rounded-full border border-[#d8c8ae] bg-[#f3ebdf] px-5 py-3 text-center text-sm font-semibold tracking-[0.04em] text-[#8d7a62]";

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground md:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl border border-[#dcc9ab] bg-[#f7eee2] p-8 shadow-[0_28px_80px_-52px_rgba(0,0,0,0.8)] md:p-10">
        <p className="text-xs uppercase tracking-[0.18em] text-[#8c7657]">
          Booking Inquiry
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
          Continue Your Reservation
        </h1>

        <div className="mt-8 space-y-3 text-sm text-[#4f3f2b]">
          <div className="flex items-center justify-between rounded-xl bg-[#efe3d2] px-4 py-3">
            <span>Type</span>
            <span className="font-semibold uppercase">{entity}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#efe3d2] px-4 py-3">
            <span>ID</span>
            <span className="font-semibold">{displayId}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#efe3d2] px-4 py-3">
            <span>Name</span>
            <span className="font-semibold text-right">{name}</span>
          </div>
          {boat ? (
            <div className="flex items-center justify-between rounded-xl bg-[#efe3d2] px-4 py-3">
              <span>Boat</span>
              <span className="font-semibold text-right">{boat}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {emailHref ? (
            <a
              href={emailHref}
              className={`${contactButtonClass} bg-[#dbc49d] text-[#1a140d] hover:bg-[#ead6b3]`}
            >
              Email Reservation Team
            </a>
          ) : (
            <div className={disabledButtonClass}>
              Reservation email is not configured
            </div>
          )}
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${contactButtonClass} border border-[#c9b189] bg-[#efe3d2] text-[#5c472f] hover:bg-[#e7d6bb]`}
            >
              Contact via WhatsApp
            </a>
          ) : (
            <div className={disabledButtonClass}>
              WhatsApp channel is not configured
            </div>
          )}
        </div>

        <p className="mt-5 text-xs text-[#6f5d47]">
          {hasSalesChannel
            ? "Inquiry details are sanitized before display and message generation."
            : "Set SALES_EMAIL and SALES_WHATSAPP_NUMBER in the environment before going live."}
        </p>

        <div className="mt-8">
          <Link
            href={backLink.href}
            className="text-sm font-semibold text-[#6f5739] underline underline-offset-4"
          >
            {backLink.label}
          </Link>
        </div>
      </section>
    </main>
  );
}
