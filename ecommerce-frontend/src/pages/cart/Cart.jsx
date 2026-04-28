import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
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

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-12 w-12 text-slate-300" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn-primary py-3 px-8 rounded-xl inline-flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item._id} className="card p-6 flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <Link to={`/products/${item._id}`} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => handleRemove(item._id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{item.category}</p>
                </div>
                                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                    <button 
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="p-1.5 hover:bg-white rounded-md transition-all shadow-sm"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      className="p-1.5 hover:bg-white rounded-md transition-all shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1">Total</p>
                    <p className="text-xl font-extrabold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="card p-8 bg-white sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Promo Code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="SAVE20" 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Apply</button>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} items)</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (GST 18%)</span>
                <span>${(totalAmount * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-600 font-medium italic">
                <span>Discount (Coupon)</span>
                <span>-$0.00</span>
              </div>
              <hr className="border-slate-100" />
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Total Amount</span>
                <span>${(totalAmount * 1.18).toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-4 mt-8 rounded-xl flex items-center justify-center gap-3 text-lg"
            >
              Checkout <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Safe & Secure Payments. Guaranteed.
            </p>
          </div>

          {/* Mini Recommendation */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">You might also like</h3>
            <div className="space-y-4">
              {[
                { name: 'Leather Case', price: '$29', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&q=80' },
                { name: 'Fast Charger', price: '$49', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&q=80' }
              ].map((rec, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                    <img src={rec.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold group-hover:text-blue-600 transition-colors">{rec.name}</h4>
                    <p className="text-xs text-blue-600 font-bold">{rec.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
