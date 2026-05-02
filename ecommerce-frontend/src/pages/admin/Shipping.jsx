import { useState, useEffect } from 'react';
import { 
  Truck, Search, MapPin, Package, CheckCircle2, Clock, 
  RefreshCw, ChevronRight, Filter, ExternalLink, Box, Ship
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Shipping = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingForm, setShippingForm] = useState({
    trackingNumber: '',
    carrier: 'BlueDart'
  });

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/order/admin/all');
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch shipping data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateShipping = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/order/status/${selectedOrder._id}`, {
        status: 'shipped',
        trackingNumber: shippingForm.trackingNumber,
        carrier: shippingForm.carrier
      });
      setOrders(orders.map(o => o._id === selectedOrder._id ? { 
        ...o, 
        status: 'shipped', 
        trackingNumber: shippingForm.trackingNumber,
        carrier: shippingForm.carrier
      } : o));
      toast.success('Shipping info updated');
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await axiosInstance.put(`/order/status/${orderId}`, { status: 'delivered' });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'delivered' } : o));
      toast.success('Order marked as Delivered');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Logistics Hub</h1>
          <p className="text-slate-500 font-medium">Manage global shipments and track delivery performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Search */}
          <div className="bg-white p-4 rounded-[2rem] border-2 border-slate-50 shadow-sm flex items-center gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by Order ID or Tracking #..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          {/* Shipments List */}
          <div className="bg-white rounded-[3.5rem] border-2 border-slate-50 shadow-sm overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center gap-6">
                 <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <Truck className="h-10 w-10" />
                 </div>
                 <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">No active shipments found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="p-8 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                     <div className="flex items-center gap-6">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-500' : 
                          order.status === 'shipped' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'
                        }`}>
                           {order.status === 'delivered' ? <CheckCircle2 className="h-7 w-7" /> : <Box className="h-7 w-7" />}
                        </div>
                        <div>
                           <p className="font-black text-slate-900 text-lg">#{order._id.slice(-8).toUpperCase()}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                              {order.userId?.username || 'Guest Customer'} • {new Date(order.createdAt).toLocaleDateString()}
                           </p>
                        </div>
                     </div>

                     <div className="flex flex-wrap items-center gap-4">
                        {order.trackingNumber ? (
                          <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3">
                             <div className="text-right">
                                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">Tracking ID</p>
                                <p className="text-xs font-black tracking-widest">{order.trackingNumber}</p>
                             </div>
                             <div className="h-6 w-px bg-slate-700"></div>
                             <span className="text-[10px] font-black uppercase">{order.carrier}</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                          >
                            Set Tracking
                          </button>
                        )}
                        
                        {order.status === 'shipped' && (
                          <button 
                            onClick={() => handleMarkDelivered(order._id)}
                            className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Mark as Delivered"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                        )}
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6 relative overflow-hidden group">
              <Ship className="absolute -right-10 -bottom-10 h-64 w-64 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <h3 className="text-xl font-black tracking-tight">Carrier Performance</h3>
              <p className="text-slate-400 text-sm font-medium">Monthly efficiency metrics.</p>
              
              <div className="space-y-6 relative z-10">
                 {[
                   { name: 'BlueDart', rate: 98 },
                   { name: 'FedEx', rate: 98 },
                   { name: 'Delhivery', rate: 98 }
                 ].map(c => (
                   <div key={c.name} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span>{c.name}</span>
                         <span className="text-emerald-400">{c.rate}% OnTime</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.rate}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-scale-up">
              <div className="p-10 border-b border-slate-50 flex items-center gap-4">
                 <div className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Truck className="h-7 w-7" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900">Initialize Shipping</h2>
                    <p className="text-sm font-bold text-slate-400 tracking-tight">Order #{selectedOrder._id.toUpperCase()}</p>
                 </div>
              </div>
              <form onSubmit={handleUpdateShipping} className="p-10 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Select Carrier</label>
                    <select 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                      value={shippingForm.carrier}
                      onChange={(e) => setShippingForm({ ...shippingForm, carrier: e.target.value })}
                    >
                       <option>BlueDart</option>
                       <option>FedEx</option>
                       <option>Delhivery</option>
                       <option>DHL</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tracking Number</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. BLU123456789"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                      value={shippingForm.trackingNumber}
                      onChange={(e) => setShippingForm({ ...shippingForm, trackingNumber: e.target.value })}
                    />
                 </div>
                 <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 mt-4">
                    Dispatch Order
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
