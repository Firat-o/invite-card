// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXTqH0X7uUQCzQc9qSj3nE5M4H3ISSK_I",
  authDomain: "invite-card-d3876.firebaseapp.com",
  projectId: "invite-card-d3876",
  storageBucket: "invite-card-d3876.appspot.com",
  messagingSenderId: "807048304171",
  appId: "1:807048304171:web:0bb12828eae43a29a4fc6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app); // Initialize Firestore using the initialized Firebase app object

export { db }; // Export Firestore instance for use in other parts of your application
