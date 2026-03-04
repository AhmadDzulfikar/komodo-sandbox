import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const boats = await prisma.boat.findUnique({
        where: { boatId: 'B1' },
        include: { images: true }
    });
    return NextResponse.json(boats?.images);
}
