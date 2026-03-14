import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/currency";
import { toRenderableImageUrl } from "@/lib/image-url";

export const metadata: Metadata = {
  title: "12 Seas Alliance | Luxury Yacht & Cabin Booking",
  description:
    "Luxury yacht and cabin booking platform for premium Komodo charter experiences.",
};

export const revalidate = 1800;

async function getFeaturedBoats() {
  try {
    return await prisma.boat.findMany({
      select: {
        boatId: true,
        boatName: true,
        destinations: true,
        category: true,
        baseBookingPrice: true,
        images: {
          select: { publicUrl: true, driveUrl: true, type: true },
          take: 3,
        },
      },
      orderBy: { boatId: "asc" },
      take: 6,
    });
  } catch (error) {
    console.error("Homepage boat fetch failed:", error);
    return [];
  }
}

function renderFeaturedBoatCards(
  boats: Awaited<ReturnType<typeof getFeaturedBoats>>
): ReactNode {
  try {
    return boats.map((boat) => {
      const image = boat.images.find((img) => img.type === "MAIN_DISPLAY") || boat.images[0];
      const imageUrl = toRenderableImageUrl(image?.publicUrl, image?.driveUrl);

      return (
        <Link
          key={boat.boatId}
          href={`/boats/${boat.boatId}`}
          className="group overflow-hidden rounded-[28px] border border-[#dcc9ab] bg-[#f7eee2] shadow-[0_24px_65px_-42px_rgba(30,23,16,0.75)] transition hover:-translate-y-1"
        >
          <div className="relative h-64 overflow-hidden bg-[#d8c5a6]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={boat.boatName}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#705c43]">
                Image coming soon
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent" />
          </div>

          <div className="p-6">
            <h3
              className="text-3xl leading-tight text-[#1f1a14]"
              style={{ fontFamily: "var(--font-lux-serif), serif" }}
            >
              {boat.boatName}
            </h3>

            <div className="mt-3 text-sm text-[#5e4b34]">
              {boat.category || "Luxury Yacht"} - {boat.destinations || "Komodo"}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-[#5e4b34]">
              <span>Starting from</span>
              <span className="font-semibold text-[#2f2417]">
                {formatCurrency(boat.baseBookingPrice)}
              </span>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#6f5739]">
              View Boat Detail
              <span className="transition group-hover:translate-x-1">&gt;</span>
            </div>
          </div>
        </Link>
      );
    });
  } catch (error) {
    console.error("Homepage boat card render failed:", error);

    return (
      <div className="rounded-[26px] border border-[#d6c2a2] bg-[#f3e9db] p-12 text-center text-[#6e5a40] md:col-span-2 xl:col-span-3">
        Featured boats are temporarily unavailable. Please try again shortly.
      </div>
    );
  }
}

export default async function HomePage() {
  const boats = await getFeaturedBoats();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden px-4 pb-16 pt-20 md:px-8 md:pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-12%] h-[360px] w-[360px] rounded-full bg-[#d8c5a6]/45 blur-3xl" />
          <div className="absolute right-[-10%] top-[30%] h-[340px] w-[340px] rounded-full bg-[#8b6d44]/16 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8c7657]">
            Luxury Charter Platform
          </p>
          <h1
            className="mx-auto mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold md:text-7xl"
            style={{ fontFamily: "var(--font-lux-serif), serif" }}
          >
            Book Premium Boats and Curated Cabins in Komodo
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#5f4f39] md:text-base">
            Data-connected listing pages powered by PostgreSQL and Cloudflare R2, designed for
            high-end charter booking experiences.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#featured-boats"
              className="inline-flex items-center justify-center rounded-full bg-[#dbc49d] px-6 py-3 text-sm font-bold tracking-[0.08em] text-[#1a140d] transition hover:bg-[#ead6b3]"
            >
              Explore Featured Boats
            </Link>
            <Link
              href="/inquiry?entity=general&id=GENERAL&name=Luxury%20Inquiry"
              className="inline-flex items-center justify-center rounded-full border border-[#c9b189] bg-[#efe3d2] px-6 py-3 text-sm font-bold tracking-[0.08em] text-[#5c472f] transition hover:bg-[#e7d6bb]"
            >
              Contact Reservation Team
            </Link>
          </div>
        </div>
      </section>

      <section id="featured-boats" className="px-4 pb-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">Boat Collection</p>
              <h2
                className="mt-2 text-4xl leading-tight md:text-5xl"
                style={{ fontFamily: "var(--font-lux-serif), serif" }}
              >
                Featured Luxury Boats
              </h2>
            </div>
          </div>

          {boats.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {renderFeaturedBoatCards(boats)}
            </div>
          ) : (
            <div className="rounded-[26px] border border-[#d6c2a2] bg-[#f3e9db] p-12 text-center text-[#6e5a40]">
              Boat data is currently unavailable. Please try again shortly.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
