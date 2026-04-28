import { LayoutDashboard, Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Revenue', value: '$24,500', icon: <TrendingUp className="h-6 w-6" />, color: 'bg-green-500' },
    { label: 'Total Orders', value: '150', icon: <ShoppingBag className="h-6 w-6" />, color: 'bg-blue-500' },
    { label: 'Total Products', value: '45', icon: <Package className="h-6 w-6" />, color: 'bg-purple-500' },
    { label: 'Total Users', value: '1,200', icon: <Users className="h-6 w-6" />, color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-blue-600" /> Admin Dashboard
        </h1>
        <div className="flex gap-4">
          <Link to="/admin/products" className="btn-secondary py-2 px-6 rounded-xl">Manage Products</Link>
          <Link to="/admin/add-product" className="btn-primary py-2 px-6 rounded-xl">Add New Product</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="card p-8">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white mb-6`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
            <h2 className="text-3xl font-extrabold mt-1">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8">
          <h3 className="text-xl font-bold mb-6">Recent Sales</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                  <div>
                    <p className="font-bold">Customer #{i}</p>
                    <p className="text-xs text-slate-500">2 minutes ago</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">+$249.00</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8">
          <h3 className="text-xl font-bold mb-6">Top Products</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100" />
                  <div>
                    <p className="font-bold">Product Item #{i}</p>
                    <p className="text-xs text-slate-500">15 sales this week</p>
                  </div>
                </div>
                <span className="font-bold">$999.00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
