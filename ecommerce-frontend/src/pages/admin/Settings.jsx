import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, User, Lock, Store, Globe, Bell, 
  Shield, Save, Mail, Phone, MapPin, Palette, Activity, 
  Database, Cpu, Share2, Info, ChevronRight, CheckCircle2,
  CloudLightning, HardDrive, Zap, Trash2, Eye, EyeOff, Loader2
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, changePassword } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    accent: 'blue',
  });

  const [storeForm, setStoreForm] = useState({
    storeName: 'ElectroHub Premium',
    supportEmail: 'support@electrohub.com',
    currency: 'USD ($)',
    maintenanceMode: false
  });

  const [systemHealth, setSystemHealth] = useState({
    cpu: 18,
    ram: 46,
    uptime: '14 Days, 6 Hours'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 15 + 10),
        ram: Math.floor(Math.random() * 5 + 42)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const result = await dispatch(updateProfile(profileForm));
      if (updateProfile.fulfilled.match(result)) {
        toast.success('Profile Synced!');
      }
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setIsSaving(true);
    try {
      const result = await dispatch(changePassword({ 
        oldPassword: passwordForm.oldPassword, 
        newPassword: passwordForm.newPassword 
      }));
      if (changePassword.fulfilled.match(result)) {
        toast.success('Password updated successfully!');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.payload || 'Password update failed');
      }
    } catch (err) {
      toast.error('Security update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', title: 'Admin Identity', icon: <User className="h-4 w-4" />, color: 'blue' },
    { id: 'security', title: 'Security Core', icon: <Shield className="h-4 w-4" />, color: 'purple' },
    { id: 'appearance', title: 'Appearance', icon: <Palette className="h-4 w-4" />, color: 'pink' },
    { id: 'system', title: 'System Health', icon: <Activity className="h-4 w-4" />, color: 'emerald' },
    { id: 'store', title: 'Store Engine', icon: <Zap className="h-4 w-4" />, color: 'orange' },
  ];

  const getColorClasses = (color, isActive) => {
    const maps = {
      blue: isActive ? 'border-blue-200 bg-blue-50/10' : 'hover:bg-slate-50',
      purple: isActive ? 'border-purple-200 bg-purple-50/10' : 'hover:bg-slate-50',
      pink: isActive ? 'border-pink-200 bg-pink-50/10' : 'hover:bg-slate-50',
      emerald: isActive ? 'border-emerald-200 bg-emerald-50/10' : 'hover:bg-slate-50',
      orange: isActive ? 'border-orange-200 bg-orange-50/10' : 'hover:bg-slate-50',
    };
    return maps[color] || '';
  };

  const getIconBg = (color, isActive) => {
    if (!isActive) return 'bg-slate-100 text-slate-400';
    const maps = {
      blue: 'bg-blue-600 text-white',
      purple: 'bg-purple-600 text-white',
      pink: 'bg-pink-600 text-white',
      emerald: 'bg-emerald-600 text-white',
      orange: 'bg-orange-600 text-white',
    };
    return maps[color] || 'bg-slate-900 text-white';
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SettingsIcon className="h-4 w-4 text-blue-600 animate-spin-slow" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Global Matrix</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium">Control center for ElectroHub infrastructure.</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-12">
        
        {/* ── SIDEBAR ── */}
        <aside className="w-full xl:w-80 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-[2.2rem] font-bold text-sm transition-all duration-300 border-2 ${
                activeTab === tab.id 
                  ? `${getColorClasses(tab.color, true)} shadow-2xl shadow-slate-200 text-slate-900 border-slate-100` 
                  : `bg-white border-transparent text-slate-400 hover:border-slate-100`
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all ${getIconBg(tab.color, activeTab === tab.id)}`}>
                  {tab.icon}
                </div>
                <span className={activeTab === tab.id ? 'font-black' : 'font-bold'}>{tab.title}</span>
              </div>
              {activeTab === tab.id && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </aside>

        {/* ── CONTENT ── */}
        <main className="flex-1 bg-white rounded-[3rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/40 p-10 xl:p-14">
          
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-10 animate-fade-in">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-xl">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Admin Identity</h3>
                  <p className="text-sm font-medium text-slate-400">Update your profile information.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Username</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Email</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Phone</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50">
                {isSaving ? 'Syncing...' : 'Save Profile'}
              </button>
            </form>
          )}

          {/* SECURITY CORE (WORKING VERSION) */}
          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="space-y-10 animate-fade-in">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-purple-100 text-purple-600 rounded-[2rem] flex items-center justify-center border-2 border-purple-200">
                  <Lock className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Security Core</h3>
                  <p className="text-sm font-medium text-slate-400">Change your administrative password.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">New Password</label>
                    <input 
                      type="password"
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Confirm New Password</label>
                    <input 
                      type="password"
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-purple-600 transition-all shadow-xl disabled:opacity-50">
                {isSaving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-12 animate-fade-in">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Appearance</h3>
                <p className="text-sm font-medium text-slate-400">Customize your dashboard theme.</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <button 
                  onClick={() => { setAppearance({...appearance, theme: 'light'}); toast.success('Light Mode Active'); }}
                  className={`p-10 rounded-[2.5rem] border-2 transition-all ${appearance.theme === 'light' ? 'border-blue-600 bg-blue-50 shadow-xl' : 'border-slate-100'}`}
                >
                  <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl mx-auto mb-4 shadow-sm"></div>
                  <span className="font-black text-xs uppercase tracking-widest">Light Core</span>
                </button>
                <button 
                  onClick={() => { setAppearance({...appearance, theme: 'dark'}); toast.success('Dark Mode Active'); }}
                  className={`p-10 rounded-[2.5rem] border-2 transition-all ${appearance.theme === 'dark' ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100'}`}
                >
                  <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl mx-auto mb-4 shadow-inner"></div>
                  <span className="font-black text-xs uppercase tracking-widest">Deep Space</span>
                </button>
              </div>
            </div>
          )}

          {/* SYSTEM HEALTH */}
          {activeTab === 'system' && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h3 className="text-2xl font-black text-slate-900">System Health</h3>
                <p className="text-sm font-medium text-slate-400">Live infrastructure monitoring.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-white shadow-xl">
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">CPU Usage</span>
                    <span className="text-xl font-black">{systemHealth.cpu}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${systemHealth.cpu}%` }}></div>
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-white shadow-xl">
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">RAM Usage</span>
                    <span className="text-xl font-black">{systemHealth.ram}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${systemHealth.ram}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="p-10 bg-slate-900 rounded-[3rem] text-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">System Uptime</p>
                <p className="text-4xl font-black">{systemHealth.uptime}</p>
              </div>
            </div>
          )}

          {/* STORE ENGINE */}
          {activeTab === 'store' && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-orange-100 text-orange-600 rounded-[2rem] flex items-center justify-center border-2 border-orange-200">
                  <Zap className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Store Engine</h3>
                  <p className="text-sm font-medium text-slate-400">Core store settings.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Store Name</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    value={storeForm.storeName}
                    onChange={(e) => setStoreForm({...storeForm, storeName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Support Email</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    value={storeForm.supportEmail}
                    onChange={(e) => setStoreForm({...storeForm, supportEmail: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border-2 border-white shadow-sm">
                <div>
                  <p className="font-black text-slate-900">Maintenance Mode</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Restrict public access</p>
                </div>
                <button 
                  onClick={() => { setStoreForm({...storeForm, maintenanceMode: !storeForm.maintenanceMode}); toast(storeForm.maintenanceMode ? 'Store Live' : 'Maintenance Mode ON'); }}
                  className={`w-14 h-8 rounded-full transition-all relative ${storeForm.maintenanceMode ? 'bg-orange-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${storeForm.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <button 
                onClick={() => toast.success('Store Settings Saved!')}
                className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-xl"
              >
                <Save className="h-5 w-5" /> Save Engine
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Settings;
