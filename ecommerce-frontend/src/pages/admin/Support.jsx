import { useState, useEffect } from 'react';
import { 
  LifeBuoy, Search, Filter, MessageCircle, Clock, 
  CheckCircle2, XCircle, MoreVertical, Send, User,
  Flag, Paperclip, Smile, ArrowLeft, RefreshCw
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchTickets = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/tickets');
      setTickets(data.tickets || []);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setIsSending(true);
    try {
      await axiosInstance.post(`/admin/ticket/${selectedTicket._id}/reply`, { message: reply });
      setReply('');
      fetchTickets();
      // Update local selected ticket
      setSelectedTicket({
        ...selectedTicket,
        responses: [...selectedTicket.responses, { sender: 'admin', message: reply, timestamp: new Date() }]
      });
      toast.success('Reply sent');
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await axiosInstance.put(`/admin/ticket/${id}/status`, { status: 'resolved' });
      setTickets(tickets.map(t => t._id === id ? { ...t, status: 'resolved' } : t));
      if (selectedTicket?._id === id) setSelectedTicket({ ...selectedTicket, status: 'resolved' });
      toast.success('Ticket resolved');
    } catch (error) {
      toast.error('Failed to resolve ticket');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-8 animate-fade-in overflow-hidden">
      
      {/* Ticket Sidebar */}
      <div className={`flex-1 md:w-96 flex flex-col gap-6 overflow-hidden ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Support Desk</h1>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">Manage customer resolutions.</p>
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-pulse">
              {tickets.filter(t => t.status === 'open').length} New
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tickets..."
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {tickets.length === 0 ? (
            <div className="p-10 text-center text-slate-300">
               <p className="font-bold uppercase tracking-widest text-xs">No tickets found</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div 
                key={ticket._id} 
                onClick={() => setSelectedTicket(ticket)}
                className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group ${
                  selectedTicket?._id === ticket._id ? 'bg-slate-900 border-slate-900 shadow-2xl' : 'bg-white border-slate-50 hover:border-slate-100 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                    ticket.priority === 'high' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {ticket.priority} Priority
                  </span>
                  <p className="text-[10px] font-bold text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
                <h3 className={`font-bold leading-tight mb-2 group-hover:text-blue-500 transition-colors ${
                  selectedTicket?._id === ticket._id ? 'text-white' : 'text-slate-900'
                }`}>{ticket.subject}</h3>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
                    {ticket.userId?.username?.charAt(0) || 'G'}
                  </div>
                  <p className={`text-xs font-bold ${selectedTicket?._id === ticket._id ? 'text-slate-400' : 'text-slate-500'}`}>
                    {ticket.userId?.username || 'Guest'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket Chat Area */}
      <div className={`flex-[2] bg-white rounded-[3.5rem] border-2 border-slate-50 shadow-2xl flex flex-col overflow-hidden ${selectedTicket ? 'flex' : 'hidden md:flex'}`}>
        {selectedTicket ? (
          <>
            {/* Chat Header */}
            <header className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={() => setSelectedTicket(null)} className="md:hidden h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
                   <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                   <div className="flex items-center gap-3">
                      <h2 className="text-xl font-black text-slate-900">{selectedTicket.subject}</h2>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        #{selectedTicket._id.slice(-6).toUpperCase()}
                      </span>
                   </div>
                   <p className="text-sm font-medium text-slate-400 mt-1">Status: <span className="text-blue-500 uppercase">{selectedTicket.status}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 {selectedTicket.status !== 'resolved' && (
                   <button 
                     onClick={() => handleResolve(selectedTicket._id)}
                     className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                   >
                      Resolve
                   </button>
                 )}
                 <button className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                    <Flag className="h-5 w-5" />
                 </button>
              </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-slate-50/30">
               {/* Original Message */}
               <div className="flex gap-4">
                  <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 uppercase">
                    {selectedTicket.userId?.username?.charAt(0) || 'U'}
                  </div>
                  <div className="max-w-xl">
                     <div className="bg-white p-6 rounded-3xl rounded-tl-none shadow-sm border border-slate-100">
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {selectedTicket.message}
                        </p>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 mt-2 ml-1">{new Date(selectedTicket.createdAt).toLocaleTimeString()}</p>
                  </div>
               </div>

               {/* Responses */}
               {selectedTicket.responses.map((res, idx) => (
                 <div key={idx} className={`flex gap-4 ${res.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${res.sender === 'admin' ? 'bg-slate-900' : 'bg-blue-600'}`}>
                      {res.sender === 'admin' ? 'A' : (selectedTicket.userId?.username?.charAt(0) || 'U')}
                    </div>
                    <div className={`max-w-xl ${res.sender === 'admin' ? 'text-right' : ''}`}>
                       <div className={`p-6 rounded-3xl shadow-sm border ${res.sender === 'admin' ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'}`}>
                          <p className="font-medium leading-relaxed">{res.message}</p>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 mt-2">{new Date(res.timestamp).toLocaleTimeString()}</p>
                    </div>
                 </div>
               ))}
            </main>

            {/* Input Area */}
            <footer className="p-8 border-t border-slate-50">
               <form onSubmit={handleReply} className="bg-slate-50 rounded-[2rem] p-4 flex items-center gap-4">
                  <button type="button" className="h-12 w-12 text-slate-400 hover:text-blue-600 transition-colors">
                     <Paperclip className="h-5 w-5" />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Type your resolution message..."
                    className="flex-1 bg-transparent border-none outline-none font-bold text-sm"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <button type="button" className="h-12 w-12 text-slate-400 hover:text-amber-500 transition-colors">
                     <Smile className="h-5 w-5" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSending}
                    className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-slate-900 transition-all shadow-lg disabled:opacity-50"
                  >
                     {isSending ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                  </button>
               </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-slate-300">
             <div className="h-32 w-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-10 shadow-inner">
                <LifeBuoy className="h-16 w-16 opacity-20" />
             </div>
             <h2 className="text-2xl font-black text-slate-400 mb-2">Select a Ticket</h2>
             <p className="max-w-xs font-medium text-slate-400">Please select a customer query from the list to start resolving the issue.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Support;
