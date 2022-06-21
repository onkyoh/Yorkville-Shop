import '../src/styles/App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Policies from './pages/Policies';
import {useState } from 'react';

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


const App = () => {

  const [cart, setCart] = useState<ICart["cart"]>([])

  let page

  switch(window.location.pathname) {
    case "/Home":
      page = <Home/>
      break
    case "/Shop":
      page = <Shop cart={cart} setCart={setCart}/>
      break
    case "/Orders":
      page = <Orders/>
      break
    case "/Cart":
      page = <Cart cart={cart} setCart={setCart}/>
      break
    case "/Policies":
      page = <Policies/>
      break
    default:
      page = <Home/>
      break  
  }

  return (
    <>
      {page}
      <Navbar/>
    </>
  );
}

export default App;
