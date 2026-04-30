import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Upload, ArrowLeft, Loader2, Info, Image as ImageIcon, DollarSign, Database, Tag, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, updateProduct } from '../../redux/slices/productSlice';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct, loading: fetchLoading } = useSelector((state) => state.products);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    sku: '',
    brand: '',
  });

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || '',
        description: selectedProduct.description || '',
        price: selectedProduct.price || '',
        category: selectedProduct.category || '',
        stock: selectedProduct.stock || '',
        images: selectedProduct.images || (selectedProduct.image ? [selectedProduct.image] : []),
        sku: selectedProduct.sku || '',
        brand: selectedProduct.brand || '',
      });
    }
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    const payload = {
        ...formData,
        images: Array.isArray(formData.images) ? formData.images : [formData.images]
    };

    const result = await dispatch(updateProduct({ id, data: payload }));
    if (updateProduct.fulfilled.match(result)) {
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } else {
      toast.error(result.payload || 'Failed to update product');
      setUpdating(false);
    }
  };

  if (fetchLoading && !selectedProduct) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-slate-500">Fetching Product Details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-20">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Product</h1>
            <p className="text-slate-500 font-medium">Update product specifications and inventory details.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-blue-600" /> Basic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="Enter product title"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Description</label>
                <textarea 
                  rows="5"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  placeholder="Describe the product features..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-blue-600" /> Media & Assets
            </h3>
            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center hover:border-blue-500 transition-all group">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-900">Upload Product Images</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">PNG, JPG or WEBP (Max 2MB)</p>
              <input 
                type="text" 
                className="mt-6 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold"
                placeholder="Or paste image URL here..."
                value={Array.isArray(formData.images) ? formData.images[0] || '' : formData.images}
                onChange={(e) => setFormData({...formData, images: [e.target.value]})}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Organization & Pricing */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
            <h3 className="text-xl font-black text-slate-900 mb-4">Pricing & Stock</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Base Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    type="number" 
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 font-black text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Stock Quantity</label>
                <div className="relative">
                  <Database className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    type="number" 
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 font-black text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">SKU / Code</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="EH-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
            <h3 className="text-xl font-black text-slate-900 mb-4">Organization</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Brand Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="e.g. Apple"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={updating}
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Update Product</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
