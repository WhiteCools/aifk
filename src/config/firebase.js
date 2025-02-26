import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLJf7gXT_CdoRDtUwKi9gdon7FeHEGzjk",
  authDomain: "flazu-c4bd4.firebaseapp.com",
  projectId: "flazu-c4bd4",
  storageBucket: "flazu-c4bd4.firebasestorage.app",
  messagingSenderId: "60010373845",
  appId: "1:60010373845:web:521b5ed863f032a320785c",
  measurementId: "G-C0V1YKQ48H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { auth, db, analytics, googleProvider };
