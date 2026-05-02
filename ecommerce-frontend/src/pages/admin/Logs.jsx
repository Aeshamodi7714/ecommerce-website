import { useState, useEffect } from 'react';
import { 
  History, Search, Shield, Database, CreditCard, 
  Settings, Download, Trash2, Filter, RefreshCw,
  Terminal, Activity, Globe, Zap, CheckCircle2
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/logs');
      setLogs(data.logs || []);
    } catch (error) {
      toast.error('Failed to fetch system logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.eventType === filter;
    const actionMatch = (log.action || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (log.adminEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && (actionMatch || emailMatch);
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Telemetry</h1>
          <p className="text-slate-500 font-medium">Real-time activity logs and security monitoring.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-900 transition-all">
              <Download className="h-4 w-4" /> Export Logs
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all">
              <Trash2 className="h-4 w-4" /> Clear History
           </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search by user, action or IP..."
             className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
           {['all', 'security', 'inventory', 'finance'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* Terminal View */}
      <div className="bg-[#0f172a] rounded-[3.5rem] border-8 border-slate-900 shadow-2xl overflow-hidden relative group">
         <div className="bg-slate-900 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
               </div>
               <div className="h-4 w-px bg-slate-800 mx-2"></div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Terminal className="h-3 w-3" /> Live Stream Output
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-800/50">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Event Type</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin / User</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Action Details</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">IP Address</th>
                  </tr>
               </thead>
               <tbody className="text-slate-300 font-mono text-xs">
                  {filteredLogs.map((log) => (
                     <tr key={log._id} className="border-b border-slate-800/30 hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                                log.eventType === 'security' ? 'bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]' :
                                log.eventType === 'inventory' ? 'bg-blue-500/10 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]' :
                                'bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                              }`}>
                                 {log.eventType === 'security' ? <Shield className="h-5 w-5" /> : 
                                  log.eventType === 'inventory' ? <Database className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                              </div>
                              <span className="font-black uppercase tracking-widest text-[10px]">{log.eventType}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 font-bold opacity-60">
                           {log.adminEmail}
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              <span className="font-bold">{log.action}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 opacity-60">
                           {new Date(log.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="px-10 py-6 opacity-40">
                           {log.ipAddress}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Backdrop effect */}
         <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Logs;
