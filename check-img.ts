import { prisma } from './lib/prisma';

async function checkImages() {
    const boat = await prisma.boat.findUnique({
        where: { boatId: 'B1' },
        include: { images: true }
    });
    console.log("Images for B1:");
    console.dir(boat?.images, { depth: null });
}
checkImages().catch(console.error).finally(() => prisma.$disconnect());
