import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Inquiry | 12 Seas Alliance",
  description: "Submit your luxury charter and cabin booking inquiry.",
};

type InquiryPageProps = {
  searchParams: Promise<{
    entity?: string;
    id?: string;
    name?: string;
    boat?: string;
  }>;
};

export default async function InquiryPage({ searchParams }: InquiryPageProps) {
  const resolved = await searchParams;
  const entity = resolved.entity === "cabin" ? "cabin" : "boat";
  const id = resolved.id || "-";
  const name = resolved.name || "Selected listing";
  const boat = resolved.boat;

  const subject = encodeURIComponent(
    `[Booking Inquiry] ${entity.toUpperCase()} ${id} - ${name}`
  );
  const body = encodeURIComponent(
    `Hello 12 Seas Alliance,\n\nI would like to inquire about the following:\n- Type: ${entity}\n- ID: ${id}\n- Name: ${name}${boat ? `\n- Boat: ${boat}` : ""}\n\nPlease share availability, pricing details, and booking process.\n\nThank you.`
  );

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 py-16 text-[#1f1b16] md:px-8">
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
            <span className="font-semibold">{id}</span>
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
          <a
            href={`mailto:reservations@12seasalliance.uk?subject=${subject}&body=${body}`}
            className="inline-flex items-center justify-center rounded-full bg-[#dbc49d] px-5 py-3 text-sm font-bold tracking-[0.08em] text-[#1a140d] transition hover:bg-[#ead6b3]"
          >
            Email Reservation Team
          </a>
          <a
            href="https://wa.me/6280000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[#c9b189] bg-[#efe3d2] px-5 py-3 text-sm font-bold tracking-[0.08em] text-[#5c472f] transition hover:bg-[#e7d6bb]"
          >
            Contact via WhatsApp
          </a>
        </div>

        <p className="mt-5 text-xs text-[#6f5d47]">
          Replace contact email/WhatsApp number with your official sales channel.
        </p>

        <div className="mt-8">
          <Link
            href={entity === "cabin" ? `/cabins/${id}` : `/boats/${id}`}
            className="text-sm font-semibold text-[#6f5739] underline underline-offset-4"
          >
            Go back to detail page
          </Link>
        </div>
      </section>
    </main>
  );
}
