import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Clock, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Smile, 
  X,
  AlertCircle,
  Edit2
} from 'lucide-react';
import { Task, Subtask } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  darkMode: boolean;
  onEditTask?: (task: Task) => void;
}

export default function CalendarView({ tasks, setTasks, darkMode, onEditTask }: CalendarViewProps) {
  // Current view month & year (initialized to June 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(5); // 0-indexed, so 5 = June
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-06-13'); // default selected: June 13
  
  // Custom Task generation form status
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Work' | 'Personal' | 'Side Hustle' | 'Learning'>('Work');
  const [newEnergy, setNewEnergy] = useState<'Low Energy' | 'Deep Focus' | 'High Energy'>('Deep Focus');
  const [newTime, setNewTime] = useState<string>('10:00 AM');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('');
  const [draftSubtasks, setDraftSubtasks] = useState<string[]>([]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Grid mechanics
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday, etc.
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  
  // Helper to format date parameters as YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Extract tasks belonging to a specific date string
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter(t => {
      // If task has no dueDate, we map it to June 13, 2026 (alex's local starting day)
      const tDate = t.dueDate || '2026-06-13';
      return tDate === dateStr;
    });
  };

  const currentSelectTasks = getTasksForDate(selectedDateStr);

  // Mark task completion directly in the calendar
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = (t.subtasks || []).map(sub => {
          if (sub.id === subtaskId) {
            return { ...sub, completed: !sub.completed };
          }
          return sub;
        });
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
  };

  // Add customized task to the selected day
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `cal-task-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      energy: newEnergy,
      time: newTime,
      priority: newPriority,
      completed: false,
      subtasks: draftSubtasks.map((st, i) => ({
        id: `cal-subtask-${Date.now()}-${i}`,
        title: st,
        completed: false
      })),
      dueDate: selectedDateStr
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTitle('');
    setNewPriority('Medium');
    setDraftSubtasks([]);
    setNewSubtaskTitle('');
    setShowAddForm(false);
  };

  // Calendar cells render mapping
  const emptyCells = Array(firstDayIndex).fill(null);
  const daysInMonthArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const allCells = [...emptyCells, ...daysInMonthArray];

  // Quick formatting for displaying English reader friendly dates
  const parseSelectedFriendly = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const y = parseInt(parts[0]);
      const m = parseInt(parts[1]) - 1;
      const d = parseInt(parts[2]);
      return `${monthNames[m]} ${d}, ${y}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="calendar-view-container" className="space-y-6">
      
      {/* Calendar Header with Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-950/45 p-5 rounded-2xl border border-slate-100 dark:border-[#1F2437] shadow-sm premium-shadow">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-vinai-terracotta font-semibold">Interactive Planner</span>
          <h2 className="text-xl font-serif italic text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            Your Energy-Synced Agenda
          </h2>
          <p className="text-xs text-slate-400">Click on any days to view, complete, or schedule focus-integrated sessions.</p>
        </div>

        {/* Micro statistics */}
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-slate-50 dark:bg-[#121522] rounded-xl border border-slate-100 dark:border-[#181C2E]">
            <p className="text-[9px] font-mono text-slate-400 uppercase">Monthly Activities</p>
            <p className="text-lg font-bold text-vinai-indigo dark:text-indigo-400">{tasks.length}</p>
          </div>
          <div className="text-center px-4 py-2 bg-slate-50 dark:bg-[#121522] rounded-xl border border-slate-100 dark:border-[#181C2E]">
            <p className="text-[9px] font-mono text-slate-400 uppercase">Completed</p>
            <p className="text-lg font-bold text-emerald-500">{tasks.filter(t => t.completed).length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid & Checklist Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: INTERACTIVE MONTH VIEW (8 units) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-950/45 p-5 rounded-3xl border border-slate-100 dark:border-[#1F2437] shadow-sm flex flex-col justify-between">
          <div>
            {/* Months Selector Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-[#1F2437]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-vinai-indigo animate-pulse" />
                <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 font-sans">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-50 dark:hover:bg-[#161B29] text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => {
                    setCurrentYear(2026);
                    setCurrentMonth(5);
                    setSelectedDateStr('2026-06-13');
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-vinai-indigo dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-[#161B29] rounded"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-50 dark:hover:bg-[#161B29] text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
                  title="Next Month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days Of Week Column Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {daysOfWeek.map(d => (
                <span key={d} className="text-[10px] font-mono uppercase text-slate-450 text-slate-400 py-1 font-semibold">
                  {d}
                </span>
              ))}
            </div>

            {/* Main Calendar Grid cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {allCells.map((cell, index) => {
                if (cell === null) {
                  return (
                    <div key={`empty-${index}`} className="aspect-square bg-slate-50/20 dark:bg-slate-900/10 rounded-xl" />
                  );
                }

                const dateStr = formatDateString(currentYear, currentMonth, cell);
                const isSelected = selectedDateStr === dateStr;
                const isToday = currentYear === 2026 && currentMonth === 5 && cell === 13;
                
                const dayTasks = getTasksForDate(dateStr);
                const hasTasks = dayTasks.length > 0;
                const allCompleted = hasTasks && dayTasks.every(t => t.completed);

                return (
                  <button
                    key={`day-${cell}`}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`aspect-square p-2 rounded-2xl flex flex-col justify-between items-center transition-all cursor-pointer relative group border ${
                      isSelected
                        ? 'bg-vinai-indigo text-white border-transparent shadow-md shadow-vinai-indigo/25 dark:bg-indigo-650'
                        : isToday
                          ? 'border-vinai-terracotta dark:border-[#C97A56] bg-vinai-terracotta/5 hover:bg-vinai-terracotta/10 text-slate-900 dark:text-slate-150'
                          : 'border-slate-100 dark:border-[#1E2333]/40 bg-slate-50/40 dark:bg-[#0F121C]/40 hover:bg-slate-100 dark:hover:bg-[#161929] text-slate-700 dark:text-slate-350'
                    }`}
                  >
                    {/* Day Number */}
                    <span className={`text-xs font-bold leading-none ${isSelected ? 'text-white' : ''}`}>
                      {cell}
                    </span>

                    {/* Task micro indicator bubbles */}
                    <div className="flex gap-1 justify-center w-full overflow-hidden mt-1.5 h-1.5">
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <span 
                          key={t.id}
                          className={`w-1 h-1 rounded-full ${
                            isSelected 
                              ? 'bg-indigo-200' 
                              : t.completed 
                                ? 'bg-emerald-400' 
                                : t.energy === 'Deep Focus' 
                                  ? 'bg-vinai-indigo dark:bg-indigo-400' 
                                  : 'bg-vinai-terracotta'
                          }`}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className={`text-[6px] font-bold leading-none ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>+</span>
                      )}
                    </div>

                    {/* Subtle outer outline for Today */}
                    {isToday && !isSelected && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-vinai-terracotta rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1F2437] flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-vinai-indigo dark:bg-indigo-400" /> Deep Focus</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-vinai-terracotta" /> Priority Tasks</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed</span>
            </div>
            <span>Double click cell to plan</span>
          </div>

        </div>

        {/* RIGHT COLUMN: AGENDA FOR SELECTED DAY (4 units) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-white dark:bg-slate-950/45 p-5 rounded-3xl border border-slate-100 dark:border-[#1F2437] shadow-sm h-full max-h-[500px] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F2437] mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase text-slate-400">Schedule Agenda</p>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {parseSelectedFriendly(selectedDateStr)}
                </h4>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="w-7 h-7 rounded-lg bg-vinai-indigo/5 dark:bg-indigo-950/30 text-vinai-indigo dark:text-indigo-400 hover:bg-vinai-indigo hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
                title="Create task for this day"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Quick Form to Append Activities */}
            {showAddForm && (
              <form onSubmit={handleAddTaskSubmit} className="bg-slate-50 dark:bg-[#121522] rounded-2xl p-4 border border-slate-100 dark:border-[#1F2437] mb-4 space-y-3 shadow-inner">
                <div className="flex justify-between items-center pb-1 border-b border-slate-150/50 dark:border-slate-800">
                  <p className="text-[10px] font-mono uppercase text-vinai-terracotta font-semibold">New Event Creator</p>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={12} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight block">Activity Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Conduct team workshop"
                    required
                    className="w-full bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-vinai-indigo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block">Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]"
                    >
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Side Hustle">Side Hustle</option>
                      <option value="Learning">Learning</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block">Energy Required</label>
                    <select
                      value={newEnergy}
                      onChange={e => setNewEnergy(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]"
                    >
                      <option value="Deep Focus">🧠 Deep Focus</option>
                      <option value="High Energy">🏃 High Energy</option>
                      <option value="Low Energy">⚡ Low Energy</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block">Time details</label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className="w-full bg-white dark:bg-slate-950 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block">Priority</label>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]"
                    >
                      <option value="High">▲ High</option>
                      <option value="Medium">● Medium</option>
                      <option value="Low">▼ Low</option>
                    </select>
                  </div>
                </div>

                {/* Subtask additions while scheduling */}
                <div className="space-y-2 pt-2 border-t border-slate-150/50 dark:border-slate-800">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Subtasks ({draftSubtasks.length})</label>
                  
                  {draftSubtasks.length > 0 && (
                    <div className="space-y-1 max-h-24 overflow-y-auto mb-2 pr-1">
                      {draftSubtasks.map((st, index) => (
                        <div key={index} className="flex items-center justify-between gap-1.5 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 shadow-xs">
                          <span className="truncate flex-1 leading-none">{st}</span>
                          <button
                            type="button"
                            onClick={() => setDraftSubtasks(prev => prev.filter((_, idx) => idx !== index))}
                            className="p-0.5 text-slate-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                            title="Delete Subtask"
                          >
                            <X size={11} strokeWidth={2.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={e => setNewSubtaskTitle(e.target.value)}
                      placeholder="Add step and press enter..."
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = newSubtaskTitle.trim();
                          if (val) {
                            setDraftSubtasks(prev => [...prev, val]);
                            setNewSubtaskTitle('');
                          }
                        }
                      }}
                      className="flex-1 bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-vinai-indigo"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = newSubtaskTitle.trim();
                        if (val) {
                          setDraftSubtasks(prev => [...prev, val]);
                          setNewSubtaskTitle('');
                        }
                      }}
                      className="px-2.5 bg-vinai-indigo/10 text-vinai-indigo dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs rounded-lg hover:bg-vinai-indigo hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-1.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-100 text-xs text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-vinai-indigo text-white dark:bg-indigo-650 rounded-lg text-xs font-bold text-center"
                  >
                    Save Activity
                  </button>
                </div>
              </form>
            )}

            {/* List of Tasks for Selected Date */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {currentSelectTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-slate-50/40 dark:bg-[#111421]/45 border border-slate-100 dark:border-[#1F2437] rounded-xl p-2.5 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-700 hover:border-vinai-indigo'
                        }`}
                      >
                        {task.completed && <Check size={12} />}
                      </button>
                      <div>
                        <p className={`text-xs font-semibold leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] text-slate-400">
                          <span>{task.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5"><Clock size={9} /> {task.time}</span>
                          {task.priority && (
                            <>
                              <span>•</span>
                              <span className={`font-semibold ${task.priority === 'High' ? 'text-rose-500' : task.priority === 'Medium' ? 'text-indigo-500' : 'text-slate-450'}`}>
                                {task.priority} Priority
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {onEditTask && (
                        <button
                          type="button"
                          onClick={() => onEditTask(task)}
                          className="p-1 rounded-md text-slate-400 hover:text-vinai-indigo hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Task"
                        >
                          <Edit2 size={11} />
                        </button>
                      )}
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        task.energy === 'Deep Focus' 
                          ? 'bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400' 
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                      }`}>
                        {task.energy === 'Deep Focus' ? 'Deep' : task.energy === 'High Energy' ? 'High' : 'Low'}
                      </span>
                    </div>
                  </div>

                  {/* Render Subtasks of Selected Task */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="pl-7 space-y-1.5 border-t border-slate-150/45 dark:border-[#1F2437] pt-2">
                      {task.subtasks.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between gap-2.5 text-[11px] group">
                          <div className="flex items-center gap-2 text-[11px]">
                            <button
                              onClick={() => handleToggleSubtask(task.id, sub.id)}
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all border shrink-0 ${
                                sub.completed
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-700 hover:border-vinai-indigo'
                              }`}
                            >
                              {sub.completed && <Check size={8} />}
                            </button>
                            <span className={`leading-tight ${
                              sub.completed 
                                ? 'line-through text-slate-400' 
                                : 'text-slate-650 dark:text-slate-300'
                            }`}>
                              {sub.title}
                            </span>
                          </div>

                          {/* Allow deleting existing scheduled subtasks as well */}
                          <button
                            type="button"
                            onClick={() => {
                              setTasks(prev => prev.map(t => {
                                if (t.id === task.id) {
                                  return {
                                    ...t,
                                    subtasks: (t.subtasks || []).filter(s => s.id !== sub.id)
                                  };
                                }
                                return t;
                              }));
                            }}
                            className="text-slate-350 hover:text-red-500 dark:text-slate-550 dark:hover:text-red-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete step"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {currentSelectTasks.length === 0 && (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20">
                  <Smile size={18} className="text-slate-450 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-medium text-slate-500">Day is beautifully clear!</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Maintain steady pacing and rest bounds.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1F2437] text-[10px] text-slate-400 leading-normal flex items-center gap-1.5">
            <AlertCircle size={11} className="text-vinai-terracotta" />
            <span>Successfully locks calendar during custom high-energy intervals.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
