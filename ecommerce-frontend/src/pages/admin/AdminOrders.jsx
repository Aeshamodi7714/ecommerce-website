import { useEffect, useState } from 'react';
import axiosInstance from '../../services/api/axiosInstance';
import { Package, Clock, CheckCircle2, ChevronRight, User, ShoppingBag, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/admin/all/orders');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/order/${id}`, { status: newStatus });
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-slate-500 animate-pulse">Loading All Orders...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Orders</h1>
          <p className="text-slate-500 font-medium">Monitor and process customer orders across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search ID..." className="bg-transparent border-none outline-none text-sm font-bold w-32" />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* ── ORDERS LIST ── */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">No orders placed yet</h2>
          <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto">When customers place orders, they will appear here for management.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-[10px] font-bold text-slate-400">Order Placed</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                          {order.userId ? 'U' : 'G'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">User ID</p>
                          <p className="text-[10px] font-bold text-slate-400">ID: {order.userId?.slice(-6) || 'Guest'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600">
                          {order.items?.length || 0} ITEMS
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 w-fit ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status === 'delivered' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900">${(order.totalbill || 0).toFixed(2)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <select 
                        className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[10px] font-black uppercase outline-none focus:border-blue-500 transition-all cursor-pointer"
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
