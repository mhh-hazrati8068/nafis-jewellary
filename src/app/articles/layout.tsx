import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ژورنال و مقالات تخصصی نقره و گوهرشناسی",
  description: "راهنمای جامع نگهداری نقره ۹۲۵، روش‌های تشخیص فیروزه اصل نیشابور و عقیق طبیعی، شناخت عیارهای نقره و ترندهای ست کردن زیورآلات.",
  keywords: [
    "مقالات گوهرشناسی",
    "راهنمای نگهداری نقره",
    "تشخیص فیروزه اصل",
    "خواص عقیق یمنی",
    "عیار نقره استرلینگ",
    "ژورنال جواهرات نفیسه عبادی"
  ],
  openGraph: {
    title: "ژورنال و مقالات تخصصی نقره و گوهرشناسی | نفیسه عبادی",
    description: "دانشنامه جامع زیورآلات نقره ۹۲۵ دست‌ساز و سنگ‌های قیمتی طبیعی.",
    url: "https://nafiseebadijewellery.com/articles",
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
