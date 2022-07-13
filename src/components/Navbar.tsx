import { Link } from "react-router-dom"
import { signOut } from "firebase/auth";
import { auth } from '../firebase-config';
import { ReactComponent as Instagram } from '../icons/instagram.svg';

interface IProps {
  setBrandChange:  React.Dispatch<React.SetStateAction<string>>
  currentUser: string
  setCurrentUser: React.Dispatch<React.SetStateAction<string>>
  classes: {
    navClass: string
    burgerClass: string
    navBarClass: string
  }
  setClasses: React.Dispatch<React.SetStateAction<IProps['classes']>>
}

const Navbar = ({setBrandChange, currentUser, setCurrentUser, classes, setClasses}: IProps) => {

  const classShow = {
    navClass: "",
    burgerClass: "make-x",
    navBarClass: "navbar"
  }
  const classHide = {
    navClass: "hide",
    burgerClass: "",
    navBarClass: "navbar not-faded"
  }

  const handleBrand = (chosenBrand: string) => {
    window.localStorage.setItem('brand', chosenBrand)
    console.log(chosenBrand)
    setBrandChange(chosenBrand)

  }

  const handleShowBrands = () => {
    var showBrandsSpan:  HTMLElement | null = document.querySelector("#triangle-span")
    var shopDropdown:  HTMLElement | null =  document.querySelector("#shop-dropdown")
    if (showBrandsSpan && shopDropdown !== null) {
      if ( showBrandsSpan.className === "open-span") {
        showBrandsSpan.className = "close-span"
        shopDropdown.className = ""
      } else {
        showBrandsSpan.className = "open-span"
        shopDropdown.className = "hide"
      }
    }
  }

  const handleShowNav = () => {
    if (classes.navClass === "") {
        setClasses(classHide)
    } else {
        setClasses(classShow)
    }
  }

  const handleCloseNav = () => {
    if ( classes.navClass === "") {
      setClasses(classHide)
    }
}


  const logout = async () => {
    await signOut(auth);
    setCurrentUser('');
}


  return (
      <nav className={classes.navBarClass}>
      <div id="logo"><Link to="/">YorkvilleShop</Link></div>
      <ul id="nav-links" className={classes.navClass}>
          <a href="https://instagram.com/yorkville.shop?igshid=YmMyMTA2M2Y=" id="instagram-container"><Instagram id="instagram"/></a>
          <li onClick={handleCloseNav}><Link to="/">HOME</Link></li>
          <li id="shop-anchor" onClick={handleShowBrands}><span id="triangle-span" className='open-span'>SHOP</span>
            <div id="shop-dropdown" className="hide">
              <Link to="/Shop" onClick={() => {handleCloseNav(); handleBrand("All")}}>All</Link>
              <Link to="/Shop" onClick={() => {handleCloseNav(); handleBrand("Jordan")}}>Jordan</Link>
              <Link to="/Shop" onClick={() => {handleCloseNav(); handleBrand("Nike")}}>Nike</Link>
              <Link to="/Shop" onClick={() => {handleCloseNav(); handleBrand("Adidas")}}>Adidas</Link>
              <Link to="/Shop" onClick={() => {handleCloseNav(); handleBrand("Essentials")}}>Essentials</Link>
              <Link to="/Shop" onClick={() => {handleCloseNav(); handleBrand("New Balance")}}>New Balance</Link>
              <Link to="/Shop" onClick={() => {handleCloseNav(); handleBrand("Puma")}}>Puma</Link>
            </div>
          </li>
          <li onClick={handleCloseNav}><Link to="/Policies">POLICIES</Link></li>
          <li onClick={handleCloseNav}><Link to="/Orders">ORDERS</Link></li>
          <li onClick={handleCloseNav}><Link to="/Cart">CART</Link></li>
          {currentUser ? 
           <li onClick={handleCloseNav}><Link to="/" onClick={logout}>LOGOUT</Link></li>
          :
          <li onClick={handleCloseNav}><Link to="/Login">LOGIN</Link></li>
          } 
      </ul>
      <div id='burger' className={classes.burgerClass} onClick={handleShowNav}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  )
}

export default Navbar