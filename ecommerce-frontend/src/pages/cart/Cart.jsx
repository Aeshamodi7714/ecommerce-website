import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck, Tag, Truck, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const FREE_SHIPPING_THRESHOLD = 500;
  const progressPercentage = Math.min((totalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountLeftForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - totalAmount, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full p-8 text-center animate-fade-in">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShoppingBag className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your cart is empty</h2>
          <p className="text-slate-500 mb-8 text-lg">Looks like you haven't found your next favorite gadget yet.</p>
          <Link to="/products" className="bg-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-1 inline-flex items-center gap-3">
            <ArrowLeft className="h-5 w-5" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          <span className="text-slate-500 font-medium bg-slate-200/50 px-4 py-1.5 rounded-full">{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items & Free Shipping Banner */}
          <div className="lg:col-span-8 space-y-6">
            


            {/* Cart Items List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-slate-50/50 transition-colors">
                    {/* Product Image */}
                    <Link to={`/products/${item._id}`} className="w-full sm:w-40 h-40 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative group">
                      <img src={item.image} className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    </Link>
                    
                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{item.category}</p>
                          <Link to={`/products/${item._id}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                            {item.name}
                          </Link>
                        </div>
                        <p className="text-xl font-black text-slate-900">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-end mt-6">
                        {/* Quantity Selector */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-slate-600 hover:text-slate-900 hover:shadow-sm"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-bold text-slate-900">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-slate-600 hover:text-slate-900 hover:shadow-sm"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Remove Action */}
                        <button 
                          onClick={() => handleRemove(item._id)}
                          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors group"
                        >
                          <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 sticky top-24 shadow-xl shadow-slate-200/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-slate-900">${(totalAmount * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  {amountLeftForFreeShipping > 0 ? (
                    <span className="font-bold text-slate-900">$25.00</span>
                  ) : (
                    <span className="font-black text-green-500">FREE</span>
                  )}
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-200 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Total</span>
                  <span className="text-4xl font-black text-blue-600">
                    ${(totalAmount * 1.18 + (amountLeftForFreeShipping > 0 ? 25 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="mb-8 border-t border-slate-100 pt-6">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 flex-shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Estimated Delivery</h4>
                    <p className="text-sm text-slate-600">
                      Delivers by <span className="font-bold text-blue-700">Friday, Oct 24th</span>
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-600/30 flex items-center justify-center gap-3 group"
              >
                Proceed to Checkout <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span>Secure Checkout Process</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
