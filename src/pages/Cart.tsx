import React, { useEffect } from 'react'
import { db } from '../firebase-config'
import { doc, getDoc, updateDoc } from '@firebase/firestore'

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


const Cart = ({cart, setCart, currentUser}: IProps) => {

  const handleGetCart = async () => {
    const userDoc: any = await getDoc(doc(db, 'users', currentUser))
    setCart(userDoc.data().cart)
  }

  const handleDeleteItem = async (name: string) => {
    console.log(name)
    var tempCart = cart
    var idx = tempCart.findIndex(item => item.name === name)
    if (tempCart[idx].quantity < 2) {
      tempCart.splice(idx, 1)
    } else {
      tempCart[idx].quantity -= 1
    }
    setCart([...tempCart])
    await updateDoc((doc(db, 'users', currentUser)), {
      cart: [...tempCart]
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
                <button onClick={() => handleDeleteItem(item.name)}> X </button>
              </li>
            ))}
          </ul>
        }
      </div>
      <div id='buy-container'>
        <button>Make Purchase</button>
      </div>
    </section>
  )
}

export default Cart