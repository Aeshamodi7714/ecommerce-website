import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Upload, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axiosInstance';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/product/add', formData);
      toast.success('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/admin/products')}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowLeft className="h-5 w-5" /> Back to Products
      </button>

      <div className="card p-8">
        <h1 className="text-2xl font-extrabold mb-8 flex items-center gap-3">
          <Package className="h-6 w-6 text-blue-600" /> Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-500">Product Name</label>
              <input 
                required 
                className="input" 
                placeholder="e.g. MacBook Pro M3"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-500">Description</label>
              <textarea 
                required 
                rows="4"
                className="input py-3" 
                placeholder="Describe the product features..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-500">Price ($)</label>
              <input 
                required 
                type="number"
                className="input" 
                placeholder="999.00"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-500">Stock Quantity</label>
              <input 
                required 
                type="number"
                className="input" 
                placeholder="50"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-500">Category</label>
              <select 
                required
                className="input"
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
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-500">Image URL</label>
              <div className="relative">
                <input 
                  required 
                  className="input pl-10" 
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                />
                <Upload className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate('/admin/products')}
              className="btn-secondary py-3 px-8 rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-12 rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
