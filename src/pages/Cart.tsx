import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { doc, getDoc, updateDoc } from '@firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import Instructions from '../components/Instructions'
import { DocumentSnapshot, DocumentData } from 'firebase/firestore'


interface IProps {
  currentUser: string
}

interface IItem {
  name: string
  size: string
  quantity: number
  price: number
  maxQuantity: number
}

interface IOrder {
  orders: {
    totalPrice: number
    id: string
    paid: boolean
    timePlaced: string
    address: IAddress
    items: IItem[]
  }
}

interface IAddress {
  firstName: string,
  lastName: string,
  address1: string,
  address2?: string,
  city: string,
  postalCode: string,
  province: string,
}


const Cart = ({currentUser}: IProps) => {
  
  const emptyAddress = {
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    province: "",
  }
  const [totalPrice, setTotalPrice] = useState(0)
  const [checkout, setCheckout] = useState(false)
  const [cart, setCart] = useState<IItem[]>()
  const [ship, setShip] = useState(false)
  const [error, setError] = useState("")
  const [shipmentAddress, setShipmentAddress] = useState<IAddress>(emptyAddress)
  const [cartError, setCartError] = useState("")
  const [isDisabled, setIsDisabled] = useState(true)
  const [paid, setPaid] = useState(false)
  const [displayedID, setDisplayedID] = useState("")
  

  const handleGetCart = async () => {
    try {
      const userDoc: any = await getDoc(doc(db, 'users', currentUser))
      if (userDoc.data() && userDoc.data().cart) {
        setCart(() => [...userDoc.data().cart])
        handleInitialTotalPrice([...userDoc.data().cart])
      }
    } catch (e: any) {
      console.log(e.message)
      setCartError(() => "Error with cart retrieval")
    }
  }

  const handleDeleteItem = async (name: string, size: string) => {
      var tempCart: IItem[] = [...cart!]
      var idx = tempCart.findIndex(item => item.name === name && item.size === size)
      if (tempCart[idx].quantity < 2) {
        tempCart.splice(idx, 1)
      } else {
        tempCart[idx].quantity -= 1
      }
      setCart([...tempCart])
      await updateDoc((doc(db, 'users', currentUser)), {
        cart: [...tempCart]
      })
      if (tempCart) {
        handleInitialTotalPrice([...tempCart])  
      }
  }

  const generateId = () => {
    const generatedId = uuidv4();
    const tempId = generatedId.split("")
    var orderId = "";
    for (let i = 0; i < 8; i++) {
      orderId = orderId + tempId[i]
    }
    setDisplayedID(orderId)
    return orderId
  }

  const generateTime = async () => {
    try {
      const loader: HTMLElement | null = document.querySelector("#loader")
      if (loader) {
        loader.className = "show"
        const timeFetch = await fetch("https://salty-citadel-43385.herokuapp.com/https://timeapi.io/api/Time/current/zone?timeZone=EST")
        const timeResponse = await timeFetch.json()
        const unLoad = async () => {
        loader.className = ""
      }
      await unLoad()
      return timeResponse.dateTime
    }
    } catch (e: any) {
      console.log(e.message)
    }
  }

  const handleInitialTotalPrice = (tempCart: IItem[]) => {
    if (cart) {
      let calculatedPrice = 0;
      for (let i = 0; i < cart.length; i++) {
        calculatedPrice = calculatedPrice + (tempCart[i].price * tempCart[i].quantity)
      }
      setTotalPrice(calculatedPrice)
    }
     
  }


  const handleTotalPrice = (tempCart: IItem[], boolean: boolean) => {
      let calculatedPrice = 0;
      for (let i = 0; i < cart!.length; i++) {
        calculatedPrice = calculatedPrice + (tempCart[i].price * tempCart[i].quantity)
      }
      if (boolean) {
        calculatedPrice = calculatedPrice + 15
      }
      setTotalPrice(calculatedPrice)
  }


  const validateAddress = (formResults: IAddress) => {
    let errorTracker = "";
    let isValid = false

    const postalValidation: RegExp = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i

    if (formResults.firstName === "") {
      errorTracker = "First Name is required."
    }
    if (formResults.lastName === "") {
      errorTracker = "Last Name is required."
    }
    if (formResults.address1 === "") {
      errorTracker = "Address 1 is required."
    }
    if (formResults.city === "") {
      errorTracker = "City is required."
    }
    if (formResults.province === "") {
      errorTracker = "Province is required."
    }
    if (!formResults.postalCode.match(postalValidation)) {
      errorTracker = "Not a valid Postal Code."
    }
    if (formResults.postalCode === "") {
      errorTracker = "Postal Code is required."
    }
    setError(errorTracker)
    console.log(errorTracker)
    if (!errorTracker) {
      isValid = true 
    }
    console.log(isValid)
    return isValid;
  }

  const handlePurchase = async (e: any) => {
    e.preventDefault()
    let isValid = true
    if (ship) {
      isValid = validateAddress(shipmentAddress)
    }

    if (isValid) {
    try {
      const userDoc: DocumentSnapshot<DocumentData> | undefined  = await getDoc(doc(db, 'users', currentUser))
      if (!userDoc.data()) {
        console.log("error retrieving user data")
        return
      }

      var oldOrders = (userDoc.data()!.orders)
      const orderId: string = generateId();
      const timePlaced: string = await generateTime();
      const newOrder: IOrder['orders'] = { id: orderId, items: [...cart!], address: shipmentAddress, totalPrice: totalPrice, paid: false, timePlaced: timePlaced }
      await updateDoc((doc(db, 'users', currentUser)), {
        orders: [...oldOrders, newOrder]
      })
      await updateDoc((doc(db, 'users', currentUser)), {
        cart: []
      })
      setPaid(true)
    } catch (e: any) {
      setError(e.messsage)
    }
  } 
  }

  const handleGoToCheckout = () => {
    if (cart) {
      setCheckout(false)
      setShip(false)
      handleInitialTotalPrice([...cart])
      setError("")
      setIsDisabled(true)
    }
  }

  const handleShip = (boolean: boolean) => {
    setShip(() => boolean)
    handleTotalPrice(cart!, boolean)
    setIsDisabled(false)
    setError("")
    setShipmentAddress(emptyAddress)
  }

 const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    const field = target.id
    setShipmentAddress({...shipmentAddress, [field]: target.value})
  }

  const handleModal = (display: string) => {
    const modal: any = document.querySelector(".modal")
    if (display === "show") {
      modal.showModal();
    } else {
      modal.close();
    }
  }

  useEffect(() => {
    if (currentUser) {
      handleGetCart()
      setCartError(() => "")
    }
  }, [currentUser])

  return (
    <section className='cart'>
      {!checkout ? 
      <div id='cart-list'>
        {!cart || cart.length === 0 || !currentUser ? 
          <h1>No items in cart...</h1>  
            :
          <> 
          {!cart || cart.length === 0 ? null : <button onClick={() => setCheckout(true)}>GO TO CHECKOUT</button>}
          <span>{cartError}</span>
          <ul>
            {cart.map((item: IItem) => (
              <li key={`${item.name}+${item.size}`} >
                <p>Shoe: {item.name}, Size: {item.size}, Price: ${item.price}, Quantity: {item.quantity}</p>
                <button onClick={() => handleDeleteItem(item.name, item.size)}> X </button>
              </li>
            ))}
          </ul>
          </>
        }
      </div>
      :
      <>
      {!paid ?
      <div id='buy-container'>
        <button id="back-to-cart" className="back-button" onClick={handleGoToCheckout}>&#9664; Back</button>
        <form>
          <h2>Enter Shipping Address</h2>
          <span className='error' style={!error ? {display: "none"} : {}}>{error}</span>
          <section>
            <div className='method'>
              <input type="radio" name="Delivery" value="pickup" id="pickup" className="radio" onChange={() => handleShip(false)}/>
              <label htmlFor="pickup">Pickup in Toronto</label>
            </div>
            <div className='method'>
              <input type="radio" name="Delivery" value="ship" id="ship" className="radio" onChange={() => handleShip(true)}/>
              <label htmlFor="ship">Ship + $15</label>
            </div>
            {ship ? <p onClick={() => handleModal("show")}>Shipping instructions</p> : <p onClick={() => handleModal("show")}>Pickup instructions</p>}
          </section>
       
          {ship ? 
            <>
              <div>
                <div>
                  <label htmlFor="firstName">First Name *</label>
                  <input type="text" id="firstName" value={shipmentAddress.firstName} onChange={(e) => handleAddress(e)} required/>
                </div>
                <div>
                  <label htmlFor="lastName">Last Name *</label>
                  <input type="text" id="lastName" value={shipmentAddress.lastName} onChange={(e) => handleAddress(e)} required/>
                </div>
              </div>
              <label htmlFor="address1">Address 1 *</label>
              <input type="text" id="address1" value={shipmentAddress.address1} onChange={(e) => handleAddress(e)} required/>

              <label htmlFor="address2">Address 2</label>
              <input type="text" id="address2" value={shipmentAddress.address2} onChange={(e) => handleAddress(e)}/>

              <div className='address3-container'>
                  <div>
                    <label htmlFor="city">City *</label>
                    <input type="text" id="city" value={shipmentAddress.city} onChange={(e) => handleAddress(e)} required/>
                  </div>
                  <div>
                    <label htmlFor="postalCode" id="postalCode-label">Postal Code *</label>
                    <input type="text" id="postalCode" value={shipmentAddress.postalCode} onChange={(e) => handleAddress(e)} required/>
                  </div>
                  <div>
                    <label htmlFor="province">Province *</label>
                    <input type="text" id="province" value={shipmentAddress.province} onChange={(e) => handleAddress(e)} required/>
                  </div>
                </div>
            </>
          : 
            null}
          <p>Total Price: ${totalPrice}</p>
          <button onClick={handlePurchase} disabled={isDisabled}>PURCHASE</button>
        </form>
        <Instructions handleModal={handleModal} ship={ship}/> 
      </div>
      : <>
          <div className='instruction-details'>
            <h1>E-TRANSFER: k_keung@live.com</h1>
            <h1>ORDER ID: {displayedID}</h1>
            <h1>ORDER PRICE: ${totalPrice}</h1>
            <p onClick={() => handleModal("show")}>Instructions</p>
          </div>
          <Instructions handleModal={handleModal} ship={ship}/> 
        </>
      }
       </>
      }
      <div id="loader" className=''>
        <div id="loader-icon"></div>
      </div>
    </section>
  )
}

export default Cart
