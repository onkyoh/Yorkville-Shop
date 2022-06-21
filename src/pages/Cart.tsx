import React, { FC } from 'react'

interface IProps {
  cart: {
    name: string
    size: string
    quantity: number
    price: number
    maxQuantity: number
  }[];
  setCart: React.Dispatch<React.SetStateAction<IProps['cart']>>;
}


const Cart = ({cart, setCart}: IProps) => {
  return (
    <div className='page'>
      {!cart ? 
      <div>No items in cart...</div>  
    :
      cart.map((item: any, i: number) => (
        <div key={i}>Shoe: {item.name}, Size: {item.size}, Price: {item.price}, Quantity: {item.quantity}</div>
      ))
    }
  </div>
  )
}

export default Cart