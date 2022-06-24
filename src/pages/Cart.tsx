import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { doc, getDoc, updateDoc } from '@firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

interface IProps {
  cart: {
    name: string
    size: string
    quantity: number
    price: number
    maxQuantity: number
  }[];
  setCart: React.Dispatch<React.SetStateAction<IProps['cart']>>;
  currentUser: string
}

interface IOrder {
  orders: {
    totalPrice: number
    id: string
      items: {
        name: string
        size: string
        quantity: number
        price: number
        maxQuantity: number
    }[];
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


const Cart = ({cart, setCart, currentUser}: IProps) => {

  const [totalPrice, setTotalPrice] = useState(0)
  const [checkout, setCheckout] = useState(false)
  const [paid, setPaid] = useState(false)
  const [ship, setShip] = useState(false)
  const [shipmentAddress, setShipmentAddress] = useState<IAddress>({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    province: "",
  })

  const handleGetCart = async () => {
    const userDoc: any = await getDoc(doc(db, 'users', currentUser))
    setCart(userDoc.data().cart)
    handleTotalPrice([...userDoc.data().cart])
  }

  const handleDeleteItem = async (name: string, size: string) => {
    var tempCart = cart
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
    handleTotalPrice([...tempCart])
  }

  const generateId = () => {
    const generatedId = uuidv4();
    const tempId = generatedId.split("")
    var orderId = "";
    for (let i = 0; i < 8; i++) {
      orderId = orderId + tempId[i]
    }
    return orderId
  }

  const handleTotalPrice = (tempCart: any) => {
    var calculatedPrice = 0;
    for (let i = 0; i < cart.length; i++) {
      calculatedPrice = calculatedPrice + (tempCart[i].price * tempCart[i].quantity)
    
    }
    if (ship) {
      calculatedPrice = calculatedPrice + 15
    }
    setTotalPrice(calculatedPrice)
    console.log("Price changed")
  }

  const handleCheckout = async () => {
    const userDoc: any = await getDoc(doc(db, 'users', currentUser))
    var oldOrders = (userDoc.data().orders)
    const orderId: string = generateId();
    var newOrder: IOrder['orders'] = { id: orderId, items: cart, totalPrice: totalPrice}

    await updateDoc((doc(db, 'users', currentUser)), {
      orders: [...oldOrders, newOrder]
    })

    await updateDoc((doc(db, 'users', currentUser)), {
      cart: []
    })

    setPaid(true)
  }

 const handleAddress = (e: any) => {
    const field = e.target.id
    setShipmentAddress({...shipmentAddress, [field]: e.target.value})
  }

  useEffect(() => {
    if (currentUser) {
      handleGetCart()
    }
  }, [currentUser])

  // useEffect(() => {

  // }, [ship])



  return (
    <section className='cart'>
      {!checkout ? 
      <div id='cart-list'>
        {cart.length === 0 || !currentUser || paid ? 
          <div id="empty">No items in cart...</div>  
            :
          <> 
          <button onClick={() => setCheckout(true)}>Go to checkout</button>
          <ul>
            {cart.map((item: any) => (
              <li key={`${item.name}+${item.size}`}>
                <p>Shoe: {item.name}, Size: {item.size}, Price: ${item.price}, Quantity: {item.quantity}</p>
                <button onClick={() => handleDeleteItem(item.name, item.size)}> X </button>
              </li>
            ))}
          </ul>
          </>
        }
      </div>
      :
      <div id='buy-container'>
        <button id="back-to-cart" onClick={() => setCheckout(false)}>Back</button>
  
        <form>
          <h2>Enter Shipping Address</h2>
          <div>
            <input type="radio" name="Delivery" value="pickup" id="pickup" className="radio" onChange={() => setShip(!ship)}/>
            <label htmlFor="pickup">Pickup in Toronto</label>
            <p></p>
          </div>

          <div>
            <input type="radio" name="Delivery" value="ship" id="ship" className="radio" onChange={() => setShip(!ship)}/>
            <label htmlFor="ship">Ship + $15</label>
          </div>
          <div>
            <div>
              <label htmlFor="firstName">First Name *</label>
              <input type="text" id="firstName" value={shipmentAddress.firstName} onChange={(e) => handleAddress(e)}/>
            </div>
            <div>
              <label htmlFor="lastName">Last Name *</label>
              <input type="text" id="lastName" value={shipmentAddress.lastName} onChange={(e) => handleAddress(e)}/>
            </div>
          </div>
          <label htmlFor="address1">Address 1 *</label>
          <input type="text" id="address1" value={shipmentAddress.address1} onChange={(e) => handleAddress(e)}/>

          <label htmlFor="address2">Address 2</label>
          <input type="text" id="address2" value={shipmentAddress.address2} onChange={(e) => handleAddress(e)}/>

          <div>
            <div>
              <label htmlFor="city">City *</label>
              <input type="text" id="city" value={shipmentAddress.city} onChange={(e) => handleAddress(e)}/>
            </div>
            <div>
              <label htmlFor="postalCode">Postal Code *</label>
              <input type="text" id="postalCode" value={shipmentAddress.postalCode} onChange={(e) => handleAddress(e)}/>
            </div>
            <div>
              <label htmlFor="province">Province *</label>
              <input type="text" id="province" value={shipmentAddress.province} onChange={(e) => handleAddress(e)}/>
            </div>
            </div>
          <p></p>
          <p>Total Price: ${totalPrice}</p>
          <button onClick={handleCheckout}>Checkout</button>
        </form>
      </div>
      }
    </section>
  )
}

export default Cart