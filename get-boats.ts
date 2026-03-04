import { prisma } from './lib/prisma';

async function main() {
    const boats = await prisma.boat.findMany({
        select: { boatId: true, boatName: true },
        take: 5
    });
    console.log("DAFTAR BOAT DI DATABASE ANDA:");
    console.log(boats);
}
main().catch(console.error).finally(() => prisma.$disconnect());
