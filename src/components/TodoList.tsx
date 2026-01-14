import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface Todo {
  id: string;
  text: string;
  createdAt: Date;
}

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'todos'));
      const todoList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(),
      }));
      setTodos(todoList);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        text: newTodo,
        createdAt: new Date(),
      });
      setTodos([...todos, { id: docRef.id, text: newTodo, createdAt: new Date() }]);
      setNewTodo('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.text}</Text>
            <Button title="Delete" onPress={() => deleteTodo(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  todoText: {
    flex: 1,
  },
}); 