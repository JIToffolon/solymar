"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { roboto } from "@/app/ui/fonts";
import Pagination from "@/app/components/Pagination";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", parentId: null });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  const fetchCategories = useCallback(async () => {
    const res = await fetch(
      `/api/admin/categories?page=${currentPage}&limit=${limit}`
    );
    const data = await res.json();
    setCategories(data.categories);
    setTotalPages(data.totalPages);
  },[currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories , currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "/api/admin/categories";
    const method = currentCategory ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        currentCategory ? { ...formData, id: currentCategory.id } : formData
      ),
    });

    if (res.ok) {
      setShowModal(false);
      setCurrentCategory(null);
      setFormData({ name: "", parentId: null });
      fetchCategories();
    } else {
      const error = await res.json();
      alert(error.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error);
      }
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const renderCategoryRow = (category, level = 0) => (
    <React.Fragment key={category.id}>
      <tr className={`hover:bg-gray-50 ${level > 0 ? "bg-gray-50" : ""}`}>
        <td className="px-6 py-4 text-sm text-gray-900">
          <div
            className="flex items-center"
            style={{ marginLeft: `${level * 2}rem` }}
          >
            {category.children?.length > 0 && (
              <button
                onClick={() => toggleCategory(category.id)}
                className="mr-2"
              >
                {expandedCategories[category.id] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            )}
            {category.name}
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {category.products.length +
            (category.children?.reduce(
              (sum, child) => sum + (child.products?.length || 0),
              0
            ) || 0)}
        </td>
        <td className="px-6 py-4 text-sm font-medium">
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setCurrentCategory(category);
                setFormData({
                  name: category.name,
                  parentId: category.parentId,
                });
                setShowModal(true);
              }}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
      {expandedCategories[category.id] &&
        category.children?.map((child) => renderCategoryRow(child, level + 1))}
    </React.Fragment>
  );

  return (
    <div
      className={`${roboto.className} min-h-screen bg-gray-50 text-gray-700`}
    >
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-700">
            Gestión de Categorías
          </h1>
          <button
            onClick={() => {
              setCurrentCategory(null);
              setFormData({ name: "", parentId: null });
              setShowModal(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Nueva Categoría
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => renderCategoryRow(category))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="py-4"
            />
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentCategory ? "Editar Categoría" : "Nueva Categoría"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoría Padre
                  </label>
                  <select
                    value={formData.parentId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parentId: e.target.value || null,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Ninguna (Categoría Principal)</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {currentCategory ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
