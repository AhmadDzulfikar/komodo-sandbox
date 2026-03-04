import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toRenderableImageUrl } from "@/lib/image-url";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";

const editorialSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lux-serif",
});

const modernSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-lux-sans",
});

const curatedTypes = ["MAIN_DISPLAY", "BEDROOM", "BATHROOM"] as const;
const supplementalTypes = [
  "BALCONY",
  "JACUZZI",
  "BATHTUB",
  "OTHER_1",
  "OTHER_2",
  "OTHER_3",
  "OTHER_4",
] as const;

const imageMeta: Record<string, { kicker: string; title: string; subtitle: string }> = {
  MAIN_DISPLAY: {
    kicker: "Signature View",
    title: "Main Display",
    subtitle: "Editorial introduction to the suite atmosphere.",
  },
  BEDROOM: {
    kicker: "Sleep Ritual",
    title: "Bedroom",
    subtitle: "Curated rest area with premium bedding details.",
  },
  BATHROOM: {
    kicker: "Private Wellness",
    title: "Bathroom",
    subtitle: "Refined wet area designed for private comfort.",
  },
  BALCONY: {
    kicker: "Open Air",
    title: "Balcony",
    subtitle: "Private outdoor corner for sunrise and sunset views.",
  },
  JACUZZI: {
    kicker: "Indulgence",
    title: "Jacuzzi",
    subtitle: "Elevated in-suite relaxation for premium stays.",
  },
  BATHTUB: {
    kicker: "Serenity Bath",
    title: "Bathtub",
    subtitle: "Calm and elegant bathing experience at sea.",
  },
  OTHER_1: {
    kicker: "Lifestyle Frame",
    title: "Signature Detail I",
    subtitle: "Additional visual mood from this cabin collection.",
  },
  OTHER_2: {
    kicker: "Lifestyle Frame",
    title: "Signature Detail II",
    subtitle: "Additional visual mood from this cabin collection.",
  },
  OTHER_3: {
    kicker: "Lifestyle Frame",
    title: "Signature Detail III",
    subtitle: "Additional visual mood from this cabin collection.",
  },
  OTHER_4: {
    kicker: "Lifestyle Frame",
    title: "Signature Detail IV",
    subtitle: "Additional visual mood from this cabin collection.",
  },
};

