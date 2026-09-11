import BrandLogo from "@/components/layout/BrandLogo";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF9F5] text-zinc-950 px-4">
      <div className="relative flex flex-col items-center justify-center mb-4">
        <BrandLogo variant="gold" size="md" showSubline={false} />
        <div className="absolute -inset-4 rounded-full border border-[#C4852B]/30 animate-ping pointer-events-none"></div>
      </div>
      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C4852B] to-transparent animate-pulse rounded-full mt-4"></div>
    </div>
  );
}
