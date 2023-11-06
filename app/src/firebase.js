import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
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
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
