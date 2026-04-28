import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import { Package, Truck, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const Orders = () => {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold">No orders found</h2>
          <p className="text-slate-500 mt-2">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card p-6 overflow-hidden">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Order ID</p>
                    <p className="font-bold text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-right">Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-right">Total</p>
                    <p className="font-bold text-blue-600">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {order.status === 'delivered' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {order.status.toUpperCase()}
                  </div>
                </div>
              </div>
              
              {/* Tracking Timeline */}
              <div className="mb-8">
                <div className="flex justify-between relative">
                  {/* Line */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                  <div className={`absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-1000`} style={{ 
                    width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '50%' : '15%' 
                  }}></div>
                  
                  {[
                    { label: 'Confirmed', icon: <Clock className="h-4 w-4" />, active: true },
                    { label: 'Processing', icon: <Package className="h-4 w-4" />, active: ['processing', 'shipped', 'delivered'].includes(order.status) },
                    { label: 'Shipped', icon: <Truck className="h-4 w-4" />, active: ['shipped', 'delivered'].includes(order.status) },
                    { label: 'Delivered', icon: <CheckCircle2 className="h-4 w-4" />, active: order.status === 'delivered' }
                  ].map((step, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-500 ${
                        step.active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {step.icon}
                      </div>
                      <span className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${step.active ? 'text-blue-600' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-4 overflow-hidden">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                      <img src={item.product?.image} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
                <button className="btn-secondary py-2 px-6 rounded-xl text-sm font-bold flex items-center gap-2">
                  View Details <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
