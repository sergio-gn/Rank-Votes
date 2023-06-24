import React, {useState} from "react";
import {auth,provider} from "../firebaseconfig";
import {signInWithPopup} from "firebase/auth";
import Logged from './logged';

function SignIn(){

    const [value,setValue] = useState('')
    const handleClick =()=>{
      signInWithPopup(auth,provider).then((data)=>{
        setValue(data.user.email)
        localStorage.setItem("email",data.user.email)
      })
    }
    return (
      <div className="login">
        {value ? <Logged uid={uid} /> : <button onClick={handleClick}>Login</button>}
      </div>
    );
  }
  
export default SignIn;