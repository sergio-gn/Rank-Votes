import React, { useState, useEffect } from "react";
import { db } from "../firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function ProfileAdmin() {
  const [parties, setParties] = useState([]);
  const [newParty, setNewParty] = useState({
    name: "",
    place: "",
    city: "",
    price: "",
    vote: 0,
  });

  const partiesCollectionRef = collection(db, "parties");

  const createParty = async () => {
    await addDoc(partiesCollectionRef, newParty);
    setNewParty({
      name: "",
      place: "",
      city: "",
      price: "",
      vote: 0,
    });
  };

  const deleteParty = async (id) => {
    const partyDoc = doc(db, "parties", id);
    await deleteDoc(partyDoc);
  };

  useEffect(() => {
    const getParties = async () => {
      const data = await getDocs(partiesCollectionRef);
      setParties(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getParties();
  }, []);

  return (
    <div className="App">
      <input
        placeholder="Name..."
        value={newParty.name}
        onChange={(event) =>
          setNewParty({ ...newParty, name: event.target.value })
        }
      />
      <input
        placeholder="Place..."
        value={newParty.place}
        onChange={(event) =>
          setNewParty({ ...newParty, place: event.target.value })
        }
      />
      <input
        placeholder="City..."
        value={newParty.city}
        onChange={(event) =>
          setNewParty({ ...newParty, city: event.target.value })
        }
      />
      <input
        placeholder="Price..."
        value={newParty.price}
        onChange={(event) =>
          setNewParty({ ...newParty, price: event.target.value })
        }
      />
      <button onClick={createParty}>Create Party</button>

        <div className="deleteParties">
        {parties.map((party) => {
          parties.sort((a, b) => b.votes - a.votes);
          return (
              <div className="partyCardAdmin" key={party.id}>
                <p>Party: {party.name}</p>
                <button onClick={() => deleteParty(party.id)}>Delete Party</button>
              </div>
          );
        })}
        </div>
    </div>
  );
}

export default ProfileAdmin;