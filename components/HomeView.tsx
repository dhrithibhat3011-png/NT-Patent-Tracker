import React from 'react';
import { Patent, TaskStatus, ViewMode } from '../types';
import { FileText, CheckCircle, Clock, Zap, ArrowRight, ShieldCheck, ListChecks, Target, BarChart3 } from 'lucide-react';

interface Props {
  patents: Patent[];
  setView: (v: ViewMode) => void;
}

const HomeView: React.FC<Props> = ({ patents, setView }) => {
  const recentActivities = patents
    .flatMap(p => p.stages.map(s => ({ ...s, patentRef: p.refId, title: p.title })))
    .filter(s => s.status === TaskStatus.COMPLETED)
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Hero Welcome */}
      <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-600 text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            Internal Ops Portal
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Newtrace Legal Dashboard</h2>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Unified strategic view of Newtrace's IP portfolio. Track lifecycle progression, enforce Arctic consultancy SLAs, and manage govt. filing fees in real-time.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <FileText className="w-64 h-64 text-blue-600" />
        </div>
      </div>

      {/* Operational Protocol */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black">1. Deployment</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
              Initialize assets via the 5-step wizard. Select <strong>Core vs Non-Core</strong> to trigger specific roadmap templates.
            </p>
          </div>
          <div className="h-px bg-white/10" />
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Setup Phase</p>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black">2. Governance</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
              Monitor the <strong>SLA Deadlines</strong> assigned to external consultants. Ensure technical reviews (NT) are completed on priority.
            </p>
          </div>
          <div className="h-px bg-white/10" />
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Tracking Phase</p>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
              <ListChecks className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black">3. Compliance</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
              Log Govt. filing fees in <strong>₹ Rupees</strong>. Capture proof of filing and remarks to maintain a clean internal audit trail.
            </p>
          </div>
          <div className="h-px bg-white/10" />
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Audit Phase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Statistics */}
        <div className="lg:col-span-1 space-y-8">
           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <BarChart3 className="w-4 h-4" /> Live Portfolio Health
           </h4>
           <div className="space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Active Assets</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{patents.length}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest">In Progress</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{patents.filter(p => p.stages.some(s => s.status !== TaskStatus.COMPLETED && s.status !== TaskStatus.NOT_STARTED)).length}</h3>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
           </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" /> Latest Milestones
            </h4>
            <button onClick={() => setView('History')} className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1">
              View All History <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {recentActivities.length > 0 ? recentActivities.map((act, i) => (
              <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg leading-tight">{act.name}</p>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                      {act.patentRef} • {act.title}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{act.completedAt}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Logged</p>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-400 font-bold italic">
                Inventory is currently empty.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;