import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شوروم و راه‌های ارتباطی زیورآلات نفیسه عبادی",
  description: "اطلاعات رسمی شوروم، ساعات کاری و راه‌های تماس مجموعه زیورآلات دست‌ساز نقره ۹۲۵ نفیسه عبادی.",
  keywords: [
    "شوروم زیورآلات نفیسه عبادی",
    "گالری نقره نفیسه عبادی",
    "خرید حضوری زیورآلات نقره",
    "تماس با نفیسه عبادی"
  ],
  openGraph: {
    title: "شوروم و راه‌های ارتباطی زیورآلات نفیسه عبادی",
    description: "اطلاعات رسمی شوروم و راه‌های ارتباطی مجموعه زیورآلات نفیسه عبادی.",
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
