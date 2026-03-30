import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/Card';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const defaultStats = {
  recentBranches: [
    { name: 'Branch X', feedbackCount: 150, avgRating: 4.7, lastUpdate: '27706.12n' },
    { name: 'Branch Y', feedbackCount: 4.7, avgRating: 4.2, lastUpdate: '27706.1an' },
    { name: 'Branch Z', feedbackCount: 50, avgRating: 4.8, lastUpdate: '27706.18n' },
  ]
};

export function BranchManagerOverview() {
  const [stats, setStats] = useState({ totalFeedback: 0, averageRating: 0, recentFeedback: [] });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const branchId = user.branchId;

  useEffect(() => {
    if (branchId) {
      api.get(`/dashboard/manager/${branchId}`)
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }
  }, [branchId]);

  return (
    <div className="space-y-6 text-slate-200">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-xl font-bold tracking-tight">Your Branch Performance</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 relative pt-1">
          <CardContent className="p-4 relative z-10 flex flex-col justify-between h-28">
            <p className="text-slate-400 font-medium text-xs">Total Feedback Received</p>
            <div className="flex items-start">
               <h3 className="text-4xl font-bold text-white">{stats.totalFeedback}</h3>
            </div>
            <div className="absolute right-4 bottom-4 flex items-end gap-1 opacity-20">
              <div className="w-3 h-4 bg-red-500 rounded-sm"></div>
              <div className="w-3 h-8 bg-red-500 rounded-sm"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 relative pt-1">
          <CardContent className="p-4 relative z-10 flex flex-col justify-between h-28">
            <p className="text-slate-400 font-medium text-xs">Average Experience Rating</p>
            <div className="flex items-center gap-2">
               <span className="text-yellow-500 font-bold text-2xl">★</span>
               <h3 className="text-4xl font-bold text-orange-400">{stats.averageRating}</h3>
            </div>
            <div className="absolute right-4 bottom-4 flex items-end gap-1 opacity-20">
              <div className="w-3 h-6 bg-orange-400 rounded-sm"></div>
              <div className="w-3 h-10 bg-orange-400 rounded-sm"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 relative pt-1 md:col-span-full lg:col-span-1">
          <CardContent className="p-4 relative z-10 flex flex-col justify-between h-28">
            <p className="text-slate-400 font-medium text-xs">Top Performer Service</p>
            <h3 className="text-4xl font-bold text-cyan-400">4.3</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Main Service Score</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 shadow-xl">
        <CardHeader title="Latest Customer Feedback" className="border-b border-slate-800 p-6" />
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#1e293b]/50 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer Info</th>
                <th className="px-6 py-4 text-center">Satisfaction</th>
                <th className="px-6 py-4">Received On</th>
                <th className="px-6 py-4">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {stats.recentFeedback.length > 0 ? stats.recentFeedback.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-200">{row.customer || 'Guest User'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                       {Array.from({length: 5}).map((_, j) => (
                          <span key={j} className={j < Math.round(row.rating) ? 'text-yellow-500' : 'text-slate-700'}>★</span>
                       ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-[11px]">{row.date}</td>
                  <td className="px-6 py-4 text-slate-300 italic truncate max-w-sm">"{row.comment || 'No comment provided'}"</td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="4" className="px-6 py-12 text-center text-slate-600 font-medium uppercase tracking-widest">
                     No feedback recorded for this branch yet
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

