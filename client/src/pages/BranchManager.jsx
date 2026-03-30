import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/Card';
import api from '../api';

const defaultStats = {
  recentFeedback: [
    { date: '16 Aug 2026', customer: 'Jino Doe', rating: 4, comment: 'Cleanliness was excellent' },
    { date: '16 Aug 2026', customer: 'Ale Phasois', rating: 4, comment: 'Recent room assignment' },
    { date: '15 Aug 2026', customer: 'Bio Bee', rating: 4, comment: 'Quick entry response.' },
    { date: '13 Jan 2026', customer: 'Sen Sen', rating: 4, comment: 'Amazing staff detail.' },
  ]
};

export function BranchManager() {
  const [stats, setStats] = useState(defaultStats);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const branchId = user.branchId;

  useEffect(() => {
    if (branchId) {
      api.get(`/dashboard/manager/${branchId}`)
        .then(res => setStats({ ...defaultStats, ...res.data }))
        .catch(err => console.log('Using mock specific branch data'));
    }
  }, [branchId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-xl font-bold text-slate-200 tracking-tight">Branch Manager Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-orange-600/90 text-white shadow-md overflow-hidden relative border-none rounded">
          <CardContent className="p-4 relative z-10 flex flex-col justify-between h-20">
             <div className="flex items-center justify-between h-full">
               <div className="flex flex-col">
                 <p className="text-white/80 font-medium text-[10px] uppercase">Total Feedback</p>
                 <h3 className="text-3xl font-bold mt-1">150</h3>
               </div>
             </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-600/90 text-white shadow-md overflow-hidden relative border-none rounded">
           <CardContent className="p-4 relative z-10 flex flex-col justify-between h-20">
             <div className="flex items-center justify-between h-full">
               <div className="flex flex-col">
                 <p className="text-white/80 font-medium text-[10px] uppercase">Average Rating</p>
                 <h3 className="text-3xl font-bold mt-1">4.7</h3>
               </div>
               <div className="flex items-end gap-[2px] opacity-70">
                 <div className="w-2 h-4 bg-white/40"></div>
                 <div className="w-2 h-6 bg-white/60"></div>
                 <div className="w-2 h-8 bg-white/80"></div>
               </div>
             </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 text-white shadow-md overflow-hidden relative border-slate-700/50 rounded">
          <CardContent className="p-3 relative z-10 flex flex-col justify-between h-20">
             <p className="text-slate-300 font-medium text-xs mb-1">Service A</p>
             <div className="flex flex-col gap-1 text-[10px] font-medium text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                  <span className="flex-1 flex justify-between"><span>010</span> <span className="text-slate-500 text-[8px]">Feedback</span></span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                   <span className="flex-1 flex justify-between"><span>020</span> <span className="text-slate-500 text-[8px]">Feedback</span></span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-800">
        <CardHeader title="Recent Feedback" className="border-b border-slate-800" />
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap text-slate-300">
            <thead className="border-b border-slate-800 font-semibold text-slate-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {stats.recentFeedback.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-medium">{row.date}</td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{row.customer || 'Anonymous'}</td>
                  <td className="px-6 py-4 text-yellow-500/90 text-sm">
                    {'★'.repeat(row.rating)}{'★'.repeat(5 - row.rating).replace(/★/g, '☆')} 
                  </td>
                  <td className="px-6 py-4 text-slate-400 truncate max-w-sm">{row.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
