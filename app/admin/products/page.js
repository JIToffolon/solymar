// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Plus, Edit2, Trash2, X } from 'lucide-react';

// const AdminProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     categoryId: '',
//     imageUrl: ''
//   });
//   const [filters, setFilters] = useState({
//     category: '',
//     search: '',
//     stock: 'all' // 'all', 'inStock', 'outOfStock'
//   });

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);

//   const fetchProducts = async () => {
//     const res = await fetch('/api/admin/products');
//     const data = await res.json();
//     setProducts(data);
//   };

//   const fetchCategories = async () => {
//     const res = await fetch('/api/admin/categories');
//     const data = await res.json();
//     setCategories(data);
//   };

//   //  handleSubmit
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const url = '/api/admin/products';
//   const method = currentProduct ? 'PUT' : 'POST';
  
//   try {
//     const res = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(
//         currentProduct 
//           ? { ...formData, id: currentProduct.id }
//           : formData
//       ),
//     });

//     if (!res.ok) {
//       throw new Error('Error al guardar el producto');
//     }

//     const data = await res.json();
//     setShowModal(false);
//     setCurrentProduct(null);
//     setFormData({
//       name: '',
//       description: '',
//       price: '',
//       stock: '',
//       categoryId: '',
//       imageUrl: ''
//     });
//     fetchProducts(); // Recargar la lista de productos
//   } catch (error) {
//     console.error('Error:', error);
//     alert('Error al guardar el producto');
//   }
// };

//   const handleDelete = async (id) => {
//     if (window.confirm('¿Estás seguro de eliminar este producto?')) {
//       const res = await fetch(`/api/admin/products?id=${id}`, {
//         method: 'DELETE',
//       });
//       if (res.ok) fetchProducts();
//     }
//   };



//   return (
//     <div className="min-h-screen bg-gray-50 font-montserrat">
//       <div className="max-w-7xl mx-auto py-6 px-4">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-red-700">Gestión de Productos</h1>
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//           >
//             <Plus size={20} />
//             Nuevo Producto
//           </button>
//         </div>
//          {/* Sección de filtros */}
//          <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
//             <input
//               type="text"
//               value={filters.search}
//               onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
//               placeholder="Buscar producto..."
//               className="w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
//             <select
//               value={filters.category}
//               onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
//               className="w-full border border-gray-300 rounded-md p-2"
//             >
//               <option value="">Todas las categorías</option>
//               {categories.map(category => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
//             <select
//               value={filters.stock}
//               onChange={(e) => setFilters(prev => ({...prev, stock: e.target.value}))}
//               className="w-full border border-gray-300 rounded-md p-2"
//             >
//               <option value="all">Todos</option>
//               <option value="inStock">En stock</option>
//               <option value="outOfStock">Sin stock</option>
//             </select>
//           </div>
//         </div>


//         {/* Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {products.map((product) => (
//                 <tr key={product.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0">
//                         <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrl || '/placeholder.png'} alt="" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">${product.price}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
//                   <td className="px-6 py-4 text-sm font-medium">
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => {
//                           setCurrentProduct(product);
//                           setFormData({ ...product });
//                           setShowModal(true);
//                         }}
//                         className="text-indigo-600 hover:text-indigo-900"
//                       >
//                         <Edit2 size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white rounded-lg p-8 max-w-md w-full">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
//                 </h2>
//                 <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
//                   <X size={24} />
//                 </button>
//               </div>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Nombre</label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Descripción</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     rows="3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Precio</label>
//                     <input
//                       type="number"
//                       value={formData.price}
//                       onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                       required
//                       step="0.01"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Stock</label>
//                     <input
//                       type="number"
//                       value={formData.stock}
//                       onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Categoría</label>
//                   <select
//                     value={formData.categoryId || ''}
//                     onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   >
//                     <option value="">Seleccionar categoría</option>
//                     {categories.map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
//                   <input
//                     type="text"
//                     value={formData.imageUrl}
//                     onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
//                   >
//                     Cancelar
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     {currentProduct ? 'Actualizar' : 'Crear'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminProducts;




'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    stock: 'all'
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = '/api/admin/products';
    const method = currentProduct ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          currentProduct 
            ? { ...formData, id: currentProduct.id }
            : formData
        ),
      });

      if (!res.ok) {
        throw new Error('Error al guardar el producto');
      }

      const data = await res.json();
      setShowModal(false);
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        imageUrl: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchProducts();
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !filters.category || product.categoryId === filters.category;
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStock = filters.stock === 'all' || 
      (filters.stock === 'inStock' && product.stock > 0) ||
      (filters.stock === 'outOfStock' && product.stock === 0);
    
    return matchesCategory && matchesSearch && matchesStock;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-700">Gestión de Productos</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
              placeholder="Buscar producto..."
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <select
              value={filters.stock}
              onChange={(e) => setFilters(prev => ({...prev, stock: e.target.value}))}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="all">Todos</option>
              <option value="inStock">En stock</option>
              <option value="outOfStock">Sin stock</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrl || '/placeholder.png'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">${product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setCurrentProduct(product);
                          setFormData({ ...product });
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
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
                    {currentProduct ? 'Actualizar' : 'Crear'}
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

export default AdminProducts;