import React, { useState } from 'react';
import { Patent, PatentCategory, PatentType, Jurisdiction, TaskStatus, UserRole } from '../types';
import { X, ChevronRight, Check, Zap, Layers, ListChecks, ArrowLeft, Target, Globe } from 'lucide-react';

interface StageTemplate {
  id: string;
  name: string;
  defaultPoc: string;
  isMandatory: boolean;
  slaDays: number;
  description: string;
}

interface Props {
  onClose: () => void;
  templates: StageTemplate[];
  onSave: (patent: Patent) => void;
}

const NewPatentModal: React.FC<Props> = ({ onClose, templates, onSave }) => {
  const [step, setStep] = useState(1);
  const [selectedStages, setSelectedStages] = useState<string[]>(
    templates.filter(t => t.isMandatory).map(t => t.id)
  );

  const [data, setData] = useState({
    title: '',
    refId: `NT-IP-${new Date().getFullYear()}-00${Math.floor(Math.random()*900)+100}`,
    category: PatentCategory.CORE,
    type: PatentType.PROVISIONAL,
    jurisdictions: [Jurisdiction.INDIA] as Jurisdiction[],
  });

  const toggleStage = (id: string) => {
    setSelectedStages(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleJurisdiction = (j: Jurisdiction) => {
    setData(prev => ({
      ...prev,
      jurisdictions: prev.jurisdictions.includes(j) 
        ? prev.jurisdictions.filter(item => item !== j)
        : [...prev.jurisdictions, j]
    }));
  };

  const handleFinish = () => {
    const finalStages = templates
      .filter(t => selectedStages.includes(t.id))
      .map(template => ({
        id: template.id,
        name: template.name,
        status: TaskStatus.NOT_STARTED,
        slaDeadline: new Date(Date.now() + template.slaDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        poc: template.defaultPoc,
        updatedBy: template.defaultPoc === 'Arctic' ? UserRole.ARCTIC : UserRole.NT,
        isMandatory: template.isMandatory,
        remarks: '',
        officialFees: 0,
        feePurpose: 'Govt. Fees',
        description: template.description
      }));

    if (finalStages.length === 0) {
      alert("Please select at least one stage for your roadmap.");
      return;
    }

    const newPatent: Patent = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      currentStageId: finalStages[0]?.id,
      stages: finalStages as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      autoSummary: `Deployment initialized for ${data.title}.`
    };
    onSave(newPatent);
  };

  const canProceed = () => {
    if (step === 1) return data.title.trim().length > 3;
    if (step === 3) return data.jurisdictions.length > 0;
    if (step === 4) return selectedStages.length > 0;
    return true;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Deployment Wizard</h2>
            <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">
              Step {step} of 5: {
                step === 1 ? 'Asset Identity' : 
                step === 2 ? 'Filing Strategy' : 
                step === 3 ? 'Target Regions' : 
                step === 4 ? 'Operational Milestones' : 'Final Review'
              }
            </p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white rounded-2xl transition-all shadow-sm">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar bg-white min-h-[480px]">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patent Title / Project Reference</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g., Advanced Electrolyzer Mesh Design..."
                  className="w-full text-xl font-bold p-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all placeholder:text-slate-300 outline-none shadow-inner"
                  value={data.title}
                  onChange={e => setData({...data, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => setData({...data, category: PatentCategory.CORE})}
                  className={`p-8 rounded-[2.5rem] border-2 text-left transition-all ${data.category === PatentCategory.CORE ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <Zap className={`w-10 h-10 mb-4 ${data.category === PatentCategory.CORE ? 'text-blue-600' : 'text-slate-300'}`} />
                  <h4 className="font-black text-slate-900">Core Strategy</h4>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest tracking-widest">High Strategic Asset</p>
                </button>
                <button 
                  onClick={() => setData({...data, category: PatentCategory.NON_CORE})}
                  className={`p-8 rounded-[2.5rem] border-2 text-left transition-all ${data.category === PatentCategory.NON_CORE ? 'border-slate-800 bg-slate-50 ring-4 ring-slate-100' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <Layers className={`w-10 h-10 mb-4 ${data.category === PatentCategory.NON_CORE ? 'text-slate-800' : 'text-slate-300'}`} />
                  <h4 className="font-black text-slate-900">Non-Core</h4>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest tracking-widest">Support / Internal IP</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-black text-slate-900">Filing Route</h3>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  {[PatentType.PROVISIONAL, PatentType.NON_PROVISIONAL].map(t => (
                    <button 
                      key={t}
                      onClick={() => setData({...data, type: t})}
                      className={`p-10 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all ${data.type === t ? 'border-purple-500 bg-purple-50/50 ring-4 ring-purple-50' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <Target className={`w-10 h-10 ${data.type === t ? 'text-purple-600' : 'text-slate-300'}`} />
                      <span className="font-black text-slate-900 uppercase tracking-widest text-sm">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-black text-slate-900">Select Jurisdictions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  {Object.values(Jurisdiction).map(j => (
                    <button 
                      key={j}
                      onClick={() => toggleJurisdiction(j)}
                      className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${data.jurisdictions.includes(j) ? 'border-green-500 bg-green-50/50 ring-2 ring-green-100' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <Globe className={`w-6 h-6 ${data.jurisdictions.includes(j) ? 'text-green-600' : 'text-slate-300'}`} />
                      <span className="font-black text-slate-900 text-[10px] uppercase tracking-widest">{j}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-blue-500" /> Lifecycle Milestone Selection
                </label>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Click to toggle stages for this asset's roadmap</span>
              </div>
              <div className="space-y-3">
                {templates.map(stage => (
                  <div 
                    key={stage.id} 
                    onClick={() => toggleStage(stage.id)}
                    className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      selectedStages.includes(stage.id) 
                        ? 'bg-blue-50 border-blue-500 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${selectedStages.includes(stage.id) ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                        {selectedStages.includes(stage.id) ? <Check className="w-4 h-4" /> : stage.id.substring(1)}
                      </div>
                      <div className="pr-4">
                        <h5 className="text-sm font-bold text-slate-900">{stage.name}</h5>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{stage.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl">
                <h3 className="text-2xl font-black text-blue-400">Final Roadmap Review</h3>
                <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Category</p>
                    <p className="font-bold text-lg">{data.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Route</p>
                    <p className="font-bold text-lg">{data.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Regions</p>
                    <p className="font-bold text-lg">{data.jurisdictions.join(', ')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Stages</p>
                    <p className="font-bold text-lg">{selectedStages.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button 
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`flex items-center gap-2 px-8 py-4 font-black text-slate-400 hover:text-slate-900 transition-all ${step === 1 ? 'opacity-0' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          {step < 5 ? (
            <button 
              disabled={!canProceed()}
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 bg-slate-900 text-white px-12 py-4 rounded-2xl font-black hover:bg-black shadow-lg active:scale-95 disabled:opacity-30 transition-all uppercase tracking-widest text-xs"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              className="flex items-center gap-2 bg-green-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-green-700 shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              <Check className="w-4 h-4" />
              Finalize & Deploy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPatentModal;