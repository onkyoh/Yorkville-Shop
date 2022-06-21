import { useState } from 'react';
import '../src/styles/App.css';
import Navbar from './components/Navbar';
import Main from './components/Main';

const App = () => {

  const [brandChange, setBrandChange] = useState("")

  return (
    <>
      <Main brandChange={brandChange}/>
      <Navbar setBrandChange={setBrandChange}/>
    </>
  );
}

export default App;
