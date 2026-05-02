import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Zap, 
  ChevronRight,
  Bell,
  Search,
  Plus,
  Database,
  CreditCard,
  Truck,
  RotateCcw,
  Megaphone,
  ShieldCheck,
  LifeBuoy,
  Cpu,
  History
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log('AdminLayout Rendering', user);

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: 'Products', path: '/admin/products', icon: <Package className="h-5 w-5" /> },
    { title: 'Inventory', path: '/admin/inventory', icon: <Database className="h-5 w-5" /> },
    { title: 'Orders', path: '/admin/orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { title: 'Payments', path: '/admin/payments', icon: <CreditCard className="h-5 w-5" /> },
    { title: 'Logistics', path: '/admin/shipping', icon: <Truck className="h-5 w-5" /> },
    { title: 'Returns', path: '/admin/returns', icon: <RotateCcw className="h-5 w-5" /> },
    { title: 'Marketing', path: '/admin/marketing', icon: <Megaphone className="h-5 w-5" /> },
    { title: 'Customers', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { title: 'Support', path: '/admin/support', icon: <LifeBuoy className="h-5 w-5" /> },
    { title: 'Roles', path: '/admin/roles', icon: <ShieldCheck className="h-5 w-5" /> },
    { title: 'AI Tools', path: '/admin/ai-tools', icon: <Cpu className="h-5 w-5" /> },
    { title: 'Logs', path: '/admin/logs', icon: <History className="h-5 w-5" /> },
    { title: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* ── SIDEBAR ── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-400 transition-all duration-300 transform lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-white fill-current" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black text-white tracking-tight animate-fade-in">
                ELECTRO<span className="text-blue-500">HUB</span>
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  {isSidebarOpen && (
                    <span className="font-bold text-sm tracking-wide animate-fade-in whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                  {isActive && isSidebarOpen && (
                    <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section / Logout */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
            >
              <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              {isSidebarOpen && <span className="font-bold text-sm">Logout Session</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <Search className="h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search orders, products..." 
                className="bg-transparent border-none outline-none text-sm font-medium w-64 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">{user?.username || 'Admin'}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-slate-200">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
