// components/CategorySidebar.js
"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function CategorySidebar({ onCategorySelect, initialSelected }) {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialSelected);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTotalProducts = (category) => {
    // Contar productos directos
    let total = category.products?.length || 0;

    // Sumar productos de subcategorías
    if (category.children) {
      total += category.children.reduce(
        (sum, child) => sum + (child.products?.length || 0),
        0
      );
    }

    return total;
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Error al cargar categorías");
        const data = await response.json();
        setCategories(data);

        // Obtener el parámetro de categoría de la URL
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("category");

        if (categoryId) {
          // Si hay una categoría en la URL, seleccionarla y expandirla
          setSelectedCategory(categoryId);
          setExpandedCategory(categoryId);
          onCategorySelect(categoryId); // Notificar al componente padre
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [onCategorySelect]); // Agregar onCategorySelect como dependencia

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse p-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-10 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">Error al cargar las categorías</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 text-gray-700">
      <h2 className="text-lg font-semibold mb-4">Categorías</h2>
      <nav className="space-y-2">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setExpandedCategory(null);
            onCategorySelect(null);
          }}
          className={`w-full flex items-center justify-between p-2 text-left rounded-lg transition-colors ${
            !selectedCategory ? "bg-red-50 text-red-600" : "hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center">Todas las categorías</span>
        </button>

        {categories.map((category) => (
          <div key={category.id}>
            <button
              onClick={() => {
                setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                );
                setSelectedCategory(category.id);
                onCategorySelect(category.id, "main");
              }}
              className={`w-full flex items-center justify-between p-2 text-left rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? "bg-red-50 text-red-600"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center">
                {category.name}
                <span className="text-sm text-gray-500">
                  ({getTotalProducts(category)})
                </span>
              </span>
              {category.children?.length > 0 &&
                (expandedCategory === category.id ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                ))}
            </button>

            {/* Subcategorías */}
            {expandedCategory === category.id &&
              category.children?.length > 0 && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.children.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => {
                        setSelectedCategory(subcategory.id);
                        onCategorySelect(subcategory.id, "sub");
                      }}
                      className="w-full p-2 text-left text-sm hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span>{subcategory.name}</span>
                      <span className="text-sm text-gray-500">
                        ({subcategory.products?.length || 0})
                      </span>
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
    </div>
  );
}
