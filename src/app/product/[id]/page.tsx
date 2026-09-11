import { initialProducts } from "@/data/products";
import ProductDetailView from "@/components/product/ProductDetailView";

// 1. Explicitly tell Next.js not to try server-rendering unknown IDs
export const dynamicParams = false;

// 2. Add 'async' here, even if you are just returning local data
export async function generateStaticParams() {
  // Safety check: ensure initialProducts is an array
  if (!initialProducts || initialProducts.length === 0) {
    return []; 
  }

  return initialProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailView productId={Number(id)} />;
}