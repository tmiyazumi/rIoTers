// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue, get } = require("firebase/database");
require('dotenv').config();
 // const express = require('express')

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

const reference = ref(db,"test/int");
const usrRef = ref(db, "Rioters");

const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

onValue(reference, (snapshot) => {
        const value = snapshot.val();
        console.log(value);
        if (value != 0 && value <= 300) {
            get(usrRef)
                .then((snapshot) => {
                    const data = snapshot.val();
                    const index = data.index;
                    const numbers = data.numbers;
                    const names = data.queue;

                    const phoneNumber = numbers[index];
                    console.log(phoneNumber);
                    const message = `${names[index]} it's your turn to take out the trash!`;

                    client.messages.create({
                        body: message,
                        to: phoneNumber,
                        from: process.env.TWILIO_PHONE_NUMBER,
                    })
                    .then((message) => console.log(`SMS sent: ${message.sid}`))
                    .catch((error) => console.error(`Error sending SMS: ${error}`));
                })
        }
  });

  return () => unsubscribe();


