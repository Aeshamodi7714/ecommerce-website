import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import { Package, Truck, Clock, CheckCircle2, ChevronRight, ShoppingBag, Receipt, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  console.log("Current Orders in State:", orders);

  const handleRefresh = () => {
    dispatch(fetchMyOrders());
    toast.success('Orders updated!');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Fetching your orders...</p>
      </div>
    );
  }

  // Ensure orders is always an array
  const ordersList = Array.isArray(orders) ? orders : [];

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/profile" className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Orders</h1>
              <button 
                onClick={handleRefresh}
                className="ml-4 p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                title="Refresh Orders"
              >
                <Clock className="h-5 w-5" />
              </button>
            </div>
            <p className="text-slate-500 font-medium ml-12">Track and manage your recent purchases.</p>
          </div>
          <Link to="/products" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95">
            Continue Shopping <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
        
        {ordersList.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl shadow-slate-200/50 animate-scale-up">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">No orders yet</h2>
            <p className="text-slate-500 text-lg font-medium mb-10 max-w-md mx-auto leading-relaxed">
              Looks like you haven't placed any orders. Start exploring our premium collection!
            </p>
            <Link to="/products" className="inline-flex items-center gap-3 text-blue-600 font-black hover:gap-5 transition-all">
              Browse Products <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {[...ordersList].reverse().map((order) => (
              <div key={order._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden animate-slide-up group">
                {/* Order Top Bar */}
                <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                      <Receipt className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Identifier</p>
                      <p className="text-lg font-black text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-8 md:gap-12">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Placed On</p>
                      <p className="font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bill</p>
                      <p className="text-xl font-black text-blue-600">${(order.totalbill || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 ${
                        order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white animate-pulse'
                      }`}>
                        {order.status === 'delivered' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {order.status || 'Processing'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Order Progress / Items Content */}
                <div className="p-8 md:p-12">
                  {/* Progress Stepper */}
                  <div className="mb-12 relative flex justify-between">
                    <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 rounded-full z-0"></div>
                    <div className="absolute top-5 left-0 h-1 bg-blue-600 rounded-full z-0 transition-all duration-1000" 
                      style={{ width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '66%' : order.status === 'processing' ? '33%' : '5%' }}
                    ></div>
                    
                    {[
                      { label: 'Confirmed', icon: <Clock className="h-4 w-4" />, active: true },
                      { label: 'Processing', icon: <Package className="h-4 w-4" />, active: ['processing', 'shipped', 'delivered'].includes(order.status) },
                      { label: 'Shipped', icon: <Truck className="h-4 w-4" />, active: ['shipped', 'delivered'].includes(order.status) },
                      { label: 'Delivered', icon: <CheckCircle2 className="h-4 w-4" />, active: order.status === 'delivered' }
                    ].map((step, idx) => (
                      <div key={idx} className="relative z-10 flex flex-col items-center text-center max-w-[80px]">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${
                          step.active ? 'bg-blue-600 text-white scale-110 shadow-blue-200' : 'bg-white text-slate-300 border-slate-50'
                        }`}>
                          {step.icon}
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-tighter mt-3 ${step.active ? 'text-slate-900' : 'text-slate-300'}`}>
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Items Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-6">
                      <div className="flex -space-x-6">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-16 h-16 rounded-2xl border-4 border-white bg-slate-50 shadow-xl overflow-hidden transform hover:translate-y-[-8px] transition-transform">
                            <img src={item.image} className="w-full h-full object-contain p-2" alt={item.name} />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-16 h-16 rounded-2xl border-4 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xl z-10">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg">{order.items.length} {order.items.length === 1 ? 'Product' : 'Products'}</p>
                        <p className="text-slate-400 text-sm font-bold">Package in transit to your location.</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-4">
                      <button className="flex-1 sm:flex-none px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all border border-slate-100">
                        Download Invoice
                      </button>
                      <button className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
