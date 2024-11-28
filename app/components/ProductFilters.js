"use client";
import { useState, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { debounce } from "lodash";
import CategorySidebar from "./CategorySidebar";
import { X } from "lucide-react";

export default function ProductFilters({ onSearch, onSort, onCategorySelect }) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCategorySelect = useCallback(
    (categoryId, type) => {
      if (typeof onCategorySelect) {
        onCategorySelect(categoryId);
        setIsFilterOpen(false);
      }
    },
    [onCategorySelect]
  );

  const debouncedSearch = useCallback(
  (value) => {
    const delayedSearch = debounce((searchValue) => {
      onSearch(searchValue);
    }, 300);
    
    delayedSearch(value);
    
    return () => {
      delayedSearch.cancel();
    };
  },
  [onSearch]
);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="mb-4 md:mb-8 space-y-3 md:space-y-4 text-gray-700">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Barra de búsqueda */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <select
            onChange={(e) => onSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="stock-desc">Mayor stock</option>
          </select>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden bg-white border border-gray-300 rounded-lg p-2"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Panel de filtros móvil */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filtros</h3>
            <button onClick={() => setIsFilterOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-6rem)]">
            <CategorySidebar
              onCategorySelect={handleCategorySelect}
              initialSelected={null}
            />
          </div>
        </div>
      )}
    </div>
  );
}
