import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فروشگاه آنلاین زیورآلات نقره ۹۲۵ دست‌ساز",
  description: "خرید آنلاین زیورآلات دست‌ساز نقره استرلینگ ۹۲۵، انگشتر، گردنبند، دستبند و گوشواره با سنگ‌های اصیل فیروزه نیشابور و عقیق طبیعی با ارسال بیمه‌شده و فاکتور رسمی.",
  keywords: [
    "خرید نقره ۹۲۵",
    "فروشگاه آنلاین نقره",
    "زیورآلات نقره زنانه",
    "زیورآلات نقره مردانه",
    "انگشتر فیروزه",
    "گردنبند نقره",
    "دستبند نقره",
    "نقره دست‌ساز نفیسه عبادی"
  ],
  openGraph: {
    title: "فروشگاه آنلاین زیورآلات نقره ۹۲۵ دست‌ساز | نفیسه عبادی",
    description: "خرید آنلاین زیورآلات دست‌ساز نقره استرلینگ ۹۲۵ با سنگ‌های اصیل طبیعی.",
    url: "https://nafiseebadijewellery.com/shop",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
