import React, { useState, useEffect } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader } from '../components/Card';
import api from '../api';

const defaultTrendData = [
  { name: 'Jan', value: 10 }, { name: 'Feb', value: 15 },
  { name: 'Mar', value: 13 }, { name: 'Apr', value: 20 },
  { name: 'May', value: 18 }, { name: 'Jun', value: 25 },
];

const defaultPieData = [
  { name: '5 Stars', value: 55 }, { name: '4 Stars', value: 21 },
  { name: '3 Stars', value: 11 }, { name: '2 Stars', value: 8 },
  { name: '1 Star', value: 5 },
];
const COLORS = ['#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#ef4444'];

const defaultList = [
  { date: '14 Jan 2026', branch: 'Bassen', service: 'Service', rating: 4, comment: 'Comments' },
  { date: '14 Jan 2026', branch: 'Ar Fetulis', service: 'Service', rating: 3, comment: 'Comments' },
  { date: '13 Jan 2026', branch: 'Sulraas', service: 'Service', rating: 4, comment: 'Comments' },
];

export function Reports() {
  const [data, setData] = useState({
    detailedReport: [],
    ratingDistribution: []
  });

  useEffect(() => {
    api.get('/feedback/reports')
      .then(res => setData(res.data))
      .catch(err => console.log('Wait for data...'));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-xl font-bold text-slate-200 tracking-tight">Reports & Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader title="Feedback Trend" className="border-b border-slate-800" />
          <CardContent className="h-[250px] p-4 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff'}} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader title="Rating Distribution" className="border-b border-slate-800" />
          <CardContent className="h-[250px] flex flex-col items-center justify-center p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.ratingDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({percent}) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader title="Detailed Feedback Report" className="border-b border-slate-800" />
        <CardContent className="p-0 overflow-x-auto text-slate-300">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#1e293b]/50 text-slate-400 font-semibold border-b border-slate-800 uppercase">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {data.detailedReport.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400">{row.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-200">{row.branch || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-400">{row.service || 'N/A'}</td>
                  <td className="px-6 py-4 text-yellow-500 text-sm tracking-widest">
                    {'★'.repeat(row.rating)}{'☆'.repeat(5 - row.rating)}
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
