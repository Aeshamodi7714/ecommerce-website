import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { Filter, ShoppingCart, Heart, Search, ChevronDown, LayoutGrid, List } from 'lucide-react';
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

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
                <div className="space-y-2">
                  {['Smartphones', 'Laptops', 'Accessories', 'Watches', 'Audio'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={category === cat.toLowerCase()}
                        onChange={() => {
                          const newParams = new URLSearchParams(searchParams);
                          if (category === cat.toLowerCase()) {
                            newParams.delete('category');
                          } else {
                            newParams.set('category', cat.toLowerCase());
                          }
                          setSearchParams(newParams);
                        }}
                      />
                      <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Price Range: ${maxPrice}</label>
                <input 
                  type="range" 
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                  min="0" 
                  max="2000" 
                  step="50"
                  value={maxPrice}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('maxPrice', e.target.value);
                    setSearchParams(newParams);
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>$0</span>
                  <span>$2000+</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Controls */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-slate-900">
              {search ? `Results for "${search}"` : category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
              <span className="ml-2 text-sm font-normal text-slate-500">({products.length} items)</span>
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              <div className="relative">
                <select 
                  className="bg-slate-100 border-none rounded-lg text-sm font-medium py-2 pl-4 pr-10 focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={sort}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('sort', e.target.value);
                    setSearchParams(newParams);
                  }}
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-96 border border-slate-200"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-8`}>
              {products.map((product) => (
                <div key={product._id} className="card group">
                  <div className={`relative ${viewMode === 'grid' ? 'h-64' : 'h-48 w-48'} overflow-hidden bg-slate-100`}>
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={product.name}
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:text-red-500 transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    {product.stock > 0 && product.stock < 5 && (
                      <span className="absolute bottom-4 left-4 px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md animate-pulse">
                        ONLY {product.stock} LEFT
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center text-red-600 font-bold text-sm">
                        OUT OF STOCK
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-2">{product.category}</p>
                    <Link to={`/products/${product._id}`} className="block text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-1 text-yellow-400 mb-3">
                      {[1, 2, 3, 4].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                      <Star className="h-3 w-3" />
                      <span className="text-[10px] text-slate-400 ml-1">(4.0)</span>
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xl font-extrabold text-blue-600">${product.price}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="btn-primary p-2 rounded-lg"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900">No products found</h2>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
