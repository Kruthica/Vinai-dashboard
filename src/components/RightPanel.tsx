import { useState, useEffect, FormEvent } from 'react';
import { 
  Zap, 
  Moon, 
  Sun, 
  MapPin, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Send,
  Loader2,
  X
} from 'lucide-react';
import { Task } from '../types';

interface RightPanelProps {
  energyLevel: 'Low Energy' | 'Deep Focus' | 'High Energy';
  setEnergyLevel: (energy: 'Low Energy' | 'Deep Focus' | 'High Energy') => void;
  contextMode: string;
  setContextMode: (mode: string) => void;
  lifeModeEnabled: boolean;
  setLifeModeEnabled: (enabled: boolean) => void;
  tasks: Task[];
}

export default function RightPanel({
  energyLevel,
  setEnergyLevel,
  contextMode,
  setContextMode,
  lifeModeEnabled,
  setLifeModeEnabled,
  tasks,
}: RightPanelProps) {
  
  // Custom states for custom dynamic locations list
  const [contexts, setContexts] = useState<Array<{ name: string; emoji: string }>>(() => {
    const saved = localStorage.getItem('vinai_user_contexts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading user context locations list", e);
      }
    }
    return [
      { name: 'Home', emoji: '🏠' },
      { name: 'Office', emoji: '🏢' },
      { name: 'Cafe', emoji: '☕' }
    ];
  });

  const [showInput, setShowInput] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationEmoji, setNewLocationEmoji] = useState('📍');

  const handleCreateContext = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = newLocationName.trim();
    if (!cleanName) return;

    if (contexts.some(ctx => ctx.name.toLowerCase() === cleanName.toLowerCase())) {
      setShowInput(false);
      setNewLocationName('');
      return;
    }

    const updated = [...contexts, { name: cleanName, emoji: newLocationEmoji }];
    setContexts(updated);
    localStorage.setItem('vinai_user_contexts', JSON.stringify(updated));
    setContextMode(cleanName);

    setNewLocationName('');
    setShowInput(false);
  };

  const handleDeleteContext = (nameToDelete: string) => {
    const updated = contexts.filter(ctx => ctx.name !== nameToDelete);
    setContexts(updated);
    localStorage.setItem('vinai_user_contexts', JSON.stringify(updated));
    
    if (contextMode === nameToDelete) {
      if (updated.length > 0) {
        setContextMode(updated[0].name);
      } else {
        setContextMode('');
      }
    }
  };
  
  // Stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const score = totalTasks > 0 ? Math.round(75 + (completedTasks / totalTasks) * 20) : 87;

  return (
    <div className="w-80 flex flex-col h-full bg-[#FAFAF9]/90 dark:bg-[#0E1017]/90 border-l border-slate-200/60 dark:border-[#1F2437] p-4 justify-start overflow-y-auto shrink-0 gap-4 glass-panel">
      
      {/* CARD 1: ENERGY LEVEL */}
      <div className="bg-white dark:bg-slate-950/65 p-4 rounded-2xl border border-slate-100 dark:border-[#1F2437] space-y-3 shadow-sm premium-shadow">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1.5">
          <Zap size={10} className="text-vinai-terracotta" />
          Energy Level
        </h3>
        
        <div className="grid grid-cols-1 gap-2">
          {/* Low Energy */}
          <button
            onClick={() => setEnergyLevel('Low Energy')}
            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left border ${
              energyLevel === 'Low Energy'
                ? 'bg-vinai-indigo text-white border-transparent shadow-md shadow-vinai-indigo/15 dark:bg-indigo-600 dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                : 'bg-slate-50/60 dark:bg-[#151824]/50 text-slate-850 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-[#1D2132] border-slate-100 dark:border-[#1F2437]'
            }`}
          >
            <div>
              <p className="text-xs font-semibold">⚡ Low Energy</p>
              <p className={`text-[10px] mt-0.5 ${energyLevel === 'Low Energy' ? 'text-indigo-150' : 'text-slate-450 dark:text-slate-550'}`}>
                Busywork & admin tasks
              </p>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${energyLevel === 'Low Energy' ? 'bg-vinai-terracotta' : 'bg-transparent'}`} />
          </button>

          {/* Deep Focus */}
          <button
            onClick={() => setEnergyLevel('Deep Focus')}
            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left border ${
              energyLevel === 'Deep Focus'
                ? 'bg-vinai-indigo text-white border-transparent shadow-md shadow-vinai-indigo/15 dark:bg-indigo-600 dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                : 'bg-slate-50/60 dark:bg-[#151824]/50 text-slate-850 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-[#1D2132] border-slate-100 dark:border-[#1F2437]'
            }`}
          >
            <div>
              <p className="text-xs font-semibold">🧠 Deep Focus</p>
              <p className={`text-[10px] mt-0.5 ${energyLevel === 'Deep Focus' ? 'text-indigo-150' : 'text-slate-450 dark:text-slate-550'}`}>
                Complex creative workloads
              </p>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${energyLevel === 'Deep Focus' ? 'bg-vinai-terracotta' : 'bg-transparent'}`} />
          </button>

          {/* High Energy */}
          <button
            onClick={() => setEnergyLevel('High Energy')}
            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left border ${
              energyLevel === 'High Energy'
                ? 'bg-vinai-indigo text-white border-transparent shadow-md shadow-vinai-indigo/15 dark:bg-indigo-600 dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                : 'bg-slate-50/60 dark:bg-[#151824]/50 text-slate-850 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-[#1D2132] border-slate-100 dark:border-[#1F2437]'
            }`}
          >
            <div>
              <p className="text-xs font-semibold">🏃 High Energy</p>
              <p className={`text-[10px] mt-0.5 ${energyLevel === 'High Energy' ? 'text-indigo-150' : 'text-slate-450 dark:text-slate-550'}`}>
                Active, tactical push
              </p>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${energyLevel === 'High Energy' ? 'bg-vinai-terracotta' : 'bg-transparent'}`} />
          </button>
        </div>

        <p className="text-[10px] text-slate-500/95 dark:text-slate-400 leading-normal bg-slate-50/50 dark:bg-[#141724]/40 p-2.5 rounded-xl border border-slate-100/50 dark:border-[#1F2437] font-serif italic text-center">
          "Based on your schedule and focus history, {energyLevel} is recommended."
        </p>
      </div>

      {/* CARD 2: CONTEXT MODE */}
      <div className="bg-white dark:bg-slate-950/65 p-4 rounded-2xl border border-slate-100 dark:border-[#1F2437] space-y-3 shadow-sm premium-shadow">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1.5">
          <MapPin size={10} className="text-vinai-indigo dark:text-indigo-400" />
          Where Are You?
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {contexts.map((ctx) => {
            const isSelected = contextMode === ctx.name;
            return (
              <div
                key={ctx.name}
                className="group/location relative flex items-center"
              >
                <button
                  onClick={() => setContextMode(ctx.name)}
                  className={`py-1.5 pl-3 pr-7 rounded-full text-xs font-medium cursor-pointer transition-all duration-150 flex items-center gap-1.5 relative ${
                    isSelected
                      ? 'bg-vinai-indigo text-white shadow-xs font-semibold dark:bg-indigo-600'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#141723]/60 dark:hover:bg-[#1C2032] text-slate-650 dark:text-slate-350'
                  }`}
                >
                  <span>{ctx.emoji}</span>
                  <span>{ctx.name}</span>
                </button>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteContext(ctx.name);
                  }}
                  className={`absolute right-1.5 p-0.5 rounded-full hover:bg-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer ${
                    isSelected 
                      ? 'text-indigo-200 hover:bg-white/20 hover:text-white' 
                      : 'text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                  title={`Delete ${ctx.name}`}
                >
                  <X size={10} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}

          {/* Circle (+) button to trigger custom context creation */}
          <button
            onClick={() => setShowInput(!showInput)}
            className="w-7 h-7 rounded-full border border-dashed border-slate-300 dark:border-[#1F2437] hover:border-vinai-indigo dark:hover:border-indigo-400 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-vinai-indigo dark:hover:text-indigo-400 text-xs font-bold transition-all cursor-pointer active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            title="Register dynamic custom location"
          >
            +
          </button>
        </div>

        {/* Dynamic Context addition controller */}
        {showInput && (
          <form onSubmit={handleCreateContext} className="mt-2.5 p-2 bg-slate-50/50 dark:bg-[#111421]/50 border border-slate-150/40 dark:border-[#1F2437] rounded-xl flex items-center gap-1.5 shadow-sm">
            <input
              type="text"
              value={newLocationEmoji}
              onChange={(e) => {
                const text = e.target.value.trim();
                if (text.length <= 2) setNewLocationEmoji(text);
              }}
              placeholder="📍"
              className="w-8 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#1F2437] text-center text-xs py-1 rounded-md text-slate-800 dark:text-slate-200"
              title="Location Icon"
            />
            <input
              type="text"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              placeholder="Location name..."
              required
              className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#1F2437] px-2 py-1 text-xs rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            <button
              type="submit"
              className="py-1 px-2.5 bg-vinai-indigo dark:bg-indigo-650 hover:bg-vinai-indigo/90 text-white rounded-md text-[10px] font-bold cursor-pointer"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="py-1 px-2 border border-slate-200 dark:border-[#1F2437] text-slate-400 dark:hover:text-slate-300 rounded-md text-[10px] cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}

        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 dark:text-slate-550 justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Context detected automatically</span>
        </div>
      </div>

      {/* CARD 3: WORK-LIFE BOUNDARY */}
      <div className="bg-white dark:bg-slate-950/65 p-4 rounded-2xl border border-slate-100 dark:border-[#1F2437] space-y-2.5 shadow-sm premium-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1.5">
            <ShieldAlert size={10} className="text-vinai-terracotta" />
            Life Mode
          </h3>
          
          {/* Animated Toggle Switch */}
          <button
            onClick={() => setLifeModeEnabled(!lifeModeEnabled)}
            className={`w-9 h-5 rounded-full transition-colors duration-200 relative ${
              lifeModeEnabled ? 'bg-vinai-indigo dark:bg-indigo-600' : 'bg-slate-200 dark:bg-[#1B1E2E]'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all transform duration-200 ${
                lifeModeEnabled ? 'translate-x-4' : 'translate-x-0'
              } flex items-center justify-center`}
            >
              <div className={`w-1 h-1 rounded-full ${lifeModeEnabled ? 'bg-vinai-indigo d-bg-indigo-600' : 'bg-slate-400'}`} />
            </div>
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Hide all work tasks after 6 PM
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
            Protect your personal time and reduce burnout.
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-1.5 py-0.5 rounded-md ${
              lifeModeEnabled ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
            }`}>
              {lifeModeEnabled ? 'Status: Active Guardian' : 'Status: Off'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
