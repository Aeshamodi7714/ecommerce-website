import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { Filter, ShoppingCart, Heart, Search, ChevronDown, LayoutGrid, List, Star, ArrowRight, Eye } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductQuickView from '../../components/products/ProductQuickView';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || 0;
  const maxPrice = searchParams.get('maxPrice') || 1000000;
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    dispatch(fetchProducts({ category, search, minPrice, maxPrice, sort }));
  }, [dispatch, category, search, minPrice, maxPrice, sort]);

  const handleQuickView = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product, e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart', {
        style: { borderRadius: '20px', background: '#0f172a', color: '#fff' }
      });
      navigate('/login');
      return;
    }
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: '20px', background: '#0f172a', color: '#fff', padding: '16px 24px' }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
              {category ? category.replace('-', ' ') : 'All Products'}.
            </h1>
            <p className="text-slate-500 font-medium max-w-lg">Discover our curated collection of premium gadgets and tech essentials.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-3 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'}`}
             >
               <LayoutGrid className="h-5 w-5" />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-3 rounded-2xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'}`}
             >
               <List className="h-5 w-5" />
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Floating Glass Filter Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 bg-white/80 backdrop-blur-2xl p-8 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50 space-y-10">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" /> Filters
                </h3>
                
                <div className="space-y-6">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price Range</p>
                      <input 
                        type="range" 
                        min="0" 
                        max="2000" 
                        step="100"
                        className="w-full accent-blue-600" 
                        value={maxPrice}
                        onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), maxPrice: e.target.value })}
                      />
                      <div className="flex justify-between text-xs font-black text-slate-900">
                        <span>$0</span>
                        <span>${maxPrice}</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sort By</p>
                      <select 
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                        value={sort}
                        onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value })}
                      >
                        <option value="">Featured</option>
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setSearchParams({})}
                className="w-full py-4 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-red-100"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Product Grid/List */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[4/5] bg-white rounded-[2rem] animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {products.map((product) => (
                  <Link
                    to={`/products/${product._id}`}
                    key={product._id}
                    className={`group bg-white rounded-[3rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-700 transform hover:-translate-y-3 flex ${viewMode === 'list' ? 'flex-row h-72' : 'flex-col'}`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-72 flex-shrink-0' : 'aspect-[4/3]'} overflow-hidden bg-slate-50/50`}>
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                        className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
                        alt={product.name}
                      />

                      {/* Premium Quick View Overlay */}
                      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
                        <button 
                          onClick={(e) => handleQuickView(e, product)}
                          className="bg-white text-slate-900 px-7 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 hover:bg-blue-600 hover:text-white"
                        >
                          <Eye className="h-4 w-4" /> Quick View
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-5 left-5 flex flex-col gap-2">
                        {product.isNewproduct && (
                          <span className="px-3.5 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-xl shadow-blue-500/20">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col relative">
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.3em] mb-3">{product.category}</p>

                      <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-4">
                        {product.name}
                      </h2>

                      {viewMode === 'list' && (
                        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                          <span className="text-3xl font-black text-slate-900 tracking-tighter">${product.price}</span>
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={product.stock === 0}
                          className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${product.stock === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/30 group-hover:scale-110 active:scale-90'
                            }`}
                        >
                          <ShoppingCart className="h-6 w-6" />
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

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView 
          product={selectedProduct} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ProductList;
