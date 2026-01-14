import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { X, Mic, MicOff } from 'lucide-react-native';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

interface PlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export default function PlanModal({ visible, onClose, onSubmit }: PlanModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Expo Voice
  useEffect(() => {
    const init = async () => {
      try {
        await Voice.initialize();
        setIsInitialized(true);
      } catch (e) {
        console.error('Voice init error:', e);
      }
    };
    init();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Set up event listeners
  useEffect(() => {
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) setPrompt((prev) => prev + ' ' + e.value[0]);
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.error('Voice error:', e);
      setIsListening(false);
    };
    Voice.onSpeechEnd = () => setIsListening(false);

    return () => {
      Voice.onSpeechResults = undefined;
      Voice.onSpeechError = undefined;
      Voice.onSpeechEnd = undefined;
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      console.error('Voice start error:', e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Voice stop error:', e);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    await onSubmit(prompt.trim());
    setPrompt('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Your Day Plan</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Tell me about your day and I'll help you plan it effectively
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="I want to focus on work, exercise, and relax..."
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {isInitialized && (
                <TouchableOpacity
                  style={[styles.micButton, isListening && styles.micButtonActive]}
                  onPress={isListening ? stopListening : startListening}
                >
                  {isListening ? <MicOff size={24} color="#fff" /> : <Mic size={24} color="#fff" />}
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, !prompt.trim() && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={!prompt.trim()}
              >
                <Text style={styles.buttonText}>Generate Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1c1c1e' },
  modalSubtitle: { fontSize: 16, color: '#8E8E93', marginBottom: 20 },
  closeButton: { padding: 4 },
  inputContainer: { position: 'relative', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, fontSize: 16, minHeight: 120 },
  micButton: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#007AFF', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  micButtonActive: { backgroundColor: '#FF3B30' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  button: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, minWidth: 120, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  cancelButtonText: { color: '#8E8E93', fontSize: 16, fontWeight: '600' },
});
