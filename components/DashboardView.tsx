
import React from 'react';
import { Patent, PatentCategory, TaskStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// Added AlertCircle to imports to fix the error on line 102
import { TrendingUp, FileText, CheckCircle2, Clock, DollarSign, AlertCircle } from 'lucide-react';

interface Props {
  patents: Patent[];
}

const DashboardView: React.FC<Props> = ({ patents }) => {
  const categoryData = [
    { name: 'Core', value: patents.filter(p => p.category === PatentCategory.CORE).length },
    { name: 'Non-Core', value: patents.filter(p => p.category === PatentCategory.NON_CORE).length },
  ];

  const statusData = [
    { name: 'Objection/FER', value: patents.filter(p => p.stages.some(s => s.status === TaskStatus.OBJECTION)).length },
    // Fix: Using TaskStatus.WIP instead of IN_PROGRESS
    { name: 'In Progress', value: patents.filter(p => p.stages.some(s => s.status === TaskStatus.WIP)).length },
    { name: 'Granted', value: patents.filter(p => p.stages.some(s => s.name === 'Grant' && s.status === TaskStatus.COMPLETED)).length },
  ];

  const COLORS = ['#2563eb', '#94a3b8', '#dc2626', '#16a34a', '#eab308'];

  const stats = [
    { label: 'Total Patents', value: patents.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Core Strategy', value: categoryData[0].value, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Actions', value: 4, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Estimated Costs', value: '$142k', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Portfolio Distribution by Jurisdiction</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{name: 'India', count: 12}, {name: 'US', count: 8}, {name: 'EU', count: 5}, {name: 'PCT', count: 9}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Core vs Non-Core</h3>
          <div className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4">
              {categoryData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-sm text-slate-600 font-medium">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Milestones</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">View All Activity</button>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { title: 'Response to FER Filed', patent: 'NT-IP-2024-001', time: '2h ago', type: 'update', user: 'Arctic Consultant' },
            { title: 'Grant Issued', patent: 'NT-IP-2023-014', time: 'Yesterday', type: 'success', user: 'USPTO' },
            { title: 'Renewal Due in 15 Days', patent: 'NT-IP-2022-009', time: 'Yesterday', type: 'warning', user: 'System' },
          ].map((item, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className={`p-2 rounded-lg ${item.type === 'success' ? 'bg-green-100 text-green-600' : item.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                {item.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : item.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500">{item.patent} • Updated by {item.user}</p>
              </div>
              <span className="text-xs text-slate-400 font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
