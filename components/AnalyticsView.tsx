
import React from 'react';
import { Patent, TaskStatus, UserRole } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, AlertCircle, Clock, CheckCircle2, Zap, ShieldAlert } from 'lucide-react';

interface Props {
  patents: Patent[];
}

const AnalyticsView: React.FC<Props> = ({ patents }) => {
  // Aggregate Arctic Performance
  const arcticStages = patents.flatMap(p => p.stages.filter(s => s.updatedBy === UserRole.ARCTIC));
  const completedArctic = arcticStages.filter(s => s.status === TaskStatus.COMPLETED);
  
  // Calculate Avg Delay
  const totalDelay = completedArctic.reduce((acc, stage) => {
    const deadline = new Date(stage.slaDeadline).getTime();
    const actual = new Date(stage.completedAt!).getTime();
    const diffDays = Math.max(0, (actual - deadline) / (1000 * 60 * 60 * 24));
    return acc + diffDays;
  }, 0);

  const avgDelay = completedArctic.length > 0 ? (totalDelay / completedArctic.length).toFixed(1) : "0";

  const metrics = [
    { label: 'Avg Arctic Delay', value: `${avgDelay} Days`, icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'SLA Compliance', value: '84%', icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Projects', value: patents.length, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completion Rate', value: '92%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const loopHoleData = [
    { name: 'Drafting', Promised: 15, Actual: 19 },
    { name: 'FER Response', Promised: 90, Actual: 88 },
    { name: 'Filing', Promised: 3, Actual: 5 },
    { name: 'Technical Review', Promised: 7, Actual: 11 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Performance Audits</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">Measuring Arctic's commitment vs. delivery.</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Restricted View: Newtrace ONLY
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{m.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{m.value}</h3>
            </div>
            <div className={`${m.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
              <m.icon className={`w-6 h-6 ${m.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            SLA Variance (The Loophole Finder)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loopHoleData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 'bold', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="Promised" fill="#cbd5e1" radius={[8, 8, 0, 0]} barSize={40} />
                <Bar dataKey="Actual" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Project Drift Over Time
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{d: 'Jan', v: 2}, {d: 'Feb', v: 5}, {d: 'Mar', v: 3}, {d: 'Apr', v: 8}]}>
                <defs>
                  <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorDrift)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-black">Ready to audit Arctic's performance?</h3>
            <p className="text-slate-400 max-w-md font-medium leading-relaxed">Download the raw Excel metadata to run your own advanced regression analysis on Arctic's efficiency vs. official legal fees charged.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-2xl transition-all active:scale-95 whitespace-nowrap">
            Generate Full Audit Report
          </button>
        </div>
        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default AnalyticsView;
