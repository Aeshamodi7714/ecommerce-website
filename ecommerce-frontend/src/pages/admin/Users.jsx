import { useState, useEffect } from 'react';
import { User, Mail, Shield, Trash2, Search, Filter, MoreVertical, Calendar, ShoppingBag, Ban, CheckCircle, UserX, UserCheck } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const UserActions = ({ user, onToggleBlock, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-scale-up overflow-hidden">
            <button
              onClick={() => {
                onToggleBlock(user._id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-colors hover:bg-slate-50 ${user.isBlocked ? 'text-green-600' : 'text-orange-600'}`}
            >
              {user.isBlocked ? (
                <>
                  <UserCheck className="h-4 w-4" /> Unblock User
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4" /> Block User
                </>
              )}
            </button>
            <div className="h-px bg-slate-50 mx-2 my-1"></div>
            <button
              onClick={() => {
                onDelete(user._id);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        axiosInstance.get('/admin/all/user'),
        axiosInstance.get('/order/admin/all')
      ]);
      setUsers(usersRes.data.users || []);
      setOrders(ordersRes.data.orders || []);
    } catch (err) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleBlock = async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/user/${id}/block`);
      setUsers(users.map(u => u._id === id ? res.data.user : u));
      toast.success(res.data.message, {
        icon: res.data.user.isBlocked ? '🚫' : '✅',
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontWeight: 'bold' }
      });
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/admin/user/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const getUserOrderCount = (userId) => {
    return orders.filter(order => (order.userId?._id || order.userId) === userId).length;
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-slate-500 font-medium">Control and monitor your platform user activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
            <Search className="h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-bold w-64 text-slate-700" 
            />
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</p>
            <p className="text-2xl font-black text-slate-900">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center gap-5">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <Ban className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blocked</p>
            <p className="text-2xl font-black text-slate-900">{users.filter(u => u.isBlocked).length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</p>
            <p className="text-2xl font-black text-slate-900">{users.filter(u => !u.isBlocked).length}</p>
          </div>
        </div>
      </div>

      {/* ── USERS TABLE ── */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Since</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-10"><div className="h-10 bg-slate-100 rounded-2xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className={`hover:bg-slate-50/80 transition-all group ${u.isBlocked ? 'opacity-60 bg-slate-50/30' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${u.isBlocked ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-110'}`}>
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                            {u.username}
                            {u.role === 'admin' && <Shield className="h-3 w-3 text-purple-600" />}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mt-1">
                            <Mail className="h-3.5 w-3.5" /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <ShoppingBag className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <div>
                          <span className="font-black text-slate-900 block leading-none">{getUserOrderCount(u._id)}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Orders</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Joined</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <UserActions 
                        user={u} 
                        onToggleBlock={handleToggleBlock} 
                        onDelete={handleDeleteUser} 
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-10 w-10 text-slate-200" />
                    </div>
                    <p className="text-slate-500 font-bold">No users found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
