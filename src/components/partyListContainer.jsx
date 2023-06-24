import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { getAuth } from "firebase/auth";
import PartyList from "./PartyList";
import Cities from "./cities";

function PartyContainer() {
    //--------------------------- parties ---------------------------//
    const [parties, setParties] = useState([]);
    //--------------------------- parties ---------------------------//

    //--------------------------- users -----------------------------//
    const [users, setUsers] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;
    //--------------------------- users -----------------------------//

    //--------------------------- DisableSystem -----------------------------------------------------------//
    const [disabledState, setDisabledState] = useState({});
    //---------------------------- DisableSystem ----------------------------------------------------------//

    const upVote = async (id) => {
        if (user) {
            //--------------------------- parties ----------------------------------//
            const newParties = [...parties];
            const partyIndex = parties.findIndex(p => p.id === id);
            newParties[partyIndex].vote += 1;
            setParties(newParties);
            await updateDoc(doc(db, "parties", id), { vote: newParties[partyIndex].vote });
            //--------------------------- parties ----------------------------------//

            //--------------------------- DisableSystem ----------------------------//
            const updatedDisabledState = { ...disabledState };
            updatedDisabledState[id] = true;
            setDisabledState(updatedDisabledState);
            //--------------------------- DisableSystem ----------------------------//

            //--------------------------- users ------------------------------------//
            await setDoc(doc(db, "users", (userId.userId)), { testUpBoolean: true, testDownBoolean: false }, { merge: true });
            //--------------------------- users ------------------------------------//

        }else {
        alert("You need to login to vote");
        }
    };

    const downVote = async (id) => {
        if (user) {
            //------------------- parties -----------------------------------------//
            const newParties = [...parties];
            const partyIndex = parties.findIndex(p => p.id === id);
            newParties[partyIndex].vote -= 1;
            setParties(newParties);
            await updateDoc(doc(db, "parties", id), { vote: newParties[partyIndex].vote });
            //------------------- parties -----------------------------------------//

            //------------------- DisableSystem -----------------------------------------//
            const updatedDisabledState = { ...disabledState };
            updatedDisabledState[id] = true;
            setDisabledState(updatedDisabledState);
            //------------------- DisableSystem -----------------------------------------//

            //------------------- users -----------------------------------------//
            await setDoc(doc(db, "users", (userId.userId)), { testUpBoolean: true, testDownBoolean: false }, { merge: true });
            //------------------- users -----------------------------------------//
        } else {
        alert("You need to login to vote");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            //--------------------------- parties -------------------------------------------------------------//
            const dataParties = await getDocs(collection(db, "parties"));
            const initParties = dataParties.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setParties(initParties);
            //--------------------------- parties -------------------------------------------------------------//

            //--------------------------- users ---------------------------------------------------------------//
            const dataUsers = await getDocs(collection(db, "users"));
            setUsers(dataUsers.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            //---------------------------- users ---------------------------------------------------------------//

            //--------------------------- DisableSystem --------------------------------------------------------//
            const disabledStateFromFirestore = dataUsers.docs.map((doc) => doc.data().testUpBoolean);
            const updatedDisabledState = {};
            disabledStateFromFirestore.forEach((state, index) => {
                updatedDisabledState[initParties[index].id] = state;
            });
            setDisabledState(updatedDisabledState);
            //--------------------------- DisableSystem ----------------------------------------------------------//
        };

    fetchData();
    }, []); 

    return (
        <>
            <Cities/>
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