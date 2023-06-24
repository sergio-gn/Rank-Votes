import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Feed from './pages/Feed'
import PartyHunter from './assets/partyhunter.svg'
import { TiUser, TiHome, TiHeart} from "react-icons/ti";


import {useState, useEffect} from "react";
import {provider, auth} from "./firebaseconfig";
import {signInWithPopup, onAuthStateChanged} from "firebase/auth";

import Logged from './components/logged';


function App() {
  const [value,setValue] = useState('')
  const [uid, setUid] = useState(null);
  const handleClick =()=>{
    signInWithPopup(auth,provider).then((data)=>{
      setValue(data.user.email)
      localStorage.setItem("email",data.user.email)
    })
  }
  useEffect(() => {
    setValue(localStorage.getItem('email'))
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return unsubscribe;
  }, []);
  return(
    <>
      <Router className="navbar">
        <div className="header">
          <Link to="/">
            <div className="logo">
              <img src={PartyHunter} alt="Party Hunter Logo" />
            </div>
          </Link>
          <div className="login">
            <Link to="/profile">
              {value ? <Logged /> : <button onClick={handleClick}>Login</button>}
            </Link>
          </div>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/">
                <TiHome style={{ fontSize: "2.5rem" }}/>
              </Link>
            </li>
            <li>
              <Link to="/feed">
                <TiHeart style={{ fontSize: "2.5rem" }}/>
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <TiUser style={{ fontSize: "2.5rem" }}/>
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route index path="/" element={<Home userId={uid}/>} />
            <Route path="/feed" element={<Feed />} />
        </Routes>
      </Router>
    </>
  );
}

export default App