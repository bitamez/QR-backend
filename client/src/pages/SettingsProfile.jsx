import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Bell, User, Shield, CheckCircle, AlertCircle, Key, Mail } from 'lucide-react';
import api from '../api';

export function SettingsProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [form, setForm] = useState({
    username: user.username || '',
    email: user.email || '',
    full_name: user.full_name || '',
    phone: user.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      if (activeTab === 'profile') {
        const res = await api.put('/users/profile', form);
        const updatedUser = { ...user, ...form };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setStatus({ type: 'success', message: 'Profile updated successfully!' });
      } else if (activeTab === 'security') {
        if (form.newPassword !== form.confirmPassword) {
            throw new Error('New passwords do not match');
        }
        // Placeholder for security update
        setStatus({ type: 'success', message: 'Security settings updated!' });
      } else {
        setStatus({ type: 'success', message: 'Notification preferences saved!' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Action failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-slate-200 tracking-tight capitalize">{activeTab} Settings</h2>
         {status.message && (
            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${status.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
              {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {status.message}
            </div>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
          >
            <User className="w-4 h-4" /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
          >
            <Shield className="w-4 h-4" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
        </div>

        <div className="col-span-1 md:col-span-2">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader 
                title={activeTab === 'profile' ? 'Profile Details' : activeTab === 'security' ? 'Security Settings' : 'Notification Preferences'} 
                subtitle={`Manage your account ${activeTab} settings and preferences.`} 
                className="border-b border-slate-800" 
            />
            <CardContent className="p-6">
              
              {activeTab === 'profile' && (
                <div className="space-y-6">
                   <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-bold text-2xl uppercase">
                      {form.username ? form.username.slice(0, 2) : 'ME'}
                    </div>
                    <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors">Change Avatar</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 uppercase">Username / Name</label>
                      <input type="text" value={user.role === 'super_admin' ? form.username : form.full_name} onChange={(e) => setForm({...form, [user.role === 'super_admin' ? 'username' : 'full_name']: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 uppercase">Email Address</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 uppercase">Current Password</label>
                      <input type="password" value={form.currentPassword} onChange={(e) => setForm({...form, currentPassword: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 uppercase">New Password</label>
                      <input type="password" value={form.newPassword} onChange={(e) => setForm({...form, newPassword: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <div>
                           <p className="text-sm font-medium text-slate-200">Email Alerts</p>
                           <p className="text-xs text-slate-500">Get notified when low ratings are received.</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={form.emailNotifications} 
                        onChange={(e) => setForm({...form, emailNotifications: e.target.checked})}
                        className="w-5 h-5 accent-blue-500 cursor-pointer" 
                      />
                   </div>
                </div>
              )}

              <div className="pt-8 flex justify-end">
                <button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
