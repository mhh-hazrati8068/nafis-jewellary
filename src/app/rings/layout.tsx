import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "انگشترهای نقره ۹۲۵ دست‌ساز مردانه و زنانه",
  description: "مجموعه انگشترهای فاخر دست‌ساز نقره استرلینگ ۹۲۵، نگین فیروزه اصل نیشابور، عقیق شرف‌الشمس، عقیق یمنی با صیقل آینه‌ای و گارانتی اصالت.",
  keywords: [
    "انگشتر نقره ۹۲۵",
    "انگشتر نقره مردانه",
    "انگشتر نقره زنانه",
    "انگشتر فیروزه نیشابور اصل",
    "انگشتر عقیق یمنی",
    "حلقه نقره دست‌ساز"
  ],
  openGraph: {
    title: "انگشترهای نقره ۹۲۵ دست‌ساز | زیورآلات نفیسه عبادی",
    description: "مجموعه انگشترهای فاخر دست‌ساز نقره استرلینگ ۹۲۵ با نگین‌های معدنی اصیل.",
    url: "https://nafiseebadijewellery.com/rings",
  },
};

export default function RingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
