import { useEffect, useState } from 'react';
import axiosInstance from '../../services/api/axiosInstance';
import { Package, Clock, CheckCircle2, ChevronRight, User, ShoppingBag, Search, Filter, X, CreditCard, Calendar, Hash, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const StatusDropdown = ({ currentStatus, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const statuses = [
    { label: 'Pending', value: 'pending', color: 'bg-orange-500', icon: Clock },
    { label: 'Shipped', value: 'shipped', color: 'bg-blue-600', icon: ShoppingBag },
    { label: 'Delivered', value: 'delivered', color: 'bg-green-500', icon: CheckCircle2 },
    { label: 'Cancelled', value: 'cancelled', color: 'bg-red-500', icon: X },
  ];

  const activeStatus = statuses.find(s => s.value === (currentStatus || 'pending')) || statuses[0];

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-sm hover:shadow-md active:scale-95 min-w-[120px] ${activeStatus.color}`}
      >
        <span className="flex items-center gap-2">
          <activeStatus.icon className="h-3 w-3" />
          {activeStatus.label}
        </span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-scale-up overflow-hidden">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  onUpdate(status.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-slate-50 ${currentStatus === status.value ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}
              >
                <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                {status.label}
                {currentStatus === status.value && <CheckCircle2 className="h-3 w-3 ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      if (selectedOrder?._id === id) setSelectedOrder({ ...selectedOrder, status: newStatus });
      toast.success(`Order marked as ${newStatus}`, {
        icon: '✅',
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontWeight: 'bold' }
      });
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
    <div className="space-y-8 animate-fade-in relative">
      
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
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Items</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...orders].reverse().map((order) => (
                  <tr 
                    key={order._id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-blue-50/40 transition-all border-b border-slate-50 last:border-0 group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-[10px] font-bold text-slate-400">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                          {order.userId ? 'U' : 'G'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Customer</p>
                          <p className="text-[10px] font-bold text-slate-400">ID: {order.userId?.slice(-6) || 'Guest'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                        {order.items?.length || 0} ITEMS
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center">
                        <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 w-fit shadow-sm text-white ${
                          order.status === 'delivered' ? 'bg-green-500' : 
                          order.status === 'shipped' ? 'bg-blue-600' :
                          'bg-orange-500'
                        }`}>
                          {order.status === 'delivered' ? <CheckCircle2 className="h-2 w-2" /> : <Clock className="h-2 w-2" />}
                          {order.status || 'pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900">${(order.totalbill || 0).toFixed(2)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <StatusDropdown 
                        currentStatus={order.status} 
                        onUpdate={(newStatus) => handleStatusUpdate(order._id, newStatus)} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ORDER DETAILS MODAL ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
            onClick={() => setSelectedOrder(null)}
          ></div>
          
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Package className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Details</h2>
                  <p className="text-sm font-bold text-slate-400">Order ID: #{selectedOrder._id.toUpperCase()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-3 bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-2xl transition-all shadow-sm active:scale-95"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info Cards */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <User className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Customer Info</span>
                  </div>
                  <p className="font-black text-slate-900">User ID: {selectedOrder.userId?.slice(-8) || 'Guest'}</p>
                  <p className="text-xs font-bold text-slate-500">{selectedOrder.userId ? 'Registered Customer' : 'Guest Checkout'}</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Order Date</span>
                  </div>
                  <p className="font-black text-slate-900">{new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs font-bold text-slate-500">Placed at {new Date(selectedOrder.createdAt || Date.now()).toLocaleTimeString()}</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Payment Status</span>
                  </div>
                  <p className="font-black text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Paid Online
                  </p>
                  <p className="text-xs font-bold text-slate-500">Transaction Verified</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" /> Items in Package
                </h3>
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4 text-center">Qty</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx} className="text-sm">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-50 rounded-xl p-2 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                              </div>
                              <p className="font-bold text-slate-900">{item.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-black text-slate-600">x{item.quantity}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-500">${(item.price || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-black text-slate-900">${(item.total || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Billing Summary</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black">${(selectedOrder.totalbill || 0).toFixed(2)}</span>
                    <span className="text-sm font-bold text-green-400">Total Paid</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-700 hidden sm:block"></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Status</p>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    selectedOrder.status === 'delivered' ? 'bg-green-500' : 
                    selectedOrder.status === 'shipped' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}>
                    {selectedOrder.status || 'pending'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-sm transition-all"
                >
                  Print Invoice
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
