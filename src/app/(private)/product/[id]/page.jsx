"use client";
import { useParams } from "next/navigation";
import ProductDetailSection from "../sections/detail.jsx";
import RecommendedSection from "../sections/recommended.jsx";
import { useProductDetailQuery } from "@/hooks/product/useProductDetailQuery";
import { useProductsQuery } from "@/hooks/dashboard/useProductsQuery";
import { useSellerInfo } from "@/hooks/product/useSellerInfo";
import { ProductDetailSkeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { product, isLoading: productLoading } = useProductDetailQuery(productId);
  const { seller, isLoading: sellerLoading } = useSellerInfo(product?.seller_id || null);

  // Fetch all products for recommendation filtering
  const { products: allProducts, isLoading: recommendationsLoading } = useProductsQuery();

  const loading = productLoading || sellerLoading;

  // Filter recommendations:
  // 1. Same category as current product
  // 2. Exclude current product
  // 3. Limit to 6 items
  const recommendedProducts =
    product && allProducts
      ? allProducts
        .filter(
          (p) =>
            p.category?.toLowerCase() === product.category?.toLowerCase() &&
            p.id !== productId
        )
        .slice(0, 6)
      : [];

  return (
    <main className="bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-8">
        {loading ? (
          <ProductDetailSkeleton />
        ) : (
          <>
            <ProductDetailSection product={product} seller={seller} />
            <RecommendedSection
              products={recommendedProducts}
              initialFilter={product?.category || "all"}
              showFilter={false}
              isLoading={recommendationsLoading}
            />
          </>
        )}
      </div>
    </main>
  );
}
