import React, { useState } from "react";
import { db } from "./firebase";
import { ref, set } from "firebase/database";
import "./App.css";
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
    let phoneList = [];
    for (let i = 0; i < numRoommates; i++) {
      listOfRoommates.push(formData.get(i + 1));
      phoneList.push(formData.get(`phone${i + 1}`));
    }

    console.log(listOfRoommates);
    console.log(phoneList);

    let data = {
      queue: listOfRoommates,
      index: 0,
      groupName: formData.get("group-name"),
      numbers: phoneList,
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
    <div className="main-div">
      <h1 className="display-4">Smart trashcan 🗑</h1>
      <p>Please input your roommates into fields below.</p>

      <form onSubmit={handleSubmit}>
        <div class="row mb-3">
          <label for="inputEmail3" class="col-sm-2 col-form-label">
            Group name:
          </label>
          <div class="col-sm-10">
            <input name="group-name" class="form-control" id="inputEmail3" />
          </div>
        </div>
        <div class="col-12">
          <label for="inputAddress" class="form-label">
            Roomate #1
          </label>
          <input
            type="text"
            name={1}
            class="form-control input-item"
            id="inputAddress"
            placeholder="Name"
          />
          <input
            type="text"
            name={`phone${1}`}
            class="form-control input-item"
            id="inputAddress"
            placeholder="Number"
          />
        </div>
        {inputFields}
        <button
          type="button"
          class="btn btn-secondary add-roommate"
          onClick={addInputField}
        >
          Add a roommate
        </button>
        <button type="submit" class="btn btn-primary">
          Confirm
        </button>
      </form>
      {/* <form >
        <p>
          Group Name: <input name="group-name" />
        </p>
        <label>
          Roommate #1
          <br />
          <label>
            Name: <input name={1} />
          </label>
          <br />
          <label>
            Number: <input name={`phone${1}`} />
          </label>
        </label>

        {inputFields}
        <br />
        <button type="button" onClick={addInputField}>
          Add a roommate
        </button>
        <button type="submit">confirm</button>
      </form> */}
    </div>
  );
}

const InputField = (props) => {
  return (
    <div class="col-12">
      <label for="inputAddress" class="form-label">
        Roomate #{props.num}
      </label>
      <input
        type="text"
        name={props.num}
        class="form-control input-item"
        id="inputAddress"
        placeholder="Name"
      />
      <input
        type="text"
        name={`phone${props.num}`}
        class="form-control input-item"
        id="inputAddress"
        placeholder="Number"
      />
    </div>
  );
};

export default Register;
