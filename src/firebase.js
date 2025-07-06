// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA68CedXyHne4o62ept1WY6phrlBujJ6ps",
  authDomain: "snake-game-593c3.firebaseapp.com",
  projectId: "snake-game-593c3",
  storageBucket: "snake-game-593c3.firebasestorage.app",
  messagingSenderId: "729245130892",
  appId: "1:729245130892:web:f94720bad85d5bff669ba9",
  measurementId: "G-Q5TNK8MSDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;