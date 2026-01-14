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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { X } from 'lucide-react-native';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: { title: string; time: string; date: Date }) => void;
  initialTask?: {
    title: string;
    time: string;
    date?: Date;
  };
  mode?: 'add' | 'edit';
}

export default function TaskModal({
  visible,
  onClose,
  onSubmit,
  initialTask,
  mode = 'add'
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
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
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Date: {format(date, 'MMM dd, yyyy')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Time: {format(date, 'hh:mm a')}
              </Text>
            </TouchableOpacity>

            {(showDatePicker || showTimePicker) && (
              <DateTimePicker
                value={date}
                mode={showDatePicker ? 'date' : 'time'}
                is24Hour={false}
                display="default"
                onChange={handleDateChange}
              />
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1c1c1e',
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