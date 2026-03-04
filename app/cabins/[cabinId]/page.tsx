import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export default async function CabinDetailPage({ params }: { params: Promise<{ cabinId: string }> }) {
    const resolvedParams = await params;
    const { cabinId } = resolvedParams;

    // 1. Fetch data dari database
    const cabin = await prisma.cabin.findUnique({
        where: { cabinId: cabinId },
        include: {
            images: true,
            boat: true,   // Ambil data boat nya biar tau ini cabin kapal apa
        },
    });

    if (!cabin) notFound();

    // 2. Filter Gambar sesuai kebutuhan template
    const mainImage = cabin.images.find(img => img.type === 'MAIN_DISPLAY')?.publicUrl;
    const bedroomImage = cabin.images.find(img => img.type === 'BEDROOM')?.publicUrl;
    const bathroomImage = cabin.images.find(img => img.type === 'BATHROOM')?.publicUrl;

    return (
        <main className="max-w-5xl mx-auto p-6 md:p-12 mb-20 mt-10">

            {/* Tombol Back ke Kapal */}
            <Link href={`/boats/${cabin.boatId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-semibold transition">
                <span className="mr-2">←</span> Back to {cabin.boat.boatName}
            </Link>

            {/* HEADER CABIN */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-slate-900 leading-tight">
                {cabin.cabinName}
            </h1>
            <p className="text-slate-500 mb-8 text-lg font-medium flex items-center gap-3">
                <span className="bg-slate-100 px-3 py-1 rounded-md text-sm">{cabin.cabinType || 'Standard Cabin'}</span>
                <span>•</span>
                <span>Hosted by {cabin.boat.boatName}</span>
            </p>

            {/* GALLERY SECTION (Bento Grid Style) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 h-auto md:h-[500px]">
                {/* Gambar Utama Kiri */}
                {mainImage ? (
                    <div className="relative h-64 md:h-full w-full col-span-2 md:col-span-2 overflow-hidden rounded-l-3xl hover:opacity-90 transition">
                        <Image src={mainImage} fill alt="Main Display" className="object-cover" />
                    </div>
                ) : (
                    <div className="col-span-2 bg-slate-100 rounded-l-3xl flex items-center justify-center text-slate-400">
                        No Main Image
                    </div>
                )}

                {/* Gambar Kanan Atas & Kanan Bawah */}
                <div className="col-span-2 grid grid-rows-2 gap-4">
                    <div className="relative h-48 md:h-full w-full overflow-hidden sm:rounded-none md:rounded-tr-3xl bg-slate-100">
                        {bedroomImage ? (
                            <Image src={bedroomImage} fill alt="Bedroom" className="object-cover hover:scale-105 transition duration-500" />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No Bedroom Image</div>
                        )}
                    </div>
                    <div className="relative h-48 md:h-full w-full overflow-hidden sm:rounded-none md:rounded-br-3xl bg-slate-100">
                        {bathroomImage ? (
                            <Image src={bathroomImage} fill alt="Bathroom" className="object-cover hover:scale-105 transition duration-500" />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No Bathroom Image</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

                {/* Konten Utama */}
                <div className="md:col-span-2">
                    <h3 className="text-3xl font-bold mt-2 mb-6 text-slate-900 border-b pb-4">Cabin Description</h3>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg mb-12">
                        {cabin.cabinDescription || cabin.description || "Description not available for this cabin."}
                    </p>

                    <h3 className="text-3xl font-bold mt-8 mb-6 text-slate-900 border-b pb-4">Amenities & Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 bg-white">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="text-2xl">👥</span>
                            <div>
                                <p className="text-sm font-semibold">Capacity</p>
                                <p className="text-xs text-slate-500">{cabin.baseCapacity} Pax (Up to {cabin.totalCapacity})</p>
                            </div>
                        </div>
                        {cabin.largeBed && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="text-2xl">🛏️</span>
                                <div><p className="text-sm font-semibold">Large Bed</p></div>
                            </div>
                        )}
                        {cabin.seaview && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="text-2xl">🌊</span>
                                <div><p className="text-sm font-semibold">Stunning Seaview</p></div>
                            </div>
                        )}
                        {cabin.balcony && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="text-2xl">🚪</span>
                                <div><p className="text-sm font-semibold">Private Balcony</p></div>
                            </div>
                        )}
                        {cabin.privateJacuzzi && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="text-2xl">🛁</span>
                                <div><p className="text-sm font-semibold">Private Jacuzzi</p></div>
                            </div>
                        )}
                        {cabin.bathtub && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="text-2xl">🛀</span>
                                <div><p className="text-sm font-semibold">Indoor Bathtub</p></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Card Section */}
                <div className="bg-white p-8 rounded-3xl h-fit border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-10">
                    <div className="text-slate-500 font-medium mb-2 uppercase text-xs tracking-widest">Price / Stay</div>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-extrabold text-blue-600">
                            Rp {cabin.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </span>
                    </div>

                    <div className="space-y-4 text-sm text-slate-600">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Additional Pax</span>
                            <span className="font-semibold text-slate-900">
                                {cabin.additionalPaxPrice ? `Rp ${cabin.additionalPaxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span>Boat Margin</span>
                            <span className="font-semibold text-slate-900">{cabin.margin?.toString() || 0}%</span>
                        </div>
                    </div>

                    <button className="w-full bg-slate-900 text-white rounded-xl py-4 mt-8 font-bold text-lg hover:bg-slate-800 hover:shadow-lg transition-all">
                        Reserve Cabin
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet</p>
                </div>

            </div>
        </main>
    );
}
