import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Shield, Calendar, Edit2, Package, LogOut, CheckCircle2, ChevronRight, X, Save, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, changePassword } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({ username: user?.username, email: user?.email });
    }
  };

  const handleSave = async () => {
    try {
      const result = await dispatch(updateProfile(formData));
      if (updateProfile.fulfilled.match(result)) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.payload || 'Update failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      const result = await dispatch(changePassword({ 
        oldPassword: passwordData.oldPassword, 
        newPassword: passwordData.newPassword 
      }));
      if (changePassword.fulfilled.match(result)) {
        toast.success('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.payload || 'Failed to change password');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 relative">
      
      {/* ── CHANGE PASSWORD MODAL ── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Old Password</label>
                <input 
                  type="password"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 mt-2 font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Password</label>
                <input 
                  type="password"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 mt-2 font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 mt-2 font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                <Lock className="h-5 w-5" /> Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Profile</h1>
            <p className="text-slate-500 font-medium">Manage your account settings and track your orders.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Package className="h-5 w-5" /> My Orders
            </button>
            <button 
              onClick={handleEditToggle}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                isEditing ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
              }`}
            >
              {isEditing ? <><X className="h-5 w-5" /> Cancel</> : <><Edit2 className="h-5 w-5" /> Edit Profile</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN: USER CARD ── */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-blue-800 opacity-5 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-32 h-32 rounded-[2.5rem] bg-blue-600 mx-auto mb-6 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/30 ring-8 ring-white transform group-hover:scale-105 transition-transform">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">{user?.username}</h2>
                <p className="text-slate-400 font-bold text-sm mb-6 uppercase tracking-widest">{user?.role || 'Valued Member'}</p>
                
                <div className="flex justify-center gap-2">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-wider">Premium</span>
                  <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-wider">Verified</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-2xl font-black">12</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Orders</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black">2</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">In Transit</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: DETAILS & EDIT ── */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-black text-slate-900 mb-8">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <User className="h-5 w-5 text-slate-400" />
                      <p className="font-bold text-slate-700">{user?.username}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <p className="font-bold text-slate-700">{user?.email}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Account Role</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                    <Shield className="h-5 w-5 text-slate-400" />
                    <p className="font-bold text-slate-700 capitalize">{user?.role}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Member Since</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <p className="font-bold text-slate-700">October 2024</p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:scale-105"
                  >
                    <Save className="h-5 w-5" /> Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => navigate('/orders')}
                className="group p-8 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-blue-200 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6" />
                </div>
                <h4 className="font-black text-slate-900 mb-1 flex items-center gap-2">
                  Order History <ChevronRight className="h-4 w-4 text-blue-600" />
                </h4>
                <p className="text-slate-400 text-xs font-bold leading-relaxed">Check status of your recent purchases.</p>
              </button>

              <button 
                onClick={() => setShowPasswordModal(true)}
                className="group p-8 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-orange-200 transition-all shadow-sm hover:shadow-xl hover:shadow-orange-500/5"
              >
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lock className="h-6 w-6" />
                </div>
                <h4 className="font-black text-slate-900 mb-1 flex items-center gap-2">
                  Security Settings <ChevronRight className="h-4 w-4 text-orange-600" />
                </h4>
                <p className="text-slate-400 text-xs font-bold leading-relaxed">Update your password and secure account.</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
