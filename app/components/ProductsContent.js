"use client";
import ProductList from "./ProductList";
import CategorySidebar from "./CategorySidebar";
import ProductFilters from "./ProductFilters";
import { roboto } from "@/app/ui/fonts";
import { useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    // Actualizar la categoría seleccionada cuando cambie la URL
    if(categoryParam){
      setSelectedCategory(categoryParam)
    }
  }, [searchParams,categoryParam]);

  const handleCategorySelect = (categoryId) => {
    console.log("Selected category:", categoryId);
    setSelectedCategory(categoryId);
  };

  const handleSearch = (query) => {
    console.log("Search query:", query);
    setSearchQuery(query);
  };

  const handleSort = (sortType) => {
    console.log("Sort by:", sortType);
    setSortBy(sortType);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
      <h1
        className={`${roboto.className} text-2xl md:text-3xl text-center font-bold text-gray-900 mb-4 md:mb-8`}
      >
        Nuestros Productos
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-4">
            <CategorySidebar
              onCategorySelect={handleCategorySelect}
              initialSelected={selectedCategory}
            />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          <ProductFilters onSearch={handleSearch} onSort={handleSort} onCategorySelect={handleCategorySelect} />

          <ProductList
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            sortBy={sortBy}
          />
        </div>
      </div>
    </main>
  );
}
