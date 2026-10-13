import type { Metadata } from "next";
import ProductDetailView from "@/components/product/ProductDetailView";
import { API_BASE_URL } from "@/lib/api";

// Required for next export / static builds
export const dynamicParams = false;

// Real product IDs existing in the backend database
const KNOWN_BACKEND_PRODUCT_IDS = [
  "19", "20", "21", "22", "23", "24", "25", "26", 
  "27", "28", "35", "36", "37", "38", "39"
];

export async function generateStaticParams() {
  const ids = new Set<string>(KNOWN_BACKEND_PRODUCT_IDS);

  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" });
    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items)) {
        items.forEach((item: { id?: number }) => {
          if (item?.id) ids.add(item.id.toString());
        });
      }
    }
  } catch {
    // Fallback to known backend product IDs
  }

  return Array.from(ids).map((id) => ({
    id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let title = "زیورآلات نقره نفیسه عبادی";
  let description = "زیورآلات دست‌ساز نقره استرلینگ ۹۲۵ و سنگ‌های طبیعی اصل نفیسه عبادی.";
  let imageUrl = "https://nafiseebadijewellery.com/favicon.png";

  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const bp = await res.json();
      if (bp && bp.name) {
        title = `${bp.name} | زیورآلات دست‌ساز نفیسه عبادی`;
        description = `${bp.name} نقره استرلینگ ۹۲۵ و گوهرسنگ اصیل. قیمت: ${Number(bp.livePriceToman || 0).toLocaleString()} تومان.`;
        if (bp.imageUrl) {
          imageUrl = bp.imageUrl.startsWith("http") ? bp.imageUrl : `${API_BASE_URL}${bp.imageUrl}`;
        }
      }
    }
  } catch {}

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://nafiseebadijewellery.com/product/${id}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);

  return (
    <ProductDetailView productId={numId} />
  );
}