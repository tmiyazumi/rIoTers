import "./dashboard.css";
import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { ref, get, onValue, update, set } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { onValueUpdated } from "firebase/functions";
import './dashboard.css';

import Register from "./Register";

const Dashboard = () => {
  const [roomData, setRoomData] = useState(null);
  const [tempRoomData, setTempRoomData] = useState(null);
  const [distance, setDistance] = useState(0);
  const [changed, setChanged] = useState(0);
  const [roommateList, setRoommateList] = useState(null);
  const [firstTime, setFirstTime] = useState(true);
  const [secondTime, setSecondTime] = useState(true);
  const [oldIndex, setOldIndex] = useState(0);
  const [oldTime, setOldTime] = useState(0);

  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  }

  const getRoomData = (data) => {
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
  }, []);

  useEffect(() => {
    const indexRef = ref(db, "Rioters/index");

    const unsubscribe = onValue(indexRef, (snapshot) => {
      const index = snapshot.val();
      setChanged(index);
    });

    // Clean up listener
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const timeRef = ref(db, "Rioters/time");

    const unsubscribe = onValue(timeRef, (snapshot) => {
      const currTime = snapshot.val();
      setOldTime(currTime);
    });

    // Clean up listener
    return () => unsubscribe();
  }, []);
  // useEffect(() => {
  //   if (roommateList === null) {
      
  //   }
  // }, [roommateList]);


  useEffect(() => {
    if (firstTime) {
      console.log("FIRST TIME");
      setFirstTime(false);
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
      return;
    } else {
      console.log("AHHHHUHFOIUEHFUIEHFIUHE");
      let pointerDB = ref(db, "Rioters/pointers");
      let temp = changed - 1;
      if (temp < 0) {
        temp = 3;
      }
  
      console.log("TEMMPPPPP");
      console.log(temp);
  
      const tempGroupRef = ref(db, "Rioters/pointers/" + temp);
  
      get(tempGroupRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (secondTime){
              setSecondTime(false);
              return;
            } 
            else{
              console.log(snapshot.val());
            setTempRoomData(snapshot.val());
  
            let prevData = snapshot.val(); // Use the updated value
            let updates = {};
            
            //get the time stored in the database
            let time = Date.now();
            let prevTime = oldTime;
            //scoring system

            console.log("PREVV TIME", prevTime);

            let timeDiff = time - prevTime;
            console.log("TIMEEE DIFF", timeDiff);
            let timeDiffInSeconds = timeDiff / 1000; // Convert milliseconds to seconds
            
            let points = 0;

            //every ten seconds subtract 2 points
            points = Math.floor(timeDiffInSeconds / 10) * 2;
            console.log("POINTS", points);
            console.log(temp);
            console.log(prevData);
            updates["Rioters/pointers/" + temp] = prevData + 10 - points;
            update(ref(db), updates);
            }
          }
        })
        .then(() => {
          // After the update, fetch the updated data again
          const groupRef = ref(db, "Rioters");
          return get(groupRef);
        })
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
  }, [changed]);
  

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
                        <td>{roomData.pointers[ind]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="stats">
              <h1 className="title-2">📊 Stats</h1>
              <h3>
                Fullness: {Math.trunc(((2700 - distance) / 2700) * 100) + "%"}
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