import "./App.css";
import React, { useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  collection,
  getFirestore,
  addDoc,
  getDocs,
  limit,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
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

function App() {
  const [inputFields, setInputFields] = useState([]);
  const [numRoommates, setNumRoommates] = useState(1);

  const addInputField = () => {
    setNumRoommates(numRoommates + 1);
    setInputFields([
      ...inputFields,
      <InputField key={inputFields.length} num={numRoommates + 1} />,
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // all the names of the roomates in order
    let listOfRoommates = [];
    for (let i = 0; i < numRoommates; i++) {
      listOfRoommates.push(formData.get(i + 1));
    }
    console.log(listOfRoommates);
  };

  return (
    <>
      <h1>Smart trashcan</h1>
      <p>Please input your roommates into fields below.</p>

      <form onSubmit={handleSubmit}>
        <label>
          1.
          <input name={1} />
        </label>

        {inputFields}
        <br />
        <button type="button" onClick={addInputField}>
          Add a roommate
        </button>
        <button type="submit">confirm</button>
      </form>
    </>
  );
}

const InputField = (props) => {
  return (
    <div>
      <label>
        {props.num}. <input name={props.num} type="text" />
      </label>
    </div>
  );
};

export default App;
