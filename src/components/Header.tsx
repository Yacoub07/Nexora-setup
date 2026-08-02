import React from 'react';
import { Terminal, Stethoscope, FolderGit2, TestTube2, Code2, BookOpen, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunDoctor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onRunDoctor }) => {
  const tabs = [
    { id: 'terminal', label: 'CLI TERMINAL', icon: Terminal },
    { id: 'doctor', label: 'DOCTOR DIAGNOSTICS', icon: Stethoscope },
    { id: 'workspace', label: 'WORKSPACE ARCHITECT', icon: FolderGit2 },
    { id: 'tests', label: 'TEST SUITE', icon: TestTube2 },
    { id: 'codebase', label: 'CODE EXPLORER', icon: Code2 },
    { id: 'docs', label: 'DOCS HUB', icon: BookOpen },
  ];

  return (
    <header className="bg-[#1e293b] border-b border-[#334155] text-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight text-white uppercase font-mono">
                  NEXORA FORGE <span className="font-normal opacity-60 text-xs">v0.1.0</span>
                </span>
                <span className="hidden sm:inline-block bg-slate-800 text-sky-400 border border-slate-700 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                  SPRINT 1
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="hidden md:flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Python 3.12+ Clean Arch
            </span>
            <button
              onClick={onRunDoctor}
              className="px-3 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-900 rounded-md transition-colors flex items-center shadow-md cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 mr-1.5" />
              RUN DOCTOR
            </button>
            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-slate-950 text-xs font-extrabold shadow-sm">
              LE
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-medium transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-sky-400 text-sky-400 font-bold bg-slate-800/60'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

