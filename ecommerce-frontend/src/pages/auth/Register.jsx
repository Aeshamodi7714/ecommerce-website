import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../redux/slices/authSlice';
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    const result = await dispatch(register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    }));
    
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[800px]">
        {/* Left Side: Image & Text */}
        <div className="hidden md:block w-1/2 relative bg-blue-600">
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
            alt="Register Hero"
          />
          <div className="absolute inset-0 p-12 flex flex-col justify-end text-white bg-gradient-to-t from-blue-900/80 to-transparent">
            <h2 className="text-4xl font-black mb-4">Start Your Journey.</h2>
            <p className="text-blue-100 text-lg">Create an account and explore the most advanced electronics marketplace on the planet.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight mb-6 block">
              ELECTRO<span className="text-slate-900">HUB</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
            <p className="mt-2 text-slate-500">Join our community of tech enthusiasts</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center text-red-600 gap-3 mb-6 animate-shake">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative group">
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-12 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="John Doe"
                  value={formData.username}
                  onChange={handleChange}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-12 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative group">
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-12 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
              <div className="relative group">
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-12 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
