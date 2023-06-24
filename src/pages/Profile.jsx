import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [joinDate, setJoinDate] = useState("");

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
    }
  }, [user]);

  const logout = () => {
    localStorage.clear();
    signOut(auth)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log("Erro para deslogar", error);
      });
  };

  return (
    <div>
      <p>Name: {name}</p>
      <p>Join Date: {joinDate}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Profile;