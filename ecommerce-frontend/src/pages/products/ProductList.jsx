import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { Filter, ShoppingCart, Heart, Search, ChevronDown, LayoutGrid, List, Star, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading } = useSelector((state) => state.products);
  const [viewMode, setViewMode] = useState('grid');
  
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || 0;
  const maxPrice = searchParams.get('maxPrice') || 2000;
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    dispatch(fetchProducts({ category, search, minPrice, maxPrice, sort }));
  }, [dispatch, category, search, minPrice, maxPrice, sort]);

  const handleAddToCart = (product, e) => {
    if(e) e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`, {
      icon: '🛍️',
      style: {
        borderRadius: '16px',
        background: '#0f172a',
        color: '#fff',
        padding: '16px 24px',
        fontWeight: 'bold'
      },
    });
  };

  const categories = ['Smartphones', 'Laptops', 'Accessories', 'Watches', 'Audio'];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 px-4 sm:px-6 lg:px-8 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">Explore Collection</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {search ? `Results for "${search}"` : category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Premium Products'}
          </h1>
          <p className="text-slate-300 max-w-2xl text-lg">
            Discover our hand-picked selection of high-end electronics designed to elevate your lifestyle.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                <Filter className="h-5 w-5 text-blue-600" /> Refine By
              </h3>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Categories</label>
                  <div className="space-y-2">
                    {categories.map((cat) => {
                      const isSelected = category === cat.toLowerCase();
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            if (isSelected) {
                              newParams.delete('category');
                            } else {
                              newParams.set('category', cat.toLowerCase());
                            }
                            setSearchParams(newParams);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                          <span className="font-semibold text-sm">{cat}</span>
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {category && (
                  <button 
                    onClick={() => setSearchParams({})}
                    className="w-full py-4 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Controls */}
            <div className="bg-white/80 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-4 z-30">
              <div className="text-sm font-medium text-slate-500 px-2">
                Showing <span className="text-slate-900 font-bold">{products.length}</span> items
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="relative flex-1 sm:flex-none">
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 py-3 pl-5 pr-12 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    value={sort}
                    onChange={(e) => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('sort', e.target.value);
                      setSearchParams(newParams);
                    }}
                  >
                    <option value="">Sort by Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-[2rem] h-[450px] border border-slate-100 shadow-sm"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {products.map((product) => (
                  <Link 
                    to={`/products/${product._id}`} 
                    key={product._id} 
                    className={`group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 border border-slate-100 transition-all duration-500 transform hover:-translate-y-2 flex ${viewMode === 'list' ? 'flex-row h-64' : 'flex-col'}`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-[4/3]'} overflow-hidden bg-slate-50`}>
                      <img 
                        src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'} 
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/800x600/f8fafc/3b82f6?text=${encodeURIComponent(product.name.split(' ').slice(0,2).join('+'))}`;
                        }}
                      />
                      
                      {/* Overlay gradients for aesthetics */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Action Buttons Overlay */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 text-slate-600 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toast('Added to Wishlist!', { icon: '❤️', style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontWeight: 'bold' } });
                          }}
                        >
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNewproduct && (
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/30">
                            New
                          </span>
                        )}
                        {product.stock > 0 && product.stock <= 5 && (
                          <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/30 animate-pulse">
                            Only {product.stock} Left
                          </span>
                        )}
                      </div>

                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                          <span className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-xl uppercase tracking-wider">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col relative">
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mb-2">{product.category}</p>
                      
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-2">
                        {product.name}
                      </h2>
                      
                      {viewMode === 'list' && (
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center gap-1.5 mb-6">
                        <div className="flex items-center text-yellow-400">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.floor(product.rating || 4.5) ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-400">({product.rating || '4.5'})</span>
                      </div>

                      <div className="mt-auto flex items-end justify-between border-t border-slate-50 pt-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-400 line-through mb-0.5 block">
                            ${(product.price * 1.2).toFixed(2)}
                          </span>
                          <span className="text-2xl font-black text-slate-900 tracking-tight">
                            ${product.price}
                          </span>
                        </div>
                        
                        <button 
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={product.stock === 0}
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            product.stock === 0 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 group-hover:scale-110'
                          }`}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center px-4">
                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3">No products found</h2>
                <p className="text-slate-500 text-lg max-w-md mb-8">We couldn't find any products matching your current filters. Try adjusting them or clearing your search.</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
                >
                  Clear All Filters <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
