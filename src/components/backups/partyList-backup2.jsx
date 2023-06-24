import {useState, useEffect} from "react";
import {db} from '../firebaseconfig';
import {collection, getDocs, updateDoc, doc, setDoc, addDoc} from 'firebase/firestore';
import { TiArrowUpThick, TiArrowDownThick} from "react-icons/ti";
import Midnight from '../assets/party.webp'
import { getAuth} from "firebase/auth";

function PartyList(userId) {
    const [parties, setParties] = useState([]);
    const partiesCollectionRef = collection(db, "parties");

    const [counter , setCounter] = useState(0)

    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "users");

    // UPVOTE AND DOWNVOTE
    const auth = getAuth();
    const user = auth.currentUser;

    const upVote = async (id, vote) => {
        if (user) {

            await updateDoc(doc(db, "parties", id),{vote: vote + 1});
            await setDoc(doc(db, "users", (userId.userId)), {testUpBoolean: true, testDownBoolean: false}, {merge: true});
        }
        else {
            alert("You need to login to vote")
        }
    };

    const downVote = async (id, vote) => {
        if (user) {
            await updateDoc(doc(db, "parties", id),{vote: vote - 1});
            // await setDoc(doc(db, "users", (userId.userId)), {[id]: false}, {merge: true});
            await setDoc(doc(db, "users", (userId.userId)), {testUpBoolean: false, testDownBoolean: true}, {merge: true});
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
        setCounter(189)
    };
    useEffect(() => {
        console.log("useEffect")
        fetchData();
    
    }, []);
    
    //DisableSystem (1/4) - useState of the disabled button
    const [disabled, setDisabled] = useState([]);

    return (
        <div className="ranking">
            {parties.map((partiesSingle, index) => {

                //ranking sort
                parties.sort(function(a, b) {
                    return parseFloat(b.vote) - parseFloat(a.vote);
                });

                //DisableSystem (2/4) - map to get the disabled boolean value from firebase
                const mapUpTest = users.map((usersSingle) => usersSingle.testUpBoolean);
                const mapDownTest = users.map((usersSingle) => usersSingle.testDownBoolean);

                //DisableSystem (3/4) - function to change the disabled state of the button (3/4)
                const handleDisableUpdate = (newData) => {
                    setDisabled(newData);
                };

                return(
                    <div className="container-card" key={index}>
                        <div className="buttons">

                            <button 
                            disabled={mapUpTest[index]} 
                            onClick={() => {
                                upVote(partiesSingle.id, partiesSingle.vote);
                                fetchData();

                                //DisableSystem (4/4) - call the function with the map as parameter, index to get the first of the map
                                handleDisableUpdate(mapUpTest[index]);
                            }}>
                                <TiArrowUpThick style={{ fontSize: "2rem" }}/>
                            </button>

                            <h2>{partiesSingle.vote}</h2>
                            
                            <button
                            disabled={mapDownTest[index]} 
                            onClick={() => {
                                downVote(partiesSingle.id, partiesSingle.vote);
                                fetchData();
                                handleDisableUpdate(mapDownTest[index]);
                                }}>
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