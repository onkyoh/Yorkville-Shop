import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { doc, getDoc, updateDoc } from '@firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { stringify } from 'querystring';

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


const Cart = ({cart, setCart, currentUser}: IProps) => {

  const [totalPrice, setTotalPrice] = useState(0)

  const handleGetCart = async () => {
    const userDoc: any = await getDoc(doc(db, 'users', currentUser))
    setCart(userDoc.data().cart)
    handleTotalPrice(userDoc.data().cart)
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
  }

  useEffect(() => {
    handleGetCart()
  }, [])

  return (
    <section className='cart'>
      <div id='cart-list'>
        {cart.length === 0 ? 
          <div>No items in cart...</div>  
            :
          <ul>
            {cart.map((item: any) => (
              <li key={item.name}>
                <p>Shoe: {item.name}, Size: {item.size}, Price: {item.price}, Quantity: {item.quantity}</p>
                <button onClick={() => handleDeleteItem(item.name, item.size)}> X </button>
              </li>
            ))}
          </ul>
        }
      </div>
      <div id='buy-container'>
        <p>Total Price: ${totalPrice}</p>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </section>
  )
}

export default Cart