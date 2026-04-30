import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../redux/slices/authSlice';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username.length < 2) {
      toast.error('Username must be at least 2 characters long');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const result = await dispatch(register({ username: formData.username, email: formData.email, password: formData.password }));
    if (register.fulfilled.match(result)) {
      toast.success('Account Created Successfully!');
      navigate('/');
    } else {
      toast.error(result.payload || 'Registration Failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* LEFT SIDE - Premium Branding & Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&q=80" 
          alt="Premium Gadgets" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <Link to="/" className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ZapIcon className="text-white h-5 w-5 fill-current" />
            </div>
            ELECTRO<span className="text-blue-500">HUB</span>
          </Link>

          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Unlock the future<br />of tech shopping.
            </h1>
            <p className="text-slate-300 text-lg mb-12 max-w-md leading-relaxed">
              Join thousands of tech enthusiasts getting exclusive access to premium gadgets, early drops, and unbeatable member pricing.
            </p>
            
            {/* Feature List */}
            <div className="space-y-5">
              {['Exclusive member-only discounts', 'Priority shipping on all orders', 'Extended 60-day returns', '24/7 dedicated tech support'].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 text-slate-200">
                  <div className="p-1 rounded-full bg-blue-500/20 text-blue-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-lg shadow-2xl">
            <div className="flex gap-1 text-yellow-400 mb-4">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
            </div>
            <p className="text-white text-base leading-relaxed italic mb-6">"ElectroHub completely transformed how I buy my gear. The member pricing alone saved me hundreds on my new setup."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-400 rounded-full overflow-hidden border-2 border-white/20">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold">Alex Chen</p>
                <p className="text-slate-400 text-sm">Pro Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <Link to="/" className="lg:hidden text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ZapIcon className="text-white h-5 w-5 fill-current" />
            </div>
            ELECTRO<span className="text-blue-600">HUB</span>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Create an account</h2>
            <p className="text-slate-500 text-lg">Enter your details to get started.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start text-red-600 gap-3 mb-8 animate-shake">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <input name="username" type="text" required
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-12 py-4 text-slate-900 placeholder-slate-400 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="John Doe" value={formData.username} onChange={handleChange} />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <input name="email" type="email" required
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-12 py-4 text-slate-900 placeholder-slate-400 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="name@company.com" value={formData.email} onChange={handleChange} />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <input name="password" type="password" required
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-12 py-4 text-slate-900 placeholder-slate-400 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="••••••••" value={formData.password} onChange={handleChange} />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Confirm Password</label>
              <div className="relative">
                <input name="confirmPassword" type="password" required
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-12 py-4 text-slate-900 placeholder-slate-400 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>Create Account <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Social Sign up (Visual) */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span></div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex justify-center items-center gap-3 px-4 py-3.5 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 font-bold">
                <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
                Google
              </button>
              <button className="flex justify-center items-center gap-3 px-4 py-3.5 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 font-bold">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.53-.88 4.07-.76 1.76.25 2.92 1.05 3.8 2.31-1.39 1.15-2.09 3.04-1.12 4.67.73 1.25 1.81 1.83 2.97 2.21-1.07 1.83-2.08 2.56-4.8 3.74zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Apple
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-slate-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-all">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper component since we didn't import Zap from lucide-react directly
const ZapIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export default Register;
