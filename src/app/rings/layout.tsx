import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "انگشترهای نقره ۹۲۵ دست‌ساز مردانه و زنانه",
  description: "مجموعه انگشترهای فاخر دست‌ساز نقره استرلینگ ۹۲۵، نگین دُرّ نجف، عقیق سرخ، عقیق کبدی و یشمی با صیقل آینه‌ای و گارانتی اصالت.",
  keywords: [
    "انگشتر نقره ۹۲۵",
    "انگشتر نقره مردانه",
    "انگشتر نقره زنانه",
    "انگشتر دُرّ نجف اصل", "انگشتر عقیق یمنی",
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
