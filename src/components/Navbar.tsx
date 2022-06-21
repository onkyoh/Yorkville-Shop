import { Link } from "react-router-dom"


const Navbar = () => {
  
  const handleBrand = (chosenBrand: string) => {
    window.localStorage.setItem('brand', chosenBrand)
    console.log(chosenBrand)
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
            </div>
        </li>
          <li><Link to="/Policies">POLICIES</Link></li>
          <li><Link to="/Orders">ORDERS</Link></li>
          <li><Link to="/Cart">CART</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar