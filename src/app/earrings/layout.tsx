import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "گوشواره‌های نقره ۹۲۵ و مروارید طبیعی",
  description: "گوشواره‌های آویز، میخی و جواهری نقره استرلینگ ۹۲۵ با سنگ‌های معدنی طبیعی، عقیق طبیعی، دُرّ نجف و مروارید اصل ضدحساسیت.",
  keywords: [
    "گوشواره نقره ۹۲۵",
    "گوشواره مروارید اصل",
    "گوشواره عقیق طبیعی", "گوشواره دُرّ نجف",
    "گوشواره آویز نقره",
    "گوشواره میخی نقره"
  ],
  openGraph: {
    title: "گوشواره‌های نقره ۹۲۵ و مروارید طبیعی | زیورآلات نفیسه عبادی",
    description: "گوشواره‌های آویز و میخی نقره استرلینگ ۹۲۵ و مروارید طبیعی.",
    url: "https://nafiseebadijewellery.com/earrings",
  },
};

export default function EarringsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
