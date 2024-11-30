// components/CategorySidebar.js
"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CategorySidebar() {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleCategorySelect = (categoryId, type) => {
    if (type === "main") {
      setExpandedCategory(categoryId);
    }

    // Actualizar la URL
    if (categoryId) {
      const params = new URLSearchParams(searchParams);
      params.set("category", categoryId);
      router.push(`/products?${params.toString()}`);
    } else {
      router.push("/products");
    }
  };

  const getTotalProducts = (category) => {
    let total = category.products?.length || 0;
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

        // Si hay una categoría en la URL, expandir su categoría padre
        const categoryId = searchParams.get("category");
        if (categoryId) {
          const mainCategory = data.find(
            (cat) =>
              cat.id === categoryId ||
              cat.children?.some((sub) => sub.id === categoryId)
          );
          if (mainCategory) {
            setExpandedCategory(mainCategory.id);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [searchParams]);

  if (loading)
    return (
      <div className="space-y-4 animate-pulse p-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-10 bg-gray-200 rounded"></div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 p-4">Error al cargar las categorías</div>
    );

  return (
    <div className="bg-white rounded-lg shadow p-4 text-gray-700">
      <h2 className="text-lg font-semibold mb-4">Categorías</h2>
      <nav className="space-y-2">
        <button
          onClick={() => handleCategorySelect(null)}
          className={`w-full flex items-center justify-between p-2 text-left rounded-lg transition-colors ${
            !currentCategory ? "bg-red-50 text-red-600" : "hover:bg-gray-50"
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
                handleCategorySelect(category.id, "main");
              }}
              className={`w-full flex items-center justify-between p-2 text-left rounded-lg transition-colors ${
                currentCategory === category.id
                  ? "bg-red-50 text-red-600"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-2">
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

            {expandedCategory === category.id &&
              category.children?.length > 0 && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.children.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() =>
                        handleCategorySelect(subcategory.id, "sub")
                      }
                      className={`w-full p-2 text-left text-sm rounded-lg transition-colors flex items-center justify-between
                      ${
                        currentCategory === subcategory.id
                          ? "bg-red-50 text-red-600"
                          : "hover:bg-gray-50 hover:text-red-600"
                      }`}
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
