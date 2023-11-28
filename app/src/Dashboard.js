import "./dashboard.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

import Register from "./Register";

const Dashboard = () => {
  const [roomData, setRoomData] = useState(null);
  const [distance, setDistance] = useState(0);
  const [roommateList, setRoommateList] = useState(null);

  const navigate = useNavigate();
  
  const goHome = () => {
    navigate('/');
  }

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

      get(groupRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setRoomData(snapshot.val());
          } else {
            console.log("no data available");
            setRoommateList([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [roommateList]);

  return (
    <>
      {roomData ? (
        <div className="main">
          <h1 className="title display-4">
            {roomData.groupName + "'s trashcan 🗑"}
          </h1>
          <div className="queue">
            {roomData.queue.map((name, ind) => {
              if (roomData.queue[roomData.index] === name) {
                return (
                  <p className="roommate-item-selected" key={ind}>
                    <b>{name}</b>
                  </p>
                );
              } else {
                return (
                  <p className="roommate-item" key={ind}>
                    {name}
                  </p>
                );
              }
            })}
          </div>
          <div className="information">
            <div className="leaderboard">
              <h1 className="title-2">🏆 Leaderboard</h1>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Number</th>
                    <th scope="col">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {roomData.queue.map((name, ind) => {
                    return (
                      <tr key={ind}>
                        <th scope="col">{ind + 1}</th>
                        <td>{name}</td>
                        <td>{roomData.numbers[ind]}</td>
                        {/* get point value from database based on name */}
                        <td>9</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="stats">
              <h1 className="title-2">📊 Stats</h1>
              <h3>
                Fullness: {Math.trunc(((1330 - distance) / 1330) * 100) + "%"}
              </h3>
            </div>
          </div>

          <div className="btn-wrapper">
            <button onClick={goHome}>Go Home</button>
          </div>
        </div>
      ) : (
        <Register getRoomData={getRoomData}></Register>
      )}
    </>
  );
}

export default Dashboard;
