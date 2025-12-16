"use client";
import { useParams } from "next/navigation";
import ProductDetailSection from "../sections/detail.jsx";
import RecommendedSection from "../sections/recommended.jsx";
import { useProductDetail } from "@/hooks/product/useProductDetail";
import { useSellerInfo } from "@/hooks/product/useSellerInfo";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { product, isLoading: productLoading } = useProductDetail(productId);
  const { seller, isLoading: sellerLoading } = useSellerInfo(product?.seller_id || null);

  const loading = productLoading || sellerLoading;

  return (
    <main className="bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-8">
        {loading ? (
          <div className="flex flex-col md:flex-row gap-8 items-start bg-white rounded-2xl shadow p-6">
            {/* Skeleton untuk gambar produk */}
            <div className="w-full md:w-1/2">
              <div className="w-full h-80 bg-gray-200 rounded-2xl shadow animate-pulse"></div>
            </div>
            {/* Skeleton untuk detail produk */}
            <div className="flex-1 w-full">
              <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6 animate-pulse"></div>
              <div className="h-7 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
              <div className="flex items-center gap-3">
                <div className="h-10 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
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
