import { mockProducts } from "@/data/products";
import ProductDetailView from "@/components/product/ProductDetailView";

export function generateStaticParams() {
  return mockProducts.map((product) => ({
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
