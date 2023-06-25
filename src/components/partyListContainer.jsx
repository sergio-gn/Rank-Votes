import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { getAuth } from "firebase/auth";
import PartyList from "./PartyList";
import SelectCities from "./selectCities";

function PartyContainer() {
  const [parties, setParties] = useState([]);
  const [users, setUsers] = useState([]);
  const [disabledState, setDisabledState] = useState({});



  const auth = getAuth();
  const user = auth.currentUser;



  const [selectedCity, setSelectedCity] = useState("");


  const upVote = async (partyID) => {
    if (user) {
      const partyIndex = parties.findIndex(party => party.id === partyID);
      const updatedVoteCount = parties[partyIndex].vote + 1;

      await updateDoc(doc(db, "parties", partyID), { vote: updatedVoteCount });
      setParties(prevParties => {
        const updatedParties = [...prevParties];
        updatedParties[partyIndex].vote = updatedVoteCount;
        return updatedParties;
      });

      setDisabledState(prevDisabledState => ({
        ...prevDisabledState,
        [partyID]: true
      }));

      await setDoc(doc(db, "users", user.uid), { testUpBoolean: true }, { merge: true });
    } else {
      alert("You need to login to vote");
    }
  };

  const downVote = async (partyID) => {
    if (user) {
      const partyIndex = parties.findIndex(party => party.id === partyID);
      const updatedVoteCount = parties[partyIndex].vote - 1;

      await updateDoc(doc(db, "parties", partyID), { vote: updatedVoteCount });
      setParties(prevParties => {
        const updatedParties = [...prevParties];
        updatedParties[partyIndex].vote = updatedVoteCount;
        return updatedParties;
      });

      setDisabledState(prevDisabledState => ({
        ...prevDisabledState,
        [partyID]: true
      }));

      await setDoc(doc(db, "users", user.uid), { testDownBoolean: true }, { merge: true });
    } else {
      alert("You need to login to vote");
    }
  };

  const filterPartiesByCity = (selectedCity) => {
    const filteredParties = parties.filter((party) => party.city === selectedCity);
    if (filteredParties.length > 0) {
      filteredParties.forEach((party) => {
        console.log(party.name);
        setSelectedCity(selectedCity);
      });
    } else {
      console.log(`No parties found in ${selectedCity}`);
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

      console.log("UseEffect triggered in partyListContainer")
    };
    fetchData();
  }, []);

  return (
    <div className="partyListContainer">
      <SelectCities filterPartiesByCity={filterPartiesByCity} />
      {selectedCity ? (
        <PartyList
          parties={parties}
          users={users}
          disabledState={disabledState}
          upVote={upVote}
          downVote={downVote}
          selectedCity={selectedCity}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default PartyContainer;