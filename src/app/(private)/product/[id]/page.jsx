"use client";
import { useParams } from "next/navigation";
import ProductDetailSection from "../sections/detail.jsx";
import RecommendedSection from "../sections/recommended.jsx";
import { useProductDetailQuery } from "@/hooks/product/useProductDetailQuery";
import { useProductsQuery } from "@/hooks/dashboard/useProductsQuery";
import { useSellerInfo } from "@/hooks/product/useSellerInfo";
import { ProductDetailSkeleton } from "@/components/ui/skeleton";
import React, { useMemo } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { product, isLoading: productLoading } =
    useProductDetailQuery(productId);
  const { seller, isLoading: sellerLoading } = useSellerInfo(
    product?.seller_id || null
  );
  const loading = productLoading || sellerLoading;

  const recParams = useMemo(
    () => ({
      per_page: 6,
      category: product?.category || undefined,
    }),
    [product?.category]
  );

  const { data: recData, isLoading: recommendationsLoading } = useProductsQuery(
    recParams,
    {
      enabled: !!product?.category,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const recommendedProducts =
    recData?.products?.filter((p) => p.id !== productId) || [];

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
