export default function BoatDetailLoading() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 pb-16 pt-8 md:px-8">
      <div className="mx-auto max-w-[1400px] animate-pulse space-y-6">
        <div className="h-[62vh] rounded-[34px] border border-[#ddceb5] bg-[#e7d8c1]" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="h-80 rounded-[28px] border border-[#ddceb5] bg-[#ebdfcb] md:col-span-7 md:row-span-2" />
          <div className="h-80 rounded-[28px] border border-[#ddceb5] bg-[#ebdfcb] md:col-span-5" />
          <div className="h-80 rounded-[28px] border border-[#ddceb5] bg-[#ebdfcb] md:col-span-5" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="h-72 rounded-[28px] border border-[#ddceb5] bg-[#efe4d2]" />
          <div className="h-72 rounded-[28px] border border-[#ddceb5] bg-[#efe4d2]" />
          <div className="h-72 rounded-[28px] border border-[#ddceb5] bg-[#efe4d2]" />
        </div>
      </div>
    </main>
  );
}
