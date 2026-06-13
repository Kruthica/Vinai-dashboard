export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: 'Work' | 'Personal' | 'Side Hustle' | 'Learning';
  energy: 'Low Energy' | 'Deep Focus' | 'High Energy';
  time: string;
  completed: boolean;
  subtasks: Subtask[];
  isDeepFocusSession?: boolean;
  energyScore?: string;
  smartSuggestion?: string;
  dueDate?: string; // Optional due date string in YYYY-MM-DD format
  priority?: 'Low' | 'Medium' | 'High';
}

export interface RescheduleSuggestion {
  id: string;
  title: string;
  previousDate: string;
  category: 'Work' | 'Personal' | 'Side Hustle' | 'Learning';
  energy: 'Low Energy' | 'Deep Focus' | 'High Energy';
  smartSuggestion: string;
}

export interface ProjectItem {
  name: string;
  color: string; // Tailwind class like "text-indigo-500" or raw hex
}

export type NavigationItem = 
  | 'Inbox' 
  | 'Today' 
  | 'Next 7 Days' 
  | 'Calendar View' 
  | 'Focus Sessions'
  | 'Settings';
