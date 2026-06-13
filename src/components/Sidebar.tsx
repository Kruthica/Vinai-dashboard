import { 
  Compass, 
  Calendar, 
  Sparkles, 
  Layers, 
  Settings, 
  HelpCircle, 
  Plus, 
  Clock, 
  Inbox, 
  User,
  Activity
} from 'lucide-react';
import { NavigationItem } from '../types';

interface SidebarProps {
  activeView: NavigationItem;
  setActiveView: (view: NavigationItem) => void;
  selectedProject: string | null;
  setSelectedProject: (project: string | null) => void;
  onQuickCaptureClick: () => void;
  userName?: string;
  userTagline?: string;
}

export default function Sidebar({
  activeView,
  setActiveView,
  selectedProject,
  setSelectedProject,
  onQuickCaptureClick,
  userName = 'Alex Rivera',
  userTagline = 'deep-focus-active',
}: SidebarProps) {
  const navItems: { id: NavigationItem; label: string; icon: any }[] = [
    { id: 'Inbox', label: 'Universal Inbox', icon: Inbox },
    { id: 'Today', label: 'Today', icon: Activity },
    { id: 'Next 7 Days', label: 'Next 7 Days', icon: Calendar },
    { id: 'Calendar View', label: 'Calendar View', icon: Compass },
    { id: 'Focus Sessions', label: 'Focus Sessions', icon: Clock },
  ];

  const projects = [
    { name: 'Work', hash: '#Work', color: 'bg-indigo-500' },
    { name: 'Personal', hash: '#Personal', color: 'bg-terracotta' },
    { name: 'Side Hustle', hash: '#Side Hustle', color: 'bg-emerald-500' },
    { name: 'Learning', hash: '#Learning', color: 'bg-amber-500' }
  ];

  return (
    <div className="w-68 flex flex-col h-full bg-[#FAFAF9]/90 dark:bg-[#0E1017]/90 border-r border-slate-200/60 dark:border-[#1F2437] px-4 py-6 justify-between shrink-0 glass-panel">
      {/* Top Brand Logo and Tagline */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-vinai-indigo flex items-center justify-center font-bold text-lg text-white shadow-md shadow-vinai-indigo/20">
              V
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-vinai-terracotta border-2 border-white dark:border-slate-800" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
              Vinai
            </h1>
            <p className="text-[10px] text-slate-500/90 dark:text-slate-400 font-mono tracking-widest uppercase">
              Mindful Core
            </p>
          </div>
        </div>

        {/* Primary Command CTA */}
        <button
          onClick={onQuickCaptureClick}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-vinai-indigo hover:bg-vinai-indigo/90 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-md shadow-vinai-indigo/10 hover:shadow-lg active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-2 uppercase tracking-wider">
            Control Room
          </p>
          <nav className="space-y-0.5 pt-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isSelected = activeView === item.id && !selectedProject;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSelectedProject(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-[#1E2235]/80 text-vinai-indigo dark:text-indigo-400 border border-slate-200/10 dark:border-[#383F5D]/30 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#121522]/60 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp size={15} className={isSelected ? 'text-vinai-indigo dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600'} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'Inbox' && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                      3
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Projects Filter List */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-2 uppercase tracking-wider">
            Commitments
          </p>
          <div className="space-y-0.5 pt-1">
            {projects.map((proj) => {
              const isSelected = selectedProject === proj.name;
              return (
                <button
                  key={proj.name}
                  onClick={() => setSelectedProject(isSelected ? null : proj.name)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-350 bg-vinai-indigo/5 dark:bg-indigo-950/40 text-vinai-indigo dark:text-indigo-400 border border-vinai-indigo/10 dark:border-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50/55 dark:hover:bg-[#121522]/60 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${proj.color === 'bg-terracotta' ? 'bg-vinai-terracotta' : proj.color}`} />
                    <span className="font-sans">{proj.hash}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-vinai-indigo dark:bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Settings and User Profile */}
      <div className="space-y-4 pt-4 border-t border-slate-150 dark:border-[#1F2437]">
        <div className="space-y-0.5">
          <button 
            onClick={() => {
              setActiveView('Settings');
              setSelectedProject(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'Settings'
                ? 'bg-slate-100 dark:bg-[#1E2235]/80 text-vinai-indigo dark:text-indigo-400 border border-slate-200/55 dark:border-[#383F5D]/30 shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#121522]/60 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-2 bg-slate-50/70 dark:bg-[#121522]/40 rounded-xl border border-slate-150/50 dark:border-[#1F2437]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-vinai-indigo to-indigo-400 flex items-center justify-center text-white relative font-semibold text-xs shadow-inner shrink-0">
            {userName ? userName.charAt(0).toUpperCase() : 'A'}
            <div className="absolute right-0 bottom-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
              {userName}
            </p>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">
              {userTagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
