import React, {useState} from 'react';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Policies from '../pages/Policies';
import Login from '../pages/Login';
import { Routes, Route } from 'react-router-dom';

interface ICart {
    cart: {
      name: string
      size: string
      quantity: number
      price: number
      maxQuantity: number
    }[];
    setCart: React.Dispatch<React.SetStateAction<ICart['cart']>>;
  }

  interface IProps {
    brandChange: string
    currentUser: string
    setCurrentUser: React.Dispatch<React.SetStateAction<string>>;
  }


const Main = ({brandChange, currentUser, setCurrentUser}: IProps) => {

    const [cart, setCart] = useState<ICart["cart"]>([])
  

  return (
    <Routes> {/* The Switch decides which component to show based on the current URL.*/}
      <Route path='/' element={<Home/>}></Route>
      <Route path='/Shop' element={<Shop brandChange={brandChange} currentUser={currentUser}/>}></Route>
      <Route path='/Cart' element={<Cart cart={cart} setCart={setCart} currentUser={currentUser}/>}></Route>
      <Route path='/Orders' element={<Orders currentUser={currentUser}/>}></Route>
      <Route path='/Policies' element={<Policies/>}></Route>
      <Route path='/Login' element={<Login setCurrentUser={setCurrentUser}/>}></Route>
    </Routes>
  );
}

export default Main;
