// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcyTGjtCp7M4yv0qf_r4d3fONlMdD-Hu0",
  authDomain: "tefsir-741b8.firebaseapp.com",
  projectId: "tefsir-741b8",
  storageBucket: "tefsir-741b8.firebasestorage.app",
  messagingSenderId: "781730779607",
  appId: "1:781730779607:web:097f2f094edbdf3a3f7b92",
  measurementId: "G-ZD06JJ32MY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);