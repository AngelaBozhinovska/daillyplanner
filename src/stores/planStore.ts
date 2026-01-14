import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  time: string;
  date: Date;
  completed: boolean;
}

interface PlanStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Task) => void;
  updateTask: (id: string, updatedTask: Task) => void;
  toggleTask: (id: string) => void;
  generateDayPlan: (prompt: string) => Promise<void>;
}

// Mock function for generating plans - replace with actual AI service implementation
const generatePlan = async (prompt: string): Promise<{ title: string; time: string }[]> => {
  // This is a placeholder implementation
  return [
    { title: 'Sample task 1', time: '09:00' },
    { title: 'Sample task 2', time: '10:00' },
  ];
};

export const usePlanStore = create<PlanStore>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  addTask: (task: Task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },

  updateTask: (id: string, updatedTask: Task) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? updatedTask : task
      ),
    }));
  },

  toggleTask: (id: string) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  },

  generateDayPlan: async (prompt: string) => {
    set({ loading: true, error: null });
    try {
      const plan = await generatePlan(prompt);
      set((state) => ({
        tasks: [
          ...state.tasks,
          ...plan.map((task) => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: task.title,
            time: task.time,
            date: new Date(),
            completed: false,
          })),
        ],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to generate plan',
        loading: false,
      });
    }
  },
})); 