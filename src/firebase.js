import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Replace these with your actual Firebase project configuration values
const firebaseConfig = {
  apiKey: "AIzaSyAQwlGIBVKf9gxLULsoOX6QW99mBDZgZNU",
  authDomain: "complaint-system-1f50b.firebaseapp.com",
  projectId: "complaint-system-1f50b",
  storageBucket: "complaint-system-1f50b.firebasestorage.app",
  messagingSenderId: "519730314759",
  appId: "1:519730314759:web:f051646a897a55dad174a2",
  measurementId: "G-T3L72W5GHV"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication 
export const auth = getAuth(app);

// Initialize Firestore (Database)
export const db = getFirestore(app);

export default app;
