import { useState, useEffect } from 'react';
import { 
  TrendingUp, Download, Calendar, ArrowUpRight, ShoppingBag, 
  Package, Users, DollarSign, FileText, Zap, Target, 
  Smile, Activity, Layers, ArrowRight, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [forecastGrowth, setForecastGrowth] = useState(15);
  const [activePulse, setActivePulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse(prev => (prev + 1) % 7);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const reportCards = [
    { title: 'Gross Revenue', value: '$124,500', trend: '+15%', icon: <DollarSign className="h-6 w-6" />, color: 'green' },
    { title: 'Avg. Order Value', value: '$83.20', trend: '+4%', icon: <FileText className="h-6 w-6" />, color: 'blue' },
    { title: 'Conversion Rate', value: '3.42%', trend: '+0.8%', icon: <TrendingUp className="h-6 w-6" />, color: 'purple' },
    { title: 'Return Rate', value: '1.2%', trend: '-0.5%', icon: <ShoppingBag className="h-6 w-6" />, color: 'red' },
  ];

  const handleExport = () => {
    toast.success('Analyzing data streams... Exporting CSV');
  };

  const projectedRevenue = (124500 * (1 + forecastGrowth / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Enterprise Analytics Engine</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Intelligence</h1>
          <p className="text-slate-500 font-medium">Deep-dive into performance metrics and future projections.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border-2 border-slate-100 p-1 rounded-2xl shadow-sm">
            {['weekly', 'monthly', 'yearly'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button 
            onClick={handleExport}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-3 group"
          >
            <Download className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" /> Export Intelligence
          </button>
        </div>
      </div>

      {/* ── METRIC GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reportCards.map((card, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-50 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:border-indigo-100 transition-all duration-500">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${card.color}-500/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
            
            <div className={`w-14 h-14 rounded-2xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-600 mb-6 shadow-inner group-hover:rotate-6 transition-transform`}>
              {card.icon}
            </div>
            
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</h2>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg ${card.trend.includes('-') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── UNIQUE FEATURE: SALES PULSE HEATMAP ── */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border-2 border-slate-50 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Weekly Sales Pulse</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Transaction density per day</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400">Low</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <div key={i} className={`w-3 h-3 rounded-md bg-indigo-600`} style={{ opacity: i * 0.2 }}></div>)}
              </div>
              <span className="text-[10px] font-black text-slate-400">High</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="space-y-4">
                <div className="flex flex-col gap-2">
                  {[...Array(6)].map((_, j) => {
                    const intensity = Math.random();
                    return (
                      <div 
                        key={j} 
                        className={`aspect-square rounded-xl transition-all duration-700 cursor-help group relative ${activePulse === i ? 'scale-110 shadow-lg' : ''}`}
                        style={{ 
                          backgroundColor: '#4f46e5', 
                          opacity: intensity > 0.8 ? 0.9 : intensity > 0.5 ? 0.6 : intensity > 0.2 ? 0.3 : 0.1 
                        }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                          {Math.floor(intensity * 100)} Orders
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── UNIQUE FEATURE: GROWTH SIMULATOR ── */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
            <Target className="h-6 w-6 text-indigo-400" /> Growth Forecaster
          </h3>
          <p className="text-indigo-200/60 text-xs font-medium mb-12">Simulate potential revenue based on growth targets.</p>
          
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Projected Growth</span>
                <span className="text-3xl font-black text-indigo-400">+{forecastGrowth}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={forecastGrowth}
                onChange={(e) => setForecastGrowth(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Estimated Revenue</p>
              <h2 className="text-5xl font-black tracking-tight mb-2">${projectedRevenue}</h2>
              <p className="text-xs text-indigo-200/40 font-medium">Potential gain of ${(124500 * (forecastGrowth / 100)).toLocaleString()}</p>
            </div>

            <button className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
              Apply Strategy <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CUSTOMER SENTIMENT */}
        <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-50 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Customer Sentiment</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">AI-Powered review analysis</p>
            </div>
            <Smile className="h-8 w-8 text-indigo-600" />
          </div>

          <div className="flex items-center gap-12">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-slate-100" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="80" cy="80" r="70" 
                  className="stroke-indigo-600" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray={440} 
                  strokeDashoffset={440 - (440 * 85) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900">85%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Positive</span>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {[
                { label: 'Satisfaction', val: 92, color: 'bg-green-500' },
                { label: 'Reliability', val: 78, color: 'bg-blue-500' },
                { label: 'Quality', val: 88, color: 'bg-indigo-500' },
              ].map(item => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-slate-900">{item.val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERFORMANCE INSIGHTS (UPGRADED) */}
        <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-50 shadow-xl shadow-slate-200/40 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <Layers className="h-10 w-10 text-indigo-50 opacity-50 group-hover:rotate-12 transition-transform" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Performance Insights</h3>
          <div className="space-y-4">
            {[
              { text: "Sales velocity has spiked 15% in 'Smartphones'.", level: "High Impact" },
              { text: "Conversion path 'Mobile View' is performing 30% better.", level: "Insight" },
              { text: "Customer retention reached an all-time high of 68%.", level: "Milestone" },
              { text: "Stock levels for 'Laptops' are critically low.", level: "Urgent" },
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] hover:bg-indigo-50/50 hover:border-indigo-100 border-2 border-transparent transition-all">
                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
                   <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{tip.text}</p>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{tip.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
