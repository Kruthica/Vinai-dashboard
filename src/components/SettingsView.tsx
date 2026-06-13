import React, { useState } from 'react';
import { 
  Palette, 
  User, 
  Clock, 
  Sparkles, 
  Volume2, 
  Check, 
  Sliders, 
  Trash2,
  Lock,
  ArrowRight
} from 'lucide-react';

export interface ThemePreset {
  id: string;
  name: string;
  indigo: string;          // Primary accent color (light mode)
  terracotta: string;      // Secondary accent color (light mode)
  indigoDark?: string;     // Primary accent color (dark mode)
  terracottaDark?: string; // Secondary accent color (dark mode)
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'royal', name: 'Midnight Royal', indigo: '#1E2A78', terracotta: '#C97A56', indigoDark: '#818CF8', terracottaDark: '#FFA07A' },
  { id: 'emerald', name: 'Emerald Forest', indigo: '#115E59', terracotta: '#D97706', indigoDark: '#34D399', terracottaDark: '#FBBF24' },
  { id: 'nordic', name: 'Nordic Aurora', indigo: '#0F766E', terracotta: '#F97316', indigoDark: '#2DD4BF', terracottaDark: '#FB923C' },
  { id: 'sunset', name: 'Vibrant Sunset', indigo: '#701A75', terracotta: '#F43F5E', indigoDark: '#E879F9', terracottaDark: '#FB7185' },
  { id: 'charcoal', name: 'Cosmic Charcoal', indigo: '#334155', terracotta: '#EF4444', indigoDark: '#94A3B8', terracottaDark: '#F87171' },
  { id: 'rosewood', name: 'Rosewood', indigo: '#881337', terracotta: '#EC4899', indigoDark: '#F472B6', terracottaDark: '#FDA4AF' },
];

interface SettingsViewProps {
  userName: string;
  setUserName: (name: string) => void;
  userTagline: string;
  setUserTagline: (tagline: string) => void;
  focusTarget: number;
  setFocusTarget: (target: number) => void;
  focusDuration: number;
  setFocusDuration: (dur: number) => void;
  breakDuration: number;
  setBreakDuration: (dur: number) => void;
  productiveStart: string;
  setProductiveStart: (start: string) => void;
  productiveEnd: string;
  setProductiveEnd: (end: string) => void;
  enableRestBounds: boolean;
  setEnableRestBounds: (val: boolean) => void;
  muteDistractions: boolean;
  setMuteDistractions: (val: boolean) => void;
  alertTone: string;
  setAlertTone: (tone: string) => void;
  activeTheme: ThemePreset;
  setActiveTheme: (theme: ThemePreset) => void;
  onAddNotification: (text: string) => void;
  darkMode: boolean;
}

