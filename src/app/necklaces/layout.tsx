import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "گردنبندها و آویزهای نقره ۹۲۵ و فیروزه",
  description: "انواع گردنبند، پلاک، چوکر و مدال‌های قلم‌زنی نقره استرلینگ ۹۲۵ با سنگ‌های طبیعی فیروزه نیشابور و عقیق در بوتیک نفیسه عبادی.",
  keywords: [
    "گردنبند نقره ۹۲۵",
    "آویز نقره زنانه",
    "پلاک فیروزه نیشابور",
    "مدال نقره دست‌ساز",
    "گردنبند زنجیری نقره"
  ],
  openGraph: {
    title: "گردنبندها و آویزهای نقره ۹۲۵ و فیروزه | زیورآلات نفیسه عبادی",
    description: "انواع گردنبند و مدال‌های قلم‌زنی نقره دست‌ساز و سنگ‌های قیمتی.",
    url: "https://nafiseebadijewellery.com/necklaces",
  },
};

export default function NecklacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
