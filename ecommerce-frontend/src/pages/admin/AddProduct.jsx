import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Upload, ArrowLeft, Loader2, Info, Image as ImageIcon, DollarSign, Database, Tag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../redux/slices/productSlice';

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Smartphones',
    stock: '',
    images: [],
    sku: '',
    brand: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict Validation
    if (!formData.name || !formData.price || !formData.stock || !formData.sku) {
      toast.error('Please fill all required fields (Name, Price, Stock, SKU)');
      return;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters long');
      return;
    }

    setLoading(true);
    
    // Ensure images is an array
    const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        isNewproduct: true, // Matching model name
        images: Array.isArray(formData.images) && formData.images.length > 0 ? formData.images : [formData.images[0] || '']
    };

    const result = await dispatch(addProduct(payload));
    if (addProduct.fulfilled.match(result)) {
      toast.success('Product added successfully!');
      navigate('/admin/products');
    } else {
      toast.error(result.payload || 'Failed to add product');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Product</h1>
            <p className="text-slate-500 font-medium text-sm">Add a new item to your premium inventory.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          
          {/* Basic Info */}
          <section className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Product Title</label>
                <input 
                  required 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Detailed Description</label>
                <textarea 
                  required 
                  rows="4"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm resize-none" 
                  placeholder="Provide a compelling description of the product..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
          </section>

          {/* Pricing & Inventory */}
          <section className="space-y-6 pt-10 border-t border-slate-50">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" /> Pricing & Stock
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Selling Price ($)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">$</span>
                  <input 
                    required 
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                    placeholder="0.00"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Inventory Level</label>
                <div className="relative">
                  <Database className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    required 
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                    placeholder="0"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Category & Media */}
          <section className="space-y-6 pt-10 border-t border-slate-50">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" /> Categorization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Product Category</label>
                <select 
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="laptops">Laptops</option>
                  <option value="audio">Audio</option>
                  <option value="watches">Watches</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Brand Name</label>
                <div className="relative">
                  <Package className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    required 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                    placeholder="e.g. Apple"
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Product SKU</label>
                <div className="relative">
                  <Database className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    required 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                    placeholder="EH-001"
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Cover Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    required 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                    placeholder="https://example.com/image.jpg"
                    value={Array.isArray(formData.images) ? formData.images[0] || '' : formData.images}
                    onChange={e => setFormData({...formData, images: [e.target.value]})}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-10 mt-10 border-t border-slate-100 flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-10 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
            >
              Discard
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Plus className="h-5 w-5" /> Launch Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
