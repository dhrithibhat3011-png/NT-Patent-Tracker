
import React from 'react';
import { Patent, TaskStatus } from '../types';
import { AlertCircle, Clock, CheckCircle2, MoreHorizontal, User2 } from 'lucide-react';

interface Props {
  patents: Patent[];
  onSelect: (p: Patent) => void;
}

const KanbanView: React.FC<Props> = ({ patents, onSelect }) => {
  // Simplified Kanban for the most critical stages
  const columns = [
    { id: 'S1', title: 'Ideation & Disclosure', color: 'border-slate-300 bg-slate-50' },
    { id: 'S7', title: 'Drafting', color: 'border-blue-400 bg-blue-50' },
    { id: 'S9', title: 'Filing', color: 'border-purple-400 bg-purple-50' },
    { id: 'S13', title: 'Examination (FER)', color: 'border-amber-400 bg-amber-50' },
    { id: 'S20', title: 'Granted', color: 'border-green-400 bg-green-50' },
  ];

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar h-[calc(100vh-12rem)] animate-in fade-in duration-500">
      {columns.map((column) => {
        const columnPatents = patents.filter(p => {
          // Check if the current stage is this column or if it's in the general vicinity
          // In a real app, logic would map stage IDs precisely
          // Fix: Using TaskStatus.WIP instead of IN_PROGRESS
          return p.currentStageId === column.id || (p.stages.find(s => s.id === column.id)?.status === TaskStatus.WIP);
        });

        return (
          <div key={column.id} className="flex-shrink-0 w-80 flex flex-col rounded-2xl bg-slate-100/50 border border-slate-200 overflow-hidden shadow-inner">
            <div className={`p-4 border-b-2 ${column.color} flex items-center justify-between`}>
              <h3 className="font-bold text-slate-800 text-sm">{column.title}</h3>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 border border-slate-200">{columnPatents.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
              {columnPatents.map((p) => {
                const currentStage = p.stages.find(s => s.id === p.currentStageId)!;
                // Corrected dueDate to slaDeadline to match types.ts
                const isOverdue = new Date(currentStage.slaDeadline) < new Date() && currentStage.status !== TaskStatus.COMPLETED;

                return (
                  <div 
                    key={p.id} 
                    onClick={() => onSelect(p)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition-all active:scale-95"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{p.refId}</span>
                      <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug mb-3 line-clamp-2">{p.title}</h4>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {p.jurisdictions.map(j => (
                        <span key={j} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">{j}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5">
                        <User2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium">{currentStage.poc}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-[10px] font-bold ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                        {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {/* Corrected dueDate to slaDeadline to match types.ts */}
                        {new Date(currentStage.slaDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {columnPatents.length === 0 && (
                <div className="h-24 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs italic">
                  No patents in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanView;
