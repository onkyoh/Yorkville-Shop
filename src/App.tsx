import { useState, useEffect} from 'react';
import '../src/styles/App.css';
import Navbar from './components/Navbar';
import Main from './components/Main';
import { auth } from './firebase-config';
import { onAuthStateChanged } from "firebase/auth";

const App = () => {

  const [brandChange, setBrandChange] = useState("")
  const [currentUser, setCurrentUser] = useState("")
  const classHide = {
    navClass: "hide",
    burgerClass: "",
    navBarClass: "navbar not-faded"
  }
  const [classes, setClasses] = useState(classHide)


  useEffect(() => {
    onAuthStateChanged (auth, (retrievedUser) => {
      if (retrievedUser) {
        setCurrentUser(retrievedUser.uid)
      } else {
       console.log("No previous user found") 
      }
    })
  }, [])




  return (
    <>
      <Main brandChange={brandChange} currentUser={currentUser} setCurrentUser={setCurrentUser} classes={classes} setClasses={setClasses}/>
      <Navbar setBrandChange={setBrandChange} currentUser={currentUser} setCurrentUser={setCurrentUser} classes={classes} setClasses={setClasses}/>
    </>
  );
}

export default App;
