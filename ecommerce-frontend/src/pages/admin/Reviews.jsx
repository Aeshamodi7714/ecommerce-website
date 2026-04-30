import { useState, useEffect } from 'react';
import { Star, Trash2, Search, Filter, MessageSquare, Package, User } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fallback dummy data
        const dummy = [
          { _id: 'r1', product: 'iPhone 15 Pro', user: 'Nick G.', rating: 5, comment: 'Amazing performance and camera. Best iPhone yet!', date: '2024-03-22' },
          { _id: 'r2', product: 'MacBook Air M2', user: 'Sarah K.', rating: 4, comment: 'Lightweight and fast, but missing some ports.', date: '2024-03-20' },
          { _id: 'r3', product: 'AirPods Pro', user: 'Alex M.', rating: 2, comment: 'Connectivity issues after 2 weeks. Disappointed.', date: '2024-03-18' },
        ];
        setReviews(dummy);
      } catch (err) {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Reviews</h1>
          <p className="text-slate-500 font-medium text-sm">Monitor and moderate customer feedback.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search reviews..." className="bg-transparent border-none outline-none text-sm font-bold w-48" />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-20 text-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : reviews.map((r) => (
          <div key={r._id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-4 w-4 ${i <= r.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">{r.date}</span>
                </div>
                
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" /> "{r.comment}"
                </h3>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Package className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{r.product}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{r.user}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center md:items-start justify-end gap-2">
                <button 
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100"
                  onClick={() => toast.success('Review deleted')}
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
