import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder, setOrderAddress } from '../../redux/slices/orderSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { MapPin, CreditCard, ChevronRight, ChevronLeft, Loader2, Check, ShoppingBag, Receipt, Smartphone, Globe, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

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

  const handleNext = () => {
    if (step === 1) {
      if (!address.fullName || !address.phone || !address.street || !address.city) {
        toast.error('Please fill all shipping details');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing based on method
    if (paymentMethod === 'upi') {
      setProcessingStatus('generating_qr');
      await new Promise(r => setTimeout(r, 1500));
      setProcessingStatus('waiting_payment');
      await new Promise(r => setTimeout(r, 5000));
    } else if (paymentMethod === 'card') {
      setProcessingStatus('verifying_card');
      await new Promise(r => setTimeout(r, 2000));
      setProcessingStatus('processing_bank');
      await new Promise(r => setTimeout(r, 3000));
    } else if (paymentMethod === 'paypal') {
      setProcessingStatus('redirecting_paypal');
      await new Promise(r => setTimeout(r, 2000));
      setProcessingStatus('authorizing');
      await new Promise(r => setTimeout(r, 3000));
    } else {
      setProcessingStatus('placing_order');
      await new Promise(r => setTimeout(r, 1000));
    }

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
      totalbill: totalAmount * 1.18,
      paymentMethod,
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
    { id: 'paypal', title: 'PayPal', desc: 'International payments', icon: <Globe className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* ── PAYMENT PROCESSING OVERLAY ── */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl animate-scale-up">
            
            {processingStatus === 'generating_qr' && (
              <div className="space-y-6">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto" />
                <h2 className="text-2xl font-black text-slate-900">Generating QR Code...</h2>
                <p className="text-slate-500 font-medium">Please wait while we prepare your secure payment link.</p>
              </div>
            )}

            {processingStatus === 'waiting_payment' && (
              <div className="space-y-6">
                <div className="relative inline-block">
                  <div className="w-48 h-48 bg-white border-8 border-slate-100 rounded-3xl p-4 mx-auto relative overflow-hidden">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ELECTROHUB_PAYMENT" 
                      className="w-full h-full grayscale opacity-80" 
                      alt="Payment QR" 
                    />
                    <div className="absolute inset-0 bg-blue-600/10 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 animate-scan"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Scan to Pay</h2>
                  <p className="text-blue-600 font-black text-xl mt-2 animate-pulse">${(totalAmount * 1.18).toFixed(2)}</p>
                </div>
                <p className="text-slate-500 text-sm font-medium">Open your UPI app and scan the code above. Processing will continue automatically.</p>
                <div className="flex justify-center gap-4 pt-4 opacity-40 grayscale">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4" alt="UPI" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c4/Google_Pay_Logo.svg" className="h-4" alt="GPay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" className="h-4" alt="PhonePe" />
                </div>
              </div>
            )}

            {(processingStatus === 'verifying_card' || processingStatus === 'processing_bank') && (
              <div className="space-y-8">
                <div className="relative w-24 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl mx-auto shadow-xl overflow-hidden animate-tilt">
                  <div className="absolute top-4 left-4 w-8 h-6 bg-yellow-400/20 rounded-md"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-1 bg-white/20 rounded-full"></div>
                  <div className="absolute inset-0 bg-white/5 animate-shimmer"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {processingStatus === 'verifying_card' ? 'Verifying Card...' : 'Connecting to Bank...'}
                  </h2>
                  <div className="mt-4 flex justify-center gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>
                    ))}
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium italic">"Securing your transaction via 3D Secure 2.0 protocol..."</p>
              </div>
            )}

            {(processingStatus === 'redirecting_paypal' || processingStatus === 'authorizing') && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {processingStatus === 'redirecting_paypal' ? 'Redirecting to PayPal...' : 'Authorizing Payment...'}
                </h2>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full animate-progress"></div>
                </div>
              </div>
            )}

            {processingStatus === 'placing_order' && (
              <div className="space-y-6">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto" />
                <h2 className="text-2xl font-black text-slate-900">Placing Order...</h2>
              </div>
            )}

            {processingStatus === 'completing' && (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20 animate-scale-up">
                  <Check className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Payment Confirmed!</h2>
                <p className="text-slate-500 font-medium">Finalizing your order details...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* ── LEFT SIDEBAR: STEPS ── */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Checkout</h1>
                <p className="text-slate-500 font-medium leading-relaxed">Complete your order in 3 simple steps.</p>
              </div>

              <div className="space-y-3">
                {steps.map((s) => (
                  <div key={s.id} 
                    className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      step === s.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-white border border-slate-100 hover:bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                      step >= s.id ? (step === s.id ? 'bg-white/20' : 'bg-green-500 text-white') : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > s.id ? <Check className="h-5 w-5" /> : s.icon}
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-blue-100' : 'text-slate-400'}`}>
                        Step {s.id}
                      </p>
                      <h3 className="font-bold text-sm">
                        {s.title}
                      </h3>
                    </div>
                    {step === s.id && (
                      <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Secure Checkout Badge */}
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-slate-600 border border-slate-100">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-[10px]">
                    <p className="font-black uppercase tracking-wider">Secure Checkout</p>
                    <p className="opacity-60 font-bold">SSL 256-bit Encryption</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT CONTENT: FORMS ── */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-8 sm:p-12 mb-8 border border-slate-100 animate-slide-up">
          
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
                  Shipping Information
                </h2>
                <p className="text-slate-500 text-sm font-medium">Please provide your accurate delivery details.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm focus:shadow-blue-500/5" 
                      placeholder="e.g. John Doe"
                      value={address.fullName} 
                      onChange={e => setAddress({...address, fullName: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                        placeholder="+91 00000 00000"
                        value={address.phone} 
                        onChange={e => setAddress({...address, phone: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                        placeholder="Enter city"
                        value={address.city} 
                        onChange={e => setAddress({...address, city: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Street Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                      placeholder="Apartment, suite, unit, etc."
                      value={address.street} 
                      onChange={e => setAddress({...address, street: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Order Summary</h2>
                <p className="text-slate-500 text-sm font-medium">Review your items before proceeding to payment.</p>
              </div>

              <div className="space-y-4 mb-10">
                {items.map(item => (
                  <div key={item._id} className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl p-3 flex-shrink-0 border border-slate-50">
                      <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-lg truncate mb-1">{item.name}</h4>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-wider">Qty: {item.quantity}</span>
                        <span className="text-slate-400 font-bold text-sm">${item.price} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between text-slate-400 font-bold text-sm uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold text-sm uppercase tracking-widest">
                    <span>Tax (GST 18%)</span>
                    <span className="text-white">${(totalAmount * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold text-sm uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-green-400 font-black">FREE</span>
                  </div>
                  <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-1">Total Payable</p>
                      <h3 className="text-4xl font-black">${(totalAmount * 1.18).toFixed(2)}</h3>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-slate-500 text-[10px] font-bold max-w-[120px]">Inclusive of all taxes and shipping charges</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Choose Payment Method</h2>
                <p className="text-slate-500 font-medium">Select your preferred way to pay securely.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-4 group relative overflow-hidden ${
                      paymentMethod === opt.id 
                        ? 'border-blue-600 bg-white shadow-2xl shadow-blue-600/10' 
                        : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                    }`}
                  >
                    {paymentMethod === opt.id && (
                      <div className="absolute top-0 right-0 p-4">
                        <div className="bg-blue-600 text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${
                      paymentMethod === opt.id ? 'bg-blue-600 text-white scale-110' : 'bg-white text-slate-400 border border-slate-100 group-hover:text-blue-500'
                    }`}>
                      {opt.icon}
                    </div>
                    <div>
                      <h3 className={`font-black text-lg ${paymentMethod === opt.id ? 'text-slate-900' : 'text-slate-700'}`}>{opt.title}</h3>
                      <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-bold text-blue-800/80 leading-relaxed">
                  Your transaction is secured with industry-standard 256-bit SSL encryption. We never store your card details.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
            ) : <div />}

            <button 
              onClick={step === 3 ? handlePlaceOrder : handleNext}
              disabled={loading}
              className="bg-blue-600 text-white py-4 px-10 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  {step === 3 ? 'Confirm Order' : 'Next Step'} 
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

        </div>

        <p className="text-center text-slate-400 text-sm font-medium">
          🔒 Secure checkout encrypted with 256-bit SSL
        </p>
      </main>
    </div>
  </div>
</div>
  );
}

export default Checkout;
