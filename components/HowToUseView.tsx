
import React from 'react';
import { Play, Book, CheckCircle, Shield, Sliders, FileSpreadsheet } from 'lucide-react';

const HowToUseView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">How to use NovaPatent.</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Master the internal legal operations workflow for Newtrace. Follow these steps to map, track, and audit your IP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { icon: Shield, title: "1. Privacy First", desc: "All patent data entered here stays in your local browser. Nothing is used for AI training unless you use a Paid API Key." },
          { icon: Sliders, title: "2. Strategic Mapping", desc: "Start by selecting Core vs Non-Core classification. This automatically triggers different workflow templates." },
          { icon: Play, title: "3. Workflow Activation", desc: "Select 'Provisional' or 'Non-Provisional' to lock in the filing route, then use the dropdown to pick drafting stages." },
          { icon: FileSpreadsheet, title: "4. SLA & Fee Tracking", desc: "The engine predicts target deadlines. Monitor Arctic's 'Actual' dates to identify performance bottlenecks." },
        ].map((item, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex gap-6 group hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <item.icon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-900">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-600 rounded-[3rem] p-12 text-white flex flex-col items-center text-center space-y-6 shadow-2xl">
        <Book className="w-16 h-16 text-white/50" />
        <h3 className="text-3xl font-black">Need a deeper demo?</h3>
        <p className="text-blue-100 max-w-lg leading-relaxed font-medium">
          Contact the Newtrace IP Admin team for a full walkthrough of the Arctic Performance Analytics suite.
        </p>
        <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-50 active:scale-95 transition-all">
          Schedule Training
        </button>
      </div>
    </div>
  );
};

export default HowToUseView;
