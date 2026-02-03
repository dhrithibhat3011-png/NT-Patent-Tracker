
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, GripVertical, AlertCircle, Clock } from 'lucide-react';

interface StageTemplate {
  id: string;
  name: string;
  defaultPoc: string;
  isMandatory: boolean;
  slaDays: number;
  // Fix: Added description to match the type in App.tsx and constants.ts
  description: string;
}

interface Props {
  templates: StageTemplate[];
  setTemplates: (t: StageTemplate[]) => void;
}

const SettingsView: React.FC<Props> = ({ templates, setTemplates }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<StageTemplate | null>(null);

  const startEditing = (t: StageTemplate) => {
    setEditingId(t.id);
    setEditValues({ ...t });
  };

  const saveEdit = () => {
    if (editValues) {
      setTemplates(templates.map(t => t.id === editingId ? editValues : t));
      setEditingId(null);
    }
  };

  const addStage = () => {
    const newId = `S${templates.length + 1}`;
    // Fix: Added default description for new stages
    const newStage: StageTemplate = {
      id: newId,
      name: 'New Patent Stage',
      defaultPoc: 'NT',
      isMandatory: false,
      slaDays: 30,
      description: 'Standard operational stage.'
    };
    setTemplates([...templates, newStage]);
  };

  const deleteStage = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Workflow Configuration</h2>
          <p className="text-slate-500">Define the master stages, SLAs, and roles for all patent lifecycles.</p>
        </div>
        <button 
          onClick={addStage}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Stage
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 w-12">ID</th>
                <th className="px-6 py-4">Stage Name</th>
                <th className="px-6 py-4">Default POC</th>
                <th className="px-6 py-4">SLA (Days)</th>
                <th className="px-6 py-4">Required?</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.map((template) => (
                <tr key={template.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-slate-400">{template.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === template.id ? (
                      <input 
                        className="w-full bg-slate-100 border-none rounded-lg p-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                        value={editValues?.name}
                        onChange={e => setEditValues({...editValues!, name: e.target.value})}
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-700">{template.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === template.id ? (
                      <select 
                        className="bg-slate-100 border-none rounded-lg p-2 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                        value={editValues?.defaultPoc}
                        onChange={e => setEditValues({...editValues!, defaultPoc: e.target.value})}
                      >
                        <option value="NT">NT (Internal)</option>
                        <option value="Arctic">Arctic (External)</option>
                        <option value="Examining Office">Examining Office</option>
                        <option value="Auto">System Automated</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${template.defaultPoc === 'Arctic' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {template.defaultPoc}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === template.id ? (
                      <input 
                        type="number"
                        className="w-20 bg-slate-100 border-none rounded-lg p-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                        value={editValues?.slaDays}
                        onChange={e => setEditValues({...editValues!, slaDays: parseInt(e.target.value)})}
                      />
                    ) : (
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        {template.slaDays}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === template.id ? (
                      <input 
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={editValues?.isMandatory}
                        onChange={e => setEditValues({...editValues!, isMandatory: e.target.checked})}
                      />
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${template.isMandatory ? 'bg-blue-500 shadow-sm shadow-blue-200' : 'bg-slate-200'}`} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === template.id ? (
                        <>
                          <button onClick={saveEdit} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(template)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteStage(template.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-blue-500 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900">Dynamic Workflow Engine</h4>
          <p className="text-sm text-blue-700 mt-1 leading-relaxed">
            Changes made here will be reflected in all <strong>new</strong> patent workflows. Existing patents maintain their historical stage snapshots to preserve audit integrity. For Core patents, the wizard will automatically select the subset of these stages based on the filing route (PCT, US, IN).
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
