
const Navbar = () => {
  
  const handleBrand = (chosenBrand: string) => {
    window.localStorage.setItem('brand', chosenBrand)
    console.log(chosenBrand)
  }

  return (
    <div className="navbar">
      <div id="logo">YorkvilleShop</div>
      <ul>
          <li><a href="/Home">HOME</a></li>
          <li id="shop-anchor">SHOP &#9660;
            <div id="shop-dropdown">
              <a href="/Shop" onClick={() => handleBrand("All")}>All</a>
              <a href="/Shop" onClick={() => handleBrand("Jordan")}>Jordan</a>
              <a href="/Shop" onClick={() => handleBrand("Nike")}>Nike</a>
              <a href="/Shop" onClick={() => handleBrand("Adidas")}>Adidas</a>
              <a href="/Shop" onClick={() => handleBrand("Essentials")}>Essentials</a>
            </div>
        </li>
          <li><a href="/Policies">POLICIES</a></li>
          <li><a href="/Orders">ORDERS</a></li>
          <li><a href="/Cart">CART</a></li>
      </ul>
    </div>
  )
}

export default Navbar