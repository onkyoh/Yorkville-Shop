import { useState, useEffect, useContext } from 'react';
import '../src/styles/App.css';
import Navbar from './components/Navbar';
import Main from './components/Main';
import { auth } from './firebase-config';
import { onAuthStateChanged } from "firebase/auth";

const App = () => {

  const [brandChange, setBrandChange] = useState("")
  const [currentUser, setCurrentUser] = useState("")

  useEffect(() => {
    onAuthStateChanged (auth, (retrievedUser) => {
      if (retrievedUser) {
        setCurrentUser(retrievedUser.uid)
        console.log("current User is", retrievedUser.uid)
      } else {
       console.log("No previous user found") 
      }
    })
  }, [])




  return (
    <>
      <Main brandChange={brandChange} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
      <Navbar setBrandChange={setBrandChange} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
    </>
  );
}

export default App;
