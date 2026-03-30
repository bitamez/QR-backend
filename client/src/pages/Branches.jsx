import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import { MapPin, Search, Plus, X, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api';

export function Branches() {
  const [branches, setBranches] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  
  const [selectedBranch, setSelectedBranch] = useState(null); 
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', organization_id: '', latitude: '', longitude: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resBranches, resOrgs, resQrCodes] = await Promise.all([
        api.get('/branches'),
        api.get('/organizations'),
        api.get('/qrcodes')
      ]);
      setBranches(resBranches.data);
      setOrgs(resOrgs.data);
      setQrCodes(resQrCodes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.organization_id) {
         alert("Please select an organization!");
         return;
      }
      await api.post('/branches', formData);
      setShowForm(false);
      setFormData({ name: '', address: '', organization_id: '', latitude: '', longitude: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to add branch');
    }
  };

  const handleGenerateQR = async (branch_id) => {
    try {
      const uniqueSlug = `QR-${branch_id}-${Date.now()}`;
      await api.post('/qrcodes', {
        qr_code_value: uniqueSlug,
        branch_id: branch_id,
        service_id: null
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to generate QR Code');
    }
  };

  const getOrgName = (id) => {
    const org = orgs.find(o => o.organization_id === id);
    return org ? org.name : 'Unknown';
  };

  const getBranchQR = (branch_id) => {
    return qrCodes.find(qr => qr.branch_id === branch_id);
  };

  // Get current hostname for displaying QR links if scanning locally
  const baseUrl = window.location.origin;

  return (
    <div className="space-y-6 flex flex-col relative h-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-200 tracking-tight">Branches Database</h2>
           <p className="text-slate-400 text-sm mt-1">Configure physical branch locations and kiosks.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg">
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Branch'}
        </button>
      </div>

      {showForm && (
        <Card className="bg-slate-900 border-slate-800 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select required className="bg-slate-950 border border-slate-800 p-2 rounded text-white sm:col-span-2" value={formData.organization_id} onChange={e => setFormData({...formData, organization_id: e.target.value})}>
                <option value="">-- Select Organization --</option>
                {orgs.map(o => <option key={o.organization_id} value={o.organization_id}>{o.name}</option>)}
              </select>
              <input required placeholder="Branch Name" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Address / Location" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <input placeholder="Latitude" type="number" step="any" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
              <input placeholder="Longitude" type="number" step="any" className="bg-slate-950 border border-slate-800 p-2 rounded text-white" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
            </div>
            <button type="submit" className="bg-blue-600 p-2 rounded text-white font-semibold mt-2">Save Branch</button>
          </form>
        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
           <div className="relative w-full max-sm:mb-4 sm:max-w-sm">
             <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
             <input type="text" placeholder="Search branches..." className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
           </div>
        </div>
        <CardContent className="p-0 overflow-x-auto text-slate-300">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/50 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Branch Name</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Coordinates</th>
                <th className="px-6 py-4 text-right">QR Setup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {branches.map((branch) => {
                const qr = getBranchQR(branch.branch_id);
                return (
                  <tr key={branch.branch_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-orange-900/20 border border-orange-900/50 flex items-center justify-center text-orange-500"><MapPin className="w-4 h-4" /></div>
                      {branch.name}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{getOrgName(branch.organization_id)}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {branch.latitude ? `${branch.latitude}, ${branch.longitude}` : 'No Coordinates'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedBranch(branch)}
                        className={`text-sm font-medium border px-3 py-1 rounded transition-colors flex items-center gap-2 ml-auto ${qr ? 'border-green-900/50 bg-green-900/20 text-green-400 hover:text-green-300' : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:text-white'}`}
                      >
                        <QrCode className="w-4 h-4" />
                        {qr ? 'View QR' : 'Setup QR'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* QR Code Modal Overlay */}
      {selectedBranch && (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedBranch(null)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-100 mb-1">{selectedBranch.name}</h3>
            <p className="text-sm text-slate-400 mb-6 text-center">Branch Feedback QR code deployment.</p>
            
            {(() => {
              const qr = getBranchQR(selectedBranch.branch_id);
              if (qr) {
                const scanUrl = `${baseUrl}/scan/${qr.qr_code_value}`;
                return (
                  <>
                    <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
                      <QRCodeSVG 
                        value={scanUrl} 
                        size={220}
                        fgColor="#0f172a"
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="w-full">
                      <p className="text-xs uppercase font-semibold text-slate-500 mb-2">Direct Link</p>
                      <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 break-all select-all font-mono">
                        {scanUrl}
                      </div>
                    </div>
                    <button 
                      onClick={() => { window.open(scanUrl, '_blank') }}
                      className="mt-6 w-full py-2.5 bg-green-600/20 text-green-500 hover:bg-green-600/30 border border-green-900/50 rounded-lg font-medium transition-colors"
                    >
                      Test Form Experience
                    </button>
                  </>
                );
              } else {
                return (
                  <div className="flex flex-col items-center w-full py-8">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <QrCode className="w-10 h-10 text-slate-600" />
                    </div>
                    <p className="text-slate-400 text-smtext-center mb-6">No QR code generated for this branch yet.</p>
                    <button 
                      onClick={() => handleGenerateQR(selectedBranch.branch_id)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
                    >
                      Generate New QR Link
                    </button>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
