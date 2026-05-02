import { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Calendar, Download, ArrowUpRight, 
  CheckCircle2, XCircle, Clock, RefreshCw, Filter, MoreHorizontal
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/order/admin/all');
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch transaction data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefund = async (orderId) => {
    if (!window.confirm('Are you sure you want to initiate a refund?')) return;
    try {
      await axiosInstance.put(`/order/status/${orderId}`, { paymentStatus: 'refunded', status: 'returned' });
      setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: 'refunded', status: 'returned' } : o));
      toast.success('Refund initiated successfully');
    } catch (error) {
      toast.error('Refund failed');
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalbill || 0), 0);
  const pendingPayouts = orders.filter(o => o.paymentStatus === 'pending').length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Ledger</h1>
          <p className="text-slate-500 font-medium">Monitor all incoming payments and manage refunds.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
           <Download className="h-4 w-4" /> Download Statement
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-50 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Net Revenue</p>
            <p className="text-5xl font-black text-slate-900 mb-2">${totalRevenue.toLocaleString()}</p>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <ArrowUpRight className="h-4 w-4" />
              <span>+12.5% from last month</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-50 rounded-tl-[5rem] -mr-10 -mb-10 transition-all group-hover:scale-110"></div>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-50 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Pending Payouts</p>
            <p className="text-5xl font-black text-slate-900 mb-2">${(pendingPayouts * 150).toLocaleString()}</p>
            <p className="text-slate-400 font-bold text-sm">Across {pendingPayouts} orders</p>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white relative overflow-hidden group">
           <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Refund Rate</p>
              <p className="text-6xl font-black text-white mb-2">0.0%</p>
              <p className="text-slate-500 font-bold text-sm">Total Refunds: 0</p>
           </div>
           <CreditCard className="absolute -right-10 -bottom-10 h-40 w-40 text-white/5 -rotate-12 group-hover:rotate-0 transition-all duration-700" />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[3.5rem] border-2 border-slate-50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row items-center gap-4">
           <div className="flex-1 relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by Transaction ID, User, or Order ID..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-xs text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">
              <Filter className="h-4 w-4" /> Filter by Date
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="font-medium text-sm">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 tracking-tight text-xs uppercase">TXN-{order._id.slice(-10).toUpperCase()}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-slate-900">{order.userId?.username || 'Guest'}</span>
                    <p className="text-[10px] text-slate-400 lowercase">{order.userId?.email || 'N/A'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <CreditCard className="h-3 w-3 text-blue-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Online</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 text-lg">${(order.totalbill || 0).toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        order.paymentStatus === 'success' || order.status !== 'pending' ? 'bg-emerald-50 text-emerald-600' : 
                        order.paymentStatus === 'refunded' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.paymentStatus || (order.status !== 'pending' ? 'success' : 'pending')}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                       <button className="h-10 w-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                          <MoreHorizontal className="h-4 w-4" />
                       </button>
                       {order.status !== 'returned' && order.paymentStatus !== 'refunded' && (
                         <button 
                           onClick={() => handleRefund(order._id)}
                           className="px-4 py-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-lg transition-all"
                         >
                           Refund
                         </button>
                       )}
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

export default Payments;
