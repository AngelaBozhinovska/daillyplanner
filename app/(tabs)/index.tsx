import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { RefreshCw, Plus, MoreVertical, Check } from 'lucide-react-native';
import { usePlanStore, Task } from '@/stores/planStore';
import PlanModal from '@/components/PlanModal';
import TaskModal from '@/components/TaskModal';

export default function TodayScreen() {
  const { tasks, loading, error, toggleTask, generateDayPlan, addTask, updateTask } = usePlanStore();
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const handleGeneratePlan = (prompt: string) => {
    generateDayPlan(prompt);
    setPlanModalVisible(false);
  };

  const handleAddTask = () => {
    setModalMode('add');
    setSelectedTask(null);
    setTaskModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setTaskModalVisible(true);
  };

  const handleTaskSubmit = (taskData: { title: string; time: string; date: Date }) => {
    if (modalMode === 'edit' && selectedTask) {
      updateTask(selectedTask.id, {
        ...selectedTask,
        title: taskData.title,
        time: taskData.time,
        date: taskData.date,
      });
    } else {
      addTask({
        id: Date.now().toString(),
        title: taskData.title,
        time: taskData.time,
        date: taskData.date,
        completed: false,
      });
    }
    setTaskModalVisible(false);
  };

  // Sort tasks by time
  const sortedTasks = [...tasks].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Plan</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => setPlanModalVisible(true)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <RefreshCw size={20} color="#ffffff" />
                <Text style={styles.generateButtonText}>Generate Plan</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTask}
          >
            <Plus size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.taskList}>
        {sortedTasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <TouchableOpacity
              style={[styles.checkbox, task.completed && styles.checkboxChecked]}
              onPress={() => toggleTask(task.id)}
            >
              {task.completed && <Check size={16} color="#ffffff" />}
            </TouchableOpacity>
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                {task.title}
              </Text>
              <Text style={styles.taskTime}>{task.time}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditTask(task)}
            >
              <MoreVertical size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <PlanModal
        visible={planModalVisible}
        onClose={() => setPlanModalVisible(false)}
        onSubmit={handleGeneratePlan}
      />

      <TaskModal
        visible={taskModalVisible}
        onClose={() => setTaskModalVisible(false)}
        onSubmit={handleTaskSubmit}
        initialTask={selectedTask}
        mode={modalMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  generateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    backgroundColor: '#ffebee',
    padding: 12,
    margin: 20,
    borderRadius: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#1c1c1e',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  editButton: {
    padding: 8,
  },
});