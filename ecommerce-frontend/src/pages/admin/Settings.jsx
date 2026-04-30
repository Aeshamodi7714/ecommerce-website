import { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Store, Globe, Bell, Shield, Save, Mail, Phone, MapPin } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, changePassword } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'ElectroHub Premium',
    supportEmail: 'support@electrohub.com',
    currency: 'USD ($)',
    timezone: 'GMT+5:30',
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(profileForm));
    if (updateProfile.fulfilled.match(result)) toast.success('Profile Updated!');
  };

  const handleChangePass = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast.error('Passwords mismatch');
    const result = await dispatch(changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword }));
    if (changePassword.fulfilled.match(result)) {
        toast.success('Password Changed!');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const tabs = [
    { id: 'profile', title: 'Admin Profile', icon: <User className="h-4 w-4" /> },
    { id: 'security', title: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'store', title: 'Store Settings', icon: <Store className="h-4 w-4" /> },
    { id: 'notifications', title: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium text-sm">Configure your admin profile and store preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-72 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {tab.icon} {tab.title}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
            
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-20 w-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-3xl font-black text-slate-400">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Personal Information</h3>
                    <p className="text-sm font-medium text-slate-400">Manage your administrative profile details.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end border-t border-slate-50">
                  <button type="submit" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl">
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleChangePass} className="space-y-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900">Security Credentials</h3>
                    <p className="text-sm font-medium text-slate-400">Update your password to keep your account secure.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input 
                        type="password"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">New Password</label>
                      <input 
                        type="password"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm New Password</label>
                      <input 
                        type="password"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end border-t border-slate-50">
                  <button type="submit" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl">
                    <Shield className="h-4 w-4" /> Update Password
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'store' && (
              <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900">General Store Configuration</h3>
                    <p className="text-sm font-medium text-slate-400">Basic settings for the ElectroHub storefront.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Store Name</label>
                    <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900" value={storeSettings.storeName} disabled />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Support Email</label>
                    <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900" value={storeSettings.supportEmail} disabled />
                  </div>
                </div>
                <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl">
                   <p className="text-sm font-bold text-orange-800 leading-relaxed flex items-center gap-2">
                     <Info className="h-5 w-5" /> Some settings are locked and can only be modified by the System Administrator.
                   </p>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
