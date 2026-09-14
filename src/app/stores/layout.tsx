import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شعب و گالری‌های اختصاصی زیورآلات نفیسه عبادی",
  description: "آدرس، ساعات کاری و تلفن تماس شعب بوتیک زیورآلات نفیسه عبادی در تهران و مشهد جهت خرید حضوری، مشاوره تخصصی و رزرو نوبت VIP.",
  keywords: [
    "شعب زیورآلات نفیسه عبادی",
    "گالری نقره تهران",
    "شعبه مشهد گالری نقره",
    "خرید حضوری زیورآلات نقره",
    "آدرس گالری نقره فرشته"
  ],
  openGraph: {
    title: "شعب و گالری‌های اختصاصی زیورآلات نفیسه عبادی",
    description: "آدرس و اطلاعات تماس شعب رسمی گالری نفیسه عبادی.",
    url: "https://nafiseebadijewellery.com/stores",
  },
};

export default function StoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
