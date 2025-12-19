"use client";
import { useParams } from "next/navigation";
import ProductDetailSection from "../sections/detail.jsx";
import RecommendedSection from "../sections/recommended.jsx";
import { useProductDetailQuery } from "@/hooks/product/useProductDetailQuery";
import { useSellerInfo } from "@/hooks/product/useSellerInfo";
import { ProductDetailSkeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { product, isLoading: productLoading } = useProductDetailQuery(productId);
  const { seller, isLoading: sellerLoading } = useSellerInfo(product?.seller_id || null);

  const loading = productLoading || sellerLoading;

  return (
    <main className="bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-8">
        {loading ? (
          <ProductDetailSkeleton />
        ) : (
          <ProductDetailSection product={product} seller={seller} />
        )}
        {!loading && (
          <RecommendedSection
            products={[]}
            initialFilter={product?.category || "all"}
          />
        )}
      </div>
    </main>
  );
}
