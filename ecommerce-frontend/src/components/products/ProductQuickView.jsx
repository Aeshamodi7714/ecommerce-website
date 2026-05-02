import { useState, useEffect } from 'react';
import { X, ShoppingCart, Heart, Star, Shield, Truck, RotateCcw, Plus, Minus, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart', {
        style: { borderRadius: '20px', background: '#0f172a', color: '#fff' }
      });
      navigate('/login');
      handleClose();
      return;
    }
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: '20px', background: '#0f172a', color: '#fff', padding: '16px 24px' }
    });
    handleClose();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-300 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-fade-in" onClick={handleClose}></div>
      
      {/* Modal Container */}
      <div className={`bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row transition-all duration-500 transform ${isOpen && !isClosing ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md text-slate-400 hover:text-slate-900 rounded-2xl shadow-xl border border-slate-100 z-20 transition-all hover:rotate-90">
          <X className="h-6 w-6" />
        </button>

        {/* Left: Image Section */}
        <div className="w-full md:w-1/2 bg-slate-50 flex items-center justify-center p-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-transparent"></div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full max-h-[500px] object-contain relative z-10 transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Floating Badges */}
          <div className="absolute bottom-10 left-10 flex flex-col gap-3 z-10">
            <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-current" />
              <span className="text-xs font-black text-slate-900">4.9 (120+ Reviews)</span>
            </div>
            <div className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg flex items-center gap-2">
              <Zap className="h-4 w-4 fill-current" />
              <span className="text-xs font-black uppercase tracking-widest">Trending Now</span>
            </div>
          </div>
        </div>

        {/* Right: Content Section */}
        <div className="w-full md:w-1/2 p-10 md:p-16 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {/* Breadcrumb / Category */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">{product.category || 'Premium Tech'}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">In Stock</span>
            </div>

            {/* Title & Price */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">{product.name}</h2>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-slate-900">${product.price}</span>
                {product.oldPrice && <span className="text-xl text-slate-300 line-through font-bold mb-1">${product.oldPrice}</span>}
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              {product.description || "Experience the pinnacle of technology with this state-of-the-art device. Designed for those who demand performance, style, and uncompromising quality."}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-xs font-bold text-slate-700">Free Shipping</span>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <button className="h-14 w-14 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
                  <Heart className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-slate-900 text-white h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-95"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </button>
                <button className="flex-1 bg-blue-600 text-white h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-blue-500/20 active:scale-95">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4 text-slate-400">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <RotateCcw className="h-4 w-4" /> 30 Day Returns
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <Shield className="h-4 w-4" /> Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
