import { useState, useEffect } from 'react';
import { 
  Zap, Plus, Trash2, Calendar, Tag, DollarSign, Percent, 
  Info, ChevronRight, X, Loader2, Edit3, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axiosInstance';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    expiry: '',
    minOrder: '',
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/admin/all/coupons');
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      expiry: '',
      minOrder: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const { data } = await axiosInstance.post('/admin/coupon', formData);
      if (data.success) {
        toast.success('Coupon created successfully');
        setShowModal(false);
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        const { data } = await axiosInstance.delete(`/admin/coupon/${id}`);
        if (data.success) {
          toast.success('Coupon deleted');
          fetchCoupons();
        }
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketing Coupons</h1>
          <p className="text-slate-500 font-medium text-sm">Create and manage discount codes for your customers.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 transform hover:-translate-y-1 active:scale-95"
        >
          <Plus className="h-5 w-5" /> New Coupon
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* ── STATS SUMMARY ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Tag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{coupons.length}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Coupons</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{coupons.reduce((acc, c) => acc + (c.usageCount || 0), 0)}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Redemptions</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">Active</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Campaign Status</p>
              </div>
            </div>
          </div>

          {/* ── COUPON GRID ── */}
          {coupons.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
               <Tag className="h-12 w-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No coupons found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coupons.map((c) => (
                <div key={c._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm tracking-widest border-2 border-blue-100 shadow-sm uppercase">
                      {c.code}
                    </div>
                    <button 
                      onClick={() => handleDelete(c._id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-end gap-2">
                      <h2 className="text-5xl font-black text-slate-900 tracking-tight">
                        {c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}
                      </h2>
                      <span className="text-slate-400 font-black mb-2 uppercase tracking-widest text-[10px]">Discount</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiry Date</p>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-blue-600" /> {new Date(c.expiry).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Min Order</p>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-green-600" /> ${c.minOrder}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 flex items-center justify-between border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${new Date(c.expiry) < new Date() ? 'bg-slate-300' : 'bg-green-500 animate-pulse'}`}></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(c.expiry) < new Date() ? 'Expired' : 'Active'}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">
                        Used {c.usageCount || 0} times
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 animate-scale-up shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Create New Coupon</h3>
                <p className="text-slate-500 font-medium text-sm">Fill in the details for the discount campaign.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:text-slate-900 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Coupon Code</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. SUMMER24"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Type</label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Value</label>
                  <input 
                    required
                    type="number"
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Expiry Date</label>
                  <input 
                    required
                    type="date"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Min Order ($)</label>
                  <input 
                    required
                    type="number"
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                    value={formData.minOrder}
                    onChange={e => setFormData({...formData, minOrder: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Launch Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
