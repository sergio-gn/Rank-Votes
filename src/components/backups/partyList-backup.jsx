import {useState, useEffect} from "react";
import {db} from '../firebaseconfig';
import {collection, getDocs, updateDoc, doc, setDoc, addDoc} from 'firebase/firestore';
import { TiArrowUpThick, TiArrowDownThick} from "react-icons/ti";
import Midnight from '../assets/party.jpg'
import { getAuth} from "firebase/auth";

function PartyList(userId) {
    const [parties, setParties] = useState([]);
    const partiesCollectionRef = collection(db, "parties");

    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "users");

    // UPVOTE AND DOWNVOTE
    const auth = getAuth();
    const user = auth.currentUser;

    const upVote = async (id, vote) => {
        if (user) {
            await updateDoc(doc(db, "parties", id),{vote: vote + 1});
            await setDoc(doc(db, "users", (userId.userId)), {[id]: true}, {merge: true});
        }
        else {
            alert("You need to login to vote")
        } 
    };

    const downVote = async (id, vote) => {
        if (user) {
            await updateDoc(doc(db, "parties", id),{vote: vote - 1});
            await setDoc(doc(db, "users", (userId.userId)), {[id]: false}, {merge: true});
        }
        else {
            alert("You need to login to vote")
        }
    };

    const fetchData = async () => {
        const dataParties = await getDocs(partiesCollectionRef);
        const dataUsers = await getDocs(usersCollectionRef);
        setParties(dataParties.docs.map((doc) => ({...doc.data(), id: doc.id})));
        setUsers(dataUsers.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };
    useEffect(() => {
        console.log("useEffect")
        fetchData();
    }, []);
    
    return (
        <div className="ranking">
        {parties.map((partiesSingle, index) => {
            parties.sort(function(a, b) {
                return parseFloat(b.vote) - parseFloat(a.vote);
            });
            const mapBatata = users.map((usersSingle) => usersSingle.batataString);
            return(
                <div className="container-card" key={index}>
                    <div className="buttons">
                        <button disabled={disableButton[partiesSingle.id]} onClick={() => {upVote(partiesSingle.id, partiesSingle.vote); fetchData();}}>
                            <TiArrowUpThick style={{ fontSize: "2rem" }}/>
                        </button>
                        <h2>{partiesSingle.vote}</h2>

                        <button onClick={() => {downVote(partiesSingle.id, partiesSingle.vote); fetchData()}}>
                            <TiArrowDownThick style={{ fontSize: "2rem" }}/>
                        </button>
                    </div>
                    <div className="card">
                        <img src={Midnight}/>
                        <h2 className="partyname">{partiesSingle.name}</h2>
                        <ul className="card-list">
                            <li>
                                Place: {partiesSingle.place}
                            </li>
                            <li>
                                Time: {mapBatata}
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