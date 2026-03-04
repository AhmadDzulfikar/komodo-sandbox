
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export default async function BoatDetailPage({ params }: { params: Promise<{ boatId: string }> }) {
    const resolvedParams = await params;
    const { boatId } = resolvedParams;

    // 1. Fetch data dari database
    const boat = await prisma.boat.findUnique({
        where: { boatId: boatId },
        include: {
            images: true, // Semua gambar kapal
            cabins: {
                include: {
                    images: true, // Ambil gambar cabin juga untuk ditampilkan di card kamar
                },
            },
        },
    });

    // Jika boat tidak ada di database, lempar ke halaman 404 Not Found
    if (!boat) {
        notFound();
    }

    // 2. Filter gambar
    const mainImage = boat.images.find(img => img.type === 'MAIN_DISPLAY')?.publicUrl;

    return (
        <main className="min-h-screen pb-20 bg-white text-gray-900">
            {/* --- HERO SECTION --- */}
            <div className="relative w-full h-[60vh] bg-slate-900">
                {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={boat.boatName}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Main Display Image Available
                    </div>
                )}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 bg-black/30">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg text-center">{boat.boatName}</h1>
                    <p className="text-lg md:text-xl max-w-3xl text-center drop-shadow-md">
                        {boat.category} • {boat.type}
                    </p>
                </div>
            </div>

            {/* --- BOAT INFORMATION SECTION --- */}
            <div className="max-w-7xl mx-auto p-6 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Kolom Kiri: Deskripsi & Fasilitas */}
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-semibold mb-6">About {boat.boatName}</h2>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                            {boat.boatDescription || boat.description}
                        </p>

                        <h3 className="text-2xl font-semibold mt-10 mb-6 border-b pb-2">Facilities & Amenities</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                            {/* Checklist Dropdown Array dari Spreadsheet */}
                            {boat.boatDisplayFacilities.map((facility, idx) => (
                                <li key={idx} className="flex items-center gap-3">
                                    <span className="text-blue-500">✓</span> {facility}
                                </li>
                            ))}

                            {/* Checklist Booleans Khusus */}
                            {boat.unlimitedFreeWifi && <li className="flex items-center gap-3">📶 Unlimited Free Wifi</li>}
                            {boat.starlinkWifi && <li className="flex items-center gap-3">📡 Starlink Wifi</li>}
                            {boat.jacuzzi && <li className="flex items-center gap-3">🛁 Jacuzzi</li>}
                            {boat.paddleBoard && <li className="flex items-center gap-3">🏄 Paddle Board</li>}
                            {boat.canoe && <li className="flex items-center gap-3">🛶 Canoe</li>}
                            {boat.kayak && <li className="flex items-center gap-3">🛶 Kayak</li>}
                            {boat.fishingGear && <li className="flex items-center gap-3">🎣 Fishing Gear</li>}
                            {boat.snorkelingAvail && <li className="flex items-center gap-3">🤿 Snorkeling Gear</li>}
                            {boat.divingAvail && <li className="flex items-center gap-3">🤿 Diving Package</li>}
                        </ul>
                    </div>

                    {/* Kolom Kanan: Detail Harga & Trip */}
                    <div className="bg-slate-50 p-6 rounded-2xl h-fit border border-slate-200 shadow-sm sticky top-10">
                        <h3 className="text-xl font-bold mb-4">Trip Info</h3>
                        <div className="space-y-3 text-gray-700 mb-6">
                            <p><strong>Operator:</strong> {boat.operator || 'N/A'}</p>
                            <p><strong>Destinations:</strong> {boat.destinations}</p>
                            <p><strong>Capacity:</strong> {boat.baseCapacity} Pax (Up to {boat.totalCapacity} Pax)</p>
                        </div>

                        <hr className="my-6 border-slate-200" />

                        <div className="mb-6">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Starting from</p>
                            <p className="text-3xl font-bold text-blue-600">
                                Rp {boat.baseBookingPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            </p>
                        </div>

                        <button className="w-full bg-blue-600 flex justify-center text-white py-4 rounded-xl mt-2 font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            Book This Boat
                        </button>
                    </div>
                </div>

                {/* --- CABIN LIST SECTION --- */}
                <div className="mt-20 pt-10 border-t border-slate-200">
                    <h2 className="text-3xl font-bold mb-8">Available Cabins on {boat.boatName}</h2>

                    {boat.cabins.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {boat.cabins.map((cabin) => {
                                const cabinImg = cabin.images.find(img => img.type === 'MAIN_DISPLAY')?.publicUrl;
                                return (
                                    <Link href={`/cabins/${cabin.cabinId}`} key={cabin.cabinId} className="group">
                                        <div className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white group-hover:-translate-y-1">
                                            <div className="h-56 relative bg-slate-100 overflow-hidden">
                                                {cabinImg ? (
                                                    <Image src={cabinImg} alt={cabin.cabinName} fill className="object-cover group-hover:scale-105 transition duration-500" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">No Image</div>
                                                )}
                                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-800">
                                                    {cabin.cabinType || 'Standard'}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="font-bold text-xl mb-1 text-slate-900 group-hover:text-blue-600 transition">{cabin.cabinName}</h4>
                                                <div className="flex gap-2 text-slate-500 text-sm mb-4">
                                                    <span>👥 {cabin.baseCapacity} Pax</span>
                                                    {cabin.bathtub && <span>• 🛀 Bathtub</span>}
                                                    {cabin.balcony && <span>• 🚪 Balcony</span>}
                                                </div>
                                                <p className="mt-2 text-lg font-bold text-slate-800">
                                                    Rp {cabin.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-10 rounded-2xl text-center text-slate-500">
                            Belum ada data kamar (cabin) yang tersambung ke kapal ini.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
