import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearSelectedProduct } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { ShoppingCart, Heart, Shield, Truck, RotateCcw, Star, Plus, Minus, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading } = useSelector((state) => state.products);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  const isWishlisted = wishlistItems.some(item => item._id === product?._id);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <button onClick={() => navigate('/products')} className="mt-4 btn-primary py-2 px-6">Back to Products</button>
    </div>
  );

  const images = product.images || [product.image, product.image, product.image].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Images */}
        <div className="space-y-6">
          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
            <img 
              src={images[selectedImage] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'} 
              className="w-full h-full object-cover"
              alt={product.name}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-4">
              {images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm font-bold text-slate-900">4.8</span>
                <span className="ml-1 text-sm text-slate-500">(120 Reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-extrabold text-blue-600">${product.price}</span>
              {product.oldPrice && (
                <span className="text-xl text-slate-400 line-through">${product.oldPrice}</span>
              )}
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed text-lg">
            {product.description || "Premium quality product with cutting-edge technology and modern design. Perfect for your daily needs and high-performance requirements."}
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-white">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <p className={`text-sm font-bold ${product.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                {product.stock > 0 
                  ? product.stock < 5 
                    ? `Low Stock: Only ${product.stock} units left!` 
                    : `In Stock (${product.stock} units available)`
                  : 'Out of Stock'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-4 px-8 rounded-2xl flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingCart className="h-6 w-6" /> Add to Cart
              </button>
              <button 
                onClick={handleToggleWishlist}
                className={`p-4 rounded-2xl border transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500'}`}
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-4 rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 transition-colors">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">7 Days Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 pt-16 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-extrabold text-slate-900">4.8</span>
              <div>
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-sm text-slate-500 font-medium">Based on 120 reviews</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-sm font-bold w-4">{star}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '2%' }}></div>
                  </div>
                  <span className="text-sm text-slate-400 w-8">{star === 5 ? '80%' : star === 4 ? '15%' : '2%'}</span>
                </div>
              ))}
            </div>
            
            <button className="btn-secondary w-full py-3 mt-8 rounded-xl font-bold">Write a Review</button>
          </div>

          <div className="flex-1 space-y-10">
            {[
              { name: 'Alex Johnson', date: '2 days ago', comment: 'Absolutely amazing! The build quality is top-notch and it exceeds all my expectations. Highly recommended for everyone.', rating: 5 },
              { name: 'Sarah Miller', date: '1 week ago', comment: 'Great product, but the delivery took a bit longer than expected. Overall, I am very satisfied with the purchase.', rating: 4 },
              { name: 'Michael Chen', date: '2 weeks ago', comment: 'Perfect for my needs. The design is sleek and modern. Will definitely buy from ElectroHub again!', rating: 5 }
            ].map((review, i) => (
              <div key={i} className="pb-8 border-b border-slate-100 last:border-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{review.date}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {Array(review.rating).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
