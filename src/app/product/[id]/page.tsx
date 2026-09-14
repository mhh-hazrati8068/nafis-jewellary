import type { Metadata } from "next";
import { initialProducts } from "@/data/products";
import ProductDetailView from "@/components/product/ProductDetailView";

// Explicitly tell Next.js not to try server-rendering unknown IDs
export const dynamicParams = false;

export async function generateStaticParams() {
  if (!initialProducts || initialProducts.length === 0) {
    return []; 
  }

  return initialProducts.map((product) => ({
    id: product.id.toString(),
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
      title: "محصول یافت نشد | زیورآلات نفیسه عبادی",
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