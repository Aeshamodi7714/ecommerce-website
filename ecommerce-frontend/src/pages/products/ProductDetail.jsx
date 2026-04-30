import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearSelectedProduct } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import {
  ShoppingCart, Heart, Shield, Truck, RotateCcw, Star,
  Plus, Minus, Share2, ChevronRight, Check, Zap, Package, BadgeCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct, items, loading } = useSelector((state) => state.products);
  // Use already-loaded product from list as immediate fallback while API call completes
  const productFromList = items.find(p => p._id === id);
  const product = selectedProduct || productFromList;
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    setQuantity(1);
    setSelectedImage(0);
    setAddedToCart(false);
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  const isWishlisted = wishlistItems.some(item => item._id === product?._id);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    setAddedToCart(true);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛍️',
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', padding: '16px 24px', fontWeight: 'bold' },
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast(isWishlisted ? '💔 Removed from Wishlist' : '❤️ Added to Wishlist!', {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontWeight: 'bold' },
    });
  };

  // Loading Skeleton
  if (loading && !product) return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="animate-pulse">
            <div className="aspect-square rounded-3xl bg-slate-200 mb-4"></div>
            <div className="flex gap-3">
              {[1,2,3].map(i => <div key={i} className="w-24 h-24 rounded-2xl bg-slate-200"></div>)}
            </div>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-slate-200 rounded-full w-24"></div>
            <div className="h-10 bg-slate-200 rounded-2xl w-3/4"></div>
            <div className="h-8 bg-slate-200 rounded-2xl w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
            <div className="h-16 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Product Not Found</h2>
        <p className="text-slate-500 mb-8">This product may have been removed or doesn't exist.</p>
        <button onClick={() => navigate('/products')} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg">
          Browse All Products
        </button>
      </div>
    </div>
  );

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image, product.image, product.image].filter(Boolean);

  const rating = product.rating || 4.5;
  const reviewCount = Math.floor(Math.random() * 200 + 50);
  const discount = product.discount || 20;
  const originalPrice = (product.price * (1 + discount / 100)).toFixed(2);

  // Auto-detect brand from product name
  const brandMap = {
    'iphone': 'Apple', 'macbook': 'Apple', 'apple watch': 'Apple', 'airpods': 'Apple',
    'samsung': 'Samsung', 'galaxy': 'Samsung',
    'pixel': 'Google', 'google': 'Google',
    'oneplus': 'OnePlus', 'xiaomi': 'Xiaomi', 'motorola': 'Motorola',
    'sony': 'Sony', 'asus': 'Asus', 'rog': 'Asus',
    'dell': 'Dell', 'lenovo': 'Lenovo', 'thinkpad': 'Lenovo',
    'hp ': 'HP', 'razer': 'Razer', 'microsoft': 'Microsoft', 'surface': 'Microsoft',
    'lg ': 'LG', 'acer': 'Acer', 'logitech': 'Logitech', 'keychron': 'Keychron',
    'anker': 'Anker', 'garmin': 'Garmin', 'fitbit': 'Fitbit', 'amazfit': 'Amazfit',
    'suunto': 'Suunto', 'withings': 'Withings', 'bose': 'Bose', 'sennheiser': 'Sennheiser',
    'jabra': 'Jabra', 'beats': 'Beats', 'sonos': 'Sonos', 'marshall': 'Marshall',
    'ultimate ears': 'Ultimate Ears', 'belkin': 'Belkin', 'cadigit': 'CalDigit',
    'satechi': 'Satechi', 'peak design': 'Peak Design',
  };
  const productBrand = product.brand || (() => {
    const nameLower = product.name.toLowerCase();
    return Object.entries(brandMap).find(([key]) => nameLower.includes(key))?.[1] || 'Generic';
  })();
  const productSku = product.sku || `SKU-${product._id?.toString().slice(-6)?.toUpperCase()}`;

  const features = [
    { icon: <Truck className="h-5 w-5" />, title: 'Free Shipping', desc: 'On orders over $500' },
    { icon: <Shield className="h-5 w-5" />, title: '1 Year Warranty', desc: 'Full manufacturer coverage' },
    { icon: <RotateCcw className="h-5 w-5" />, title: '30-Day Returns', desc: 'Hassle-free returns' },
    { icon: <BadgeCheck className="h-5 w-5" />, title: '100% Authentic', desc: 'Officially authorized' },
  ];

  const reviews = [
    { name: 'Alex Johnson', date: '2 days ago', comment: 'Absolutely amazing! Build quality is top-notch and it exceeds all my expectations. Highly recommended.', rating: 5, avatar: 'AJ' },
    { name: 'Sarah Miller', date: '1 week ago', comment: 'Great product, but the delivery took a bit longer than expected. Overall, very satisfied with the purchase.', rating: 4, avatar: 'SM' },
    { name: 'Michael Chen', date: '2 weeks ago', comment: 'Perfect for my needs. The design is sleek and modern. Will definitely buy from ElectroHub again!', rating: 5, avatar: 'MC' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <Link to="/products" className="hover:text-blue-600 transition-colors font-medium">Products</Link>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          {product.category && (
            <>
              <Link to={`/products?category=${product.category}`} className="hover:text-blue-600 transition-colors font-medium capitalize">{product.category}</Link>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            </>
          )}
          <span className="text-slate-900 font-bold truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── Image Gallery ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm group">
              <img
                src={images[selectedImage] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                alt={product.name}
              />

              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-col gap-2">
                {product.isNewproduct && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">NEW</span>
                )}
                <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                  -{discount}% OFF
                </span>
              </div>

              {/* Wishlist */}
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-5 right-5 h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isWishlisted ? 'bg-red-500 text-white scale-110' : 'bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 hover:scale-110'}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              {/* Share */}
              <button className="absolute bottom-5 right-5 h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 hover:text-blue-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <span className="px-6 py-3 bg-slate-900 text-white font-bold text-lg rounded-2xl uppercase tracking-wider">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === i ? 'border-blue-600 shadow-lg shadow-blue-500/20 scale-105' : 'border-transparent hover:border-slate-300 bg-white'}`}
                  >
                    <img src={img} className="w-full h-full object-contain p-2 mix-blend-multiply" alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-7">

            {/* Category & Rating */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <Link to={`/products?category=${product.category}`} className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full hover:bg-blue-100 transition-colors capitalize">
                {product.category}
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`h-4 w-4 ${i <= Math.floor(rating) ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <span className="font-bold text-slate-900">{rating}</span>
                <span className="text-slate-400 text-sm">({reviewCount} reviews)</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">{product.name}</h1>
              <p className="text-slate-400 font-semibold mt-2">by <span className="text-slate-600">{productBrand}</span></p>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">${product.price}</span>
              <div>
                <span className="text-xl text-slate-400 line-through">${originalPrice}</span>
                <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-xl">You save ${(originalPrice - product.price).toFixed(2)}</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3 py-4 px-5 rounded-2xl bg-slate-50 border border-slate-100">
              {product.stock > 0 ? (
                <>
                  <div className={`h-3 w-3 rounded-full animate-pulse flex-shrink-0 ${product.stock <= 5 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                  <p className={`text-sm font-bold ${product.stock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                    {product.stock <= 5 ? `⚠️ Only ${product.stock} units left – Order soon!` : `✅ In Stock (${product.stock} units available)`}
                  </p>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 rounded-full bg-red-500 flex-shrink-0"></div>
                  <p className="text-sm font-bold text-red-600">❌ Out of Stock</p>
                </>
              )}
            </div>

            {/* Quantity + Buttons */}
            {product.stock > 0 && (
              <div className="space-y-4">
                {/* Qty Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Quantity</span>
                  <div className="flex items-center bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="h-12 w-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors font-bold text-xl"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-14 text-center text-lg font-black text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="h-12 w-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-slate-400">Max: {product.stock}</span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-16 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300 border-2 ${
                      addedToCart
                        ? 'bg-green-50 border-green-300 text-green-700 scale-95'
                        : 'bg-white border-slate-200 text-slate-900 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg'
                    }`}
                  >
                    {addedToCart ? (
                      <><Check className="h-6 w-6" /> Added!</>
                    ) : (
                      <><ShoppingCart className="h-6 w-6" /> Add to Cart</>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Zap className="h-6 w-6 fill-current" /> Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">{f.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{f.title}</p>
                    <p className="text-xs text-slate-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mt-20">
          <div className="flex border-b border-slate-200 mb-10 gap-1">
            {['description', 'specs', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-bold text-sm uppercase tracking-wider capitalize transition-all duration-300 border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">About this Product</h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-8">
                {product.description || 'Premium quality product with cutting-edge technology and modern design. Perfect for your daily needs and high-performance requirements.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {['Premium Build Quality', 'Long-Lasting Battery', 'Fast Performance'].map((f, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl">
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-slate-700">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Brand', value: productBrand },
                  { label: 'Category', value: product.category?.charAt(0).toUpperCase() + product.category?.slice(1) },
                  { label: 'SKU', value: productSku },
                  { label: 'Stock', value: `${product.stock} units` },
                  { label: 'Price', value: `$${product.price}` },
                  { label: 'Condition', value: 'Brand New' },
                  { label: 'Warranty', value: '1 Year Manufacturer' },
                  { label: 'Return Policy', value: '30-Day Money Back' },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center justify-between py-4 px-5 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{spec.label}</span>
                    <span className="font-bold text-slate-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                {/* Rating Summary */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white min-w-[200px] text-center shadow-xl shadow-blue-500/20">
                  <p className="text-7xl font-black">{rating}</p>
                  <div className="flex justify-center text-yellow-300 my-3">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-current" />)}
                  </div>
                  <p className="text-blue-200 font-semibold">Based on {reviewCount} reviews</p>
                </div>

                {/* Rating Bars */}
                <div className="flex-1 space-y-3 w-full">
                  {[5, 4, 3, 2, 1].map(star => {
                    const widths = { 5: '80%', 4: '12%', 3: '5%', 2: '2%', 1: '1%' };
                    return (
                      <div key={star} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-12 flex-shrink-0">
                          <span className="text-sm font-bold text-slate-700">{star}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all" style={{ width: widths[star] }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-400 w-10">{widths[star]}</span>
                      </div>
                    );
                  })}
                  <button className="mt-6 w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors">
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.map((review, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black flex items-center justify-center text-sm flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="font-bold text-slate-900">{review.name}</h4>
                          <p className="text-xs text-slate-400 font-medium">{review.date}</p>
                        </div>
                        <div className="flex text-yellow-400 mt-1">
                          {Array(review.rating).fill(0).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                          {Array(5 - review.rating).fill(0).map((_, j) => <Star key={j} className="h-4 w-4 text-slate-200" />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile */}
      {product.stock > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 z-50 flex gap-4 shadow-2xl">
          <button
            onClick={handleAddToCart}
            className="flex-1 h-14 rounded-2xl border-2 border-slate-200 text-slate-900 font-bold flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition-all"
          >
            <ShoppingCart className="h-5 w-5" /> Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Zap className="h-5 w-5 fill-current" /> Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
