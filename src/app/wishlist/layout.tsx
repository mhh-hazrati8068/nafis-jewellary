import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لیست علاقه‌مندی‌ها و منتخب شما",
  description: "مشاهده و مدیریت زیورآلات نقره نشان‌شده و ذخیره‌شده شما در گالری نفیسه عبادی.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
