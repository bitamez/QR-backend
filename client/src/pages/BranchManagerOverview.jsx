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
  const [stats, setStats] = useState(defaultStats);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-xl font-bold text-slate-200 tracking-tight">Branch Manager Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 relative pt-1">
          <CardContent className="p-4 relative z-10 flex flex-col justify-between h-28">
            <p className="text-slate-400 font-medium text-xs">Total Feedback</p>
            <div className="flex items-start">
               <h3 className="text-4xl font-bold text-white">150</h3>
            </div>
            {/* Background Red visualizer */}
            <div className="absolute right-4 bottom-4 flex items-end gap-1 opacity-20">
              <div className="w-3 h-4 bg-red-500 rounded-sm"></div>
              <div className="w-3 h-8 bg-red-500 rounded-sm"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 relative pt-1">
          <CardContent className="p-4 relative z-10 flex flex-col justify-between h-28">
            <p className="text-slate-400 font-medium text-xs">Average Rating</p>
            <div className="flex items-center gap-1">
               <span className="text-yellow-500 font-bold text-2xl">★</span>
               <h3 className="text-4xl font-bold text-orange-400">4.7</h3>
            </div>
            <div className="absolute right-4 bottom-4 flex items-end gap-1 opacity-20">
              <div className="w-3 h-6 bg-orange-400 rounded-sm"></div>
              <div className="w-3 h-10 bg-orange-400 rounded-sm"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 relative pt-1">
          <CardContent className="p-4 relative z-10 flex flex-col justify-between h-28">
            <p className="text-slate-400 font-medium text-xs">Average Rating</p>
            <h3 className="text-4xl font-bold text-cyan-400">4.3</h3>
            <div className="absolute right-4 bottom-4 flex items-end gap-1 opacity-20">
              <div className="w-3 h-8 bg-cyan-400 rounded-sm"></div>
              <div className="w-3 h-6 bg-cyan-400 rounded-sm"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent Feedback" className="border-b border-slate-800" />
        <CardContent className="p-0 overflow-x-auto text-slate-300">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4 text-center">Total Feedback</th>
                <th className="px-6 py-4 text-center">Avg Rating</th>
                <th className="px-6 py-4">Last Update</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {stats.recentBranches.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => navigate('/manager/branch')}>
                  <td className="px-6 py-4 font-semibold text-slate-200">{row.name}</td>
                  <td className="px-6 py-4 text-slate-300 text-center">{row.feedbackCount}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                      {Array.from({length: 5}).map((_, j) => (
                         <span key={j} className={j < Math.round(row.avgRating) ? 'text-yellow-500' : 'text-slate-700'}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-[11px]">{row.lastUpdate}</td>
                  <td className="px-6 py-4 text-right text-slate-500">
                     &gt;
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
