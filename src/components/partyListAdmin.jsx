import {useState, useEffect} from "react";
import {db} from '../firebaseconfig';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';


function PartyList() {
    
    //CREATE NEW PARTY
    const [newName, setNewName] = useState("");
    const [newVotes, setNewVotes] = useState(0);
    const createUser = async () => {
        await addDoc(partiesCollectionRef, { name: newName, vote: Number(newVotes) });
    };
    // DELETE USER
    const deleteUser = async(id) => {
      const userDoc = doc(db, "parties", id);
      await deleteDoc(userDoc);
    }
    
    const [parties, setparties] = useState([]);
    const partiesCollectionRef = collection(db, "parties");
    // UPVOTE AND DOWNVOTE
    const upVote = async (id, vote) => {
        const userDoc = doc(db, "parties", id);
        const newFields = {vote: vote + 1};
        await updateDoc(userDoc, newFields);
    };
    const downVote = async (id, vote) => {
        const userDoc = doc(db, "parties", id);
        const newFields = {vote: vote - 1};
        await updateDoc(userDoc, newFields);
    };
    
    useEffect(() => {
      const getparties = async () => {
        const data = await getDocs(partiesCollectionRef);
        setparties(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
      };
      getparties();
    }, [])

    return (
      <div className="App">
        <input placeholder="Name..." onChange={(event) => {setNewName(event.target.value);}}/>
        <input type="number" placeholder="Votes..." onChange={(event) => {setNewVotes(event.target.value);}}/>
        <button onClick={createUser}>Create User</button>

        {parties.map((party) => {
            parties.sort(function(a, b) {
                return parseFloat(b.vote) - parseFloat(a.vote);
            });
            return(
                <div>
                    <h1>Party: {party.name}</h1>
                    <h2>Votes: {party.vote}</h2>
                    <button onClick={() => {upVote(party.id, party.vote)}}>Upvote</button>
                    <button onClick={() => {downVote(party.id, party.vote)}}>Downvote</button>
                    <button onClick={() => {deleteUser(party.id, party.age)}}>Delete User</button>
                </div>
            );
        })}
      </div>
    )
}
export default PartyList;