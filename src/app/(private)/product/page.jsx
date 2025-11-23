import SearchBar from "../../../components/ui/SearchBar.jsx";
import ProductDetailSection from "./sections/detail.jsx";
import RecommendedSection from "./sections/recommended.jsx";

function ProductPage({ searchParams }) {
  const id = searchParams?.id;

  return (
    <main className="bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <SearchBar />
        <ProductDetailSection id={id} />
        <RecommendedSection />
      </div>
    </main>
  );
}

export default ProductPage;
