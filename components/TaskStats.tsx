import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export default function TaskStats({ totalTasks, completedTasks, pendingTasks }: TaskStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.statNumber}>{totalTasks}</Text>
        <Text style={styles.statLabel}>Total Tasks</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={[styles.statNumber, styles.completedNumber]}>{completedTasks}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={[styles.statNumber, styles.pendingNumber]}>{pendingTasks}</Text>
        <Text style={styles.statLabel}>Pending</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#f1f1f1',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  completedNumber: {
    color: '#34C759',
  },
  pendingNumber: {
    color: '#FF9500',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8e8e93',
  },
});