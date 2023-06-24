import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import PartyHunter from "../assets/profile.png";

function Logged() {
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const { displayName } = user;
      setDisplayName(displayName);
    }
  }, []);

  return (
    <div className="d-flex align-items-center">
        <p>{displayName}</p>
        <img className="user-icon" src={PartyHunter} alt="Profile" />
    </div>
  );
}

export default Logged;
