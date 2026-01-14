import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { format } from 'date-fns';
import { Check, Clock } from 'lucide-react-native';
import { usePlanStore } from '@/stores/planStore';

type TaskStatus = 'all' | 'completed' | 'pending';

export default function CalendarScreen() {
  const { tasks } = usePlanStore();
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('all');

  // Filter tasks based on selected status
  const filteredTasks = tasks.filter(task => {
    if (selectedStatus === 'completed') return task.completed;
    if (selectedStatus === 'pending') return !task.completed;
    return true;
  });

  // Sort tasks by time
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });

  // Group tasks by hour
  const tasksByHour: { [hour: string]: typeof tasks } = {};
  sortedTasks.forEach(task => {
    const hour = task.time.split(':')[0].padStart(2, '0');
    if (!tasksByHour[hour]) {
      tasksByHour[hour] = [];
    }
    tasksByHour[hour].push(task);
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={[styles.statBox, selectedStatus === 'all' && styles.selectedStat]}
          onPress={() => setSelectedStatus('all')}
        >
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>All Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statBox, selectedStatus === 'completed' && styles.selectedStat]}
          onPress={() => setSelectedStatus('completed')}
        >
          <Text style={[styles.statNumber, { color: '#34C759' }]}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statBox, selectedStatus === 'pending' && styles.selectedStat]}
          onPress={() => setSelectedStatus('pending')}
        >
          <Text style={[styles.statNumber, { color: '#FF9500' }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.timelineContainer}>
        {Object.entries(tasksByHour).map(([hour, hourTasks]) => (
          <View key={hour} style={styles.hourBlock}>
            <View style={styles.timeIndicator}>
              <Clock size={16} color="#8E8E93" />
              <Text style={styles.hourText}>{`${hour}:00`}</Text>
            </View>
            <View style={styles.tasksContainer}>
              {hourTasks.map(task => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={[styles.taskStatus, task.completed && styles.taskStatusCompleted]}>
                    {task.completed && <Check size={12} color="#fff" />}
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                      {task.title}
                    </Text>
                    <Text style={styles.taskTime}>{task.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    marginTop: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  selectedStat: {
    backgroundColor: '#F2F2F7',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  timelineContainer: {
    flex: 1,
    padding: 16,
  },
  hourBlock: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeIndicator: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hourText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tasksContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskStatus: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskStatusCompleted: {
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
});