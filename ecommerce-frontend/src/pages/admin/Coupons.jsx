import { useState } from 'react';
import { Zap, Plus, Trash2, Calendar, Tag, DollarSign, Percent, Info, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Coupons = () => {
  const [coupons, setCoupons] = useState([
    { _id: 'c1', code: 'WELCOME10', type: 'percentage', value: 10, expiry: '2024-12-31', minOrder: 50, usageCount: 145 },
    { _id: 'c2', code: 'FLAT50', type: 'fixed', value: 50, expiry: '2024-06-15', minOrder: 500, usageCount: 22 },
    { _id: 'c3', code: 'SUMMER24', type: 'percentage', value: 20, expiry: '2024-08-30', minOrder: 100, usageCount: 0 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketing Coupons</h1>
          <p className="text-slate-500 font-medium text-sm">Create and manage discount codes for your customers.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.map((c) => (
          <div key={c._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 -mr-12 -mt-12 rounded-full"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-sm tracking-widest border border-blue-100">
                {c.code}
              </div>
              <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-black text-slate-900">
                  {c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}
                </h2>
                <span className="text-slate-400 font-bold mb-1 uppercase tracking-widest text-[10px]">Discount</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiry</p>
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {c.expiry}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Min Order</p>
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> ${c.minOrder}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                </div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  Used {c.usageCount} times
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coupons;
