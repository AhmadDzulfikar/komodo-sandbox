import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/currency";
import { toRenderableImageUrl } from "@/lib/image-url";
import { getBoatPageData } from "@/lib/listing-data";
import Image from "next/image";
import Link from "next/link";

const signatureTypes = ["EXTERIOR", "EXTERIOR_2", "RELAX_AREA_2", "OTHER_1"] as const;
const cabinImageOrder = ["MAIN_DISPLAY", "BEDROOM", "BATHROOM"] as const;

const signatureMeta: Record<
  (typeof signatureTypes)[number],
  { kicker: string; headline: string; subtitle: string }
> = {
  EXTERIOR: {
    kicker: "Arrival Sequence",
    headline: "Grand Exterior",
    subtitle: "First impression with warm nautical tones.",
  },
  EXTERIOR_2: {
    kicker: "Cinematic Angle",
    headline: "Exterior II",
    subtitle: "A more immersive profile for brochure-ready storytelling.",
  },
  RELAX_AREA_2: {
    kicker: "Serenity Deck",
    headline: "Relax Area II",
    subtitle: "Designed for sunset rituals and slow moments.",
  },
  OTHER_1: {
    kicker: "Lifestyle Detail",
    headline: "Signature Scene",
    subtitle: "Editorial mood frame to elevate the booking journey.",
  },
};

const formatImageType = (type: string) =>
  type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

type BoatPageProps = {
  params: Promise<{ boatId: string }>;
};

export const revalidate = 1800;

