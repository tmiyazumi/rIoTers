import React, { useState } from "react";
import { db } from "./firebase";
import { ref, set } from "firebase/database";

// Import the functions you need from the SDKs you need

function Register({ getRoomData }) {
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

    let data = {
      queue: listOfRoommates,
      index: 0,
      groupName: formData.get("group-name"),
    };

    set(ref(db, `${formData.get("group-name")}`), data);

    // Push the new data to the database (creates a new unique key for each entry)
    // const ref = collection(db, "group"); // Firebase creates this automatically

    // const expirationDate = new Date();
    // expirationDate.setDate(expirationDate.getDate() + 7);
    // const cookieValue = data.groupName;
    // document.cookie = `myCookie=${cookieValue}; expires=${expirationDate.toUTCString()}`;
    // Send room data to frontend app component
    getRoomData(data);

    // try {
    //   addDoc(ref, data);
    // } catch (err) {
    //   console.log(err);
    // }
    // db.collection("roommates")
    //   .add({ names: listOfRoommates })
    //   .then(() => {
    //     console.log("List added to Firestore");
    //   })
    //   .catch((error) => {
    //     console.error("Error adding list to Firestore:", error);
    //   });
  };

  return (
    <>
      <h1>Smart trashcan</h1>
      <p>Please input your roommates into fields below.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Group Name: <input name="group-name" />
        </label>
        <br />
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

export default Register;
