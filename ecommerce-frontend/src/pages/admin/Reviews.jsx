import { useState, useEffect } from 'react';
import { Star, Trash2, Search, Filter, MessageSquare, Package, User, StarHalf, TrendingUp, ThumbsUp, AlertCircle } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get('/admin/all/reviews');
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axiosInstance.delete(`/admin/review/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
      toast.success('Review deleted successfully');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      (r.productId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.comment || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.userId?.username || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === 'all' || r.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  });

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Reviews</h1>
          <p className="text-slate-500 font-medium">Moderate and monitor product feedback across the store.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
            <Search className="h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by product or text..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-bold w-64 text-slate-700" 
            />
          </div>
          <div className="relative">
            <select 
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="appearance-none bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 outline-none hover:border-blue-500 cursor-pointer transition-all pr-12 shadow-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center gap-5">
          <div className="w-14 h-14 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center">
            <Star className="h-7 w-7 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Rating</p>
            <p className="text-2xl font-black text-slate-900">{avgRating} / 5.0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <MessageSquare className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reviews</p>
            <p className="text-2xl font-black text-slate-900">{reviews.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Positive (4-5★)</p>
            <p className="text-2xl font-black text-slate-900">{reviews.filter(r => r.rating >= 4).length}</p>
          </div>
        </div>
      </div>

      {/* ── REVIEWS MASONRY / GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-[2.5rem] h-64 border border-slate-100"></div>
          ))
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((r) => (
            <div key={r._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/10 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group relative overflow-hidden flex flex-col">
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 ${r.rating >= 4 ? 'bg-green-500' : r.rating <= 2 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>

              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 p-2 flex items-center justify-center border border-slate-100">
                    {r.productId?.image ? (
                      <img src={r.productId.image} className="w-full h-full object-contain" alt="product" />
                    ) : (
                      <Package className="h-6 w-6 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate max-w-[200px]">
                      {r.productId?.name || 'Unknown Product'}
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Review ID: #{r._id.slice(-6)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  <span className="text-sm font-black text-slate-900">{r.rating}</span>
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                </div>
              </div>

              <div className="flex-1">
                <div className="relative mb-6">
                  <MessageSquare className="absolute -left-2 -top-2 h-10 w-10 text-slate-50 -z-10 group-hover:text-blue-50 transition-colors" />
                  <p className="text-slate-600 font-medium italic leading-relaxed pl-2">
                    "{r.comment}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/30">
                    {(r.userId?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{r.userId?.username || 'Guest'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(r._id)}
                  className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                  title="Delete Review"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No reviews found</h3>
            <p className="text-slate-500 font-bold mt-2">Adjust your search or filter to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
