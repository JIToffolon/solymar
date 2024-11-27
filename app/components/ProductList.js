"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ selectedCategory, searchQuery, sortBy, priceRange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (selectedCategory) params.set("categoryId", selectedCategory);
        if (searchQuery) params.set("search", searchQuery);
        if (sortBy && sortBy !== "default") params.set("sort", sortBy);
        params.set("page", currentPage);
        params.set("limit", productsPerPage);

        const url = `/api/products${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        let filteredProducts = data.products;
        // Filtrar por precio en el cliente
        if (priceRange) {
          filteredProducts = filteredProducts.filter((product) => {
            const price = Number(product.price);
            return (
              price >= priceRange.min && price <= (priceRange.max || Infinity)
            );
          });
        }

        setProducts(filteredProducts);
        setTotalPages(Math.ceil(data.total / productsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, priceRange, currentPage]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const renderPagination = () => {
    return (
      <div className="flex justify-center gap-2 mt-8 text-gray-700">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            // Mostrar primera página, última página, página actual y páginas adyacentes
            return (
              page === 1 ||
              page === totalPages ||
              Math.abs(currentPage - page) <= 1
            );
          })
          .map((page, index, array) => {
            // Agregar elipsis si hay saltos en la secuencia
            if (index > 0 && page - array[index - 1] > 1) {
              return (
                <span key={`ellipsis-${page}`} className="px-4 py-2">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
        >
          Siguiente
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No hay productos que coincidan con los filtros.
          </p>
        </div>
      ) : (
        renderPagination()
      )}
    </div>
  );
};

export default ProductList;
