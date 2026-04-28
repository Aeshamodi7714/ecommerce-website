import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <div className="animate-bounce-subtle bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Order Confirmed!</h1>
      <p className="text-slate-500 text-lg mb-12 max-w-md mx-auto">
        Your order has been placed successfully. We'll send you an email with tracking details as soon as it ships.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/orders" className="btn-primary py-3 px-8 rounded-xl flex items-center justify-center gap-2">
          <Package className="h-5 w-5" /> View My Orders
        </Link>
        <Link to="/" className="btn-secondary py-3 px-8 rounded-xl flex items-center justify-center gap-2">
          Continue Shopping <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
