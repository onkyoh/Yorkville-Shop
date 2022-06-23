import { Link } from "react-router-dom"
import { signOut } from "firebase/auth";
import { auth } from '../firebase-config'

interface IProps {
  setBrandChange:  React.Dispatch<React.SetStateAction<string>>
  currentUser: string
  setCurrentUser: React.Dispatch<React.SetStateAction<string>>
}

const Navbar = ({setBrandChange, currentUser, setCurrentUser}: IProps) => {
  
  const handleBrand = (chosenBrand: string) => {
    window.localStorage.setItem('brand', chosenBrand)
    console.log(chosenBrand)
    setBrandChange(chosenBrand)
  }

  const logout = async () => {
    await signOut(auth);
    setCurrentUser('');
}  

  return (
    <nav className="navbar">
      <div id="logo">YorkvilleShop</div>
      <ul>
          <li><Link to="/">HOME</Link></li>
          <li id="shop-anchor">SHOP &#9660;
            <div id="shop-dropdown">
              <Link to="/Shop" onClick={() => handleBrand("All")}>All</Link>
              <Link to="/Shop" onClick={() => handleBrand("Jordan")}>Jordan</Link>
              <Link to="/Shop" onClick={() => handleBrand("Nike")}>Nike</Link>
              <Link to="/Shop" onClick={() => handleBrand("Adidas")}>Adidas</Link>
              <Link to="/Shop" onClick={() => handleBrand("Essentials")}>Essentials</Link>
              <Link to="/Shop" onClick={() => handleBrand("Test")}>Test</Link>
            </div>
        </li>
          <li><Link to="/Policies">POLICIES</Link></li>
          <li><Link to="/Orders">ORDERS</Link></li>
          <li><Link to="/Cart">CART</Link></li>
          {currentUser ? 
           <li><Link to="/" onClick={logout}>LOGOUT</Link></li>
          :
          <li><Link to="/Login">LOGIN</Link></li>
          }
         
      </ul>
    </nav>
  )
}

export default Navbar