import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../redux/slices/orderSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { MapPin, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderData = {
      items: items.map(item => ({ product: item._id, quantity: item.quantity })),
      address,
      totalAmount: totalAmount * 1.18,
    };

    const result = await dispatch(placeOrder(orderData));
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/order-confirmation');
    } else {
      toast.error(result.payload || 'Failed to place order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="card p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required className="input" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input required className="input" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input required className="input" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <input required className="input" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input required className="input" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-8 opacity-60">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" /> Payment Method
            </h2>
            <div className="p-4 border-2 border-blue-600 rounded-xl bg-blue-50 flex items-center justify-between">
              <span className="font-bold">Cash on Delivery (Default)</span>
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 italic">Online payments are currently disabled for maintenance.</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-8 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-slate-600 truncate mr-2">{item.name} x {item.quantity}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
            <hr className="my-6 border-slate-100" />
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-slate-900 pt-4 border-t border-slate-100">
                <span>Order Total</span>
                <span>${(totalAmount * 1.18).toFixed(2)}</span>
              </div>
            </div>
          <button 
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 mt-8 rounded-xl flex items-center justify-center gap-2 text-lg"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Order'} <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
