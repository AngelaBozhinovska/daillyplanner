import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { format } from 'date-fns';
import { X, Calendar, Clock } from 'lucide-react-native';
import { Task } from '@/stores/planStore';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: { title: string; time: string; date: Date }) => void;
  initialTask?: Task | null;
  mode?: 'add' | 'edit';
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

export default function TaskModal({
  visible,
  onClose,
  onSubmit,
  initialTask,
  mode = 'add'
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      if (initialTask.time) {
        const [hours, minutes] = initialTask.time.split(':').map(Number);
        const newDate = new Date();
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        setDate(newDate);
      }
      if (initialTask.date) {
        setDate(initialTask.date);
      }
    }
  }, [initialTask]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      time: format(date, 'HH:mm'),
      date: date,
    });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDate(new Date());
    onClose();
  };

  const setTime = (hours: number, minutes: number) => {
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
    setShowTimePicker(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === 'add' ? 'Add New Task' : 'Edit Task'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Task title"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={20} color="#1c1c1e" style={styles.buttonIcon} />
              <Text style={styles.dateButtonText}>
                {format(date, 'hh:mm a')}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <View style={styles.timePickerContainer}>
                <View style={styles.timePickerHeader}>
                  <Text style={styles.timePickerTitle}>Select Time</Text>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.timePickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timePicker}>
                  <ScrollView style={styles.timePickerColumn}>
                    {hours.map((hour) => (
                      <TouchableOpacity
                        key={hour}
                        style={[
                          styles.timePickerItem,
                          date.getHours() === hour && styles.timePickerItemSelected,
                        ]}
                        onPress={() => setTime(hour, date.getMinutes())}
                      >
                        <Text
                          style={[
                            styles.timePickerText,
                            date.getHours() === hour && styles.timePickerTextSelected,
                          ]}
                        >
                          {hour.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <Text style={styles.timePickerSeparator}>:</Text>
                  <ScrollView style={styles.timePickerColumn}>
                    {minutes.map((minute) => (
                      <TouchableOpacity
                        key={minute}
                        style={[
                          styles.timePickerItem,
                          date.getMinutes() === minute && styles.timePickerItemSelected,
                        ]}
                        onPress={() => setTime(date.getHours(), minute)}
                      >
                        <Text
                          style={[
                            styles.timePickerText,
                            date.getMinutes() === minute && styles.timePickerTextSelected,
                          ]}
                        >
                          {minute.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, !title.trim() && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!title.trim()}
            >
              <Text style={styles.buttonText}>
                {mode === 'add' ? 'Add Task' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1c1c1e',
  },
  timePickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  timePickerDone: {
    fontSize: 16,
    color: '#007AFF',
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  timePickerColumn: {
    flex: 1,
    height: '100%',
  },
  timePickerSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginHorizontal: 8,
  },
  timePickerItem: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  timePickerItemSelected: {
    backgroundColor: '#007AFF',
  },
  timePickerText: {
    fontSize: 18,
    color: '#1c1c1e',
  },
  timePickerTextSelected: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 