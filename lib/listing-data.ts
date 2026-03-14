import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const cabinPreviewImageTypes = ["MAIN_DISPLAY", "BEDROOM", "BATHROOM"] as const;

function normalizeCabinDisplayFacilities(value: boolean | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value.filter((facility): facility is string => Boolean(facility));
  }

  return [];
}

export const getBoatPageData = cache(async (boatId: string) => {
  return prisma.boat.findUnique({
    where: { boatId },
    select: {
      boatId: true,
      boatName: true,
      description: true,
      category: true,
      operator: true,
      trip: true,
      destinations: true,
      type: true,
      baseCapacity: true,
      totalCapacity: true,
      baseBookingPrice: true,
      additionalPaxPrice: true,
      boatDescription: true,
      boatDisplayFacilities: true,
      images: {
        select: {
          publicUrl: true,
          driveUrl: true,
          type: true,
        },
      },
      cabins: {
        orderBy: { cabinId: "asc" },
        select: {
          cabinId: true,
          cabinName: true,
          cabinType: true,
          baseCapacity: true,
          price: true,
          images: {
            where: {
              type: {
                in: [...cabinPreviewImageTypes],
              },
            },
            select: {
              publicUrl: true,
              driveUrl: true,
              type: true,
            },
          },
        },
      },
    },
  });
});

export const getCabinPageData = cache(async (cabinId: string) => {
  const rawCabin = await prisma.cabin.findUnique({
    where: { cabinId },
    select: {
      cabinId: true,
      cabinName: true,
      description: true,
      cabinType: true,
      cabinDescription: true,
      baseCapacity: true,
      totalCapacity: true,
      additionalPaxPrice: true,
      price: true,
      largeBed: true,
      seaview: true,
      balcony: true,
      privateJacuzzi: true,
      bathtub: true,
      cabinDisplayFacilities: true,
      boatId: true,
      boat: {
        select: {
          boatId: true,
          boatName: true,
        },
      },
      images: {
        select: {
          publicUrl: true,
          driveUrl: true,
          type: true,
        },
      },
    },
  });

  if (!rawCabin) {
    return null;
  }

  const cabin = {
    ...rawCabin,
    cabinDisplayFacilities: normalizeCabinDisplayFacilities(
      rawCabin.cabinDisplayFacilities as boolean | string[] | null | undefined
    ),
  };

  const siblingCabins = await prisma.cabin.findMany({
    where: {
      boatId: cabin.boatId,
      cabinId: {
        not: cabin.cabinId,
      },
    },
    orderBy: { cabinId: "asc" },
    take: 3,
    select: {
      cabinId: true,
      cabinName: true,
      cabinType: true,
      baseCapacity: true,
      price: true,
      images: {
        where: {
          type: {
            in: [...cabinPreviewImageTypes],
          },
        },
        select: {
          publicUrl: true,
          driveUrl: true,
          type: true,
        },
      },
    },
  });

  return {
    cabin,
    siblingCabins,
  };
});
