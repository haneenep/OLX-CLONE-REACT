import React, { useState,useContext } from 'react';

import Logo from '../../olx-logo.png';
import {Link, useNavigate} from "react-router-dom";
import { FirebaseContext } from '../../store/firebaseContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

function Login() {

  const [email,setEmail] = React.useState('')
  const [password,setPassword] = useState('')
  const {auth} = useContext(FirebaseContext)
  const navigate = useNavigate()

  const [error, setError] = useState({
    email: "",
    password: "",
    commonError: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault()

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
    const newErrors = {}; 
    
    if(!email.trim()){
      newErrors.email = "Email is required";
    } else if(!email.match(emailPattern)){
      newErrors.email = "Email pattern is not Matching"
    }

    if(!password.trim()){
      newErrors.password = "Password is required";
    } else if(password.length < 6){
      newErrors.password = "Password must need atleast 6 characters"
    }

    if(Object.keys(newErrors).length > 0){
      setError(newErrors);
      return;
    }

    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=> {
      userCredential.user
      navigate('/')
    })
    .catch((error) => {
      setError({commonError : error.message})
    }) 
  }

  return (
    <div>
      <div className="loginParentDiv">
        <img width="200px" height="200px" src={Logo}></img>
        {error.commonError && <span className="error" style={{color : "red"}}>{error.commonError}</span>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <br />
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value) }
            id="email"
            name="email"
          />
          {error.email ? <span className="error" style={{color: "red"}}>{error.email}</span>: <br/>}
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            className="input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
          />
          {error.password ? <span className="error" style={{color:"red"}}>{error.password}</span>: <br/>}
          <br />
          <br />
          <button>Login</button>
        </form>
        <Link to={'/signup'}>Signup</Link>
      </div>
    </div>
  );
}

export default Login;
