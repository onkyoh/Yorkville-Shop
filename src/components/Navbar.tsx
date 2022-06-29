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

  const handleShowBrands = () => {
    var showBrandsSpan: any = document.querySelector("#triangle-span")
    var shopDropdown: any =  document.querySelector("#shop-dropdown")
    if ( showBrandsSpan.className === "open-span") {
      showBrandsSpan.className = "close-span"
      shopDropdown.className = ""
    } else {
      showBrandsSpan.className = "open-span"
      shopDropdown.className = "hide"
    }
    console.log(shopDropdown)
  }

  const handleShowNav = () => {
    var nav: any =  document.querySelector("#nav-links")
    var burger: any =  document.querySelector("#burger")
    var navBar: any = document.querySelector(".navbar")
    if ( nav.className === "") {
      nav.className = "hide"
      burger.className = ""
      navBar.className = "navbar not-faded"
    } else {
      nav.className = ""
      burger.className = "make-x"
      navBar.className = "navbar"

    }
    console.log(burger)
  }


  const logout = async () => {
    await signOut(auth);
    setCurrentUser('');
}


  return (
    <nav className="navbar not-faded">
      <div id="logo"><Link to="/">YorkvilleShop</Link></div>
      <ul id="nav-links" className='hide'>
          <li><Link to="/">HOME</Link></li>
          <li id="shop-anchor" onClick={handleShowBrands}><span id="triangle-span" className='open-span'>SHOP</span>
            <div id="shop-dropdown" className="hide">
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
      <div id='burger' onClick={handleShowNav}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  )
}

export default Navbar