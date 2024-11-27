"use client";
import ProductList from "@/app/components/ProductList";
import CategorySidebar from "@/app/components/CategorySidebar";
import ProductFilters from "@/app/components/ProductFilters";
import { roboto } from "@/app/ui/fonts";
import { useState } from "react";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className={`${roboto.className} text-3xl text-center font-bold text-gray-900 mb-8`}
      >
        Nuestros Productos
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <CategorySidebar onCategorySelect={handleCategorySelect} />
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          <ProductFilters
            onSearch={handleSearch}
            onSort={handleSort}
          />

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
