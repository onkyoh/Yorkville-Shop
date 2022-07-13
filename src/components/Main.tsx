import React, {useState} from 'react';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Policies from '../pages/Policies';
import Login from '../pages/Login';
import { Routes, Route } from 'react-router-dom';

  interface IProps {
    brandChange: string
    currentUser: string
    setCurrentUser: React.Dispatch<React.SetStateAction<string>>;
  }


const Main = ({brandChange, currentUser, setCurrentUser}: IProps) => {

  
  return (
    <Routes>
      <Route path='/' element={<Home currentUser={currentUser}/>}></Route>
      <Route path='/Shop' element={<Shop brandChange={brandChange} currentUser={currentUser}/>}></Route>
      <Route path='/Cart' element={<Cart currentUser={currentUser}/>}></Route>
      <Route path='/Orders' element={<Orders currentUser={currentUser}/>}></Route>
      <Route path='/Policies' element={<Policies/>}></Route>
      <Route path='/Login' element={<Login setCurrentUser={setCurrentUser}/>}></Route>
    </Routes>
  );
}

export default Main;
