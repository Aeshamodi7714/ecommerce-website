import { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Mail, Bell, Globe, 
  BarChart3, Edit3, Trash2, CheckCircle2, RefreshCw, 
  Image as ImageIcon, ExternalLink, Zap
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Marketing = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('banners');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState({ title: '', image: '', link: '', isActive: true });

  const fetchBanners = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/banners');
      setBanners(data.banners || []);
    } catch (error) {
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      if (currentBanner._id) {
        await axiosInstance.put(`/admin/banner/${currentBanner._id}`, currentBanner);
        toast.success('Banner updated');
      } else {
        await axiosInstance.post('/admin/banner', currentBanner);
        toast.success('Banner created');
      }
      fetchBanners();
      setIsModalOpen(false);
      setCurrentBanner({ title: '', image: '', link: '', isActive: true });
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await axiosInstance.delete(`/admin/banner/${id}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const toggleStatus = async (banner) => {
    try {
      await axiosInstance.put(`/admin/banner/${banner._id}`, { isActive: !banner.isActive });
      fetchBanners();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Growth Center</h1>
          <p className="text-slate-500 font-medium">Manage banners, email campaigns and system-wide alerts.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="text-right border-r border-slate-100 pr-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Avg Click Rate</p>
                 <p className="text-lg font-black text-emerald-500">5.2%</p>
              </div>
              <BarChart3 className="h-5 w-5 text-slate-300" />
           </div>
           <button 
             onClick={() => { setCurrentBanner({ title: '', image: '', link: '', isActive: true }); setIsModalOpen(true); }}
             className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
           >
              <Plus className="h-4 w-4" /> New Asset
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-100 rounded-3xl w-fit shadow-sm">
        {[
          { id: 'banners', label: 'Home Banners', icon: Globe },
          { id: 'emails', label: 'Email Matrix', icon: Mail },
          { id: 'push', label: 'Push Alerts', icon: Bell }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {banners.length === 0 ? (
             <div className="md:col-span-2 bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
                <ImageIcon className="h-20 w-20 text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-slate-900">No Banners Active</h3>
                <p className="text-slate-500 font-medium mb-8">Create high-conversion banners for your store's homepage.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest"
                >
                  Get Started
                </button>
             </div>
          ) : (
            banners.map((banner) => (
              <div key={banner._id} className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-sm overflow-hidden group">
                <div className="h-64 relative overflow-hidden">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${banner.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{banner.title}</h3>
                    <p className="text-sm font-bold text-slate-400">{banner.clicks || 0} total clicks tracked</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => { setCurrentBanner(banner); setIsModalOpen(true); }}
                      className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => toggleStatus(banner)}
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${banner.isActive ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-slate-50 text-slate-400 hover:bg-emerald-500 hover:text-white'}`}
                    >
                      <Zap className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBanner(banner._id)}
                      className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-scale-up">
            <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
               <div className="h-14 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                  <Megaphone className="h-7 w-7" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-900">{currentBanner._id ? 'Edit Asset' : 'New Marketing Asset'}</h2>
                  <p className="text-sm font-bold text-slate-400 tracking-tight">Configure your promotional content.</p>
               </div>
            </div>
            <form onSubmit={handleSaveBanner} className="p-10 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Asset Title</label>
                  <input 
                    type="text" required placeholder="e.g. Summer Tech Sale"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    value={currentBanner.title}
                    onChange={(e) => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Image URL</label>
                  <input 
                    type="url" required placeholder="https://unsplash.com/..."
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    value={currentBanner.image}
                    onChange={(e) => setCurrentBanner({ ...currentBanner, image: e.target.value })}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Target Link</label>
                  <input 
                    type="text" placeholder="/category/smartphones"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    value={currentBanner.link}
                    onChange={(e) => setCurrentBanner({ ...currentBanner, link: e.target.value })}
                  />
               </div>
               <div className="flex items-center gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Save Asset</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketing;
