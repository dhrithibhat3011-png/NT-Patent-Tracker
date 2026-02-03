
import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  FolderSearch, 
  Plus, 
  Search, 
  Settings,
  Menu,
  X,
  History as HistoryIcon,
  PlayCircle,
  Home as HomeIcon,
  BarChart3,
  Sliders
} from 'lucide-react';
import { Patent, ViewMode, TaskStatus } from './types';
import HomeView from './components/HomeView';
import PortfolioView from './components/PortfolioView';
import HistoryView from './components/HistoryView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import PatentDetailModal from './components/PatentDetailModal';
import NewPatentModal from './components/NewPatentModal';
import { initialPatents } from './mockData';
import { STAGE_TEMPLATES as defaultTemplates } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('Home');
  const [patents, setPatents] = useState<Patent[]>(initialPatents);
  const [stageTemplates, setStageTemplates] = useState(defaultTemplates);
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [isNewPatentModalOpen, setIsNewPatentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [trackerTitle, setTrackerTitle] = useState('Operational Tracker: Newtrace vs. Arctic Performance');

  const filteredPatents = useMemo(() => {
    return patents.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.refId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patents, searchTerm]);

  const updatePatent = (updated: Patent) => {
    const current = updated.stages.find(s => s.id === updated.currentStageId);
    const completedCount = updated.stages.filter(s => s.status === TaskStatus.COMPLETED).length;
    updated.autoSummary = `Currently: ${current?.name} (${Math.round((completedCount/updated.stages.length)*100)}% progress).`;
    
    setPatents(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (selectedPatent?.id === updated.id) setSelectedPatent(updated);
  };

  const addPatent = (newPatent: Patent) => {
    setPatents(prev => [newPatent, ...prev]);
  };

  const deletePatent = (id: string) => {
    setPatents(prev => prev.filter(p => p.id !== id));
    setSelectedPatent(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar - The "3 lines" menu */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/40">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase">NovaPatent</h1>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {[
              { id: 'Home', icon: HomeIcon, label: 'Home & Protocol' },
              { id: 'Portfolio', icon: FolderSearch, label: 'Patents List' },
              { id: 'History', icon: HistoryIcon, label: 'Audit History' },
              { id: 'Analytics', icon: BarChart3, label: 'Analytics', adminOnly: true },
            ].map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => { setView(item.id as ViewMode); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${view === item.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-2">
            <button 
              onClick={() => { setView('Settings'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all ${view === 'Settings' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Sliders className="w-5 h-5" />
              <span className="font-bold text-sm">Edit Workflows</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsNewPatentModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Asset
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {view === 'Home' && <HomeView patents={patents} setView={setView} />}
          {view === 'Portfolio' && (
            <PortfolioView 
              patents={filteredPatents} 
              onSelect={setSelectedPatent} 
              isAdmin={isAdmin} 
              title={trackerTitle} 
              setTitle={setTrackerTitle} 
            />
          )}
          {view === 'History' && <HistoryView patents={patents} />}
          {view === 'Analytics' && <AnalyticsView patents={patents} />}
          {view === 'Settings' && <SettingsView templates={stageTemplates} setTemplates={setStageTemplates} />}
        </div>
      </main>

      {selectedPatent && (
        <PatentDetailModal 
          patent={selectedPatent} 
          onClose={() => setSelectedPatent(null)} 
          onUpdate={updatePatent}
          onDelete={deletePatent}
        />
      )}

      {isNewPatentModalOpen && (
        <NewPatentModal 
          onClose={() => setIsNewPatentModalOpen(false)} 
          templates={stageTemplates}
          onSave={(p) => { addPatent(p); setIsNewPatentModalOpen(false); }} 
        />
      )}
    </div>
  );
};

export default App;
