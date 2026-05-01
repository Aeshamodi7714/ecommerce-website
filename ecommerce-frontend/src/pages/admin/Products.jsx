import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import { Plus, Edit2, Trash2, ExternalLink, Search, Filter, MoreVertical, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axiosInstance';

import { useState } from 'react';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ 
      search: searchTerm, 
      category: selectedCategory 
    }));
  }, [dispatch, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProducts({ 
      search: searchTerm, 
      category: selectedCategory 
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(result)) {
        toast.success('Product deleted successfully');
      } else {
        toast.error(result.payload || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Inventory</h1>
          <p className="text-slate-500 font-medium">Manage your product listings, stock levels, and pricing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={async () => {
              if (window.confirm('This will reset the database with sample products. Continue?')) {
                try {
                  await axiosInstance.post('/admin/seed-products');
                  dispatch(fetchProducts());
                  toast.success('Database seeded successfully');
                } catch (err) {
                  const msg = err.response?.data?.message || err.message;
                  toast.error(`Error: ${msg}`);
                  console.error('Seed Error:', err);
                }
              }
            }}
            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all border border-slate-200"
          >
            Seed Sample Data
          </button>
          <Link to="/admin/add-product" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            <Plus className="h-5 w-5" /> Add Product
          </Link>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <form onSubmit={handleSearch} className="md:col-span-2 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, SKU or brand..." 
            className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-14 pr-24 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
          >
            Search
          </button>
        </form>

        <div className="relative group">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
          <select 
            className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 font-bold text-slate-900 focus:outline-none focus:border-purple-500 transition-all shadow-sm appearance-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
            <option value="audio">Audio</option>
            <option value="watches">Watches</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <button 
          onClick={() => {
            setSearchTerm('');
            setSelectedCategory('');
            dispatch(fetchProducts());
          }}
          className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
        >
          Reset Filters
        </button>
      </div>

      {/* ── PRODUCT TABLE ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-slate-400">Loading Inventory...</p>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-slate-200" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">No products found</h3>
                      <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm">Get started by adding your first product to the inventory.</p>
                      <Link to="/admin/add-product" className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        Add New Product
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 p-2 overflow-hidden group-hover:scale-105 transition-transform">
                        <img src={product.image} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight mb-1">{product.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SKU: {product._id?.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-900">${product.price}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                      <span className="font-bold text-sm text-slate-600">{product.stock} in stock</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <Link 
                        to={`/admin/edit-product/${product._id}`}
                        className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Link to={`/products/${product._id}`} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
