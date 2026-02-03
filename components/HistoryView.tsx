
import React from 'react';
import { Patent, UserRole, TaskStatus } from '../types';
import { History, Clock, User2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  patents: Patent[];
}

const HistoryView: React.FC<Props> = ({ patents }) => {
  const allEvents = patents
    .flatMap(p => p.stages.map(s => ({ 
      ...s, 
      patentRef: p.refId, 
      patentTitle: p.title 
    })))
    .filter(s => s.status === TaskStatus.COMPLETED)
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Audit History</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">Quantifying all completed actions by Newtrace & Arctic.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-10 space-y-12">
        {allEvents.length > 0 ? (
          <div className="relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100" />
            
            <div className="space-y-12">
              {allEvents.map((event, i) => {
                const isLate = new Date(event.completedAt!) > new Date(event.slaDeadline);
                return (
                  <div key={i} className="flex gap-8 group relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm ${
                      event.updatedBy === UserRole.ARCTIC ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
                    }`}>
                      {event.updatedBy === UserRole.ARCTIC ? <User2 className="w-7 h-7 text-orange-600" /> : <CheckCircle2 className="w-7 h-7 text-blue-600" />}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                          {event.name}
                          {/* Wrapped AlertTriangle in a span with title attribute as AlertTriangle component does not support title prop */}
                          {isLate && (
                            <span title="Delivered after SLA">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            </span>
                          )}
                        </h4>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{event.completedAt}</span>
                      </div>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-tighter">
                        {event.patentRef} • {event.patentTitle}
                      </p>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
                        <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                          "{event.remarks || 'No specific remarks recorded for this milestone.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-32 text-center space-y-4">
             <History className="w-20 h-20 text-slate-100 mx-auto" />
             <p className="text-slate-400 text-lg font-bold italic">No completed history to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;