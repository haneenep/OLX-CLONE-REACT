import {useContext,useState} from 'react';

import Logo from '../../olx-logo.png';
import './Signup.css';
import { FirebaseContext } from '../../store/firebaseContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {doc,setDoc} from "firebase/firestore"
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/userContext';

export default function Signup() {

  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [password,setPassword] = useState('')
  const {auth,db} = useContext(FirebaseContext);
  const {setUser} = useContext(AuthContext);

  const [error,setError] = useState({
    name : "",
    email : "",
    phone : "",
    password : "",
    commonError : ""
  })

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newError = {}
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
    const phonePattern = /^[0-9]{10}$/;

    if(!name.trim()){
      newError.name = "Name is Requied"
    }

    if(!email.trim()){
      newError.email = "Email is Required";
    } else if(!email.match(emailPattern)){
      newError.email = "Email pattern is Not matching";
    }

    if (!phone.trim()) {
      newError.phone = "Number is required";
    } else if (!phone.match(phonePattern)) {
      newError.phone = "Number must be 10 digits";
    }

    if(!password.trim()){
      newError.password = "Password is Required";
    } else if (password.length < 6) {
      newError.password = "Password must be at least 6 characters";
    }

    if(Object.keys(newError).length > 0){
      setError(newError);
      return;
    }

    try {

      // creating user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      const user = userCredential.user;
  
      console.log(user,"userssss");
      
      // updating profile
      await updateProfile(user, {
        displayName : name,
      })
  
      // storing in firebase
      await setDoc(doc(db,"users",user.uid), {
        
        name : name,
        phone : phone,
        id : user.uid,
        email : email
      })
  
      const updatedUser = auth.currentUser;
      setUser(updatedUser)
      
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid : user.uid,
          email : email,
          displayName : name,
          phone : phone
        })
      )
  
      console.log("User Successfully signedup and data saved to firebase");
      navigate('/')

    } catch(error){
      setError({commonError : error.message})
    }

  }

  return (
    <div>
      <div className="signupParentDiv">
        <img width="200px" height="200px" src={Logo}></img>
        {error.commonError && <span className="error" style={{color:"red"}}>{error.commonError}</span>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="userName">Username</label>
          <br />
          <input
            className="input"
            type="text"
            id="userName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
          />
          {error.name ? <span className="error" style={{color: "red"}}>{error.name}</span>: <br/>}
          <br />
          <label htmlFor="email">Email</label>
          <br />
          <input
            className="input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
          {error.email ? <span className="error" style={{color: "red"}}>{error.email}</span>: <br/>}
          <br />
          <label htmlFor="phone">Phone</label>
          <br />
          <input
            className="input"
            type="number"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            name="phone"
          />
          {error.phone ? <span className="error" style={{color: "red"}}>{error.phone}</span>: <br/>}
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
          />
          {error.password ? <span className="error" style={{color: "red"}}>{error.password}</span>: <br/>}
          <br />
          <br />
          <button>Signup</button>
        </form>
        <Link to={'/login'}>Login</Link>
      </div>
    </div>
  );
}
