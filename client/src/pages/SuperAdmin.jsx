import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Card, CardContent, CardHeader } from '../components/Card';
import { QrCode } from 'lucide-react';
import api from '../api';

const defaultData = [
  { name: 'Jan', value: 18 }, { name: 'Feb', value: 24 },
  { name: 'Mar', value: 28 }, { name: 'Apr', value: 39 },
  { name: 'May', value: 45 }, { name: 'Jun', value: 55 },
];

export function SuperAdmin() {
  const [stats, setStats] = useState({
    totalBranches: 10, totalServices: 25, totalFeedback: 1240, averageRating: 4.5, trendData: defaultData
  });
  
  useEffect(() => {
    api.get('/dashboard/super-admin')
      .then(res => setStats(res.data))
      .catch(err => console.log('Using mock data'));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-slate-200 tracking-tight">Super Admin Dashboard</h2>
         <select className="px-4 py-2 border border-slate-800 rounded-md text-sm bg-slate-900 text-slate-300 shadow-sm focus:ring-2 focus:ring-slate-700 outline-none">
            <option>Super Feedback</option>
         </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:border-slate-700 transition-colors">
          <CardContent className="flex flex-col p-4">
            <p className="text-xs font-medium text-slate-400 mb-1">Total Branches</p>
            <h3 className="text-3xl font-bold text-slate-100">{stats.totalBranches}</h3>
          </CardContent>
        </Card>
        <Card className="hover:border-slate-700 transition-colors">
          <CardContent className="flex flex-col p-4">
            <p className="text-xs font-medium text-slate-400 mb-1">Total Services</p>
            <div className="flex items-center gap-3">
               <h3 className="text-3xl font-bold text-slate-100">{stats.totalServices}</h3>
               <div className="w-10 h-1 bg-slate-800 rounded-full overflow-hidden mt-1"><div className="h-full bg-blue-500/50 w-2/3"></div></div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-slate-700 transition-colors">
          <CardContent className="flex flex-col p-4">
            <p className="text-xs font-medium text-slate-400 mb-1">Total Feedback</p>
            <h3 className="text-3xl font-bold text-slate-100">{stats.totalFeedback.toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card className="hover:border-slate-700 transition-colors border-l-2 border-l-slate-700">
          <CardContent className="flex flex-col p-4">
            <p className="text-xs font-medium text-slate-400 mb-1">Average Rating</p>
            <div className="flex items-end gap-3 font-bold">
               <h3 className="text-3xl text-slate-100">{stats.averageRating}</h3>
               <div className="flex align-end gap-[1px] mb-1">
                 <div className="w-1.5 h-3 bg-slate-700"></div>
                 <div className="w-1.5 h-4 bg-slate-700"></div>
                 <div className="w-1.5 h-6 bg-slate-600"></div>
                 <div className="w-1.5 h-5 bg-slate-700"></div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Feedback Overview" className="border-b border-slate-800" />
          <CardContent>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trendData.length ? stats.trendData : defaultData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-800">
              {['Branch A', 'Branch C', 'Branch C'].map((branch, i) => (
                <li key={i} className="flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded bg-red-900/20 border border-red-900/50 flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-slate-200 text-sm">{branch}</span>
                    <span className="text-[10px] text-slate-500">Optimized Comments</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500/80 text-[10px]">
                    ★★★★<span className="text-slate-700">★</span> <span className="text-slate-600 ml-1">&gt;</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
