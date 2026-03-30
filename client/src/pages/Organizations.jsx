import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import { Building2, Search, Plus } from 'lucide-react';
import api from '../api';

export function Organizations() {
  const [orgs, setOrgs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', latitude: '', longitude: '' });

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    try {
      const res = await api.get('/organizations');
      setOrgs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/organizations', formData);
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', address: '', latitude: '', longitude: '' });
      fetchOrgs();
    } catch (err) {
      console.error(err);
      alert('Failed to add organization');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-200 tracking-tight">Organizations</h2>
           <p className="text-slate-400 text-sm mt-1">Manage global client organizations and tenants.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg">
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Organization'}
        </button>
      </div>

      {showForm && (
        <Card className="bg-slate-900 border-slate-800 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input required placeholder="Name" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Email" type="email" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input placeholder="Phone" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input placeholder="Address" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <input placeholder="Latitude" type="number" step="any" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
              <input placeholder="Longitude" type="number" step="any" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
            </div>
            <button type="submit" className="bg-blue-600 p-2 rounded text-white font-semibold">Save</button>
          </form>
        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
           <div className="relative w-full max-w-sm">
             <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
             <input type="text" placeholder="Search organizations..." className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
           </div>
        </div>
        <CardContent className="p-0 overflow-x-auto text-slate-300">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/50 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Organization Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Coordinates</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {orgs.map((org) => (
                <tr key={org.organization_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-blue-400"><Building2 className="w-4 h-4" /></div>
                    {org.name}
                  </td>
                  <td className="px-6 py-4">{org.email || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {org.latitude ? `${org.latitude}, ${org.longitude}` : 'No Coordinates'}
                  </td>
                  <td className="px-6 py-4 text-slate-400 tabular-nums">{new Date(org.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
