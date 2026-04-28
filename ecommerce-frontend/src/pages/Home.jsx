import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchProducts } from '../redux/slices/productSlice';
import { ChevronRight, Zap, Shield, Truck, CreditCard } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 4 }));
  }, [dispatch]);

  const categories = [
    { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', color: 'bg-blue-500' },
    { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', color: 'bg-indigo-500' },
    { name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', color: 'bg-purple-500' },
    { name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', color: 'bg-pink-500' },
  ];

  const features = [
    { icon: <Truck className="h-6 w-6" />, title: 'Free Delivery', desc: 'On orders over $500' },
    { icon: <Shield className="h-6 w-6" />, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: <Zap className="h-6 w-6" />, title: 'Fast Support', desc: '24/7 dedicated help' },
    { icon: <CreditCard className="h-6 w-6" />, title: 'Easy Returns', desc: '30-day money back' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-blue-50 h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&q=80" 
            className="w-full h-full object-cover opacity-10"
            alt="Hero Background"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-xl animate-fade-in-up">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
              Summer Sale 2024
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              Next-Gen Tech For Your <span className="text-blue-600">Lifestyle</span>
            </h1>
            <p className="text-slate-600 text-lg mb-8 max-w-md">
              Upgrade your setup with our premium selection of smartphones, laptops, and accessories. Experience the future today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary py-3 px-8 text-lg rounded-xl">
                Shop Now
              </Link>
              <Link to="/products" className="btn-secondary py-3 px-8 text-lg rounded-xl">
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-slate-200">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                {feature.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{feature.title}</h4>
                <p className="text-xs text-slate-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600 rounded-2xl animate-pulse">
              <Zap className="h-8 w-8 text-white fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Flash Sale is Live!</h3>
              <p className="text-slate-400">Up to 70% off on premium electronics</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            {[
              { label: 'Days', value: '02' },
              { label: 'Hours', value: '14' },
              { label: 'Mins', value: '35' },
              { label: 'Secs', value: '42' }
            ].map((time, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-2xl font-black text-blue-500 border border-slate-700">
                  {time.value}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 tracking-widest">{time.label}</span>
              </div>
            ))}
          </div>

          <Link to="/products" className="btn-primary py-4 px-10 rounded-2xl text-lg font-bold shadow-blue-500/20 shadow-lg hover:-translate-y-1 transition-all">
            Grab Deals
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-slate-500">Explore our wide range of products</p>
          </div>
          <Link to="/products" className="text-blue-600 font-semibold flex items-center hover:underline">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/products?category=${cat.name.toLowerCase()}`}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img 
                src={cat.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                <p className="text-slate-300 text-sm mt-1">Browse Collection</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Deals</h2>
            <p className="text-slate-500">Don't miss out on these exclusive offers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-96 border border-slate-200"></div>
            ))
          ) : products.map((product) => (
            <div key={product._id} className="card group">
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={product.name}
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:text-red-500 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-2">{product.category}</p>
                <Link to={`/products/${product._id}`} className="block text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                  {product.name}
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-extrabold text-blue-600">${product.price}</span>
                  <button className="btn-primary p-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full opacity-20"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left z-10">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Join our Newsletter</h2>
              <p className="text-blue-100">Get 10% off your first order and exclusive updates.</p>
            </div>
            <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-6 py-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-400 transition-all"
              />
              <button className="bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
