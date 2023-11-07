import "./App.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { getDatabase, ref, child, get, onValue } from "firebase/database";

import Register from "./Register";

function App() {
  const [roomData, setRoomData] = useState(null);
  const [distance, setDistance] = useState(0);
  const [roommateList, setRoommateList] = useState(null);

  const getRoomData = (data) => {
    // This function will receive data from the child component
    setRoomData(data);
  };

  useEffect(() => {    
    const numberRef = ref(db, "test/int");

    const unsubscribe = onValue(numberRef, (snapshot) => {
      const data = snapshot.val();
      setDistance(data);
    });

    // Clean up listener
    return () => unsubscribe();


    // WORKING ON READING FROM
    // const dbRef = ref(getDatabase());
    // get(child(dbRef, `users/${userId}`))
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       console.log(snapshot.val());
    //     } else {
    //       console.log("No data available");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // const fetchData = async () => {
    //   try {
    //     const ref = collection(db, "group"); // Firestore collection reference
    //     const q = query(ref, where("groupName", "==", roomData.groupName)); // Create a query to filter by groupName
    //     const querySnapshot = await getDocs(q);
    //     if (querySnapshot.size > 0) {
    //       // Retrieve the first matching document
    //       querySnapshot.forEach((doc) => {
    //         setRoomData({ ...doc.data() });
    //       });
    //     } else {
    //       // Handle the case when no matching document is found
    //       console.log("No document found with groupName:", roomData.groupName);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    // fetchData();
  });

  useEffect(() => {
    if (roommateList === null) {
      const groupRef = ref(db, "Rioters");

      get(groupRef).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setRoomData(snapshot.val());
        } else {
          console.log("no data available");
          setRoommateList([]);
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [roommateList]);

  return (
    <>
      {roomData ? (
        <>
          <h1>Welcome to the Dashboard</h1>
          <h2>
            It's {roomData.queue[roomData.index]} turn to take the trash out!
          </h2>
          <h3>Group name: {roomData.groupName}</h3>
          <h3>Distance: {distance}</h3>
          <p>QUEUE:</p>
          {roomData.queue.map((name, ind) => {
            if (roomData.queue[roomData.index] === name) {
              return (
                <p key={ind}>
                  <b>{name}</b>
                </p>
              );
            } else {
              return <p key={ind}>{name}</p>;
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
