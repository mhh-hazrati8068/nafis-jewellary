import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما و پشتیبانی مشتریان",
  description: "راه‌های ارتباطی با گالری زیورآلات نفیسه عبادی، شماره تماس، مشاوره آنلاین خرید نقره ۹۲۵ و رزرو وقت مشاوره حضوری.",
  keywords: [
    "تماس با گالری نفیسه عبادی",
    "شماره تماس فروشگاه نقره",
    "پشتیبانی سفارشات زیورآلات",
    "مشاوره خرید نقره"
  ],
  openGraph: {
    title: "تماس با ما و پشتیبانی | زیورآلات نفیسه عبادی",
    description: "راه‌های ارتباطی و پشتیبانی ۲۴ ساعته مشتریان گالری نفیسه عبادی.",
    url: "https://nafiseebadijewellery.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
