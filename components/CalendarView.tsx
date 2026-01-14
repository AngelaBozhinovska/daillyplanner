import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Check } from 'lucide-react-native';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    time: string;
  }>;
}

export default function CalendarView({ selectedDate, onSelectDate, tasks }: CalendarViewProps) {
  const renderWeek = () => {
    const start = startOfWeek(selectedDate);
    return [...Array(7)].map((_, idx) => {
      const date = addDays(start, idx);
      const isSelected = isSameDay(date, selectedDate);
      
      return (
        <TouchableOpacity
          key={idx}
          onPress={() => onSelectDate(date)}
          style={[styles.dayButton, isSelected && styles.selectedDay]}
        >
          <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
            {format(date, 'EEE')}
          </Text>
          <Text style={[styles.dateText, isSelected && styles.selectedDayText]}>
            {format(date, 'd')}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    `${String(i).padStart(2, '0')}:00`
  );

  const getTasksForTime = (time: string) => {
    return tasks.filter(task => {
      const taskHour = parseInt(task.time.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      return taskHour === slotHour;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekContainer}>
        {renderWeek()}
      </ScrollView>
      
      <ScrollView style={styles.timelineContainer}>
        {timeSlots.map((time) => {
          const tasksAtTime = getTasksForTime(time);
          
          return (
            <View key={time} style={styles.timeSlot}>
              <Text style={styles.timeText}>{time}</Text>
              <View style={styles.taskContainer}>
                {tasksAtTime.map((task) => (
                  <View key={task.id} style={[styles.task, task.completed && styles.completedTask]}>
                    <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
                      {task.title}
                    </Text>
                    {task.completed && <Check size={16} color="#8e8e93" />}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  weekContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  dayButton: {
    width: 60,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#8e8e93',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1c1c1e',
  },
  selectedDayText: {
    color: '#ffffff',
  },
  timelineContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  timeSlot: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  timeText: {
    width: 60,
    paddingTop: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8e8e93',
  },
  taskContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 8,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  completedTask: {
    backgroundColor: '#f1f1f1',
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#1c1c1e',
  },
  completedTaskText: {
    color: '#8e8e93',
    textDecorationLine: 'line-through',
  },
});