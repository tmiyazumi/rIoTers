const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue, get, update } = require("firebase/database");
require('dotenv').config();

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
const indRef = ref(db, "Rioters/index")

const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const lastSentTimeStamps = {};

let textSent = false;
let firstTime = true;

onValue(indRef, (snapshot) => {
    const value = snapshot.val()
    console.log("ind update");
    textSent = false;
    firstTime = true;
})


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
                    const points = data.pointers;
                    
                    const phoneNumber = numbers[index];
                    console.log(phoneNumber);
                    const message = `${names[index]} it's your turn to take out the trash!`;

                    const currentTimeStamp = Date.now();
                    const lastTimeStamp = lastSentTimeStamps[phoneNumber] || 0;


                    
                    if (currentTimeStamp - lastTimeStamp >= 9000) {
                        lastSentTimeStamps[phoneNumber] = currentTimeStamp;
                        if (textSent) {
                            const updates = {};
                            points[index] -= 1;
                            updates['Rioters/pointers'] = points;
                            update(ref(db), updates);
                        };
                    
                        client.messages.create({
                            body: message,
                            to: phoneNumber,
                            from: process.env.TWILIO_PHONE_NUMBER,
                        })
                        .then((message) => console.log(`SMS sent: ${message.sid}`))
                        .catch((error) => console.error(`Error sending SMS: ${error}`));
                        if (firstTime) {
                            const updates = {}
                            pushedTime = Date.now();
                            updates['Rioters/time'] = pushedTime;
                            update(ref(db), updates);
                            firstTime = false;
                        }
                    }
                    else {
                        console.log("message has been sent in the past 5 minutes!");
                    }
                })
        }
  });

  return () => unsubscribe();