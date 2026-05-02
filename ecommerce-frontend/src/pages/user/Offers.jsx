import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Ticket, Clock, CheckCircle, Copy, Gift, Zap, ChevronRight, X, Info, HelpCircle, ShieldCheck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axiosInstance';

const Offers = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRulesModal, setShowRulesModal] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axiosInstance.get('/user/coupons/active');
        if (data.success) {
          setCoupons(data.coupons.filter(c => new Date(c.expiry) > new Date()));
        }
      } catch (error) {
        console.error('Failed to fetch coupons');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code "${code}" copied!`, {
      icon: '✂️',
      style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-xl shadow-blue-500/20">
            <Zap className="h-3.5 w-3.5 fill-current" /> Exclusive Rewards
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 uppercase">My Offers.</h1>
          <p className="text-slate-500 font-medium text-lg">Save more on your next luxury tech purchase with these exclusive codes.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 4].map(i => (
              <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coupons.map((c) => (
              <div key={c._id} className="group bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 -mr-24 -mt-24 rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-50 rounded-r-full border-r border-slate-100"></div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-50 rounded-l-full border-l border-slate-100"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                      <Ticket className="h-8 w-8" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Valid Until</p>
                      <p className="text-xs font-black text-slate-900 uppercase">{new Date(c.expiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                      {c.type === 'percentage' ? `${c.value}% OFF` : `$${c.value} FLAT`}
                    </h2>
                    <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">On Minimum Order of <span className="text-slate-900">${c.minOrder}</span></p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-6 py-4 flex items-center justify-between group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all">
                      <span className="font-black text-slate-900 tracking-[0.3em] uppercase">{c.code}</span>
                      <button 
                        onClick={() => copyCode(c.code)}
                        className="text-blue-600 hover:text-slate-900 transition-colors"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => navigate('/products')}
                      className="h-14 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active & Verified</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
             <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
               <Gift className="h-10 w-10 text-slate-200" />
             </div>
             <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">No active offers.</h2>
             <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10">Check back later for new seasonal deals and exclusive tech drops.</p>
             <button onClick={() => navigate('/products')} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl">Start Shopping</button>
          </div>
        )}
        
        {/* Extra Info - How to Use Trigger */}
        <div 
          onClick={() => setShowRulesModal(true)}
          className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden cursor-pointer group hover:bg-blue-600 transition-all duration-500"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-white/10"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight flex items-center gap-3 justify-center md:justify-start">
                  How to use? <HelpCircle className="h-6 w-6 text-blue-400 group-hover:text-white" />
                </h3>
                <p className="text-slate-400 font-medium group-hover:text-blue-100">Click here to see full rules and instructions.</p>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white/80">
                 <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> 100% Verified</span>
                 <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Instant Apply</span>
              </div>
           </div>
        </div>
      </div>

      {/* ── RULES MODAL ── */}
      {showRulesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-fade-in" onClick={() => setShowRulesModal(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 md:p-14 relative z-10 animate-scale-up shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] custom-scrollbar">
            
            {/* Background Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 -mr-32 -mt-32 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Info className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Usage Guide.</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">How it works & Rules</p>
                  </div>
                </div>
                <button onClick={() => setShowRulesModal(false)} className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:text-slate-900 transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-10">
                {/* Step 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">01</div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2">Copy the Code</h4>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">Choose your favorite offer and click the copy icon. The code will be saved to your clipboard instantly.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">02</div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2">Add to Cart</h4>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">Shop for your desired gadgets and make sure your cart value meets the <span className="text-blue-600 font-bold">Minimum Order</span> requirement.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm">03</div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2">Apply at Checkout</h4>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">At the final step of checkout, paste your code in the <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">"Promotions"</span> box and watch the price drop!</p>
                  </div>
                </div>

                {/* Important Rules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                   <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center gap-4">
                      <ShieldCheck className="h-6 w-6 text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-tight">One coupon per order only</span>
                   </div>
                   <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center gap-4">
                      <Clock className="h-6 w-6 text-orange-500" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-tight">Valid until expiry date</span>
                   </div>
                   <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center gap-4">
                      <CreditCard className="h-6 w-6 text-blue-500" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-tight">Apply before payment</span>
                   </div>
                   <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center gap-4">
                      <Ticket className="h-6 w-6 text-purple-500" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-tight">Not valid on sale items</span>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setShowRulesModal(false)}
                className="w-full mt-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
