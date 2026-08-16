"use client";

import { useAppStore } from "@/store/useAppStore";
import { MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrappers";

export default function FeaturesRow() {
  const { t } = useAppStore();

  const features = [
    {
      number: "01",
      title: t.features.guaranteeTitle,
      description: t.features.guaranteeDesc,
      tag: "CERTIFIED 18K GOLD"
    },
    {
      number: "02",
      title: t.features.craftedTitle,
      description: t.features.craftedDesc,
      tag: "ARTISAN WORKSHOP"
    },
    {
      number: "03",
      title: t.features.shippingTitle,
      description: t.features.shippingDesc,
      tag: "INSURED LOGISTICS"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F4F1EA] border-y border-[#C4852B]/20 transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        <MotionStaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
          {features.map((feature, idx) => (
            <MotionStaggerItem key={idx}>
              <div 
                className="h-full flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200/80 hover:border-[#C4852B] transition-all duration-500 shadow-sm group luxury-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
                    <span className="font-brand-en text-2xl sm:text-3xl font-light text-[#C4852B] font-mono">
                      {feature.number}
                    </span>
                    <span className="text-[9px] font-mono tracking-[0.25em] text-[#660000] uppercase bg-[#660000]/10 px-2.5 py-1 rounded-full font-bold">
                      {feature.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 mb-2.5 tracking-wide group-hover:text-[#C4852B] transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-xs text-[#626667] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C4852B]">
                  <div className="w-6 h-px bg-[#C4852B] group-hover:w-10 transition-all duration-300"></div>
                  <span>Nafise Ebadi Standard</span>
                </div>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>
      </div>
    </section>
  );
}
