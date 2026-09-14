import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دستبندها و النگوهای نقره استرلینگ ۹۲۵",
  description: "دستبندهای زنجیری نقره ۹۲۵، بنگل‌های مینیمال و النگوهای کارگاهی دست‌ساز با بالاترین خلوص نقره و قفل‌های ایمن در گالری نفیسه عبادی.",
  keywords: [
    "دستبند نقره ۹۲۵",
    "النگو نقره",
    "دستبند کارتیه نقره",
    "دستبند تنیس نقره",
    "دستبند زنجیری نقره دست‌ساز"
  ],
  openGraph: {
    title: "دستبندها و النگوهای نقره استرلینگ ۹۲۵ | زیورآلات نفیسه عبادی",
    description: "دستبندهای زنجیری نقره ۹۲۵ و النگوهای دست‌ساز کارگاهی.",
    url: "https://nafiseebadijewellery.com/bracelets",
  },
};

export default function BraceletsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
