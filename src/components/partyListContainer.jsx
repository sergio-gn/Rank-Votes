import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { getAuth } from "firebase/auth";
import PartyList from "./PartyList";
import Cities from "./cities";

function PartyContainer() {
  const [parties, setParties] = useState([]);
  const [users, setUsers] = useState([]);
  const [disabledState, setDisabledState] = useState({});

  const auth = getAuth();
  const user = auth.currentUser;

  const upVote = async (id) => {
    if (user) {
      await updateDoc(doc(db, "parties", id), { vote: increment });
      setParties(prevParties =>
        prevParties.map(party => {
          if (party.id === id) {
            return { ...party, vote: party.vote + 1 };
          }
          return party;
        })
      );

      setDisabledState(prevDisabledState => ({
        ...prevDisabledState,
        [id]: true
      }));

      await setDoc(doc(db, "users", user.uid), { testUpBoolean: true }, { merge: true });
    } else {
      alert("You need to login to vote");
    }
  };

  const downVote = async (id) => {
    if (user) {
      await updateDoc(doc(db, "parties", id), { vote: decrement });
      setParties(prevParties =>
        prevParties.map(party => {
          if (party.id === id) {
            return { ...party, vote: party.vote - 1 };
          }
          return party;
        })
      );

      setDisabledState(prevDisabledState => ({
        ...prevDisabledState,
        [id]: true
      }));

      await setDoc(doc(db, "users", user.uid), { testDownBoolean: true }, { merge: true });
    } else {
      alert("You need to login to vote");
    }
  };

  const filterPartiesByCity = (parties) => {
    const filteredParties = parties.filter((party) => party.city === "guarapuava");
    if (filteredParties.length > 0) {
      filteredParties.forEach((party) => {
        console.log(party.name);
      });
    } else {
      console.log("No parties found in guarapuava");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const dataParties = await getDocs(collection(db, "parties"));
      const initParties = dataParties.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setParties(initParties);

      const dataUsers = await getDocs(collection(db, "users"));
      setUsers(dataUsers.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      const disabledStateFromFirestore = dataUsers.docs.reduce((state, doc) => {
        const { id, testUpBoolean, testDownBoolean } = doc.data();
        if (id && (testUpBoolean || testDownBoolean)) {
          return { ...state, [id]: true };
        }
        return state;
      }, {});
      setDisabledState(disabledStateFromFirestore);

      filterPartiesByCity(initParties);
    };

    fetchData();
  }, []);

  return (
    <>
      <Cities />
      <PartyList
        parties={parties}
        users={users}
        disabledState={disabledState}
        upVote={upVote}
        downVote={downVote}
      />
    </>
  );
}

export default PartyContainer;