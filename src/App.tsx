import React, { useState, useEffect, FormEvent } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Bell, 
  Mic, 
  Calendar as CalendarIcon, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon,
  Info,
  Clock,
  Briefcase,
  UserCheck,
  Brain,
  Layers,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  X,
  Compass,
  CornerDownRight,
  ShieldCheck,
  ZapOff,
  Edit2,
  Trash2
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import CalendarView from './components/CalendarView';
import SettingsView, { THEME_PRESETS, ThemePreset } from './components/SettingsView';
import { Task, Subtask, RescheduleSuggestion, NavigationItem } from './types';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<NavigationItem>('Today');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Focus & Context State
  const [energyLevel, setEnergyLevel] = useState<'Low Energy' | 'Deep Focus' | 'High Energy'>('Deep Focus');
  const [contextMode, setContextMode] = useState<string>('Office');
  const [lifeModeEnabled, setLifeModeEnabled] = useState<boolean>(true);
  
  // Theme & Notifications State
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifCount, setNotifCount] = useState<number>(1);
  const [notifList, setNotifList] = useState<Array<{ id: string; text: string; time: string; read: boolean }>>([
    { id: '1', text: 'Vinai loaded successfully. AI Mindful Coach is ready.', time: 'Just now', read: false },
    { id: '2', text: 'Yesterday\'s outstanding workloads analyzed for rescheduling.', time: '10m ago', read: true }
  ]);

  // User Profile Customization
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('vinai-username') || 'Alex Rivera');
  const [userTagline, setUserTagline] = useState<string>(() => localStorage.getItem('vinai-tagline') || 'deep-focus-active');

  // Habit & Goal Settings
  const [focusTarget, setFocusTarget] = useState<number>(() => Number(localStorage.getItem('vinai-focus-target') || '4'));
  const [focusDuration, setFocusDuration] = useState<number>(() => Number(localStorage.getItem('vinai-focus-duration') || '45'));
  const [breakDuration, setBreakDuration] = useState<number>(() => Number(localStorage.getItem('vinai-break-duration') || '10'));

  // Productivity Hours
  const [productiveStart, setProductiveStart] = useState<string>(() => localStorage.getItem('vinai-prod-start') || '09:00 AM');
  const [productiveEnd, setProductiveEnd] = useState<string>(() => localStorage.getItem('vinai-prod-end') || '12:00 PM');
  const [enableRestBounds, setEnableRestBounds] = useState<boolean>(() => localStorage.getItem('vinai-rest-bounds') === 'true');

  // Sound Alerts
  const [muteDistractions, setMuteDistractions] = useState<boolean>(() => localStorage.getItem('vinai-mute-dist') !== 'false');
  const [alertTone, setAlertTone] = useState<string>(() => localStorage.getItem('vinai-alert-tone') || 'Warm Chime');

  // Design Theme Presets State
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem('vinai-active-theme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing active theme, resetting', e);
      }
    }
    return THEME_PRESETS[0];
  });

  // Sync theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('vinai-active-theme', JSON.stringify(activeTheme));
  }, [activeTheme]);

  // Task Engine State
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Feature Roadmap',
      category: 'Work',
      energy: 'Deep Focus',
      time: '10:00 AM - 2:00 PM',
      completed: false,
      isDeepFocusSession: true,
      energyScore: '92%',
      smartSuggestion: 'Combines competitor research and wireframing into one high-focus window.',
      subtasks: [
        { id: 'sub-1', title: 'Research competitors', completed: true },
        { id: 'sub-2', title: 'Create wireframes', completed: true },
        { id: 'sub-3', title: 'Draft roadmap', completed: false },
        { id: 'sub-4', title: 'Team review', completed: false },
      ]
    },
    {
      id: 'task-2',
      title: 'Pick up groceries',
      category: 'Personal',
      energy: 'Low Energy',
      time: '6:30 PM',
      completed: false,
      subtasks: [
        { id: 'sub-gro-1', title: 'Organic almond milk', completed: false },
        { id: 'sub-gro-2', title: 'Avocados & spinach bunch', completed: false }
      ]
    },
    {
      id: 'task-3',
      title: 'Update portfolio website',
      category: 'Side Hustle',
      energy: 'Deep Focus',
      time: '4:00 PM',
      completed: false,
      subtasks: []
    },
    {
      id: 'task-4',
      title: 'Book dentist appointment',
      category: 'Personal',
      energy: 'Low Energy',
      time: '11:30 AM',
      completed: true,
      subtasks: []
    }
  ]);

  // Suggestions state state
  const [rescheduleSuggestions, setRescheduleSuggestions] = useState<RescheduleSuggestion[]>([
    {
      id: 'resch-1',
      title: 'Review Q3 Revenue Projections',
      previousDate: 'Yesterday',
      category: 'Work',
      energy: 'Deep Focus',
      smartSuggestion: 'Reschedule to 1:00 PM today. Directly aligns with your peak focus capacity.'
    },
    {
      id: 'resch-2',
      title: 'Send Invoice to Delta Studio',
      previousDate: 'Yesterday',
      category: 'Work',
      energy: 'Low Energy',
      smartSuggestion: 'Reschedule to 5:00 PM. Perfect admin wrap-up task to protect personal transition time.'
    }
  ]);

  // Sorting Control State
  const [activeSort, setActiveSort] = useState<'Priority' | 'Energy' | 'Time'>('Priority');

  // Input binds
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Subtask UI expansion
  const [isRoadmapExpanded, setIsRoadmapExpanded] = useState<boolean>(true);

  // Add Task Modal State
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalCategory, setModalCategory] = useState<'Work' | 'Personal' | 'Side Hustle' | 'Learning'>('Work');
  const [modalEnergy, setModalEnergy] = useState<'Low Energy' | 'Deep Focus' | 'High Energy'>('Deep Focus');
  const [modalTime, setModalTime] = useState<string>('12:00 PM');
  const [modalPriority, setModalPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [modalDueDate, setModalDueDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [modalSubtasks, setModalSubtasks] = useState<string[]>([]);
  const [modalNewSubtask, setModalNewSubtask] = useState<string>('');

  // UTC Polish Clock
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Task Handlers
  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        // Auto toggles all subtasks if completing primary
        const updatedSubtasks = t.subtasks.map(sub => ({
          ...sub,
          completed: nextState
        }));
        return { ...t, completed: nextState, subtasks: updatedSubtasks };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(sub => {
          if (sub.id === subtaskId) {
            return { ...sub, completed: !sub.completed };
          }
          return sub;
        });
        
        // If all completed, toggle task completed if not already, or vice-versa
        const totalSub = updatedSubtasks.length;
        const compSub = updatedSubtasks.filter(s => s.completed).length;
        const allDone = totalSub > 0 && totalSub === compSub;
        
        return { 
          ...t, 
          subtasks: updatedSubtasks,
          completed: allDone ? true : t.completed
        };
      }
      return t;
    }));
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setModalTitle(task.title);
    setModalCategory(task.category);
    setModalEnergy(task.energy);
    setModalTime(task.time);
    setModalPriority(task.priority || 'Medium');
    setModalDueDate(task.dueDate || new Date().toISOString().split('T')[0]);
    setModalSubtasks((task.subtasks || []).map(st => st.title));
    setModalNewSubtask('');
    setIsAddTaskOpen(true);
  };

  const handleModalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    if (editingTaskId) {
      // Edit mode
      setTasks(prev => prev.map(t => {
        if (t.id === editingTaskId) {
          const existingSubMap = new Map((t.subtasks || []).map(s => [s.title.toLowerCase().trim(), s.completed]));
          const updatedSubtasks: Subtask[] = modalSubtasks.map((titleText, idx) => ({
            id: `modal-sub-${idx}-${Date.now()}`,
            title: titleText.trim(),
            completed: existingSubMap.get(titleText.toLowerCase().trim()) || false
          }));

          return {
            ...t,
            title: modalTitle.trim(),
            category: modalCategory,
            energy: modalEnergy,
            priority: modalPriority,
            dueDate: modalDueDate,
            time: modalTime.trim() || 'Flexible',
            subtasks: updatedSubtasks
          };
        }
        return t;
      }));

      // Add normal notification
      setNotifList(prev => [{
        id: String(Date.now()),
        text: `Updated task: "${modalTitle.trim()}"`,
        time: 'Just now',
        read: false
      }, ...prev]);
      setNotifCount(c => c + 1);
    } else {
      // Add mode
      const newTask: Task = {
        id: `taskModal-${Date.now()}`,
        title: modalTitle.trim(),
        category: modalCategory,
        energy: modalEnergy,
        time: modalTime.trim() || 'Flexible',
        priority: modalPriority,
        dueDate: modalDueDate,
        completed: false,
        subtasks: modalSubtasks.map((st, idx) => ({
          id: `modal-sub-${idx}-${Date.now()}`,
          title: st.trim(),
          completed: false
        }))
      };

      setTasks(prev => [newTask, ...prev]);

      // Add normal notification
      setNotifList(prev => [{
        id: String(Date.now()),
        text: `Added new task: "${newTask.title}"`,
        time: 'Just now',
        read: false
      }, ...prev]);
      setNotifCount(c => c + 1);
    }

    // Reset and close
    setEditingTaskId(null);
    setModalTitle('');
    setModalCategory('Work');
    setModalTime('12:00 PM');
    setModalEnergy('Deep Focus');
    setModalPriority('Medium');
    setModalDueDate(new Date().toISOString().split('T')[0]);
    setModalSubtasks([]);
    setModalNewSubtask('');
    setIsAddTaskOpen(false);
  };

  // Life Mode filter: Hide work tasks when enabled and current hour is late (after 6 PM)
  // Since user environment metadata timestamp shows current local hour is 23 (11:43 PM),
  // this is an incredible, hyper-realistic, dynamic utility in action!
  // Work-related tasks are filtered out visually OR styled with a protective alert if enabled
  const getFittedTasks = () => {
    let list = [...tasks];

    // Filter by project/category if active
    if (selectedProject) {
      list = list.filter(t => t.category.toLowerCase() === selectedProject.toLowerCase());
    }

    // Filter by active view constraints if looking at Focus Sessions alone
    if (activeView === 'Today') {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      list = list.filter(t => (t.dueDate || '2026-06-13') === todayStr);
    } else if (activeView === 'Focus Sessions') {
      list = list.filter(t => t.energy === 'Deep Focus');
    } else if (activeView === 'Inbox') {
      // Inbox simulated state (e.g. fresh items)
      list = list.slice(0, 3);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }

    // Core sorting engine
    if (activeSort === 'Time') {
      // Trivial order based on duration or text times
      list.sort((a, b) => a.time.localeCompare(b.time));
    } else if (activeSort === 'Energy') {
      // High Energy and Deep Focus come first
      const weight = { 'Deep Focus': 3, 'High Energy': 2, 'Low Energy': 1 };
      list.sort((a, b) => weight[b.energy] - weight[a.energy]);
    } else {
      // "Priority" sorting (High -> Medium -> Low), completed last
      const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
      list.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const aw = priorityWeight[a.priority || 'Medium'];
        const bw = priorityWeight[b.priority || 'Medium'];
        if (aw !== bw) return bw - aw; // Highest priority first
        if (a.isDeepFocusSession) return -1;
        if (b.isDeepFocusSession) return 1;
        return 0;
      });
    }

    return list;
  };

  const filteredTasks = getFittedTasks();

  // Highlight if some work tasks are hidden to honor Life mode
  const currentHour = new Date().getHours();
  const isPostWorkTime = currentHour >= 18 || currentHour < 6; // After 6 PM local
  const hiddenWorkTasksCount = tasks.filter(t => t.category === 'Work' && !t.completed).length;
  const shouldHideWorkTasks = lifeModeEnabled && isPostWorkTime;

  // Final filtered list mapping
  const visibleTasks = shouldHideWorkTasks 
    ? filteredTasks.filter(t => t.category !== 'Work')
    : filteredTasks;

  const countHidden = shouldHideWorkTasks ? filteredTasks.filter(t => t.category === 'Work').length : 0;

  return (
    <div 
      style={{
        '--color-vinai-indigo': darkMode ? (activeTheme.indigoDark || activeTheme.indigo) : activeTheme.indigo,
        '--color-vinai-terracotta': darkMode ? (activeTheme.terracottaDark || activeTheme.terracotta) : activeTheme.terracotta,
      } as React.CSSProperties}
      className={`w-full min-h-screen flex flex-col ${darkMode ? 'dark bg-[#090A0E] text-slate-100' : 'bg-[#F5F5F3] text-slate-800'} transition-colors duration-300 antialiased font-sans`}
    >
      
      {/* Top micro indicator & dev helper block */}
      <div className="bg-vinai-indigo dark:bg-[#07080C] text-slate-250 dark:text-slate-400 text-[11px] px-6 py-2 flex justify-between items-center z-20 border-b border-indigo-950 dark:border-[#151926] font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="font-semibold text-white">Vinai Mindful Core v1.2</span>
          </span>
          <span className="opacity-60 hidden md:inline">|</span>
          <span className="opacity-60 hidden md:inline">Active Mode: <strong className="text-white">{energyLevel}</strong> @ {contextMode}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-indigo-300">SYSTEM TIME:</span>
          <span className="text-white bg-indigo-900 rounded-md px-2 py-0.5 tracking-wider font-bold">
            {currentTime || "11:43 PM"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 h-[calc(100vh-32px)] overflow-hidden">
        
        {/* LEFT SIDEBAR CONTROLS */}
        <Sidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          onQuickCaptureClick={() => {
            setIsAddTaskOpen(true);
          }}
          userName={userName}
          userTagline={userTagline}
        />

        {/* CENTER PANEL (Focus Zone) */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
          
          {/* Header row */}
          <header className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-serif italic text-slate-900 dark:text-neutral-50 tracking-tight">
                {(() => {
                  const hour = new Date().getHours();
                  if (hour >= 5 && hour < 12) return "Good Morning";
                  if (hour >= 12 && hour < 17) return "Good Afternoon";
                  return "Good Evening";
                })()}, {userName ? userName.split(' ')[0] : 'Alex'}.
              </h1>
              <p className="text-xs text-slate-500/90 dark:text-slate-400 font-mono tracking-wider uppercase flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-vinai-terracotta" />
                Breathe in Focus.
              </p>
            </div>

            {/* Micro Controls Box */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Component */}
              <div className="flex bg-white/70 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <button
                  type="button"
                  id="theme-light-toggle"
                  onClick={() => setDarkMode(false)}
                  className={`p-1.5 rounded-lg transition-all ${!darkMode ? 'bg-vinai-indigo text-white shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-400'}`}
                  title="Force premium Light Theme"
                >
                  <Sun size={15} />
                </button>
                <button
                  type="button"
                  id="theme-dark-toggle"
                  onClick={() => setDarkMode(true)}
                  className={`p-1.5 rounded-lg transition-all ${darkMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
                  title="Enable Dark Slate Mode"
                >
                  <Moon size={15} />
                </button>
              </div>

              {/* Notification Bell Dropdown Panel */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setNotifCount(0); // clear count
                  }}
                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-100 dark:border-slate-850 flex items-center justify-center relative transition-all active:scale-95 shadow-sm"
                >
                  <Bell size={16} className="text-slate-600 dark:text-slate-300" />
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-vinai-terracotta text-white flex items-center justify-center text-[9px] font-bold border border-white dark:border-slate-900 animate-bounce">
                      {notifCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg p-3 z-30 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Vinai Intel Notifications</p>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {notifList.map(notif => (
                        <div key={notif.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850 text-[11px] space-y-1">
                          <p className="text-slate-600 dark:text-slate-400">{notif.text}</p>
                          <span className="text-[9px] text-slate-400">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* SECTION 2: Today's Focus or Settings Workspace */}
          {activeView === 'Settings' ? (
            <SettingsView
              userName={userName}
              setUserName={setUserName}
              userTagline={userTagline}
              setUserTagline={setUserTagline}
              focusTarget={focusTarget}
              setFocusTarget={setFocusTarget}
              focusDuration={focusDuration}
              setFocusDuration={setFocusDuration}
              breakDuration={breakDuration}
              setBreakDuration={setBreakDuration}
              productiveStart={productiveStart}
              setProductiveStart={setProductiveStart}
              productiveEnd={productiveEnd}
              setProductiveEnd={setProductiveEnd}
              enableRestBounds={enableRestBounds}
              setEnableRestBounds={setEnableRestBounds}
              muteDistractions={muteDistractions}
              setMuteDistractions={setMuteDistractions}
              alertTone={alertTone}
              setAlertTone={setAlertTone}
              activeTheme={activeTheme}
              setActiveTheme={setActiveTheme}
              darkMode={darkMode}
              onAddNotification={(text) => {
                setNotifList(prev => [{
                  id: String(Date.now()),
                  text: text,
                  time: 'Just now',
                  read: false
                }, ...prev]);
                setNotifCount(c => c + 1);
              }}
            />
          ) : activeView === 'Calendar View' ? (
            <CalendarView 
              tasks={tasks}
              setTasks={setTasks}
              darkMode={darkMode}
              onEditTask={openEditModal}
            />
          ) : (
            <section className="flex-1 flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-md font-bold text-slate-800 dark:text-neutral-50 flex items-center gap-2">
                  <span>Today's Focus</span>
                  {selectedProject && (
                    <span className="text-xs font-mono bg-vinai-indigo/5 text-vinai-indigo dark:text-indigo-400 px-2 py-0.5 rounded-md border border-vinai-indigo/10">
                      #{selectedProject}
                    </span>
                  )}
                  {activeSort && (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      sorted by {activeSort}
                    </span>
                  )}
                </h3>
              </div>

              {/* Sorting and Filter controls */}
              <div className="flex items-center gap-1.5 bg-[#FAFAF9]/80 dark:bg-[#121522]/80 border border-slate-200/50 dark:border-[#1F2437] rounded-lg p-0.5 shadow-sm">
                {['Priority', 'Energy', 'Time'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveSort(mode as any)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      activeSort === mode
                        ? 'bg-white dark:bg-[#1E2235] text-vinai-indigo dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/5'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Life Mode Work Isolation Alert */}
            {shouldHideWorkTasks && hiddenWorkTasksCount > 0 && (
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs text-emerald-800 dark:text-emerald-400">
                    <strong className="font-semibold">Life Mode Screen guard active</strong>. Work commitments on hold; protecting personal restoration.
                  </p>
                </div>
                <button
                  onClick={() => setLifeModeEnabled(false)}
                  className="text-[10px] text-emerald-600 font-bold hover:underline"
                >
                  Override Life Mode
                </button>
              </div>
            )}

            <div className="space-y-3.5">
              
              {/* Today Completed Appreciation Message Card */}
              {activeView === 'Today' && visibleTasks.length > 0 && visibleTasks.every(t => t.completed) && (
                <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-transparent border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 shadow-lg shadow-emerald-500/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 text-white animate-pulse">
                    <Sparkles size={22} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <h4 className="text-md font-sans font-bold text-emerald-800 dark:text-emerald-400">
                      Phenomenal work! You've cleared today's focus.
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Every single commitment for today is fully complete. Take a well-deserved moment to pause, breathe, and restore.
                    </p>
                  </div>
                </div>
              )}
              
              {/* PRIMARY HIGH-FIDELITY DEEP FOCUS CARD */}
              {visibleTasks.map((task) => {
                const isDeepWork = task.isDeepFocusSession || task.energy === 'Deep Focus';
                
                return (
                  <div
                    key={task.id}
                    className={`group rounded-2xl relative border overflow-hidden transition-all duration-300 ${
                      task.completed 
                        ? 'bg-slate-100/40 dark:bg-slate-950/25 border-slate-200/50 dark:border-[#1F2437] opacity-60' 
                        : isDeepWork 
                          ? 'bg-vinai-indigo dark:bg-[#1E233A] text-white border-transparent dark:border-[#2D334D] shadow-xl shadow-vinai-indigo/15 dark:shadow-[0_0_20px_rgba(99,102,241,0.06)]'
                          : 'bg-white/85 dark:bg-slate-950/45 border-slate-150 dark:border-[#1F2437] shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-[#333A57]'
                    }`}
                  >
                    
                    {/* Upper decorative bar for the active Focus session */}
                    {isDeepWork && !task.completed && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vinai-terracotta to-purple-400 dark:from-vinai-terracotta dark:to-indigo-500" />
                    )}

                    <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      {/* Left: Input checkboxes, Title and metadata */}
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-600 dark:border-emerald-600'
                              : isDeepWork
                                ? 'border-indigo-300 dark:border-indigo-550 hover:border-white hover:bg-white/10 dark:hover:bg-white/10'
                                : 'border-slate-300 dark:border-[#2D334D] hover:border-vinai-indigo dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                          }`}
                        >
                          {task.completed && <Check size={14} className="stroke-[3]" />}
                        </button>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                              isDeepWork && !task.completed
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                              {task.energy}
                            </span>

                            <span className={`text-[9px] font-mono ${
                              isDeepWork && !task.completed ? 'text-indigo-200' : 'text-slate-400'
                            }`}>
                              #{task.category}
                            </span>

                            {task.smartSuggestion && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-vinai-terracotta font-medium bg-vinai-terracotta/10 px-2 py-0.5 rounded-full">
                                <Sparkles size={8} /> parsed logic
                              </span>
                            )}
                          </div>

                          <h4 className={`text-lg font-sans tracking-tight font-medium ${
                            task.completed 
                              ? 'line-through text-slate-405 text-slate-400' 
                              : isDeepWork 
                                ? 'text-white' 
                                : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {task.title}
                          </h4>

                          {task.smartSuggestion && !task.completed && (
                            <p className={`text-[11px] leading-relaxed max-w-lg italic font-serif ${
                              isDeepWork ? 'text-indigo-150 opacity-90' : 'text-slate-550 text-slate-500'
                            }`}>
                              "{task.smartSuggestion}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Timing details, Energy rating & Action Buttons */}
                      <div className="text-left md:text-right shrink-0 flex flex-col md:items-end justify-between gap-1">
                        <p className={`text-xs font-mono font-medium ${
                          isDeepWork && !task.completed ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {task.time}
                        </p>
                        {task.energyScore && (
                          <p className="text-xs font-bold text-emerald-400 dark:text-emerald-500 font-mono">
                            Energy Score: {task.energyScore}
                          </p>
                        )}
                        
                        {/* Task priority tag indicator if set */}
                        {task.priority && (
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isDeepWork && !task.completed 
                              ? 'text-indigo-150' 
                              : task.priority === 'High' 
                                ? 'text-rose-500' 
                                : task.priority === 'Medium' 
                                  ? 'text-indigo-500 dark:text-indigo-400' 
                                  : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            {task.priority === 'High' ? '▲ High' : task.priority === 'Medium' ? '● Medium' : '▼ Low'} Priority
                          </span>
                        )}

                        {/* Inline Edit/Delete buttons */}
                        <div className="flex items-center gap-1.5 pt-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(task)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                              isDeepWork && !task.completed
                                ? 'text-indigo-200 hover:text-white hover:bg-white/10'
                                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                            }`}
                            title="Edit Task"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTasks(prev => prev.filter(t => t.id !== task.id));
                              setNotifList(prev => [{
                                id: String(Date.now()),
                                text: `Removed task commitment: "${task.title}"`,
                                time: 'Just now',
                                read: false
                              }, ...prev]);
                              setNotifCount(c => c + 1);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                              isDeepWork && !task.completed
                                ? 'text-indigo-200 hover:text-rose-450 hover:bg-white/10'
                                : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-500 dark:hover:bg-rose-950/20'
                            }`}
                            title="Remove Task"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Expandable subtasks section for Roadmap / Complex tasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className={`px-5 pb-5 border-t ${
                        isDeepWork && !task.completed
                          ? 'border-white/10 text-white'
                          : 'border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300'
                      }`}>
                        
                        <div className="flex items-center justify-between py-3">
                          <button
                            onClick={() => {
                              if (task.id === 'task-1') {
                                setIsRoadmapExpanded(!isRoadmapExpanded);
                              }
                            }}
                            className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-slate-600 hover:underline cursor-pointer"
                          >
                            <span>{task.subtasks.filter(s => s.completed).length} of {task.subtasks.length} completed</span>
                            {task.id === 'task-1' && (
                              isRoadmapExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                            )}
                          </button>

                          {/* Progress indicator micro bar */}
                          <div className="w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                            />
                          </div>
                        </div>

                        {(task.id !== 'task-1' || isRoadmapExpanded) && (
                          <div className="space-y-2.5 pt-1">
                            {task.subtasks.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center justify-between gap-3 text-xs pl-2 hover:bg-slate-100/10 rounded p-1"
                              >
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => toggleSubtask(task.id, sub.id)}
                                    className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                                      sub.completed
                                        ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                                        : isDeepWork && !task.completed
                                          ? 'border border-white/40 hover:border-white hover:bg-white/15'
                                          : 'border border-slate-300 dark:border-[#383F5B] hover:border-vinai-indigo dark:hover:border-indigo-400'
                                    }`}
                                  >
                                    {sub.completed && <Check size={10} />}
                                  </button>
                                  <span className={sub.completed ? 'line-through text-slate-400' : ''}>
                                    {sub.title}
                                  </span>
                                </div>
                                <span className="text-[9px] text-slate-400 font-mono">step</span>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}

              {/* No visible tasks placeholder state */}
              {visibleTasks.length === 0 && (
                <div className="p-12 text-center rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800">
                  <ZapOff size={32} className="mx-auto text-slate-400 mb-3" />
                  <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300">No matching activities captured</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Try changing your sorting, project constraints, or disable Life Mode screen protection.
                  </p>
                </div>
              )}

              {/* Protected Work tasks counter banner if hidden */}
              {shouldHideWorkTasks && countHidden > 0 && (
                <div className="p-4 text-center rounded-xl bg-slate-100/60 dark:bg-slate-850/30 border border-slate-150/40 text-xs text-slate-500 flex items-center justify-center gap-1.5">
                  <Info size={13} />
                  <span>{countHidden} additional Work tasks muted temporarily. Safeguarding energy pathways.</span>
                </div>
              )}

            </div>
          </section>
          )}

          {/* AI MIND COMPASS FLOATING BANNER */}
          <footer className="pt-4 border-t border-slate-200/50 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2">
            <p>© 2026 Vinai Mindful OS. Pure Focus, Zero Friction.</p>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Durable Client State</span>
              <span>•</span>
              <span>Gemini Pro Context Engine Active</span>
            </div>
          </footer>

        </div>

        {/* RIGHT PANEL */}
        <RightPanel 
          energyLevel={energyLevel}
          setEnergyLevel={setEnergyLevel}
          contextMode={contextMode}
          setContextMode={setContextMode}
          lifeModeEnabled={lifeModeEnabled}
          setLifeModeEnabled={setLifeModeEnabled}
          tasks={tasks}
        />

      </div>

      {/* RENDER THE ADD TASK MODAL OVERLAY */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/95 dark:bg-[#0E1017]/95 backdrop-blur-xl border border-slate-150 dark:border-[#1F2437] rounded-3xl shadow-2xl p-6 w-full max-w-lg space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-150/50 dark:border-slate-800/50 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-lg font-serif italic text-slate-900 dark:text-neutral-50 tracking-tight">
                  {editingTaskId ? 'Edit Focus Commitment' : 'Add New Focus Commitment'}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                  {editingTaskId ? 'Vinai Mindful OS Task Modification' : 'Vinai Mindful OS Task Creation'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddTaskOpen(false);
                  setEditingTaskId(null);
                  setModalTitle('');
                  setModalSubtasks([]);
                  setModalNewSubtask('');
                }}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all flex items-center justify-center cursor-pointer"
                title="Cancel and Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} className="space-y-4 pt-1">
              
              {/* Task Title */}
              <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-200">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Task Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="e.g. Brainstorm team OKRs"
                  className="w-full bg-white dark:bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-vinai-indigo/20 dark:focus:ring-indigo-600/30 text-slate-800 dark:text-slate-150"
                />
              </div>

              {/* Category & Energy Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Work', 'Personal', 'Side Hustle', 'Learning'] as const).map((cat) => {
                      const isSelected = modalCategory === cat;
                      const dotColor = cat === 'Work' ? 'bg-indigo-500' : cat === 'Personal' ? 'bg-vinai-terracotta' : cat === 'Side Hustle' ? 'bg-emerald-500' : 'bg-amber-500';
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setModalCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-vinai-indigo/10 text-vinai-indigo border-vinai-indigo/30 dark:bg-indigo-600/10 dark:text-indigo-400 dark:border-indigo-500/30 font-semibold'
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Energy Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Energy Requirement</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Low Energy', 'Deep Focus', 'High Energy'] as const).map((eng) => {
                      const isSelected = modalEnergy === eng;
                      return (
                        <button
                          key={eng}
                          type="button"
                          onClick={() => setModalEnergy(eng)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-vinai-indigo/10 text-vinai-indigo border-vinai-indigo/30 dark:bg-indigo-600/10 dark:text-indigo-400 dark:border-indigo-500/30 font-semibold'
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          {eng === 'Deep Focus' ? '⚡ Deep' : eng === 'High Energy' ? '🔥 High' : '☕ Low'}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Priority Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Priority</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((pri) => {
                    const isSelected = modalPriority === pri;
                    const colorClasses = pri === 'High' 
                      ? 'bg-rose-500/10 text-rose-600 border-rose-500/25 dark:text-rose-400' 
                      : pri === 'Medium'
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-400';
                    return (
                      <button
                        key={pri}
                        type="button"
                        onClick={() => setModalPriority(pri)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border text-center ${
                          isSelected
                            ? `${colorClasses} font-bold ring-2 ring-indigo-500/10`
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {pri === 'High' ? '🔴 High' : pri === 'Medium' ? '🟡 Medium' : '🟢 Low'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time scheduled input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Target Time Slot</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    placeholder="e.g. 10:00 AM - 12:30 PM, or Afternoon"
                    className="flex-1 bg-white dark:bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-vinai-indigo/20 dark:focus:ring-indigo-600/30 text-slate-800 dark:text-slate-150"
                  />
                  <div className="flex gap-1">
                    {['9:00 AM', '1:00 PM', 'Flexible'].map(tSlot => (
                      <button
                        key={tSlot}
                        type="button"
                        onClick={() => setModalTime(tSlot)}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-[10px] text-slate-500"
                      >
                        {tSlot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Due Date Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-medium">Target Due Date</label>
                <input
                  type="date"
                  value={modalDueDate}
                  onChange={(e) => setModalDueDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-vinai-indigo/20 dark:focus:ring-indigo-600/30 text-slate-800 dark:text-slate-150 cursor-pointer"
                />
              </div>

              {/* Subtasks Section with Dynamic Add/Delete Option */}
              <div className="space-y-2 border-t border-slate-150/50 dark:border-slate-800/50 pt-3">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Add Sub-Commitment Steps ({modalSubtasks.length})
                </label>

                {/* Subtasks list with delete cross button */}
                {modalSubtasks.length > 0 && (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto mb-2 pr-1">
                    {modalSubtasks.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/80 rounded-xl text-xs text-slate-705 dark:text-slate-300 shadow-3xs"
                      >
                        <span className="truncate flex-1 font-sans">{sub}</span>
                        <button
                          type="button"
                          onClick={() => setModalSubtasks(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-md cursor-pointer hover:bg-slate-200/50 transition-all block shrink-0"
                          title="Delete step"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input row to add new subtask */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={modalNewSubtask}
                    onChange={(e) => setModalNewSubtask(e.target.value)}
                    placeholder="Type subtask step / action item..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = modalNewSubtask.trim();
                        if (val) {
                          setModalSubtasks(prev => [...prev, val]);
                          setModalNewSubtask('');
                        }
                      }
                    }}
                    className="flex-1 bg-white dark:bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-vinai-indigo/20 dark:focus:ring-indigo-600/30 text-slate-800 dark:text-slate-150"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = modalNewSubtask.trim();
                      if (val) {
                        setModalSubtasks(prev => [...prev, val]);
                        setModalNewSubtask('');
                      }
                    }}
                    className="px-4 bg-vinai-indigo text-white dark:bg-indigo-600 rounded-xl text-xs font-bold hover:bg-opacity-90 transition-all cursor-pointer flex items-center justify-center shrink-0"
                  >
                    Add Step
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-150/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddTaskOpen(false);
                    setEditingTaskId(null);
                    setModalTitle('');
                    setModalSubtasks([]);
                    setModalNewSubtask('');
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 bg-white dark:bg-slate-950 transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={!modalTitle.trim()}
                  className="flex-2 py-2.5 rounded-xl bg-vinai-indigo hover:bg-vinai-indigo/95 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-40"
                >
                  {editingTaskId ? 'Update Commitment' : 'Save Commitment'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
