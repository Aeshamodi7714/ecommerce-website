import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success('Added to cart!');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="h-12 w-12 text-slate-300" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Wishlist is empty</h2>
        <p className="text-slate-500 mb-8">Save your favorite tech here for later!</p>
        <Link to="/products" className="btn-primary py-3 px-8 rounded-xl inline-flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" /> Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8">My Wishlist</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((product) => (
          <div key={product._id} className="card group">
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              <button 
                onClick={() => dispatch(removeFromWishlist(product._id))}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-red-500 shadow-sm"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs text-blue-600 font-bold uppercase mb-2">{product.category}</p>
              <Link to={`/products/${product._id}`} className="block text-lg font-bold hover:text-blue-600 line-clamp-1 mb-4">
                {product.name}
              </Link>
              <div className="flex items-center justify-between">
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
    </div>
  );
};

export default Wishlist;
