import { create } from 'zustand';
import { generatePlan } from '@/lib/ai';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  time: string;
  date: string;
}

interface PlanStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Task) => void;
  updateTask: (id: string, updatedTask: Task) => void;
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
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? updatedTask : task
          ),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      generateDayPlan: async (customPrompt: string) => {
        set({ loading: true, error: null });
        try {
          console.log('Generating plan for prompt:', customPrompt);
          const prompt = `Create a detailed schedule for the following plan: ${customPrompt}. Format each task with a specific time (e.g., "9:00 AM - Morning routine"). Focus only on actionable tasks, no introductory text. Do not use asterisks or other special characters.`;
          const response = await generatePlan(prompt);
          console.log('AI Response:', response);
          
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

              // Extract time and convert to 24-hour format
              let time = '09:00';
              const timeMatch = cleanText.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
              if (timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = timeMatch[2];
                const meridiem = timeMatch[3]?.toUpperCase();

                // Convert to 24-hour format if AM/PM is present
                if (meridiem) {
                  if (meridiem === 'PM' && hours !== 12) {
                    hours += 12;
                  } else if (meridiem === 'AM' && hours === 12) {
                    hours = 0;
                  }
                }

                time = `${hours.toString().padStart(2, '0')}:${minutes}`;
              }

              return {
                id: `task-${index}-${Date.now()}`,
                title: cleanText,
                completed: false,
                time,
                date: today,
              };
            });

          console.log('Parsed tasks:', tasks);
          set({ tasks, loading: false });
        } catch (error) {
          console.error('Error in generateDayPlan:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to generate plan. Please try again.';
          set({ error: errorMessage, loading: false });
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