import { useState, useEffect } from 'react';
import axiosInstance from '../../services/api/axiosInstance';
import { ShoppingBag, Package, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Download, Loader2 } from 'lucide-react';

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
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Live Insights...</p>
    </div>
  );

  const stats = [
    { label: 'Total Revenue', value: `$${(data?.stats?.totalRevenue || 0).toLocaleString()}`, trend: '+12.5%', icon: <TrendingUp className="h-6 w-6" />, color: 'from-green-500 to-emerald-600', up: true },
    { label: 'Total Orders', value: data?.stats?.totalOrders || 0, trend: '+8.2%', icon: <ShoppingBag className="h-6 w-6" />, color: 'from-blue-500 to-indigo-600', up: true },
    { label: 'Total Products', value: data?.stats?.totalProducts || 0, trend: '0%', icon: <Package className="h-6 w-6" />, color: 'from-purple-500 to-violet-600', up: true },
    { label: 'Active Users', value: data?.stats?.totalUsers || 0, trend: '-2.4%', icon: <Users className="h-6 w-6" />, color: 'from-orange-500 to-red-600', up: false },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ── WELCOME SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity -mr-16 -mt-16 rounded-full`}></div>
            
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/10`}>
              {stat.icon}
            </div>
            
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black text-slate-900">{stat.value}</h2>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
                stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CHARTS / ACTIVITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Weekly Sales Performance</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Units Sold vs Revenue</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Units</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-4 relative">
             {/* Grid Lines */}
             <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-5">
               {[1,2,3,4].map(i => <div key={i} className="border-t border-slate-900 w-full"></div>)}
             </div>

             {[
               { day: 'Mon', revenue: '65%', units: '40%' },
               { day: 'Tue', revenue: '85%', units: '55%' },
               { day: 'Wed', revenue: '45%', units: '30%' },
               { day: 'Thu', revenue: '95%', units: '70%' },
               { day: 'Fri', revenue: '75%', units: '50%' },
               { day: 'Sat', revenue: '55%', units: '35%' },
               { day: 'Sun', revenue: '40%', units: '25%' },
             ].map((bar, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                 <div className="w-full flex items-end justify-center gap-1.5 h-48 relative">
                    <div 
                      className="w-3 bg-slate-100 rounded-t-lg transition-all duration-1000 group-hover:bg-slate-200" 
                      style={{ height: bar.units }}
                    ></div>
                    <div 
                      className="w-3 bg-blue-600 rounded-t-lg shadow-lg shadow-blue-500/20 transition-all duration-1000 group-hover:bg-blue-700" 
                      style={{ height: bar.revenue }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.revenue}
                    </div>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bar.day}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
          <h3 className="text-xl font-black text-slate-900 mb-8">Top Products</h3>
          <div className="space-y-6">
            {[
              { name: 'iPhone 15 Pro', sales: '84 Sales', price: '$999.00', img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200' },
              { name: 'MacBook Air M2', sales: '62 Sales', price: '$1,199.00', img: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?w=200' },
              { name: 'Apple Watch S9', sales: '45 Sales', price: '$399.00', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200' },
              { name: 'AirPods Pro 2', sales: '38 Sales', price: '$249.00', img: 'https://images.unsplash.com/photo-1588423770674-f2855ee491b3?w=200' },
            ].map((prod, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden p-1">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{prod.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{prod.sales}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{prod.price}</p>
                  <p className="text-[10px] font-black text-green-500">+12%</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
            Full Inventory Report
          </button>
        </div>

      </div>

      {/* ── RECENT TRANSACTIONS (Moved below chart) ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
            <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">View All Orders</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders || []).map((order, i) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                          {order.userId ? 'U' : 'G'}
                        </div>
                        <span className="text-sm font-bold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600">
                      {order.items?.length || 0} Items
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        order.status === 'delivered' ? 'text-green-600 bg-green-50' : 
                        order.status === 'shipped' ? 'text-blue-600 bg-blue-50' : 
                        'text-orange-500 bg-orange-50'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-900">${(order.totalbill || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
