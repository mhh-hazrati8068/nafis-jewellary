import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره گالری و کارگاه نقره‌سازی نفیسه عبادی",
  description: "داستان برند، استاندارد نقره استرلینگ ۹۲۵، اصالت سنگ‌های قیمتی فیروزه نیشابور و عقیق و فلسفه ساخت زیورآلات دست‌ساز در کارگاه نفیسه عبادی.",
  keywords: [
    "درباره زیورآلات نفیسه عبادی",
    "کارگاه نقره‌سازی",
    "تاریخچه گالری نفیس",
    "ساخت سفارشی نقره",
    "اصالت فیروزه نیشابور"
  ],
  openGraph: {
    title: "درباره گالری و کارگاه زیورآلات نفیسه عبادی",
    description: "داستان برند و استانداردهای زرگری زیورآلات دست‌ساز نقره ۹۲۵.",
    url: "https://nafiseebadijewellery.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
