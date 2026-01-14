// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJDOWR28qy4_0qWIPir-FCxnAqKdkeCXA",
  authDomain: "project-90d3f.firebaseapp.com",
  projectId: "project-90d3f",
  storageBucket: "project-90d3f.firebasestorage.app",
  messagingSenderId: "77645689991",
  appId: "1:77645689991:web:a20ace69cda652ea99f422"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
