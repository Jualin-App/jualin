"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetailSection from "../sections/detail.jsx";
import RecommendedSection from "../sections/recommended.jsx";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndSeller = async () => {
      try {
        // Fetch product detail
        const productRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${params.id}`
        );
        const productData = await productRes.json();
        console.log("productData", productData);

        // ✅ Fix: productData.data (bukan productData.data.data)
        setProduct(productData.data);

        // ✅ Fix: seller_id ada di productData.data
        if (productData.data.seller_id) {
          const sellerRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${productData.data.seller_id}`
          );
          const sellerData = await sellerRes.json();
          console.log("sellerData", sellerData);
          setSeller(sellerData.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSeller();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent mb-4"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-8">
        <ProductDetailSection product={product} seller={seller} />
        <RecommendedSection
          products={[]}
          initialFilter={product?.category || "all"}
        />
      </div>
    </main>
  );
}
