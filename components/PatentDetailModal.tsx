
import React, { useState } from 'react';
import { Patent, Stage, TaskStatus, UserRole, Jurisdiction } from '../types';
import { getCurrencySymbol } from '../constants';
import { 
  X, Calendar, User, MessageSquare, AlertCircle, Save, 
  CheckCircle, ChevronRight, History, Trash2, Edit3, Lock,
  ArrowUpRight, Sliders, Info, Clock, Globe
} from 'lucide-react';

interface Props {
  patent: Patent;
  onClose: () => void;
  onUpdate: (p: Patent) => void;
  onDelete: (id: string) => void;
}

const PatentDetailModal: React.FC<Props> = ({ patent, onClose, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'details' | 'notes'>('workflow');
  const [editedPatent, setEditedPatent] = useState<Patent>(patent);
  const [showDescriptions, setShowDescriptions] = useState(true);

  const handleStageUpdate = (stageId: string, updates: Partial<Stage>) => {
    const updatedStages = editedPatent.stages.map(s => {
      if (s.id === stageId) {
        const newStage = { ...s, ...updates };
        if (updates.status === TaskStatus.COMPLETED && !s.completedAt) {
          newStage.completedAt = new Date().toISOString().split('T')[0];
        }
        return newStage;
      }
      return s;
    });

    const currentIndex = updatedStages.findIndex(s => s.id === stageId);
    
    // Auto-advance logic
    if (updates.status === TaskStatus.COMPLETED && currentIndex < updatedStages.length - 1) {
      setEditedPatent({
        ...editedPatent,
        stages: updatedStages,
        currentStageId: updatedStages[currentIndex + 1].id,
        updatedAt: new Date().toISOString()
      });
    } else {
      setEditedPatent({ ...editedPatent, stages: updatedStages, updatedAt: new Date().toISOString() });
    }
  };

  const handleSave = () => {
    onUpdate(editedPatent);
    onClose();
  };

  const currency = getCurrencySymbol(editedPatent.jurisdictions);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        {/* Header */}
        <div className="px-10 py-8 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono font-black text-blue-600 bg-white border border-blue-100 px-2 py-0.5 rounded shadow-sm">{editedPatent.refId}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${editedPatent.category === 'Core' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-200 text-slate-700 border-slate-300'}`}>{editedPatent.category}</span>
              <span className="flex items-center gap-1 text-[8px] font-black bg-white px-2 py-0.5 rounded-full border border-slate-200 uppercase tracking-widest text-slate-500">
                <Globe className="w-3 h-3" />
                {editedPatent.jurisdictions.join('/')}
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 truncate tracking-tight">{editedPatent.title}</h2>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <button onClick={() => onDelete(editedPatent.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all" title="Delete Asset">
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95 group">
              <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Save Changes
            </button>
            <div className="w-px h-8 bg-slate-200 mx-1" />
            <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-10 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-10">
            {[
              { id: 'workflow', label: 'Lifecycle Management', icon: ChevronRight },
              { id: 'details', label: 'Asset Metadata', icon: Edit3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-5 flex items-center gap-2 text-sm font-black border-b-2 transition-all ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-300'}`} />
                {tab.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowDescriptions(!showDescriptions)}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all border ${showDescriptions ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
          >
            <Info className="w-3 h-3" />
            {showDescriptions ? 'Hide Guidelines' : 'Show Guidelines'}
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/20">
          {activeTab === 'workflow' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {editedPatent.stages.map((stage, idx) => {
                const isCurrent = editedPatent.currentStageId === stage.id;
                const isOverdue = new Date(stage.slaDeadline) < new Date() && stage.status !== TaskStatus.COMPLETED;
                
                return (
                  <div key={stage.id} className={`flex gap-8 group relative transition-all duration-300`}>
                    {idx < editedPatent.stages.length - 1 && (
                      <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-slate-200 group-last:hidden" />
                    )}

                    <div className="relative z-10 pt-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm ${
                        stage.status === TaskStatus.COMPLETED ? 'bg-green-500 border-green-500 text-white' :
                        isCurrent ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-500/20' : 
                        'bg-white border-slate-200 text-slate-300'
                      }`}>
                        {stage.status === TaskStatus.COMPLETED ? <CheckCircle className="w-7 h-7" /> : <span className="text-base font-black">{idx + 1}</span>}
                      </div>
                    </div>

                    <div className={`flex-1 rounded-[2.5rem] border-2 p-8 transition-all relative overflow-hidden ${
                      isCurrent ? 'border-blue-500 bg-white shadow-xl' : 'border-slate-100 bg-white'
                    }`}>
                      
                      <div className="flex items-start justify-between mb-8 gap-4">
                        <div className="flex-1">
                          <h4 className="font-black text-xl text-slate-900">{stage.name}</h4>
                          {showDescriptions && stage.description && (
                            <p className="mt-2 text-[11px] text-slate-500 font-medium leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              {stage.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Update Operational Status</label>
                           <select 
                            value={stage.status}
                            onChange={(e) => handleStageUpdate(stage.id, { status: e.target.value as TaskStatus })}
                            className={`text-[10px] font-black px-4 py-2.5 rounded-xl border-none outline-none cursor-pointer transition-all shadow-sm ${
                              stage.status === TaskStatus.COMPLETED ? 'bg-green-500 text-white' :
                              stage.status === TaskStatus.WAITING_ARCTIC ? 'bg-orange-500 text-white' :
                              stage.status === TaskStatus.WIP ? 'bg-blue-600 text-white' :
                              stage.status === TaskStatus.STARTED ? 'bg-indigo-600 text-white' :
                              'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <option value={TaskStatus.NOT_STARTED}>NOT STARTED</option>
                            <option value={TaskStatus.STARTED}>STARTED</option>
                            <option value={TaskStatus.WIP}>WORK IN PROGRESS</option>
                            <option value={TaskStatus.WAITING_ARCTIC}>WAITING FOR ARCTIC</option>
                            <option value={TaskStatus.COMPLETED}>COMPLETED</option>
                            <option value={TaskStatus.DELAYED}>DELAYED</option>
                            <option value={TaskStatus.OBJECTION}>OBJECTION</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-500' : ''}`} />
                            Due Date
                          </p>
                          <input 
                            type="date" 
                            value={stage.slaDeadline} 
                            onChange={(e) => handleStageUpdate(stage.id, { slaDeadline: e.target.value })}
                            className={`text-sm font-black bg-transparent border-none p-0 focus:ring-0 w-full ${isOverdue ? 'text-red-600' : 'text-slate-800'}`} 
                          />
                        </div>

                        <div className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Done Date
                          </p>
                          <input 
                            type="date" 
                            value={stage.completedAt || ''} 
                            onChange={(e) => handleStageUpdate(stage.id, { completedAt: e.target.value, status: TaskStatus.COMPLETED })}
                            className="text-sm font-black text-blue-600 bg-transparent border-none p-0 focus:ring-0 w-full" 
                          />
                        </div>

                        <div className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <span className="text-green-600 font-black">{currency}</span>
                            Official Fees
                          </p>
                          <div className="flex items-center">
                             <input 
                              type="number" 
                              value={stage.officialFees || 0} 
                              onChange={(e) => handleStageUpdate(stage.id, { officialFees: parseInt(e.target.value) })}
                              className="text-sm font-black text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full" 
                            />
                          </div>
                        </div>

                        <div className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Remarks/Action
                          </p>
                          <input 
                            type="text" 
                            value={stage.remarks || ''} 
                            placeholder="Type internal remarks..."
                            onChange={(e) => handleStageUpdate(stage.id, { remarks: e.target.value, updatedBy: UserRole.NT })}
                            className="text-xs font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <ArrowUpRight className="w-6 h-6 text-blue-500" />
                  Asset Identity
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Project Name</label>
                    <textarea 
                      value={editedPatent.title}
                      onChange={(e) => setEditedPatent({...editedPatent, title: e.target.value})}
                      className="w-full rounded-[1.5rem] border-slate-100 bg-slate-50 text-slate-900 font-black p-6 focus:ring-2 focus:ring-blue-500 min-h-[140px] transition-all resize-none shadow-inner"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategy Classification</label>
                      <select 
                        value={editedPatent.category}
                        onChange={(e) => setEditedPatent({...editedPatent, category: e.target.value as any})}
                        className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black outline-none"
                      >
                        <option value="Core">Core Strategy</option>
                        <option value="Non-Core">Non-Core / Support</option>
                      </select>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Filing Jurisdictions</p>
                      <div className="flex flex-wrap gap-2">
                        {editedPatent.jurisdictions.map(j => (
                          <span key={j} className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 shadow-sm">{j}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatentDetailModal;
