// components/CategorySidebar.js
"use client";
import { useState, useEffect,useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CategorySidebar({ onCategorySelect, initialSelected }) {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialSelected);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategorySelect = useCallback(
    (categoryId, type) => {
      setSelectedCategory(categoryId);
      if (categoryId) {
        // Actualizar la URL
        const params = new URLSearchParams(searchParams);
        params.set("category", categoryId);
        router.push(`/products?${params.toString()}`);
      } else {
        // Si se selecciona "Todas las categorías"
        router.push("/products");
      }

      if (type === "main") {
        setExpandedCategory(categoryId);
      }

      if (onCategorySelect) {
        onCategorySelect(categoryId, type);
      }
    },
    [router, searchParams, onCategorySelect]
  );

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
        const categoryId = searchParams.get("category");

        if (categoryId) {
          setSelectedCategory(categoryId);
          setExpandedCategory(categoryId);
          if (onCategorySelect) {
            onCategorySelect(categoryId);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [searchParams, onCategorySelect]);

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
            handleCategorySelect(null)
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