const formatCurrency = (value?: { toString(): string } | null) => {
  if (!value) return "On request";
  return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const amenityItems = (cabin: {
  largeBed: boolean;
  seaview: boolean;
  balcony: boolean;
  privateJacuzzi: boolean;
  bathtub: boolean;
}) => {
  const list: { title: string; copy: string }[] = [];

  if (cabin.largeBed) list.push({ title: "Large Bed", copy: "King-size comfort setup." });
  if (cabin.seaview) list.push({ title: "Sea View", copy: "Open view to ocean horizon." });
  if (cabin.balcony) list.push({ title: "Private Balcony", copy: "Personal outdoor lounge area." });
  if (cabin.privateJacuzzi) list.push({ title: "Private Jacuzzi", copy: "In-suite wellness indulgence." });
  if (cabin.bathtub) list.push({ title: "Bathtub", copy: "Calm indoor soaking space." });

  return list;
};

export default async function CabinDetailPage({
  params,
}: {
  params: Promise<{ cabinId: string }>;
}) {
  const resolvedParams = await params;
  const { cabinId } = resolvedParams;

  const cabin = await prisma.cabin.findUnique({
    where: { cabinId },
    include: {
      images: true,
      boat: {
        include: {
          cabins: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!cabin) {
    notFound();
  }

  const getImageByType = (type: string) => {
    const img = cabin.images.find((item) => item.type === type);
    return toRenderableImageUrl(img?.publicUrl, img?.driveUrl);
  };

  const firstImage = toRenderableImageUrl(cabin.images[0]?.publicUrl, cabin.images[0]?.driveUrl);
  const heroImage =
    getImageByType("MAIN_DISPLAY") ||
    getImageByType("BEDROOM") ||
    getImageByType("BATHROOM") ||
    firstImage;

  const curatedGallery = curatedTypes
    .map((type) => {
      const src = getImageByType(type);
      if (!src) return null;
      return {
        type,
        src,
        ...imageMeta[type],
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const suiteMoments = supplementalTypes
    .map((type) => {
      const src = getImageByType(type);
      if (!src) return null;
      return {
        type,
        src,
        ...imageMeta[type],
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const otherCabins = cabin.boat.cabins.filter((item) => item.cabinId !== cabin.cabinId).slice(0, 3);

  const getSiblingImage = (sibling: (typeof otherCabins)[number]) => {
    const preferred = curatedTypes
      .map((type) => sibling.images.find((img) => img.type === type))
      .find(Boolean);

    if (preferred) return toRenderableImageUrl(preferred.publicUrl, preferred.driveUrl);
    return toRenderableImageUrl(sibling.images[0]?.publicUrl, sibling.images[0]?.driveUrl);
  };

  const amenities = amenityItems(cabin);

  return (
    <main
      className={`${editorialSerif.variable} ${modernSans.variable} relative overflow-hidden bg-[#f6f1e8] text-[#1f1b16]`}
      style={{ fontFamily: "var(--font-lux-sans), sans-serif" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-40 right-[-16%] h-[460px] w-[460px] rounded-full bg-[#d8c5a6]/45 blur-3xl" />
        <div className="absolute left-[-14%] top-[30%] h-[340px] w-[340px] rounded-full bg-[#8b6d44]/16 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-[1400px] px-4 pb-14 pt-6 md:px-8 md:pt-10">
        <div className="lux-fade-up relative overflow-hidden rounded-[34px] border border-white/55 bg-[#1c1813] shadow-[0_42px_120px_-52px_rgba(0,0,0,0.95)]">
          <div className="absolute inset-0">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={cabin.cabinName}
                fill
                priority
                className="lux-zoom-soft object-cover opacity-86"
              />
            ) : (
              <div className="h-full w-full bg-[#1f1912]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/76 via-black/40 to-black/12" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/14" />
          </div>

          <Link
            href={`/boats/${cabin.boatId}`}
            className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-white/90 transition hover:text-white md:left-8 md:top-8"
          >
            <span className="text-sm">&larr;</span>
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Back to {cabin.boat.boatName}</span>
          </Link>

          <div className="relative z-10 grid min-h-[78vh] items-end gap-8 px-6 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-12 md:py-12">
            <div className="max-w-2xl text-white">
              <p className="mb-4 inline-flex items-center rounded-full border border-white/35 bg-white/10 px-4 py-1 text-[11px] tracking-[0.2em] uppercase">
                Cabin Experience
              </p>

              <h1
                className="text-5xl leading-[0.93] font-semibold md:text-7xl"
                style={{ fontFamily: "\"Morion\", var(--font-lux-serif), serif" }}
              >
                {cabin.cabinName}
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 md:text-base">
                A private suite crafted for premium comfort, intimate sea views, and seamless
                luxury charter journeys.
              </p>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-xs md:grid-cols-4">
                <div className="rounded-2xl border border-white/25 bg-black/25 p-3 backdrop-blur-md">
                  <p className="text-white/70 uppercase tracking-[0.14em]">Cabin Type</p>
                  <p className="mt-1 font-semibold text-white">{cabin.cabinType || "Suite"}</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-black/25 p-3 backdrop-blur-md">
                  <p className="text-white/70 uppercase tracking-[0.14em]">Boat</p>
                  <p className="mt-1 line-clamp-1 font-semibold text-white">{cabin.boat.boatName}</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-black/25 p-3 backdrop-blur-md">
                  <p className="text-white/70 uppercase tracking-[0.14em]">Base Pax</p>
                  <p className="mt-1 font-semibold text-white">{cabin.baseCapacity || "-"} Pax</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-black/25 p-3 backdrop-blur-md">
                  <p className="text-white/70 uppercase tracking-[0.14em]">Total Pax</p>
                  <p className="mt-1 font-semibold text-white">{cabin.totalCapacity || "-"} Pax</p>
                </div>
              </div>
            </div>

            <div className="lux-fade-up lux-delay-1 ml-auto w-full max-w-md rounded-3xl border border-[#d5bc91]/55 bg-[#111111]/72 p-6 text-white backdrop-blur-xl md:p-7">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#d6c2a0]">Suite Rate</p>
              <p
                className="mt-2 text-4xl font-semibold leading-none"
                style={{ fontFamily: "\"Morion\", var(--font-lux-serif), serif" }}
              >
                {formatCurrency(cabin.price)}
              </p>
              <p className="mt-2 text-sm text-white/76">Per stay. Reserve now, pay later option.</p>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#d5bc91]/75 to-transparent" />

              <div className="space-y-3 text-sm text-white/90">
                <div className="flex items-center justify-between">
                  <span className="text-white/65">Additional Pax</span>
                  <span className="font-medium">{formatCurrency(cabin.additionalPaxPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/65">Margin</span>
                  <span className="font-medium">{cabin.margin?.toString() || "0"}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/65">Hosted by</span>
                  <span className="font-medium line-clamp-1">{cabin.boat.boatName}</span>
                </div>
              </div>

              <button className="mt-7 w-full rounded-full bg-[#dbc49d] px-5 py-3 text-sm font-bold tracking-[0.08em] text-[#1a140d] transition hover:bg-[#ead6b3]">
                Reserve This Cabin
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1400px] px-4 pb-16 md:px-8">
        <div className="lux-fade-up lux-delay-2 pb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">Suite Showcase</p>
          <h2
            className="mt-2 text-4xl leading-tight text-[#1f1a14] md:text-5xl"
            style={{ fontFamily: "\"Morion\", var(--font-lux-serif), serif" }}
          >
            Signature Interior Gallery
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f4f39] md:text-base">
            Curated from your cabin image records: Main Display, Bedroom, and Bathroom.
          </p>
        </div>

        {curatedGallery.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {curatedGallery.map((item, index) => (
              <article
                key={item.type}
                className={`lux-fade-up relative overflow-hidden rounded-[28px] border border-[#deceb4] bg-[#19130f] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.7)] ${
                  index === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"
                }`}
                style={{ animationDelay: `${0.08 * (index + 2)}s` }}
              >
                <div className="relative h-[280px] md:h-full md:min-h-[280px]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 hover:scale-[1.03]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/24 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#e2cfb2]">{item.kicker}</p>
                  <h3
                    className="mt-2 text-3xl leading-tight font-medium"
                    style={{ fontFamily: "\"Morion\", var(--font-lux-serif), serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">{item.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-[#dbc8aa] bg-[#f3ebdf] p-12 text-center text-[#6e5a40]">
            Suite gallery is not available yet.
          </div>
        )}
      </section>

      <section className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 pb-16 md:grid-cols-[1.15fr_0.85fr] md:px-8">
        <div className="lux-fade-up lux-delay-2 rounded-[30px] border border-[#dcccae] bg-[#f3e9db] p-7 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">Cabin Narrative</p>
          <h2
            className="mt-2 text-4xl leading-tight text-[#1f1a14] md:text-5xl"
            style={{ fontFamily: "\"Morion\", var(--font-lux-serif), serif" }}
          >
            About This Suite
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-[#3f3324]">
            {cabin.cabinDescription ||
              cabin.description ||
              "This suite is designed for guests who seek privacy, comfort, and curated luxury details throughout their voyage."}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#dbc8aa] bg-[#f9f2e8] px-4 py-3 text-sm text-[#4f3f2b]">
              Base Capacity: <span className="font-semibold">{cabin.baseCapacity || "-"} Pax</span>
            </div>
            <div className="rounded-2xl border border-[#dbc8aa] bg-[#f9f2e8] px-4 py-3 text-sm text-[#4f3f2b]">
              Total Capacity: <span className="font-semibold">{cabin.totalCapacity || "-"} Pax</span>
            </div>
            <div className="rounded-2xl border border-[#dbc8aa] bg-[#f9f2e8] px-4 py-3 text-sm text-[#4f3f2b]">
              Cabin Type: <span className="font-semibold">{cabin.cabinType || "Suite"}</span>
            </div>
            <div className="rounded-2xl border border-[#dbc8aa] bg-[#f9f2e8] px-4 py-3 text-sm text-[#4f3f2b]">
              Hosted by: <span className="font-semibold">{cabin.boat.boatName}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {suiteMoments.length > 0 && (
            <div className="lux-fade-up lux-delay-3 rounded-[30px] border border-[#d7c4a4] bg-[#efe3d2] p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">Suite Moments</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {suiteMoments.map((item) => (
                  <div key={item.type} className="group relative overflow-hidden rounded-2xl border border-[#d5bf9b]">
                    <div className="relative h-36">
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent px-3 py-2 text-[11px] tracking-[0.08em] uppercase text-white">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="lux-fade-up lux-delay-3 rounded-[30px] border border-[#d2bb95] bg-[#e7d6bb] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#755d3e]">Amenities</p>
            {amenities.length > 0 ? (
              <div className="mt-4 space-y-3 text-sm text-[#3e2f1e]">
                {amenities.map((amenity) => (
                  <div key={amenity.title} className="rounded-xl bg-[#f4eadb] px-4 py-3">
                    <p className="font-semibold">{amenity.title}</p>
                    <p className="mt-1 text-xs text-[#5f4c36]">{amenity.copy}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-[#f4eadb] px-4 py-3 text-sm text-[#5f4c36]">
                Amenity details are being curated.
              </div>
            )}
          </div>
        </div>
      </section>

      {otherCabins.length > 0 && (
        <section className="relative mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
          <div className="lux-fade-up lux-delay-3 mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">More Suites</p>
              <h2
                className="mt-2 text-4xl leading-tight text-[#1f1a14] md:text-5xl"
                style={{ fontFamily: "\"Morion\", var(--font-lux-serif), serif" }}
              >
                Other Cabins on {cabin.boat.boatName}
              </h2>
            </div>
            <Link
              href={`/boats/${cabin.boatId}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#c9b189] bg-[#efe3d2] px-5 py-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#5c472f] transition hover:bg-[#e7d6bb]"
            >
              Back to Boat
              <span>&gt;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {otherCabins.map((sibling, index) => {
              const siblingImage = getSiblingImage(sibling);
              return (
                <Link
                  key={sibling.cabinId}
                  href={`/cabins/${sibling.cabinId}`}
                  className="lux-fade-up group overflow-hidden rounded-[28px] border border-[#dcc9ab] bg-[#f7eee2] shadow-[0_24px_65px_-42px_rgba(30,23,16,0.75)] transition hover:-translate-y-1"
                  style={{ animationDelay: `${0.08 * (index + 2)}s` }}
                >
                  <div className="relative h-60 overflow-hidden bg-[#d8c5a6]">
                    {siblingImage ? (
                      <Image
                        src={siblingImage}
                        alt={sibling.cabinName}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#705c43]">
                        Cabin image coming soon
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/45 bg-black/25 px-3 py-1 text-[11px] tracking-[0.12em] text-white uppercase backdrop-blur-sm">
                      {sibling.cabinType || "Suite"}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3
                      className="text-3xl leading-tight text-[#1f1a14]"
                      style={{ fontFamily: "\"Morion\", var(--font-lux-serif), serif" }}
                    >
                      {sibling.cabinName}
                    </h3>
                    <div className="mt-4 flex items-center justify-between text-sm text-[#5e4b34]">
                      <span>Capacity</span>
                      <span className="font-semibold">{sibling.baseCapacity || "-"} Pax</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-[#5e4b34]">
                      <span>Price</span>
                      <span className="font-semibold text-[#2f2417]">{formatCurrency(sibling.price)}</span>
                    </div>
                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#6f5739]">
                      View Cabin
                      <span className="transition group-hover:translate-x-1">&gt;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
