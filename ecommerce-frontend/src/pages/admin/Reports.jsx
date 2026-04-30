import { useState } from 'react';
import { TrendingUp, Download, Calendar, ArrowUpRight, ShoppingBag, Package, Users, DollarSign, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  const reportCards = [
    { title: 'Gross Revenue', value: '$124,500', trend: '+15%', icon: <DollarSign className="h-6 w-6" />, color: 'bg-green-500' },
    { title: 'Avg. Order Value', value: '$83.20', trend: '+4%', icon: <FileText className="h-6 w-6" />, color: 'bg-blue-500' },
    { title: 'Conversion Rate', value: '3.42%', trend: '+0.8%', icon: <TrendingUp className="h-6 w-6" />, color: 'bg-purple-500' },
    { title: 'Return Rate', value: '1.2%', trend: '-0.5%', icon: <ShoppingBag className="h-6 w-6" />, color: 'bg-red-500' },
  ];

  const handleExport = () => {
    toast.success('Report exporting to CSV...');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Reports</h1>
          <p className="text-slate-500 font-medium text-sm">Analyze your store performance and sales metrics.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="weekly">Weekly View</option>
            <option value="monthly">Monthly View</option>
            <option value="yearly">Yearly View</option>
          </select>
          <button 
            onClick={handleExport}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reportCards.map((card, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all relative overflow-hidden group">
            <div className={`w-12 h-12 rounded-2xl ${card.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10 transition-transform group-hover:scale-110`}>
              {card.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{card.title}</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black text-slate-900">{card.value}</h2>
              <div className="flex items-center gap-1 text-[10px] font-black px-2 py-1 bg-green-50 text-green-600 rounded-lg">
                <ArrowUpRight className="h-3 w-3" /> {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Report Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-xl font-black text-slate-900 mb-8">Sales by Category</h3>
          <div className="space-y-6">
            {[
              { label: 'Smartphones', value: '45%', color: 'bg-blue-600' },
              { label: 'Laptops', value: '30%', color: 'bg-purple-600' },
              { label: 'Audio', value: '15%', color: 'bg-green-600' },
              { label: 'Others', value: '10%', color: 'bg-slate-300' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-900">{item.value}</span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: item.value }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-xl font-black text-slate-900 mb-8">Performance Insights</h3>
          <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Top Insights
            </h4>
            <ul className="space-y-4 text-sm text-blue-800/80 font-medium list-disc pl-4">
              <li>Sales have increased by 15% compared to the previous month.</li>
              <li>"Smartphones" remains the highest revenue-generating category.</li>
              <li>Customer retention rate is at an all-time high of 68%.</li>
              <li>Recommend increasing stock for "Laptops" ahead of seasonal sales.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
