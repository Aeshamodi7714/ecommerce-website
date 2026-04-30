import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Printer, Receipt, MapPin, Calendar, User, Phone, X, Heart, ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
  const { lastOrder, orderAddress } = useSelector((state) => state.orders);
  const [showThankYou, setShowThankYou] = useState(false);

  if (!lastOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No order found</h1>
        <Link to="/" className="text-blue-600 mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative">
      
      {/* Thank You Pop-up Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[40px] p-8 sm:p-12 max-w-md w-full text-center relative shadow-2xl animate-scale-up">
            <button 
              onClick={() => setShowThankYou(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-slate-400" />
            </button>
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Heart className="h-12 w-12 fill-current" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Thank You!</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
              Your order has been placed successfully. We are getting it ready for shipment!
            </p>
            <button 
              onClick={() => setShowThankYou(false)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Continue to Bill
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Order Confirmed!</h1>
          <p className="text-slate-500 font-medium">Order ID: #{lastOrder._id.toUpperCase()}</p>
        </div>

        {/* Bill / Receipt Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-slide-up">
          <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-wider">Official Invoice</h2>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Date</p>
              <p className="font-bold">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              {/* User Details */}
              <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User className="h-3 w-3" /> Shipping Details
                </h3>
                <div className="space-y-3 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-lg font-black text-slate-900">{orderAddress?.fullName || 'Valued Customer'}</p>
                  <p className="text-slate-600 flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4 text-slate-400" /> {orderAddress?.phone}
                  </p>
                  <p className="text-slate-600 flex items-start gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" /> 
                    <span>{orderAddress?.street}, {orderAddress?.city}<br/>{orderAddress?.zipCode}</span>
                  </p>
                </div>
              </div>

              {/* Delivery Status */}
              <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Delivery Estimate
                </h3>
                <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100/50">
                  <p className="text-2xl font-black text-green-600 mb-1">3-5 Days</p>
                  <p className="text-sm text-green-700 font-bold uppercase tracking-tighter">Expected Arrival</p>
                  <div className="mt-4 h-1.5 w-full bg-green-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-1/4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-10">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Ordered Items</h3>
              <div className="space-y-6">
                {lastOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} className="w-full h-full object-contain p-1" alt={item.name} />
                        ) : (
                          <span className="font-bold text-slate-400 text-[10px] uppercase tracking-tighter">No Image</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.name || `Product #${item.productId.slice(-6).toUpperCase()}`}</p>
                        <p className="text-xs text-slate-500 font-bold">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="font-black text-slate-900 text-lg">${item.total?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white mb-10 shadow-xl">
              <div className="flex justify-between text-slate-400 mb-2 font-bold uppercase tracking-widest text-[10px]">
                <span>Total Amount Paid</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-sm font-medium">Includes 18% Tax & Shipping</span>
                <span className="text-4xl font-black text-white tracking-tighter">${lastOrder.totalbill?.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-white border-2 border-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Printer className="h-5 w-5" /> Print Invoice
              </button>
              <Link 
                to="/orders" 
                className="flex-1 bg-slate-50 border-2 border-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Package className="h-5 w-5" /> Track Orders
              </Link>
            </div>

            <button 
              onClick={() => setShowThankYou(true)}
              className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95"
            >
              Finish & Close <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-slate-400 font-bold hover:text-slate-900 transition-colors inline-flex items-center gap-2 group">
            <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
