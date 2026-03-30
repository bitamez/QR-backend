import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import { Shield, Plus, Trash2 } from 'lucide-react';
import api from '../api';

export function RolesList() {
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ role_name: '', description: '' });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/roles', formData);
      setShowForm(false);
      setFormData({ role_name: '', description: '' });
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert('Failed to add role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-200 tracking-tight">System Roles</h2>
           <p className="text-slate-400 text-sm mt-1">Define and manage dynamic system permissions and access levels.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg">
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Create Role'}
        </button>
      </div>

      {showForm && (
        <Card className="bg-slate-900 border-slate-800 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input required placeholder="Role Name (e.g., supervisor)" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.role_name} onChange={e => setFormData({...formData, role_name: e.target.value.toLowerCase().replace(' ', '_')})} />
            <textarea placeholder="Role Description" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <button type="submit" className="bg-blue-600 p-2 rounded text-white font-semibold">Save Role</button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.role_id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-900/20 border border-blue-900/50 flex items-center justify-center text-blue-500">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-slate-100 font-bold capitalize">{role.role_name.replace('_', ' ')}</h3>
                <p className="text-slate-400 text-xs mt-1">{role.description || 'No description provided.'}</p>
                <div className="mt-4 flex items-center justify-between">
                   <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">ID: {role.role_id}</span>
                   {/* Prevent deleting core roles if needed */}
                   {!['super_admin', 'manager', 'coordinator'].includes(role.role_name) && (
                     <button className="text-red-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                   )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
