import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import { Users, Search, Plus, ShieldAlert } from 'lucide-react';
import api from '../api';

export function UsersList() {
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    organization_id: '',
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'manager'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resUsers, resOrgs, resRoles] = await Promise.all([
        api.get('/users'),
        api.get('/organizations'),
        api.get('/roles')
      ]);
      setUsers(resUsers.data);
      setOrgs(resOrgs.data);
      setRoles(resRoles.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.organization_id) {
       alert("Please select an organization!");
       return;
    }
    try {
      await api.post('/users', formData);
      setShowForm(false);
      setFormData({
        organization_id: '',
        full_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'manager'
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to add user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-200 tracking-tight">System Users</h2>
           <p className="text-slate-400 text-sm mt-1">Manage platform access, roles, and administrative permissions.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg">
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Invite User'}
        </button>
      </div>

      {showForm && (
        <Card className="bg-slate-900 border-slate-800 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <select required className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.organization_id} onChange={e => setFormData({...formData, organization_id: e.target.value})}>
              <option value="">-- Select Organization --</option>
              {orgs.map(o => <option key={o.organization_id} value={o.organization_id}>{o.name}</option>)}
            </select>
            <input required placeholder="Full Name" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
            <input required type="email" placeholder="Email Address" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required placeholder="Phone Number" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input required type="password" placeholder="User Password" title="For new account access" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            <select className="bg-slate-950 border border-slate-800 p-2 rounded text-white capitalize" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              {roles.map(r => (
                <option key={r.role_id} value={r.role_name}>{r.role_name.replace('_', ' ')}</option>
              ))}
            </select>
            <button type="submit" className="bg-blue-600 p-2 rounded text-white font-semibold">Invite User Account</button>
            <p className="text-xs text-slate-500 mt-1">Leave password blank for default: password123</p>
          </form>
        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
           <div className="relative w-full max-w-sm">
             <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
             <input type="text" placeholder="Search users by name or email..." className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
           </div>
        </div>
        <CardContent className="p-0 overflow-x-auto text-slate-300">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/50 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">System Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs uppercase border border-slate-700">
                      {user.full_name.slice(0, 2)}
                    </div>
                    {user.full_name}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{user.email}</td>
                  <td className="px-6 py-4 text-slate-400">{user.org_name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs border bg-slate-800 text-slate-300 border-slate-700">
                       {user.role_name || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
