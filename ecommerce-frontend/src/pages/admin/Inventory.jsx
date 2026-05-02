import { useState, useEffect } from 'react';
import { 
  Database, Search, Filter, ArrowUpDown, AlertTriangle, 
  Plus, Minus, RefreshCw, Download, FilterX, MoreVertical
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, low, out

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get('/product/all');
      setProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockUpdate = async (productId, newStock) => {
    if (newStock < 0) return;
    try {
      await axiosInstance.put(`/product/${productId}`, { stock: newStock });
      setProducts(products.map(p => p._id === productId ? { ...p, stock: newStock } : p));
      toast.success('Stock updated');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'low') return matchesSearch && p.stock > 0 && p.stock <= (p.lowStockThreshold || 5);
    if (filter === 'out') return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Matrix</h1>
          <p className="text-slate-500 font-medium">Track and manage stock levels across all collections.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Items</p>
          <p className="text-4xl font-black text-slate-900">{products.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Low Stock</p>
          <p className="text-4xl font-black text-amber-500">
            {products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5)).length}
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Out of Stock</p>
          <p className="text-4xl font-black text-red-500">
            {products.filter(p => p.stock === 0).length}
          </p>
        </div>
        <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/20 text-white">
          <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Inventory Value</p>
          <p className="text-4xl font-black">${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by product name or SKU..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl w-full md:w-auto">
          {['all', 'low', 'out'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f === 'all' ? 'All Items' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isLow = p.stock > 0 && p.stock <= (p.lowStockThreshold || 5);
                const isOut = p.stock === 0;
                
                return (
                  <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden">
                          <img src={p.image} alt="" className="w-full h-full object-contain p-2" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${p.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">{p.sku || 'N/A'}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-black ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {p.stock} units
                        </span>
                        {isLow && <AlertTriangle className="h-4 w-4 text-amber-500 animate-pulse" />}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleStockUpdate(p._id, p.stock - 1)}
                          className="h-10 w-10 rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-red-200 hover:text-red-500 transition-all"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleStockUpdate(p._id, p.stock + 1)}
                          className="h-10 w-10 rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-emerald-200 hover:text-emerald-500 transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
