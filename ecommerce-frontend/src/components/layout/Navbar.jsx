import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Heart, Search, LogOut, Menu, X, Smartphone, Laptop, Headphones, Watch, Package, ChevronDown, Zap, Tag, Ticket } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { logout } from '../../redux/slices/authSlice';
import axiosInstance from '../../services/api/axiosInstance';

const categories = [
  { name: 'Smartphones', slug: 'smartphones', icon: Smartphone, color: 'text-blue-500' },
  { name: 'Laptops', slug: 'laptops', icon: Laptop, color: 'text-indigo-500' },
  { name: 'Accessories', slug: 'accessories', icon: Package, color: 'text-purple-500' },
  { name: 'Watches', slug: 'watches', icon: Watch, color: 'text-pink-500' },
  { name: 'Audio', slug: 'audio', icon: Headphones, color: 'text-orange-500' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const catRef = useRef(null);
  const userRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Sticky shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setShowCategories(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowAutocomplete(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Live Search Effect
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const { data } = await axiosInstance.get('/product/all');
          if (data && data.products) {
            const query = searchQuery.toLowerCase();
            const filtered = data.products.filter(p =>
              p.name.toLowerCase().includes(query) ||
              (p.category && p.category.toLowerCase().includes(query)) ||
              (p.brand && p.brand.toLowerCase().includes(query))
            ).slice(0, 5);
            setSearchResults(filtered);
          }
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    // Simple debounce
    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg shadow-slate-900/5 border-b border-slate-100' : 'border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-xl font-black tracking-tight">
              ELECTRO<span className="text-blue-600">HUB</span>
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                Shop <ChevronDown className={`h-4 w-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
              </button>
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <Link
                    to="/products"
                    onClick={() => setShowCategories(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Package className="h-4 w-4 text-slate-400" /> All Products
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/products?category=${cat.slug}`}
                      onClick={() => setShowCategories(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <cat.icon className={`h-4 w-4 ${cat.color}`} />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              About
            </Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              Contact
            </Link>
            <Link to="/faq" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              FAQs
            </Link>
            <Link to="/offers" className="flex items-center gap-2 px-4 py-2 text-sm font-black text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-blue-100/50">
              <Tag className="h-3.5 w-3.5" /> Offers
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs xl:max-w-sm relative" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAutocomplete(true);
                }}
                onFocus={() => setShowAutocomplete(true)}
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Go
                </button>
              )}
            </div>

            {/* Live Search Autocomplete Dropdown */}
            {showAutocomplete && searchQuery.trim().length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-sm font-bold text-slate-400">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        onClick={() => { setShowAutocomplete(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                          <p className="text-xs font-bold text-blue-600">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm font-bold text-slate-400">No products found</div>
                )}
                <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                  <button type="submit" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700">
                    View All Results
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Right Icons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/wishlist" className="relative p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-bold text-slate-700 hidden xl:block">{user?.username}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-black text-slate-900">{user?.username}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    <Link to="/offers" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">
                      <Ticket className="h-4 w-4" /> My Offers
                    </Link>
                    {user?.email === 'admin@hub.com' && (
                      <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors">
                        <Zap className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-slate-100" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-blue-500/25 hover:shadow-md transition-all">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2 text-slate-600">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-4 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-400 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <cat.icon className={`h-4 w-4 ${cat.color}`} /> {cat.name}
              </Link>
            ))}
          </div>

          <hr className="border-slate-100" />
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="py-2.5 px-4 text-sm font-semibold text-slate-600 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="py-2.5 px-4 text-sm font-semibold text-slate-600 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors">About Us</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="py-2.5 px-4 text-sm font-semibold text-slate-600 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors">Contact</Link>
            <Link to="/faq" onClick={() => setIsOpen(false)} className="py-2.5 px-4 text-sm font-semibold text-slate-600 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors">FAQs</Link>
            <Link to="/offers" onClick={() => setIsOpen(false)} className="py-2.5 px-4 text-sm font-black text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"><Tag className="h-4 w-4" /> Offers</Link>
          </div>

          <hr className="border-slate-100" />
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link to="/profile" onClick={() => setIsOpen(false)} className="py-2.5 px-4 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">My Profile</Link>
              <Link to="/orders" onClick={() => setIsOpen(false)} className="py-2.5 px-4 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">My Orders</Link>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="py-2.5 px-4 text-sm font-bold text-red-500 text-left rounded-xl hover:bg-red-50 transition-colors">Logout</button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 py-3 text-center text-sm font-bold border-2 border-slate-200 text-slate-700 rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all">Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1 py-3 text-center text-sm font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
