export const revalidate = 60;

import ProductDetailSection from "./sections/detail.jsx";
import RecommendedSection from "./sections/recommended.jsx";
import {
  fetchProducts,
  fetchProductById,
} from "../../../modules/product/service.js";

export default async function ProductPage({ searchParams }) {
  const params = await searchParams;
  const id = params?.id;
  const [product, products] = await Promise.all([
    id ? fetchProductById(id) : null,
    fetchProducts(),
  ]);

  return (
    <main className="bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-8">
        <ProductDetailSection product={product} />
        <RecommendedSection products={products} initialFilter={product?.category || "all"} />
      </div>
    </main>
  );
}
