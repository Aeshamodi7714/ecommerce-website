import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { ChevronRight, Zap, Shield, Truck, RotateCcw, Heart, ShoppingCart, Star, Smartphone, Laptop, Headphones, Watch, Package, ArrowRight, Play, Keyboard, Mouse, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { name: 'Smartphones', slug: 'smartphones', icon: Smartphone, image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80', gradient: 'from-blue-600/80 to-cyan-500/80' },
  { name: 'Laptops', slug: 'laptops', icon: Laptop, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', gradient: 'from-indigo-600/80 to-purple-500/80' },
  { name: 'Audio', slug: 'audio', icon: Headphones, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80', gradient: 'from-orange-500/80 to-pink-600/80' },
  { name: 'Watches', slug: 'watches', icon: Watch, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80', gradient: 'from-green-500/80 to-teal-600/80' },
  { name: 'Accessories', slug: 'accessories', icon: Package, image: 'https://images.unsplash.com/photo-1527864550417-7fd1c3561242?w=600&q=80', gradient: 'from-purple-600/80 to-pink-500/80' },
];

const features = [
  { icon: Headphones, title: 'Wireless & Wired Headphones' },
  { icon: Keyboard, title: 'Mechanical Keyboards' },
  { icon: Mouse, title: 'Optical and Laser Mice' },
  { icon: Monitor, title: 'High-Resolution Monitors' },
];

const offers = [
  { tag: 'Limited Time Offer', title: 'Flash Sale is Live!', desc: 'Up to 70% off on premium electronics', bg: 'from-blue-50 to-indigo-100', iconColor: 'text-blue-600', iconBg: 'bg-blue-200/50', icon: Zap },
  { tag: 'New Arrival', title: 'MacBook Pro M3', desc: 'Experience the ultimate power. Free AirPods on purchase.', bg: 'from-purple-50 to-fuchsia-100', iconColor: 'text-purple-600', iconBg: 'bg-purple-200/50', icon: Laptop },
  { tag: 'Clearance', title: 'Audio Fest 2024', desc: 'Flat 50% off on Sony & Bose headphones.', bg: 'from-orange-50 to-amber-100', iconColor: 'text-orange-600', iconBg: 'bg-orange-200/50', icon: Headphones },
];

const brands = ['Apple', 'Samsung', 'Sony', 'Google', 'Bose', 'Garmin', 'Dell', 'Logitech'];

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => { dispatch(fetchProducts({ limit: 8 })); }, [dispatch]);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} added!`, {
      icon: '🛍️',
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontWeight: 'bold' },
    });
  };

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-[75vh] flex items-center pt-20 pb-0 overflow-hidden bg-[#f4f4f4]">
        {/* Full Section Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-90"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1600&q=80')",
            backgroundPosition: "right center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}
        ></div>
        
        {/* Fading gradient to ensure text readability on the left */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#f4f4f4] via-[#f4f4f4]/90 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl pb-20 pt-10">
            <h1 className="text-5xl md:text-[4.5rem] lg:text-[5.5rem] font-bold text-slate-800 leading-[1.1] tracking-wide mb-8 uppercase">
              Take Your<br />
              Gadgets To The<br />
              Next Level!
            </h1>
            <p className="text-slate-700 text-xl font-medium leading-relaxed mb-10 max-w-lg">
              Discover the latest in tech innovation with exclusive discounts up to <span className="text-orange-600 font-extrabold">50% off</span>. Don't miss limited-time offers!
            </p>
            <div className="flex items-center gap-8">
              <Link to="/products" className="px-10 py-4 bg-[#1e4b9b] text-white font-bold text-lg rounded-xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20">
                Shop Now
              </Link>
              <button className="flex items-center gap-3 group">
                <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </div>
                <span className="font-bold text-slate-900 text-lg">Watch Video</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="bg-[#f4f4f4] border-t border-slate-300/60 pb-12 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center divide-x divide-slate-300">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-8 py-2">
                <f.icon className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-bold text-slate-500">{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">Explore</span>
              <h2 className="text-4xl font-extrabold text-slate-900">Shop by Category</h2>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-blue-600 font-bold hover:gap-2 transition-all text-sm">
              All Products <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} to={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-3xl aspect-[3/4] shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2"
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'; }} />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-70 group-hover:opacity-80 transition-opacity`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl w-fit mb-3">
                    <cat.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{cat.name}</h3>
                  <p className="text-white/80 text-sm mt-1 flex items-center gap-1">Browse <ArrowRight className="h-3 w-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFERS SLIDESHOW ── */}
      <section className="py-16 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="relative rounded-[3rem] overflow-hidden shadow-xl border border-slate-100">
            {/* The Slider Track */}
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {offers.map((offer, idx) => (
                <div key={idx} className={`w-full flex-shrink-0 bg-gradient-to-br ${offer.bg} relative overflow-hidden`}>
                  {/* Decorative dot pattern */}
                  <div className="absolute inset-0 opacity-[0.4]"
                    style={{ backgroundImage: 'radial-gradient(#94a3b8 1px,transparent 1px)', backgroundSize: '32px 32px' }}></div>

                  {/* Content Container (Larger padding for bigger slide) */}
                  <div className="relative z-10 px-8 py-20 md:py-32 md:px-20 flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* Left text section */}
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className={`h-20 w-20 ${offer.iconBg} rounded-3xl flex items-center justify-center flex-shrink-0 shadow-inner backdrop-blur-md border border-white/40`}>
                        <offer.icon className={`h-10 w-10 ${offer.iconColor} animate-pulse`} />
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${offer.iconColor}`}>{offer.tag}</p>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-2">{offer.title}</h3>
                        <p className="text-slate-600 text-lg md:text-xl font-medium max-w-sm">{offer.desc}</p>
                      </div>
                    </div>

                    {/* Right side: Countdown & Button */}
                    <div className="flex flex-col items-center md:items-end gap-8 w-full md:w-auto">
                      <div className="flex gap-4">
                        {[['02', 'Days'], ['14', 'Hrs'], ['35', 'Min'], ['42', 'Sec']].map(([v, l], i) => (
                          <div key={i} className="text-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/60 border border-white/80 backdrop-blur-md rounded-2xl shadow-sm flex items-center justify-center text-2xl md:text-3xl font-black text-slate-800">{v}</div>
                            <p className="text-slate-500 text-[10px] md:text-xs uppercase tracking-widest mt-2 font-bold">{l}</p>
                          </div>
                        ))}
                      </div>

                      <Link to="/products" className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white font-bold text-lg rounded-2xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 flex-shrink-0 group">
                        Grab Deals <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {offers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 shadow-sm ${currentSlide === idx ? 'w-10 bg-blue-600' : 'w-2.5 bg-slate-300 hover:bg-blue-400'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">Hand-Picked</span>
              <h2 className="text-4xl font-extrabold text-slate-900">Featured Products</h2>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-blue-600 font-bold hover:gap-2 transition-all text-sm">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 rounded-3xl h-80"></div>
            )) : products.slice(0, 8).map((product) => (
              <Link key={product._id} to={`/products/${product._id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square bg-slate-50 overflow-hidden relative">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/f8fafc/3b82f6?text=${encodeURIComponent(product.name.split(' ')[0])}`; }}
                  />
                  <button onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-3 right-3 h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-600 shadow-lg">
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); toast('❤️ Added to Wishlist', { style: { borderRadius: '16px', background: '#0f172a', color: '#fff' } }); }}
                    className="absolute top-3 right-3 h-8 w-8 bg-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm transition-all duration-300 text-slate-400 hover:text-red-500">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">{product.category}</p>
                  <h3 className="font-bold text-slate-900 line-clamp-1 mb-3 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 line-through block">${(product.price * 1.2).toFixed(0)}</span>
                      <span className="text-xl font-black text-slate-900">${product.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                      <span className="text-xs font-bold text-slate-500">{product.rating || 4.5}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section className="py-14 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Authorized Reseller of Top Brands</p>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand, i) => (
              <div key={i} className="px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all cursor-default">
                <span className="text-slate-700 font-black text-sm">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-200/40 rounded-full blur-[80px]"></div>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4 block">Newsletter</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Get Exclusive Deals First</h2>
          <p className="text-slate-500 text-lg mb-10">Subscribe and get 10% off your first order, plus early access to flash sales.</p>
          {subscribed ? (
            <div className="py-6 px-8 bg-green-50 border border-green-200 rounded-2xl">
              <p className="text-green-600 font-bold text-lg">🎉 You're subscribed! Check your inbox.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="flex flex-col sm:flex-row gap-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email address..."
                className="flex-1 px-6 py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm" />
              <button type="submit" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex-shrink-0">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
