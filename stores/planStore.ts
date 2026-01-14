import { create } from 'zustand';
import { generatePlan } from '@/lib/ai';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  time: string;
  date: string; // Add date field to track which day the task belongs to
}

interface PlanStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  generateDayPlan: (customPrompt: string) => Promise<void>;
  getTasksByDate: (date: string) => Task[];
}

export const usePlanStore = create(
  persist<PlanStore>(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      generateDayPlan: async (customPrompt: string) => {
        set({ loading: true, error: null });
        try {
          const prompt = `Create a detailed schedule for the following plan: ${customPrompt}. Format each task with a specific time (e.g., "9:00 AM - Morning routine"). Focus only on actionable tasks, no introductory text. Do not use asterisks or other special characters.`;
          const response = await generatePlan(prompt);
          
          const today = new Date().toISOString().split('T')[0];
          
          // Parse the AI response and create tasks
          const tasks: Task[] = response
            .split('\n')
            .filter(line => line.trim())
            .filter(line => {
              // Filter out lines that don't look like tasks (e.g., introductory text)
              return line.match(/\d{1,2}:\d{2}/); // Only keep lines that contain times
            })
            .map((line, index) => {
              // Clean up the task text by removing asterisks and extra spaces
              const cleanText = line.replace(/\*/g, '').trim();
              
              // Extract time if present, otherwise use default
              const timeMatch = cleanText.match(/(\d{1,2}:\d{2})/);
              const time = timeMatch ? timeMatch[1] : '09:00';
              
              return {
                id: `task-${index}-${Date.now()}`,
                title: cleanText,
                completed: false,
                time,
                date: today,
              };
            });
          
          set({ tasks, loading: false });
        } catch (error) {
          set({ error: 'Failed to generate plan', loading: false });
        }
      },
      getTasksByDate: (date: string) => {
        return get().tasks.filter(task => task.date === date);
      },
    }),
    {
      name: 'plan-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);