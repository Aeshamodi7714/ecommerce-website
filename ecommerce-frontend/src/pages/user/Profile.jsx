import { useSelector } from 'react-redux';
import { User, Mail, Shield, Calendar, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8">My Profile</h1>
      
      <div className="card p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
          <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-slate-500">{user?.email}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">
                {user?.role || 'Customer'}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                Active Member
              </span>
            </div>
          </div>
          <button className="btn-secondary py-2 px-6 rounded-xl flex items-center gap-2">
            <Edit2 className="h-4 w-4" /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Full Name</p>
                <p className="font-semibold">{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Shield className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Account Role</p>
                <p className="font-semibold capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Calendar className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Joined On</p>
                <p className="font-semibold">April 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
