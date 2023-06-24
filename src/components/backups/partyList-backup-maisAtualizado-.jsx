import { useState, useEffect } from "react";
import { db } from '../firebaseconfig';
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { TiArrowUpThick, TiArrowDownThick } from "react-icons/ti";
import Midnight from '../assets/party.webp';
import { getAuth } from "firebase/auth";

function PartyList() {
  //PARTY LIST
  const partiesCollectionRef = collection(db, "parties");
  const [parties, setParties] = useState([]);

  //USER SYSTEM
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  //UPVOTE AND DOWNVOTE
  const [disabledState, setDisabledState] = useState({});

  const upVote = async (id) => {
    if (user) {
      const newParties = [...parties];
      const partyIndex = parties.findIndex(p => p.id === id);
      newParties[partyIndex].vote += 1;
      setParties(newParties);

      const updatedDisabledState = { ...disabledState };
      updatedDisabledState[id] = true;
      setDisabledState(updatedDisabledState);

      await updateDoc(doc(db, "parties", id), { vote: newParties[partyIndex].vote });
      await setDoc(doc(db, "users", (userId.userId)), { testUpBoolean: true, testDownBoolean: false }, { merge: true });
    }
    else {
      alert("You need to login to vote")
    }
  };

  const downVote = async (id) => {
    if (user) {
      const newParties = [...parties];
      const partyIndex = parties.findIndex(p => p.id === id);
      newParties[partyIndex].vote -= 1;
      setParties(newParties);

      const updatedDisabledState = { ...disabledState };
      updatedDisabledState[id] = true;
      setDisabledState(updatedDisabledState);

      await updateDoc(doc(db, "parties", id), { vote: newParties[partyIndex].vote });
      await setDoc(doc(db, "users", (userId.userId)), { testUpBoolean: true, testDownBoolean: false }, { merge: true });
    }
    else {
      alert("You need to login to vote")
    }
  };

  const fetchData = async () => {
    const dataParties = await getDocs(partiesCollectionRef);
    const initParties = dataParties.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setParties(initParties);

    const dataUsers = await getDocs(usersCollectionRef);
    setUsers(dataUsers.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    //DisableSystem (4/4) - Retrieve disabled state from Firestore and update the disabled state variable
    const disabledStateFromFirestore = dataUsers.docs.map((doc) => doc.data().testUpBoolean);
    const updatedDisabledState = {};
    disabledStateFromFirestore.forEach((state, index) => {
      updatedDisabledState[initParties[index].id] = state;
    });
    setDisabledState(updatedDisabledState);
  };

  useEffect(() => {
    console.log("useEffect");
    fetchData();
  }, []);

  //ranking sort
  parties.sort(function (a, b) {
    console.log("sort");
    return parseFloat(b.vote) - parseFloat(a.vote);
  });

  return (
    <div className="ranking">
      {parties.map((partiesSingle, index) => {
        return (
          <div className="container-card" key={index}>
            <div className="buttons">
              <button
                disabled={disabledState[partiesSingle.id]}
                onClick={() => {
                  upVote(partiesSingle.id, partiesSingle.vote);
                }}>
                <TiArrowUpThick style={{ fontSize: "2rem" }} />
              </button>

              <h2>{partiesSingle.vote}</h2>

              <button
                disabled={disabledState[partiesSingle.id]}
                onClick={() => {
                  downVote(partiesSingle.id, partiesSingle.vote);
                }}>
                <TiArrowDownThick style={{ fontSize: "2rem" }} />
              </button>
            </div>
            <div className="card">
              <img src={Midnight} alt="Party" />
              <h2 className="partyname">{partiesSingle.name}</h2>
              <ul className="card-list">
                <li>
                  Place: {partiesSingle.place}
                </li>
                <li>
                  Time:
                </li>
                <li>
                  Price: {partiesSingle.price}
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default PartyList;