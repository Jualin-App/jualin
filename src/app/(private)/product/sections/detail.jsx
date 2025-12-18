"use client";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import Toast from "../../../../components/ui/Toast";
import useMidtransPayment from "../hooks/useMidtransPayment";
import { ChatContext } from "@/context/ChatProvider";
import { AuthContext } from "@/context/AuthProvider";
import { getProductImageUrl } from "@/utils/imageHelper";

export default function ProductDetailSection({ product, seller }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { startChat } = useContext(ChatContext);
  const { pay, loading, toast, setToast } = useMidtransPayment();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleChatSeller = async () => {
    // Check if user is logged in
    if (!user) {
      setToast({
        message: "Please login first to chat with seller",
        type: "error",
      });
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    if (!seller || !seller.id) {
      if (seller && seller.success === false) {
        if (seller.status_code === 401) {
          setToast({
            message: "Session expired. Please login to continue.",
            type: "error",
          });
          setTimeout(() => router.push("/auth/login"), 1500);
          return;
        }
        setToast({
          message: seller.message || "Seller information is not available",
          type: "error",
        });
        return;
      }

      setToast({
        message: "Seller information is not available",
        type: "error",
      });
      return;
    }

    if (user?.id && seller?.id && user.id === seller.id) {
      setToast({
        message: "You cannot chat with yourself",
        type: "error",
      });
      return;
    }

    setIsStartingChat(true);

    try {
      const sellerInfo = {
        name: seller?.username || seller?.email || "Seller",
        avatar: seller?.avatar || seller?.profile_picture || null,
      };

      await startChat(
        seller.id,
        sellerInfo,
        product.id
      );

      router.push("/chat");
    } catch (error) {
      console.error("❌ Error starting chat:", error);
      setToast({
        message: "Failed to start chat. Please try again.",
        type: "error",
      });
    } finally {
      setIsStartingChat(false);
    }
  };

  if (!product) {
    return (
      <div className="text-center py-12 text-gray-300">
        Stok produk kosong atau telah dihapus
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex flex-col md:flex-row gap-8 items-start bg-white rounded-2xl shadow p-6">
        <img
          src={getProductImageUrl(product.image)}
          alt={product.name}
          className="w-full md:w-1/2 h-80 object-cover rounded-2xl shadow"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-blue-700">
            {product.brand || product.category}
          </h1>
          <h2 className="text-2xl font-semibold mb-4 text-black">
            {product.name}
          </h2>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <span className="block font-bold text-xl text-black mb-6">
            Rp {product.price}
          </span>
          <div className="flex items-center gap-3">
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition"
              onClick={() => pay(product)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
            <button
              onClick={handleChatSeller}
              className="px-6 py-2 rounded-full font-semibold border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 transition shadow"
              aria-label="Open chat"
              disabled={isStartingChat}
            >
              {isStartingChat ? "Starting chat..." : "Chat"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