export default function SettingsView({
  userName,
  setUserName,
  userTagline,
  setUserTagline,
  focusTarget,
  setFocusTarget,
  focusDuration,
  setFocusDuration,
  breakDuration,
  setBreakDuration,
  productiveStart,
  setProductiveStart,
  productiveEnd,
  setProductiveEnd,
  enableRestBounds,
  setEnableRestBounds,
  muteDistractions,
  setMuteDistractions,
  alertTone,
  setAlertTone,
  activeTheme,
  setActiveTheme,
  onAddNotification,
  darkMode,
}: SettingsViewProps) {
  // Temporary component state for save notification indication
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    // Write variables manually to localStorage
    localStorage.setItem('vinai-username', userName);
    localStorage.setItem('vinai-tagline', userTagline);
    localStorage.setItem('vinai-focus-target', String(focusTarget));
    localStorage.setItem('vinai-focus-duration', String(focusDuration));
    localStorage.setItem('vinai-break-duration', String(breakDuration));
    localStorage.setItem('vinai-prod-start', productiveStart);
    localStorage.setItem('vinai-prod-end', productiveEnd);
    localStorage.setItem('vinai-rest-bounds', String(enableRestBounds));
    localStorage.setItem('vinai-mute-dist', String(muteDistractions));
    localStorage.setItem('vinai-alert-tone', alertTone);

    setSaveSuccess(true);
    onAddNotification('System configuration and customized color theme successfully synchronized.');
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleResetToDefault = () => {
    if (confirm("Reset configuration settings to default?")) {
      setUserName('Alex Rivera');
      setUserTagline('deep-focus-active');
      setFocusTarget(4);
      setFocusDuration(45);
      setBreakDuration(10);
      setProductiveStart('09:00 AM');
      setProductiveEnd('12:00 PM');
      setEnableRestBounds(false);
      setMuteDistractions(true);
      setAlertTone('Warm Chime');
      setActiveTheme(THEME_PRESETS[0]);
      onAddNotification('Configuration settings restored to default values.');
    }
  };

  return (
    <div id="settings-view-workspace" className="space-y-6 max-w-4xl pb-12 animate-fade-in">
      
      {/* Settings Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-vinai-terracotta font-semibold">User Configuration Center</span>
          <h2 className="text-2xl font-serif italic text-slate-900 dark:text-neutral-50 tracking-tight mt-1">
            System Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Optimize your workspace habits, notification routines, and customize visual theme palette bounds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-[#1F2437] rounded-xl font-medium transition-all cursor-pointer bg-white/40 dark:bg-slate-950/20"
          >
            Reset Defaults
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-1.5 text-xs bg-vinai-indigo text-white dark:bg-indigo-650 rounded-xl font-semibold hover:bg-vinai-indigo/90 shadow-sm transition-all cursor-pointer"
          >
            Save All Changes
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span><strong>Settings successfully applied!</strong> Brand accents updated in real-time.</span>
        </div>
      )}

      {/* Grid segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* COMPONENT 1: Theme Accents Preset */}
        <div className="bg-white dark:bg-slate-950/65 p-5 rounded-2xl border border-slate-150 dark:border-[#1F2437] space-y-4 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center gap-2">
            <Palette size={14} className="text-vinai-terracotta" />
            Dashboard Accent Themes
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            Choose a dual-accent brand system. Changing this option dynamically recolors your sidebar elements, active deep-focus panels, CTA states, and layout accents.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {THEME_PRESETS.map((preset) => {
              const isSelected = activeTheme.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setActiveTheme(preset);
                    // Automatically trigger notifications about color update
                    onAddNotification(`Active mood theme set to: "${preset.name}"`);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-vinai-indigo bg-vinai-indigo/[0.04] dark:bg-[#1E233A]/20 ring-2 ring-vinai-indigo/15'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-200 dark:hover:border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`text-xs font-medium ${isSelected ? 'text-slate-800 dark:text-slate-100 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                      {preset.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {/* Color Dot 1 */}
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner flex shrink-0" style={{ backgroundColor: darkMode ? (preset.indigoDark || preset.indigo) : preset.indigo }} />
                      {/* Color Dot 2 */}
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner flex shrink-0" style={{ backgroundColor: darkMode ? (preset.terracottaDark || preset.terracotta) : preset.terracotta }} />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-vinai-indigo text-white flex items-center justify-center shadow-xs">
                      <Check size={11} className="stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* COMPONENT 2: User Profile Settings */}
        <div className="bg-white dark:bg-slate-950/65 p-5 rounded-2xl border border-slate-150 dark:border-[#1F2437] space-y-4 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center gap-2">
            <User size={14} className="text-vinai-terracotta" />
            User Card Profile Context
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            Update your identity constraints. These variables render dynamic text attributes in the active control bar and the sidebar index card.
          </p>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">User Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-[#1F2437] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-vinai-indigo focus:outline-none focus:bg-white text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Restoration Tagline / Status</label>
              <input
                type="text"
                value={userTagline}
                onChange={(e) => setUserTagline(e.target.value)}
                placeholder="e.g. deep-focus-active"
                className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-[#1F2437] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-vinai-indigo focus:outline-none focus:bg-white text-slate-800 dark:text-slate-200"
              />
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-vinai-indigo to-indigo-400 flex items-center justify-center text-white relative font-semibold text-sm shadow-inner shrink-0">
                {userName ? userName.charAt(0).toUpperCase() : 'A'}
                <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white dark:border-slate-950" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                  {userName || "Alex Rivera"}
                </p>
                <p className="text-[10px] text-slate-400 italic truncate mt-0.5">
                  Live Preview: {userTagline || "focus-active"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COMPONENT 3: Focus & Mindful Metric Targets */}
        <div className="bg-white dark:bg-slate-950/65 p-5 rounded-2xl border border-slate-150 dark:border-[#1F2437] space-y-4 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center gap-2">
            <Clock size={14} className="text-emerald-500" />
            Focus Sessions & Habit Targets
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            Calibrate intervals to optimize cognitive retention. Custom work boundaries defend against sensory fatigue.
          </p>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Daily Focus Count Target</label>
                <span className="font-mono text-vinai-indigo dark:text-indigo-400 font-bold">{focusTarget} shifts</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={focusTarget}
                onChange={(e) => setFocusTarget(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-vinai-indigo"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">Session Duration</label>
                <select
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(Number(e.target.value))}
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-[#1F2437] rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value={20}>20 minutes</option>
                  <option value={25}>25 minutes (Standard)</option>
                  <option value={40}>40 minutes</option>
                  <option value={45}>45 minutes (Strategic)</option>
                  <option value={60}>60 minutes (Deep Focus)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">Short Rest Duration</label>
                <select
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Number(e.target.value))}
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-[#1F2437] rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes (Optimal)</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* COMPONENT 4: Chronotype & Peak Focus intervals */}
        <div className="bg-white dark:bg-slate-950/65 p-5 rounded-2xl border border-slate-150 dark:border-[#1F2437] space-y-4 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center gap-2">
            <Sliders size={14} className="text-amber-500" />
            Biometric Synchronicity
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            Control dynamic notification locks and task scheduling recomendations during peak physiological circadian times.
          </p>

          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">Productive Hours Start</label>
                <input
                  type="text"
                  value={productiveStart}
                  onChange={(e) => setProductiveStart(e.target.value)}
                  placeholder="09:00 AM"
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-[#1F2437] rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 text-center"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">Productive Hours End</label>
                <input
                  type="text"
                  value={productiveEnd}
                  onChange={(e) => setProductiveEnd(e.target.value)}
                  placeholder="12:00 PM"
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-[#1F2437] rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 text-center"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/10 p-3 rounded-xl border border-slate-100 dark:border-[#1F2437] cursor-pointer hover:bg-slate-100/50 transition-colors">
              <input
                type="checkbox"
                checked={enableRestBounds}
                onChange={(e) => setEnableRestBounds(e.target.checked)}
                className="rounded text-vinai-indigo focus:ring-vinai-indigo w-4 h-4 cursor-pointer"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-850 dark:text-slate-200">Enable Automated Rest Limits</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Defends cognitive reserve during continuous low-energy intervals.</p>
              </div>
            </label>
          </div>
        </div>

        {/* COMPONENT 5: Quiet Hours & Notification Sounds */}
        <div className="bg-white dark:bg-slate-950/65 p-5 rounded-2xl border border-slate-150 dark:border-[#1F2437] space-y-4 md:col-span-2 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center gap-2">
            <Volume2 size={14} className="text-indigo-500" />
            Distraction Shielding & Auditory Alerts
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <div className="space-y-4">
              <label className="flex items-start gap-3 bg-slate-50/50 dark:bg-slate-900/5 p-3 rounded-xl border border-slate-100 dark:border-slate-850/50 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={muteDistractions}
                  onChange={(e) => setMuteDistractions(e.target.checked)}
                  className="rounded text-vinai-indigo focus:ring-vinai-indigo w-4 h-4 mt-0.5 cursor-pointer"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-850 dark:text-slate-200">Mute Distractions During Sessions</p>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Automatically dismiss extraneous client-side system requests and quiet active telemetry lines when a focus commitment timer is running.</p>
                </div>
              </label>
            </div>

            <div className="space-y-1.5 justify-center flex flex-col">
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Notification Sound Alert Tone</label>
              <select
                value={alertTone}
                onChange={(e) => {
                  setAlertTone(e.target.value);
                  onAddNotification(`Circadian sound alert theme calibrated to: "${e.target.value}"`);
                }}
                className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-[#1F2437] rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Warm Chime">🔔 Warm Chime (Harmonic Bell)</option>
                <option value="Gentle Ripple">🌊 Gentle Ripple (Soft Water Drop)</option>
                <option value="Wood block">🪵 Restful Wood Block (Zen Tap)</option>
                <option value="Silent Alert">🔕 Silent Indicator (Visual Flare Only)</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Save Button Footer section */}
      <div className="flex items-center justify-between p-4 bg-[#FAFAF9]/80 dark:bg-[#121522]/80 border border-slate-200/50 dark:border-[#1F2437] rounded-2xl">
        <span className="text-[11px] text-slate-500 font-mono tracking-tight flex items-center gap-1.5">
          <Lock size={12} className="text-vinai-terracotta" />
          Settings are stored locally in the secure browser compartment.
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2 bg-vinai-indigo hover:bg-vinai-indigo/95 dark:bg-indigo-650 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer rounded-xl flex items-center gap-2 hover:-translate-y-0.5"
        >
          <span>Save Changes</span>
          <ArrowRight size={13} />
        </button>
      </div>

    </div>
  );
}
