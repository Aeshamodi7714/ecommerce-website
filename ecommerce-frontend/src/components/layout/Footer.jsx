import { Link } from 'react-router-dom';
import { Globe, Link as LinkIcon, Share2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              ELECTRO<span className="text-slate-900">HUB</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your one-stop shop for the latest electronics, gadgets, and tech accessories. Quality guaranteed.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Globe className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><LinkIcon className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Share2 className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-slate-500 text-sm hover:text-blue-600 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=smartphones" className="text-slate-500 text-sm hover:text-blue-600 transition-colors">Smartphones</Link></li>
              <li><Link to="/products?category=laptops" className="text-slate-500 text-sm hover:text-blue-600 transition-colors">Laptops</Link></li>
              <li><Link to="/products?category=accessories" className="text-slate-500 text-sm hover:text-blue-600 transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6">Customer Service</h3>
            <ul className="space-y-4">
              <li><Link to="/profile" className="text-slate-500 text-sm hover:text-blue-600 transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="text-slate-500 text-sm hover:text-blue-600 transition-colors">Track Orders</Link></li>
              <li><Link to="/wishlist" className="text-slate-500 text-sm hover:text-blue-600 transition-colors">Wishlist</Link></li>
              <li><Link to="/faq" className="text-slate-500 text-sm hover:text-blue-600 transition-colors">Help & FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-slate-500">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>123 Tech Avenue, Silicon Valley, CA 94025</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-500">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>+1 (555) 000-0000</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-500">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>support@electrohub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-500 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} ElectroHub. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-slate-500 text-xs hover:text-blue-600">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 text-xs hover:text-blue-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
