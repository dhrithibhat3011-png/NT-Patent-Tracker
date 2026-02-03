import React, { useState } from 'react';
import { Patent, TaskStatus, Jurisdiction } from '../types';
import { getCurrencySymbol } from '../constants';
import { 
  Eye, 
  ClipboardList,
  MessageSquare,
  Edit2,
  Check,
  Search,
  Globe,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface Props {
  patents: Patent[];
  onSelect: (p: Patent) => void;
  isAdmin: boolean;
  title: string;
  setTitle: (t: string) => void;
}

const PortfolioView: React.FC<Props> = ({ patents, onSelect, isAdmin, title, setTitle }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filtered = filterCategory === 'All' ? patents : patents.filter(p => p.category === filterCategory);

  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      case TaskStatus.WIP: return 'bg-blue-100 text-blue-700 border-blue-200';
      case TaskStatus.WAITING_ARCTIC: return 'bg-orange-100 text-orange-700 border-orange-200';
      case TaskStatus.STARTED: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case TaskStatus.OBJECTION: return 'bg-red-100 text-red-700 border-red-200';
      case TaskStatus.DELAYED: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const copyForSlack = (p: Patent) => {
    const current = p.stages.find(s => s.id === p.currentStageId);
    const text = `🚀 *IP STATUS*: ${p.refId} | ${p.title}\n*Stage*: ${current?.name}\n*Status*: ${current?.status}\n*SLA*: ${current?.slaDeadline}\n*Notes*: ${current?.remarks || 'No notes'}`;
    navigator.clipboard.writeText(text);
    alert('Lean status report copied for Slack!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 group">
              {isEditingTitle ? (
                <div className="flex items-center gap-2 w-full max-w-xl">
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-black text-slate-900 border-b-2 border-blue-600 focus:outline-none w-full bg-blue-50/30 px-2 py-1"
                    autoFocus
                  />
                  <button onClick={() => setIsEditingTitle(false)} className="p-2 bg-blue-600 text-white rounded-lg shadow-lg">
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <ClipboardList className="w-6 h-6 text-blue-600" />
                    {title}
                  </h2>
                  <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-300 hover:text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <p className="text-slate-500 text-sm font-medium italic">Internal Operational Portfolio: Newtrace IP Roadmap</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {['All', 'Core', 'Non-Core'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterCategory === cat ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">Asset details</th>
                <th className="px-8 py-5">Current stage</th>
                <th className="px-8 py-5">Next action</th>
                <th className="px-8 py-5">Timelines & Due Date</th>
                <th className="px-8 py-5">Official Fees</th>
                <th className="px-8 py-5">Operational Remarks</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((patent) => {
                const currentIdx = patent.stages.findIndex(s => s.id === patent.currentStageId);
                const current = patent.stages[currentIdx];
                const next = patent.stages[currentIdx + 1];
                const currency = getCurrencySymbol(patent.jurisdictions);

                return (
                  <tr key={patent.id} className="hover:bg-blue-50/20 transition-all group cursor-pointer" onClick={() => onSelect(patent)}>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit border border-blue-100 uppercase">{patent.refId}</span>
                        <span className="text-sm font-black text-slate-900 line-clamp-1">{patent.title}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${patent.category === 'Core' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{patent.category}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{patent.type}</span>
                          <span className="flex items-center gap-1 text-[8px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                            <Globe className="w-2.5 h-2.5" />
                            {patent.jurisdictions.join('/')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <div className={`text-[10px] font-black px-2 py-1 rounded-lg border mb-1.5 w-fit ${getStatusStyle(current?.status || TaskStatus.NOT_STARTED)}`}>
                          {current?.status.toUpperCase()}
                        </div>
                        <span className="text-xs font-black text-slate-800">{current?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {next ? (
                        <div className="flex items-center gap-2 text-slate-400">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-bold italic">{next.name}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100 uppercase">Roadmap complete</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span className="text-[10px] font-black text-slate-500 uppercase">Target Due</span>
                          <span className="text-xs font-black text-slate-900">{current?.slaDeadline}</span>
                        </div>
                        {current?.completedAt && (
                          <div className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase">Actual Done</span>
                            <span className="text-xs font-black text-green-600">{current?.completedAt}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 w-fit">
                        <div className="flex items-center gap-1 text-slate-900 font-black">
                          <span className="text-green-600 font-black text-[10px]">{currency}</span>
                          <span className="text-xs">{current?.officialFees?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-[200px]">
                        <p className="text-[10px] font-bold text-slate-600 line-clamp-2 leading-relaxed">
                          {current?.remarks || patent.autoSummary || "Waiting for internal status update."}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); copyForSlack(patent); }}
                          className="bg-purple-600 text-white hover:bg-purple-700 p-2.5 rounded-xl transition-all shadow-md active:scale-95"
                          title="Instant Slack Report"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="bg-slate-900 text-white hover:bg-black p-2.5 rounded-xl transition-all shadow-md active:scale-95">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;