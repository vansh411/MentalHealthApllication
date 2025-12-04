// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";  // ✅ Storage import

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR0waxeCZLNnDtrsdynlpyEmeJRABQci4",
  authDomain: "mentalhealthapplication-dd348.firebaseapp.com",
  projectId: "mentalhealthapplication-dd348",
  storageBucket: "mentalhealthapplication-dd348.firebasestorage.app",
  messagingSenderId: "685454968715",
  appId: "1:685454968715:web:2a8fdf5659a95558dc118e",
  measurementId: "G-PTJK6NXCWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (only load if supported — stops Vite from crashing)
let analytics = null;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);   // ✅ Storage initialized

// Authentication providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Export everything
export { 
  auth, 
  googleProvider, 
  facebookProvider, 
  signInWithPopup, 
  db,
  storage,
  analytics 
};
