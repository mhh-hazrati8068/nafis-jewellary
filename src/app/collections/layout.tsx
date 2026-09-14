import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "کالکشن‌های فاخر نقره و سنگ‌های طبیعی",
  description: "مجموعه‌های اختصاصی زیورآلات نقره ۹۲۵ با نگین‌های اصل فیروزه نیشابور، عقیق یمانی و مروارید طبیعی در گالری نفیسه عبادی.",
  keywords: [
    "کالکشن نقره",
    "ست زیورآلات نقره",
    "سرویس نقره عروس",
    "نیم‌ست نقره",
    "نقره فیروزه نیشابور"
  ],
  openGraph: {
    title: "کالکشن‌های فاخر نقره و سنگ‌های طبیعی | زیورآلات نفیسه عبادی",
    description: "مجموعه‌های اختصاصی زیورآلات نقره ۹۲۵ و سنگ‌های طبیعی اصل.",
    url: "https://nafiseebadijewellery.com/collections",
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
