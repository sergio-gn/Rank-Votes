import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {db} from '../firebaseconfig';
import ProfileAdmin from "./ProfileAdmin"; // Import the ProfileAdmin component

function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin status

  useEffect(() => {
    if (user) {
      // Get user's display name
      const displayName = user.displayName || "Sem Nome";
      setName(displayName);

      // Get user's join date
      const joinTimestamp = user.metadata.creationTime;
      const joinDateObj = new Date(joinTimestamp);
      const formattedJoinDate = joinDateObj.toLocaleDateString();
      setJoinDate(formattedJoinDate);

      // Update the name field in the "users" collection
      const updateUser = async () => {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            name: displayName
          });
        } catch (error) {
          console.log("Error updating user data: ", error);
        }
      };

      // Check if user is an admin
      const checkAdminStatus = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.admin || false);
          }
        } catch (error) {
          console.log("Error checking admin status: ", error);
        }
      };

      if (displayName) {
        updateUser();
      }

      checkAdminStatus();
    }
  }, [user]);

  const logout = () => {
    localStorage.clear();
    signOut(auth)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log("Error logging out: ", error);
      });
  };

  return (
    <div>
      <p>Name: {name}</p>
      <p>Join Date: {joinDate}</p>
      {isAdmin && <ProfileAdmin />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Profile;