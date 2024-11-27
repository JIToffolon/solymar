"use client";
import { useState, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { debounce } from "lodash";

export default function ProductFilters({ onSearch, onSort, totalProducts }) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="mb-8 space-y-4 text-gray-700">
      <div className="flex gap-4">
        {/* Barra de búsqueda */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg "
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Botón de filtros para móvil */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden bg-white border border-gray-300 rounded-lg p-2"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Panel de filtros */}
      <div
        className={`lg:flex gap-4 ${showFilters ? "block" : "hidden lg:flex"}`}
      >
        {/* Ordenar por */}
        <select
          onChange={(e) => onSort(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="default">Ordenar por</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
          <option value="name-asc">Nombre A-Z</option>
          <option value="stock-desc">Mayor stock</option>
        </select>
      </div>

      {/* Contador de resultados
      <div className="text-gray-600">{totalProducts} productos encontrados</div> */}
    </div>
  );
}
