import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2JGLSuGYF8uyx9caQtZg1lJTgTzYqaP0",
  authDomain: "rioters-b0f93.firebaseapp.com",
  projectId: "rioters-b0f93",
  storageBucket: "rioters-b0f93.appspot.com",
  messagingSenderId: "1016852189752",
  appId: "1:1016852189752:web:ac748e2c57ca121eb6cccd",
  measurementId: "G-V6THY66CX8",
  databaseURL: "https://rioters-b0f93-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
