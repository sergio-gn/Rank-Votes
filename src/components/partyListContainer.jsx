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
      const partyIndex = parties.findIndex(party => party.id === id);
      const updatedVoteCount = parties[partyIndex].vote + 1;
      
      await updateDoc(doc(db, "parties", id), { vote: updatedVoteCount });
      setParties(prevParties => {
        const updatedParties = [...prevParties];
        updatedParties[partyIndex].vote = updatedVoteCount;
        return updatedParties;
      });
  
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
      const partyIndex = parties.findIndex(party => party.id === id);
      const updatedVoteCount = parties[partyIndex].vote - 1;
  
      await updateDoc(doc(db, "parties", id), { vote: updatedVoteCount });
      setParties(prevParties => {
        const updatedParties = [...prevParties];
        updatedParties[partyIndex].vote = updatedVoteCount;
        return updatedParties;
      });
  
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
      
      const dataUsers = await getDocs(collection(db, "users"));
      const usersData = dataUsers.docs.reduce((users, doc) => {
        const { id, testUpBoolean, testDownBoolean } = doc.data();
        if (id) {
          users[id] = { testUpBoolean, testDownBoolean };
        }
        return users;
      }, {});
  
      const updatedParties = initParties.map((party) => {
        const { id } = party;
        const userData = usersData[id];
        if (userData) {
          return {
            ...party,
            vote: userData.testUpBoolean ? party.vote + 1 : userData.testDownBoolean ? party.vote - 1 : party.vote
          };
        }
        return party;
      });
  
      setParties(updatedParties);
      setUsers(dataUsers.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setDisabledState(usersData);
      
      filterPartiesByCity(updatedParties);
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