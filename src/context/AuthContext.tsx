import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyJ0kjzbvVhGYUQC_u4Ab8tpd-WEwBp_k",
  authDomain: "aidailyplanner.firebaseapp.com",
  projectId: "aidailyplanner",
  storageBucket: "aidailyplanner.firebasestorage.app",
  messagingSenderId: "1070967105278",
  appId: "1:1070967105278:web:518eac25ea0ce02d6e27af",
  measurementId: "G-HZ8WYMD8CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up Google OAuth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Get this from Google Cloud Console
    iosClientId: 'YOUR_IOS_CLIENT_ID', // Get this from Google Cloud Console
    clientId: 'YOUR_WEB_CLIENT_ID', // Get this from Google Cloud Console
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        // Handle the Google Sign-in result
        // You'll need to implement the token exchange with Firebase
        Alert.alert('Success', 'Google sign-in successful!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 