import { useState, useEffect } from 'react';
import axiosInstance from '../../services/api/axiosInstance';
import { 
  ShoppingBag, Package, Users, TrendingUp, ArrowUpRight, 
  ArrowDownRight, Download, Loader2, Zap, Bell, 
  Settings, Search, Calendar, ChevronRight, Activity, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/stats');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
      </div>
      <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Syncing Core Systems...</p>
    </div>
  );

  const stats = [
    { label: 'Net Revenue', value: `$${(data?.stats?.totalRevenue || 0).toLocaleString()}`, trend: '+14.2%', icon: <TrendingUp className="h-6 w-6" />, color: 'blue', up: true },
    { label: 'Total Orders', value: data?.stats?.totalOrders || 0, trend: '+8.2%', icon: <ShoppingBag className="h-6 w-6" />, color: 'purple', up: true },
    { label: 'Inventory', value: data?.stats?.totalProducts || 0, trend: '0%', icon: <Package className="h-6 w-6" />, color: 'orange', up: true },
    { label: 'Customers', value: data?.stats?.totalUsers || 0, trend: '+2.4%', icon: <Users className="h-6 w-6" />, color: 'green', up: true },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      
      {/* ── TOP NAV BAR (DASHBOARD INTERNAL) ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Live System Analytics</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-slate-500 font-medium">Monitoring ElectroHub performance in real-time.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
            <Download className="h-4 w-4" /> Intelligence Report
          </button>
        </div>
      </div>

      {/* ── STATS CARDS (UNIQUE STYLE) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Link 
            key={i} 
            to={
              stat.label.includes('Revenue') ? '/admin/orders' : 
              stat.label.includes('Orders') ? '/admin/orders' : 
              stat.label.includes('Inventory') ? '/admin/products' : 
              '/admin/customers'
            }
            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 block"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-600/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
            
            <div className="flex items-center justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 shadow-inner group-hover:rotate-6 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-xl ${
                stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
            
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h2>
          </Link>
        ))}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVENUE FORECAST CHART */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Revenue Stream</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Projection based on current trajectory</p>
            </div>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl">
              {['1W', '1M', '1Y'].map(v => (
                <button key={v} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${v === '1W' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-72 flex items-end justify-between gap-6 px-4 relative">
             {/* Grid Lines */}
             <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-5">
               {[1,2,3,4,5].map(i => <div key={i} className="border-t border-slate-900 w-full"></div>)}
             </div>

             {[
               { day: 'Mon', h: '55%', c: 'bg-blue-600' },
               { day: 'Tue', h: '75%', c: 'bg-blue-600' },
               { day: 'Wed', h: '45%', c: 'bg-indigo-600' },
               { day: 'Thu', h: '90%', c: 'bg-blue-600' },
               { day: 'Fri', h: '65%', c: 'bg-blue-600' },
               { day: 'Sat', h: '85%', c: 'bg-indigo-600' },
               { day: 'Sun', h: '60%', c: 'bg-blue-600' },
             ].map((bar, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-5 group">
                 <div className="w-full flex items-end justify-center h-52 relative">
                    <div 
                      className={`w-4 ${bar.c} rounded-t-2xl shadow-2xl transition-all duration-1000 group-hover:scale-x-110 group-hover:brightness-110`} 
                      style={{ height: bar.h }}
                    ></div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-2 shadow-xl whitespace-nowrap">
                      ${Math.floor(Math.random()*5000 + 2000)}
                    </div>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bar.day}</span>
               </div>
             ))}
          </div>
        </div>

        {/* QUICK ACTIONS & NOTIFICATIONS */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/10">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" /> Fast Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/add-product" className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest">Add Product</p>
              </Link>
              <Link to="/admin/orders" className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest">Orders</p>
              </Link>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900">Recent Activity</h3>
              <Bell className="h-5 w-5 text-slate-300" />
            </div>
            <div className="space-y-6">
              {[
                { type: 'order', msg: 'New Order #EF921', time: '2 mins ago', color: 'blue' },
                { type: 'user', msg: 'New Customer Registered', time: '15 mins ago', color: 'green' },
                { type: 'stock', msg: 'Low Stock Alert: iPhone 15', time: '45 mins ago', color: 'orange' },
                { type: 'review', msg: 'New 5-Star Review received', time: '1 hr ago', color: 'purple' },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 3 && <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-slate-50"></div>}
                  <div className={`w-5 h-5 rounded-full bg-${act.color}-100 border-4 border-white shadow-sm flex-shrink-0 z-10`}></div>
                  <div className="flex-1 -mt-1">
                    <p className="text-xs font-bold text-slate-900">{act.msg}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── TRANSACTION TABLE ── */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Transactions</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live feed from all channels</p>
            </div>
            <Link to="/admin/orders" className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Hash</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Tracking</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(data?.recentOrders || []).map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 font-black text-[10px] group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                          {order._id.slice(-2).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-slate-900">ID: {order._id.slice(-10).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">{order.items?.length || 0} Products</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-500' : 
                          order.status === 'shipped' ? 'bg-blue-500' : 
                          'bg-orange-400 animate-pulse'
                        }`}></span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'delivered' ? 'text-green-600' : 
                          order.status === 'shipped' ? 'text-blue-600' : 
                          'text-orange-500'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 font-black text-slate-900 text-lg">${(order.totalbill || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

// Internal Helper Icons
const Plus = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
  </svg>
);

export default AdminDashboard;
