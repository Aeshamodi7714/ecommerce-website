import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { 
  ChevronRight, Zap, Shield, Truck, RotateCcw, Heart, 
  ShoppingCart, Star, Smartphone, Laptop, Headphones, 
  Watch, Package, ArrowRight, Play, Keyboard, Mouse, 
  Monitor, Flame, Timer, Eye, MessageCircle, X, CheckCircle, 
  Gift, Sparkles, PartyPopper, PlayCircle, Box, Cpu, ArrowUpRight,
  TrendingUp, Layers, MousePointer2
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { name: 'Smartphones', slug: 'smartphones', icon: Smartphone, image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80', gradient: 'from-blue-600/80 to-cyan-500/80' },
  { name: 'Laptops', slug: 'laptops', icon: Laptop, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', gradient: 'from-indigo-600/80 to-purple-500/80' },
  { name: 'Audio', slug: 'audio', icon: Headphones, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80', gradient: 'from-orange-500/80 to-pink-600/80' },
  { name: 'Watches', slug: 'watches', icon: Watch, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80', gradient: 'from-green-500/80 to-teal-600/80' },
  { name: 'Accessories', slug: 'accessories', icon: Package, image: 'https://images.unsplash.com/photo-1527864550417-7fd1c3561242?w=600&q=80', gradient: 'from-purple-600/80 to-pink-500/80' },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [showNotification, setShowNotification] = useState(false);
  const [recentSale, setRecentSale] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => { dispatch(fetchProducts({ limit: 12 })); }, [dispatch]);

  // Flash Sale Timer Logic
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60); 
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Recent Sales Simulation
  useEffect(() => {
    const locations = ['Mumbai', 'Delhi', 'Bangalore', 'London', 'New York', 'Dubai'];
    const interval = setInterval(() => {
      if (products.length > 0) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomLoc = locations[Math.floor(Math.random() * locations.length)];
        setRecentSale({ product: randomProduct, location: randomLoc });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [products]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(addToCart(product));
    toast.success(`${product.name} added!`, { icon: '🛍️' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setShowSuccessModal(true);
      setEmail('');
    }
  };

  return (
    <div className="bg-white relative overflow-hidden font-sans">

      {/* ── SUCCESS MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm animate-fade-in" onClick={() => setShowSuccessModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative z-10 shadow-2xl animate-scale-up text-center border border-slate-100">
             <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <PartyPopper className="h-10 w-10 animate-bounce" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 mb-3">You're All Set!</h2>
             <p className="text-slate-500 font-medium mb-8">
                Your 20% discount is waiting in your inbox. 🎁
             </p>
             <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-blue-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-900 transition-all shadow-lg">
               Start Shopping
             </button>
          </div>
        </div>
      )}

      {/* ── MINI TOP BAR ── */}
      <div className="bg-white py-2 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Free Express Delivery</span>
              <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> 2-Year Warranty</span>
           </div>
           <div className="flex items-center gap-4 text-blue-600 font-black">
              Sale Ends In: {formatTime(timeLeft)}
           </div>
        </div>
      </div>

      {/* ── HERO SECTION (CENTERED) ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-center px-4 py-20 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80" 
            className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
            alt="Tech Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-slate-50"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">
           <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl shadow-blue-500/20">
              <Zap className="h-3 w-3 fill-white" /> Live: 12-Hour Flash Sale
           </div>
           
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-8">
             Upgrade Your <br /> 
             <span className="text-blue-600 italic font-medium">Everyday Tech.</span>
           </h1>
           
           <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
             Discover premium gadgets designed for the modern digital lifestyle. Unparalleled innovation meets exclusive daily deals.
           </p>

           <div className="flex flex-wrap items-center justify-center gap-6">
             <Link to="/products" className="px-12 py-6 bg-blue-600 text-white font-bold text-sm rounded-2xl hover:bg-slate-900 transition-all shadow-2xl shadow-blue-600/40 flex items-center gap-3 group">
               Shop the Collection <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
             </Link>
             <button className="flex items-center gap-4 group px-10 py-6 rounded-2xl border border-slate-200 hover:border-blue-600 bg-white/80 backdrop-blur-sm transition-all text-slate-600 font-bold text-sm shadow-sm">
               <PlayCircle className="h-6 w-6 text-blue-600" />
               Watch Intro
             </button>
           </div>
        </div>
      </section>

      {/* ── TRENDING PRODUCTS (UNIQUE & PROFESSIONAL CSS) ── */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-20">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <TrendingUp className="h-5 w-5 text-blue-600" />
                 <span className="text-xs font-black uppercase tracking-widest text-blue-600">Curated Choice</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Trending Collections</h2>
              <p className="text-slate-500 text-lg mt-3">The most wanted tech in our marketplace right now.</p>
            </div>
            <Link to="/products" className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm group">
               <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
             {products.slice(0, 4).map((p, i) => (
               <div key={i} className="group relative">
                  {/* The Card */}
                  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-4 relative overflow-hidden h-full flex flex-col">
                     
                     {/* Badge & Heart */}
                     <div className="flex justify-between items-center mb-8 relative z-10">
                        <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">In Stock</span>
                        <button className="h-10 w-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 transition-all border border-slate-100 group-hover:border-red-100">
                           <Heart className="h-5 w-5" />
                        </button>
                     </div>

                     {/* Image Container with unique background shape */}
                     <div className="aspect-square mb-10 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-slate-50/50 rounded-full scale-90 blur-2xl group-hover:bg-blue-50 transition-colors"></div>
                        <img 
                           src={p.image} 
                           alt={p.name} 
                           className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700" 
                        />
                        {/* Quick Action Overlay (Unique feature) */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                           <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                              <MousePointer2 className="h-4 w-4" /> Quick View
                           </div>
                        </div>
                     </div>

                     {/* Product Info */}
                     <div className="mt-auto relative z-10">
                        <h3 className="font-bold text-slate-900 text-xl mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                        <div className="flex items-center gap-1 mb-4 text-orange-400">
                           <Star className="h-3 w-3 fill-current" />
                           <Star className="h-3 w-3 fill-current" />
                           <Star className="h-3 w-3 fill-current" />
                           <Star className="h-3 w-3 fill-current" />
                           <Star className="h-3 w-3 fill-current opacity-50" />
                           <span className="text-slate-400 text-[10px] font-bold ml-1">(4.8)</span>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest line-through mb-1">${(p.price * 1.2).toFixed(0)}</span>
                              <span className="text-3xl font-bold text-slate-900 tracking-tight">${p.price}</span>
                           </div>
                           <button 
                              onClick={(e) => handleAddToCart(p, e)}
                              className="h-14 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl active:scale-95 group/btn overflow-hidden relative"
                           >
                              <div className="absolute inset-0 bg-blue-600 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                              <ShoppingCart className="h-6 w-6 relative z-10" />
                           </button>
                        </div>
                     </div>

                     {/* Unique background accent */}
                     <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 opacity-[0.02] rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {categories.slice(0, 3).map((cat, i) => (
               <Link key={i} to={`/products?category=${cat.slug}`} className="group relative h-[450px] rounded-[3rem] overflow-hidden shadow-xl border-4 border-white">
                  <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={cat.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-10">
                     <h3 className="text-3xl font-bold text-white mb-3">{cat.name}</h3>
                     <p className="text-white/70 text-xs font-bold flex items-center gap-2 group-hover:text-white transition-colors">
                        Explore Collection <ArrowRight className="h-4 w-4" />
                     </p>
                  </div>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* ── RECENT SALE ── */}
      <div className={`fixed bottom-8 left-8 z-[100] transition-all duration-700 transform ${showNotification ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
         {recentSale && (
           <div className="bg-white p-5 pr-12 rounded-[2rem] shadow-2xl border border-slate-50 flex items-center gap-5 max-w-sm relative">
              <button onClick={() => setShowNotification(false)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-900">
                <X className="h-4 w-4" />
              </button>
              <div className="h-14 w-14 bg-slate-50 rounded-xl flex items-center justify-center p-2">
                 <img src={recentSale.product.image} className="max-w-full max-h-full object-contain" alt="Sale" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Live Purchase</p>
                 <p className="text-sm font-bold text-slate-900 line-clamp-1">{recentSale.product.name}</p>
              </div>
           </div>
         )}
      </div>

      {/* ── NEWSLETTER ── */}
      <section className="py-40 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Stay in the Loop</h2>
           <p className="text-slate-500 text-xl mb-12 font-medium">Join our community for weekly drops and exclusive discounts.</p>
           <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-all shadow-sm" 
                placeholder="Email address..."
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="px-10 py-5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl">
                SUBSCRIBE
              </button>
           </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
