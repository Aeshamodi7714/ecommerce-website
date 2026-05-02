import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder, setOrderAddress } from '../../redux/slices/orderSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { MapPin, CreditCard, ChevronRight, ChevronLeft, Loader2, Check, ShoppingBag, Receipt, Smartphone, Globe, User, Phone, Tag, Ticket, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axiosInstance';

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axiosInstance.get('/user/coupons/active');
        if (data.success) {
          setAvailableCoupons(data.coupons.filter(c => new Date(c.expiry) > new Date()));
        }
      } catch (error) {
        console.error('Failed to fetch coupons');
      }
    };
    fetchCoupons();
  }, []);

  const handleApplyCoupon = async (codeToApply = couponCode) => {
    if (!codeToApply) return;
    setValidatingCoupon(true);
    try {
      const { data } = await axiosInstance.post('/user/coupon/validate', {
        code: codeToApply,
        cartTotal: totalAmount
      });
      if (data.success) {
        setAppliedCoupon(data.coupon);
        let discount = 0;
        if (data.coupon.type === 'percentage') {
          discount = (totalAmount * data.coupon.value) / 100;
        } else {
          discount = data.coupon.value;
        }
        setDiscountAmount(discount);
        toast.success(`Coupon "${data.coupon.code}" applied!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const finalAmount = (totalAmount - discountAmount) * 1.18;

  const handleNext = () => {
    if (step === 1) {
      if (!address.fullName || !address.phone || !address.street || !address.city) {
        toast.error('Please fill all shipping details');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setProcessingStatus('placing_order');
    await new Promise(r => setTimeout(r, 1000));
    setProcessingStatus('completing');
    
    const orderData = {
      items: items.map(item => ({ 
        productId: item._id, 
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      totalbill: finalAmount,
      paymentMethod,
      couponUsed: appliedCoupon?.code || null,
      discount: discountAmount
    };

    dispatch(setOrderAddress(address));
    const result = await dispatch(placeOrder(orderData));
    
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      setIsProcessing(false);
      toast.success('Order placed successfully!');
      navigate('/order-confirmation');
    } else {
      setIsProcessing(false);
      toast.error(result.payload || 'Failed to place order');
    }
  };

  const steps = [
    { id: 1, title: 'Shipping', icon: <MapPin className="h-5 w-5" /> },
    { id: 2, title: 'Summary', icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 3, title: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
  ];

  const paymentOptions = [
    { id: 'cod', title: 'Cash on Delivery', desc: 'Pay when order arrives', icon: <Receipt className="h-6 w-6" /> },
    { id: 'card', title: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: <CreditCard className="h-6 w-6" /> },
    { id: 'upi', title: 'UPI / QR Code', desc: 'Google Pay, PhonePe, Paytm', icon: <Smartphone className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl animate-scale-up">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {processingStatus === 'placing_order' ? 'Securing your order...' : 'Order Confirmed!'}
            </h2>
            <p className="text-slate-500 font-medium">Please do not refresh the page.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 pt-28">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-28 space-y-8">
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Checkout.</h1>
                <p className="text-slate-500 font-medium leading-relaxed">Complete your purchase.</p>
              </div>

              <div className="space-y-3">
                {steps.map((s) => (
                  <div key={s.id} className={`group relative flex items-center gap-4 p-5 rounded-[1.75rem] transition-all duration-300 ${step === s.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' : 'bg-white border border-slate-100 opacity-60'}`}>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${step >= s.id ? (step === s.id ? 'bg-blue-600 text-white' : 'bg-green-500 text-white') : 'bg-slate-50 text-slate-400'}`}>
                      {step > s.id ? <Check className="h-6 w-6" /> : s.icon}
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${step === s.id ? 'text-blue-400' : 'text-slate-400'}`}>Step {s.id}</p>
                      <h3 className="font-bold text-sm uppercase tracking-wider">{s.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 p-10 md:p-14 mb-8 border border-slate-100">
          
              {step === 1 && (
                <div className="animate-fade-in space-y-10">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Shipping Info.</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Full Name</label>
                      <input className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-blue-500 transition-all outline-none" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Phone</label>
                      <input className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-blue-500 transition-all outline-none" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} placeholder="+1 234 567 890" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Street Address</label>
                      <input className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-blue-500 transition-all outline-none" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="123 Luxury Lane" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">City</label>
                      <input className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-blue-500 transition-all outline-none" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="Metropolis" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in space-y-10">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Summary.</h2>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item._id} className="flex items-center gap-6 p-6 bg-slate-50/50 border border-slate-50 rounded-[2.5rem] hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
                        <div className="w-20 h-20 bg-white rounded-2xl p-3 border border-slate-100"><img src={item.image} className="w-full h-full object-contain" alt={item.name} /></div>
                        <div className="flex-1 min-w-0"><h4 className="font-black text-slate-900 text-lg mb-1">{item.name}</h4><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity} × ${item.price}</p></div>
                        <div className="text-right font-black text-slate-900 text-2xl">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── COUPON SECTION (NEW) ── */}
                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                      <Ticket className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Promotions & Coupons</h3>
                    </div>
                    
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] animate-scale-up">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Tag className="h-6 w-6 text-emerald-500" /></div>
                          <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Applied Coupon</p>
                            <p className="text-lg font-black text-slate-900">{appliedCoupon.code} <span className="text-emerald-500 text-sm ml-2">-{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`} OFF</span></p>
                          </div>
                        </div>
                        <button onClick={removeCoupon} className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm"><X className="h-5 w-5" /></button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <input className="flex-1 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-blue-500 transition-all outline-none" placeholder="Enter coupon code..." value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} />
                          <button onClick={() => handleApplyCoupon()} disabled={validatingCoupon || !couponCode} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50">
                            {validatingCoupon ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Apply'}
                          </button>
                        </div>
                        
                        {availableCoupons.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Available For You</p>
                            <div className="flex flex-wrap gap-4">
                              {availableCoupons.map(c => (
                                <button key={c._id} onClick={() => handleApplyCoupon(c.code)} className="px-6 py-3 bg-white border border-slate-100 rounded-xl flex items-center gap-3 hover:border-blue-600 hover:bg-blue-50 transition-all group">
                                  <Ticket className="h-4 w-4 text-blue-600" />
                                  <span className="font-black text-xs text-slate-700">{c.code}</span>
                                  <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-400">Apply</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between text-slate-400 font-black text-xs uppercase tracking-widest"><span>Subtotal</span><span>${totalAmount.toFixed(2)}</span></div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-black text-xs uppercase tracking-widest"><span>Coupon Discount</span><span>-${discountAmount.toFixed(2)}</span></div>
                      )}
                      <div className="flex justify-between text-slate-400 font-black text-xs uppercase tracking-widest"><span>Tax (GST 18%)</span><span>${((totalAmount - discountAmount) * 0.18).toFixed(2)}</span></div>
                      <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                        <div><p className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2">Grand Total</p><h3 className="text-5xl font-black tracking-tighter">${finalAmount.toFixed(2)}</h3></div>
                        <div className="text-right hidden sm:block"><p className="text-slate-500 text-[10px] font-bold">Inclusive of all taxes</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-fade-in space-y-10 text-center">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Payment Method.</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {paymentOptions.map((opt) => (
                      <button key={opt.id} onClick={() => setPaymentMethod(opt.id)} className={`p-10 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-6 relative ${paymentMethod === opt.id ? 'border-blue-600 bg-white shadow-2xl shadow-blue-600/10' : 'border-slate-50 bg-slate-50/30 hover:border-slate-100'}`}>
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === opt.id ? 'bg-blue-600 text-white rotate-6' : 'bg-white text-slate-300'}`}>{opt.icon}</div>
                        <div><h3 className="font-black text-lg uppercase tracking-tight text-slate-900">{opt.title}</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{opt.desc}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-16 flex items-center justify-between gap-6">
                {step > 1 ? <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"><ChevronLeft className="h-5 w-5" /> Back</button> : <div />}
                <button onClick={step === 3 ? handlePlaceOrder : handleNext} className="bg-slate-900 text-white h-16 px-12 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl flex items-center gap-3">
                  {step === 3 ? 'Confirm Order' : 'Next Step'} <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
