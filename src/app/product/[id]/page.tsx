import type { Metadata } from "next";
import { initialProducts } from "@/data/products";
import ProductDetailView from "@/components/product/ProductDetailView";

import { API_BASE_URL } from "@/lib/api";

// Explicitly tell Next.js not to try server-rendering unknown IDs
export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = new Set<string>();

  // 1. Static initial products
  if (initialProducts && initialProducts.length > 0) {
    initialProducts.forEach((product) => {
      ids.add(product.id.toString());
    });
  }

  // 2. Pre-generate range 1..100 so all current and upcoming product IDs are exported
  for (let i = 1; i <= 100; i++) {
    ids.add(i.toString());
  }

  // 3. Include products from live backend if reachable
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
    // Ignore fetch error at build time
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
  const product = initialProducts.find((p) => p.id === Number(id));

  if (!product) {
    return {
      title: "محصول زیورآلات نقره | زیورآلات نفیسه عبادی",
      description: "زیورآلات دست‌ساز نقره استرلینگ ۹۲۵ و سنگ‌های طبیعی اصل نفیسه عبادی.",
    };
  }

  const title = `${product.nameFa} | زیورآلات دست‌ساز نفیسه عبادی`;
  const description = `${product.descriptionFa} ساخته شده از نقره استرلینگ ۹۲۵ و سنگ‌های طبیعی اصل. قیمت: ${product.price.toLocaleString()} تومان.`;

  return {
    title,
    description,
    keywords: [
      product.nameFa,
      product.nameEn,
      product.categoryFa,
      product.materialFa,
      "زیورآلات نقره ۹۲۵",
      "خرید آنلاین نقره دست‌ساز",
      "نقره نفیسه عبادی"
    ],
    openGraph: {
      title,
      description,
      url: `https://nafiseebadijewellery.com/product/${product.id}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.nameFa,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = initialProducts.find((p) => p.id === Number(id));

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.nameFa,
        "image": product.image,
        "description": product.descriptionFa,
        "sku": `NF-${product.id}`,
        "brand": {
          "@type": "Brand",
          "name": "زیورآلات نفیسه عبادی"
        },
        "material": product.materialFa,
        "offers": {
          "@type": "Offer",
          "url": `https://nafiseebadijewellery.com/product/${product.id}`,
          "priceCurrency": "IRT",
          "price": product.price,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "زیورآلات نفیسه عبادی"
          }
        }
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailView productId={Number(id)} />
    </>
  );
}