export async function generateStaticParams() {
  try {
    const boats = await prisma.boat.findMany({ select: { boatId: true } });
    return boats.map((boat) => ({ boatId: boat.boatId }));
  } catch (error) {
    console.error("generateStaticParams(boats) failed:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: BoatPageProps): Promise<Metadata> {
  const { boatId } = await params;

  try {
    const boat = await getBoatPageData(boatId);

    if (!boat) {
      return {
        title: "Boat Not Found | 12 Seas Alliance",
        description: "The requested boat detail could not be found.",
      };
    }

    const description =
      boat.boatDescription ||
      boat.description ||
      `Luxury yacht charter to ${boat.destinations || "Komodo"} with 12 Seas Alliance.`;
    const previewImage = toRenderableImageUrl(
      boat.images[0]?.publicUrl,
      boat.images[0]?.driveUrl
    );

    return {
      title: `${boat.boatName} | 12 Seas Alliance`,
      description,
      openGraph: {
        title: `${boat.boatName} | 12 Seas Alliance`,
        description,
        images: previewImage ? [{ url: previewImage }] : undefined,
      },
    };
  } catch (error) {
    console.error("generateMetadata(boats) failed:", error);
    return {
      title: "Boat Detail | 12 Seas Alliance",
      description: "Luxury yacht charter details by 12 Seas Alliance.",
    };
  }
}

export default async function BoatDetailPage({
  params,
}: BoatPageProps) {
  const resolvedParams = await params;
  const { boatId } = resolvedParams;

  const boat = await getBoatPageData(boatId);

  if (!boat) {
    notFound();
  }

  const getBoatImage = (type: string) => {
    const image = boat.images.find((img) => img.type === type);
    return toRenderableImageUrl(image?.publicUrl, image?.driveUrl);
  };

  const getCabinImage = (cabin: (typeof boat.cabins)[number]) => {
    for (const type of cabinImageOrder) {
      const image = cabin.images.find((img) => img.type === type);
      const src = toRenderableImageUrl(image?.publicUrl, image?.driveUrl);
      if (src) return src;
    }
    return toRenderableImageUrl(cabin.images[0]?.publicUrl, cabin.images[0]?.driveUrl);
  };

  const fallbackBoatImage = toRenderableImageUrl(boat.images[0]?.publicUrl, boat.images[0]?.driveUrl);
  const heroImage =
    getBoatImage("MAIN_DISPLAY") ||
    getBoatImage("EXTERIOR") ||
    getBoatImage("EXTERIOR_2") ||
    fallbackBoatImage;

  const signatureGallery = signatureTypes
    .map((type) => {
      const src = getBoatImage(type);
      if (!src) return null;
      return { type, src, ...signatureMeta[type] };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const supplementalGallery = boat.images
    .map((img) => {
      const src = toRenderableImageUrl(img.publicUrl, img.driveUrl);
      if (!src) return null;
      return { type: img.type, src };
    })
    .filter(
      (
        item
      ): item is { type: (typeof boat.images)[number]["type"]; src: string } =>
        item !== null
    )
    .filter((item) => !signatureTypes.includes(item.type as (typeof signatureTypes)[number]))
    .slice(0, 6);

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-40 left-[-15%] h-[420px] w-[420px] rounded-full bg-[#d8c5a6]/45 blur-3xl" />
        <div className="absolute right-[-15%] top-[26%] h-[380px] w-[380px] rounded-full bg-[#8b6d44]/18 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-[1400px] px-4 pb-14 pt-6 md:px-8 md:pt-10">
        <div className="lux-fade-up relative overflow-hidden rounded-[34px] border border-white/55 bg-[#1c1813] shadow-[0_42px_120px_-52px_rgba(0,0,0,0.95)]">
          <div className="absolute inset-0">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={boat.boatName}
                fill
                priority
                className="lux-zoom-soft object-cover opacity-85"
              />
            ) : (
              <div className="h-full w-full bg-[#241f18]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/48 to-black/18" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-transparent to-black/14" />
          </div>

          <div className="relative z-10 grid min-h-[80vh] items-end gap-8 px-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-12 md:py-12">
            <div className="max-w-2xl text-white">
              <p className="mb-4 inline-flex items-center rounded-full border border-white/35 bg-white/12 px-4 py-1 text-[11px] tracking-[0.22em] uppercase">
                Twelve Seas Alliance Collection
              </p>

              <h1
                className="text-5xl leading-[0.93] font-semibold md:text-7xl"
                style={{ fontFamily: "var(--font-lux-serif), serif" }}
              >
                {boat.boatName}
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/90 md:text-base">
                {boat.boatDescription ||
                  boat.description ||
                  `${boat.boatName} is a premium yacht experience designed for curated journeys around ${boat.destinations || "Komodo"}.`}
              </p>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-xs md:grid-cols-4">
                <div className="rounded-2xl border border-white/25 bg-black/25 p-3 backdrop-blur-md">
                  <p className="text-white/70 uppercase tracking-[0.14em]">Category</p>
                  <p className="mt-1 text-white font-semibold">{boat.category || "Luxury Yacht"}</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-black/25 p-3 backdrop-blur-md">
                  <p className="text-white/70 uppercase tracking-[0.14em]">Destinations</p>
                  <p className="mt-1 text-white font-semibold line-clamp-1">{boat.destinations || "Komodo"}</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-black/25 p-3 backdrop-blur-md">
                  <p className="text-white/70 uppercase tracking-[0.14em]">Capacity</p>
                  <p className="mt-1 text-white font-semibold">{boat.totalCapacity || boat.baseCapacity || "-"} Pax</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-black/25 p-3 backdrop-blur-md">
                  <p className="text-white/70 uppercase tracking-[0.14em]">Cabins</p>
                  <p className="mt-1 text-white font-semibold">{boat.cabins.length} Suites</p>
                </div>
              </div>
            </div>

            <div className="lux-fade-up lux-delay-1 ml-auto w-full max-w-md rounded-3xl border border-[#d5bc91]/55 bg-[#111111]/72 p-6 text-white backdrop-blur-xl md:p-7">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#d6c2a0]">Signature Charter</p>
              <p
                className="mt-2 text-4xl font-semibold leading-none"
                style={{ fontFamily: "var(--font-lux-serif), serif" }}
              >
                {formatCurrency(boat.baseBookingPrice)}
              </p>
              <p className="mt-2 text-sm text-white/76">Starting rate for exclusive voyage booking.</p>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#d5bc91]/75 to-transparent" />

              <div className="space-y-3 text-sm text-white/90">
                <div className="flex items-center justify-between">
                  <span className="text-white/65">Operator</span>
                  <span className="font-medium">{boat.operator || "Private Operator"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/65">Boat Type</span>
                  <span className="font-medium">{boat.type || "Phinisi"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/65">Additional Pax</span>
                  <span className="font-medium">{formatCurrency(boat.additionalPaxPrice)}</span>
                </div>
              </div>

              <Link
                href={{
                  pathname: "/inquiry",
                  query: {
                    entity: "boat",
                    id: boat.boatId,
                    name: boat.boatName,
                  },
                }}
                className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#dbc49d] px-5 py-3 text-sm font-bold tracking-[0.08em] text-[#1a140d] transition hover:bg-[#ead6b3]"
              >
                Reserve Private Charter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1400px] px-4 pb-16 md:px-8">
        <div className="lux-fade-up lux-delay-2 flex items-end justify-between gap-6 pb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">Signature Spaces</p>
            <h2
              className="mt-2 text-4xl leading-tight text-[#1f1a14] md:text-5xl"
              style={{ fontFamily: "var(--font-lux-serif), serif" }}
            >
              Exterior and Lifestyle Gallery
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f4f39] md:text-base">
              Curated directly from your R2 collection: Exterior, Exterior 2, Relax Area 2, and
              Other 1.
            </p>
          </div>
        </div>

        {signatureGallery.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {signatureGallery.map((item, index) => (
              <article
                key={item.type}
                className={`lux-fade-up relative overflow-hidden rounded-[28px] border border-[#deceb4] bg-[#19130f] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.7)] ${
                  index === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"
                }`}
                style={{ animationDelay: `${0.08 * (index + 2)}s` }}
              >
                <div className="relative h-[280px] md:h-full md:min-h-[280px]">
                  <Image src={item.src} alt={item.headline} fill className="object-cover transition duration-700 hover:scale-[1.03]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/24 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#e2cfb2]">{item.kicker}</p>
                  <h3
                    className="mt-2 text-3xl leading-tight font-medium"
                    style={{ fontFamily: "var(--font-lux-serif), serif" }}
                  >
                    {item.headline}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">{item.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-[#dbc8aa] bg-[#f3ebdf] p-12 text-center text-[#6e5a40]">
            Signature boat gallery is not available yet.
          </div>
        )}
      </section>

      <section className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 pb-16 md:grid-cols-[1.15fr_0.85fr] md:px-8">
        <div className="lux-fade-up lux-delay-2 rounded-[30px] border border-[#dcccae] bg-[#f3e9db] p-7 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">Voyage Narrative</p>
          <h2
            className="mt-2 text-4xl leading-tight text-[#1f1a14] md:text-5xl"
            style={{ fontFamily: "var(--font-lux-serif), serif" }}
          >
            About {boat.boatName}
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-[#3f3324]">
            {boat.boatDescription ||
              boat.description ||
              "An intimate charter crafted for premium island-hopping experiences and private celebrations."}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {boat.boatDisplayFacilities.map((facility, idx) => (
              <div key={`${facility}-${idx}`} className="rounded-2xl border border-[#dbc8aa] bg-[#f9f2e8] px-4 py-3 text-sm text-[#4f3f2b]">
                {facility}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {supplementalGallery.length > 0 && (
            <div className="lux-fade-up lux-delay-3 rounded-[30px] border border-[#d7c4a4] bg-[#efe3d2] p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">Additional Frames</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {supplementalGallery.map((item) => (
                  <div key={item.type} className="group relative overflow-hidden rounded-2xl border border-[#d5bf9b]">
                    <div className="relative h-36">
                      <Image src={item.src} alt={formatImageType(item.type)} fill className="object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent px-3 py-2 text-[11px] tracking-[0.08em] uppercase text-white">
                      {formatImageType(item.type)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="lux-fade-up lux-delay-3 rounded-[30px] border border-[#d2bb95] bg-[#e7d6bb] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#755d3e]">Trip Snapshot</p>
            <div className="mt-4 space-y-3 text-sm text-[#3e2f1e]">
              <div className="flex items-center justify-between rounded-xl bg-[#f4eadb] px-4 py-3">
                <span>Base Capacity</span>
                <span className="font-semibold">{boat.baseCapacity || "-"} Pax</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#f4eadb] px-4 py-3">
                <span>Total Capacity</span>
                <span className="font-semibold">{boat.totalCapacity || "-"} Pax</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#f4eadb] px-4 py-3">
                <span>Destination Focus</span>
                <span className="font-semibold line-clamp-1">{boat.destinations || "Komodo Islands"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
        <div className="lux-fade-up lux-delay-3 mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8c7657]">Accommodation</p>
            <h2
              className="mt-2 text-4xl leading-tight text-[#1f1a14] md:text-5xl"
              style={{ fontFamily: "var(--font-lux-serif), serif" }}
            >
              Curated Cabin Collection
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#5f4f39]">
            Every suite is staged for privacy, comfort, and elevated sea views.
          </p>
        </div>

        {boat.cabins.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {boat.cabins.map((cabin, index) => {
              const cabinImg = getCabinImage(cabin);
              return (
                <Link
                  href={`/cabins/${cabin.cabinId}`}
                  key={cabin.cabinId}
                  className="lux-fade-up group overflow-hidden rounded-[28px] border border-[#dcc9ab] bg-[#f7eee2] shadow-[0_24px_65px_-42px_rgba(30,23,16,0.75)] transition hover:-translate-y-1"
                  style={{ animationDelay: `${0.08 * (index + 2)}s` }}
                >
                  <div className="relative h-64 overflow-hidden bg-[#d8c5a6]">
                    {cabinImg ? (
                      <Image src={cabinImg} alt={cabin.cabinName} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#705c43]">
                        Cabin image coming soon
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/45 bg-black/25 px-3 py-1 text-[11px] tracking-[0.12em] text-white uppercase backdrop-blur-sm">
                      {cabin.cabinType || "Suite"}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3
                      className="text-3xl leading-tight text-[#1f1a14]"
                      style={{ fontFamily: "var(--font-lux-serif), serif" }}
                    >
                      {cabin.cabinName}
                    </h3>

                    <div className="mt-4 flex items-center justify-between text-sm text-[#5e4b34]">
                      <span>Capacity</span>
                      <span className="font-semibold">{cabin.baseCapacity || "-"} Pax</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm text-[#5e4b34]">
                      <span>Price</span>
                      <span className="font-semibold text-[#2f2417]">{formatCurrency(cabin.price)}</span>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#6f5739]">
                      View Cabin Details
                      <span className="transition group-hover:translate-x-1">&gt;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[26px] border border-[#d6c2a2] bg-[#f3e9db] p-12 text-center text-[#6e5a40]">
            No connected cabins found for this boat yet.
          </div>
        )}
      </section>
    </main>
  );
}
