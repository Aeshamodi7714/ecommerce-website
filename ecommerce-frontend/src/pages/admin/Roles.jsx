import { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Search, Plus, Edit3, Trash2, 
  Lock, CheckCircle2, XCircle, Shield, Info, MoreVertical,
  Key, Eye, Settings, Terminal
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Roles = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const permissionsList = [
    { id: 'inventory', title: 'Inventory Access', desc: 'Manage stock and products' },
    { id: 'orders', title: 'Order Management', desc: 'Process orders and shipping' },
    { id: 'customers', title: 'Customer Support', desc: 'Manage users and tickets' },
    { id: 'marketing', title: 'Marketing Control', desc: 'Campaigns and banners' },
    { id: 'financials', title: 'Financial Reports', desc: 'Revenue and payment data' },
  ];

  const fetchAdmins = async () => {
    try {
      const { data } = await axiosInstance.get('/user/admin/all'); // Backend endpoint to get only staff
      setAdmins(data.admins || []);
    } catch (error) {
      toast.error('Failed to fetch admin list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const togglePermission = async (adminId, permId) => {
    const admin = admins.find(a => a._id === adminId);
    const hasPerm = admin.permissions?.includes(permId);
    const newPerms = hasPerm 
      ? admin.permissions.filter(p => p !== permId)
      : [...(admin.permissions || []), permId];

    try {
      await axiosInstance.put(`/user/permissions/${adminId}`, { permissions: newPerms });
      setAdmins(admins.map(a => a._id === adminId ? { ...a, permissions: newPerms } : a));
      toast.success('Permissions updated');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Matrix (RBAC)</h1>
          <p className="text-slate-500 font-medium">Manage administrative roles and fine-grained permissions.</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl">
           <Plus className="h-5 w-5" /> Provision New Admin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Admin Staff List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-[2rem] border-2 border-slate-50 shadow-sm relative">
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter staff by name or email..."
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredAdmins.map((admin) => (
              <div 
                key={admin._id} 
                onClick={() => setSelectedAdmin(admin)}
                className={`bg-white rounded-[2.5rem] border-2 p-8 transition-all cursor-pointer group ${
                  selectedAdmin?._id === admin._id ? 'border-blue-600 shadow-2xl shadow-blue-500/10' : 'border-slate-50 shadow-sm hover:border-slate-100 hover:shadow-lg'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-xl font-black text-slate-400 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-500">
                      {admin.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{admin.username}</h3>
                      <p className="text-sm font-medium text-slate-400 lowercase">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                     <span className="px-4 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                       {admin.role}
                     </span>
                     <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                       {admin.permissions?.length || 0} Modules
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Panel */}
        <div className="space-y-8">
           {selectedAdmin ? (
             <div className="bg-white rounded-[3.5rem] border-2 border-slate-50 shadow-2xl p-10 animate-scale-up sticky top-8">
                <div className="text-center mb-10">
                   <div className="h-24 w-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <ShieldCheck className="h-12 w-12" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-1">{selectedAdmin.username}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrative Control</p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Module Permissions</p>
                  {permissionsList.map((perm) => {
                    const isActive = selectedAdmin.permissions?.includes(perm.id);
                    return (
                      <button 
                        key={perm.id}
                        onClick={() => togglePermission(selectedAdmin._id, perm.id)}
                        className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all group ${
                          isActive ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-50 hover:border-slate-100'
                        }`}
                      >
                        <div className="text-left">
                           <p className={`font-bold text-sm ${isActive ? 'text-emerald-600' : 'text-slate-900'}`}>{perm.title}</p>
                           <p className="text-[10px] font-medium text-slate-400 mt-0.5">{perm.desc}</p>
                        </div>
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
                          isActive ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300 group-hover:text-slate-400'
                        }`}>
                           {isActive ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <div className="flex items-start gap-4">
                      <Info className="h-5 w-5 text-blue-500 mt-1" />
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Changes to permissions take effect immediately after the admin refreshes their session.
                      </p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <Users className="h-20 w-20 mb-6 opacity-20" />
                <p className="font-black uppercase tracking-widest text-xs">Select an admin user<br/>to manage matrix access</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Roles;
