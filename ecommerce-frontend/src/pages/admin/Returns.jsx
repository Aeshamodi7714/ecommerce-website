import { useState, useEffect } from 'react';
import { 
  RotateCcw, Search, CheckCircle2, XCircle, Clock, 
  MessageSquare, RefreshCw, AlertCircle, Trash2, ArrowRight
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Returns = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/order/admin/all');
      // Filter only orders with return requests
      const returnRequests = (data.orders || []).filter(o => o.returnRequest && o.returnRequest.status !== 'none');
      setRequests(returnRequests);
    } catch (error) {
      toast.error('Failed to fetch return requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReturnAction = async (orderId, action) => {
    try {
      await axiosInstance.put(`/order/status/${orderId}`, { 
        'returnRequest.status': action,
        status: action === 'approved' ? 'returned' : 'delivered' // If rejected, it stays delivered
      });
      setRequests(requests.map(r => r._id === orderId ? { 
        ...r, 
        returnRequest: { ...r.returnRequest, status: action },
        status: action === 'approved' ? 'returned' : 'delivered'
      } : r));
      toast.success(`Request ${action} successfully`);
      setSelectedRequest(null);
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const filteredRequests = requests.filter(r => 
    r._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Return Management</h1>
          <p className="text-slate-500 font-medium">Review and process customer return and refund requests.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Requests</p>
          <p className="text-4xl font-black text-slate-900">{requests.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Review</p>
          <p className="text-4xl font-black text-amber-500">{requests.filter(r => r.returnRequest.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Approved</p>
          <p className="text-4xl font-black text-emerald-500">{requests.filter(r => r.returnRequest.status === 'approved').length}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Refund Total</p>
          <p className="text-4xl font-black text-slate-900">
            ${requests.filter(r => r.returnRequest.status === 'approved').reduce((acc, r) => acc + r.totalbill, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-[2rem] border-2 border-slate-50 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer Name..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <RotateCcw className="h-16 w-16 animate-spin-slow" />
                      <p className="font-black uppercase tracking-widest text-xs">No return requests found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedRequest(req)}>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900">#{req._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${req.totalbill}</p>
                    </td>
                    <td className="px-8 py-6">
                       <span className="font-bold text-slate-900">{req.userId?.username || 'Guest User'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-600 line-clamp-1">{req.returnRequest.reason}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        req.returnRequest.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        req.returnRequest.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {req.returnRequest.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedRequest(null)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-scale-up">
            <div className="p-10 border-b border-slate-50 bg-slate-50/50">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <RotateCcw className="h-7 w-7" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-slate-900">Review Request</h2>
                        <p className="text-sm font-bold text-slate-400 tracking-tight">Order #{selectedRequest._id.toUpperCase()}</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedRequest(null)} className="h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                    <XCircle className="h-6 w-6" />
                  </button>
               </div>
            </div>

            <div className="p-10 space-y-8">
               <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Customer Reason</p>
                  <p className="text-lg font-bold text-slate-700 leading-relaxed italic">"{selectedRequest.returnRequest.reason}"</p>
               </div>

               <div className="flex items-center gap-8 px-4">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Refund Amount</p>
                      <p className="text-2xl font-black text-slate-900">${selectedRequest.totalbill}</p>
                   </div>
                   <div className="h-10 w-[1px] bg-slate-100"></div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                      <span className="font-bold text-slate-900">{selectedRequest.userId?.username || 'Guest User'}</span>
                   </div>
               </div>

               {selectedRequest.returnRequest.status === 'pending' && (
                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => handleReturnAction(selectedRequest._id, 'rejected')}
                      className="px-8 py-5 bg-red-50 text-red-600 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      Reject Request
                    </button>
                    <button 
                      onClick={() => handleReturnAction(selectedRequest._id, 'approved')}
                      className="px-8 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                      Approve & Refund
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Returns;
