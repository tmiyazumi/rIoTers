import "./App.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { getDocs, collection, query, where } from "@firebase/firestore";
import Register from "./Register";

function App() {
  const [roomData, setRoomData] = useState(null);
  const getRoomData = (data) => {
    // This function will receive data from the child component
    setRoomData(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = collection(db, "group"); // Firestore collection reference
        const q = query(ref, where("groupName", "==", roomData.groupName)); // Create a query to filter by groupName
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          // Retrieve the first matching document
          querySnapshot.forEach((doc) => {
            setRoomData({ ...doc.data() });
          });
        } else {
          // Handle the case when no matching document is found
          console.log("No document found with groupName:", roomData.groupName);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  });

  return (
    <>
      {roomData ? (
        <>
          <h1>Welcome to the Dashboard</h1>
          <h2>
            It's {roomData.queue[roomData.index]} turn to take the trash out!
          </h2>
          <h3>Group name: {roomData.groupName}</h3>
          <p>QUEUE:</p>
          {roomData.queue.map((name) => {
            if (roomData.queue[roomData.index] === name) {
              return (
                <p>
                  <b>{name}</b>
                </p>
              );
            } else {
              return <p>{name}</p>;
            }
          })}
        </>
      ) : (
        <Register getRoomData={getRoomData}></Register>
      )}
    </>
  );
}

export default App;
