
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrxGc58iZFxFZcjrT_MLIh6Vyoun0Mewc",
  authDomain: "studio-4038725125-b78cf.firebaseapp.com",
  projectId: "studio-4038725125-b78cf",
  storageBucket: "studio-4038725125-b78cf.appspot.com",
  messagingSenderId: "2526625447",
  appId: "1:2526625447:web:66e0846c17c40a172fe582"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
