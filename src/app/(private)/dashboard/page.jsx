

import BannerSection from "./sections/banner.jsx";
import CategorySection from "./sections/category.jsx";
import RecommendedSection from "./sections/recommended.jsx";
import { banners, categories } from "../../dummydata.jsx";
import SearchBar from "../../../components/ui/SearchBar.jsx";
import { fetchProducts } from "../../../modules/product/service.js";

export default async function DashboardPage() {
  const products = await fetchProducts();

  return (
    <main className="bg-[#fafafa]">
      <SearchBar />
      <BannerSection banners={banners} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <CategorySection categories={categories} />
        <RecommendedSection products={products} />
      </div>
    </main>
  );
}
