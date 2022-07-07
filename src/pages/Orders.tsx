import React, { useEffect, useState } from "react"
import { db } from '../firebase-config'
import { doc, getDoc } from '@firebase/firestore'
import { DocumentData, DocumentSnapshot } from "firebase/firestore"

interface IProps {
  currentUser: string
}

interface IItems {
  name: string
  size: string
  quantity: number
  price: number
  maxQuantity: number
}

interface IOrder {
  id: string
  totalPrice: number
  paid: boolean
  timePlaced?: string
  items: IItems[];
}

interface IOrders {
  orders: IOrder[]
  setOrders: React.Dispatch<React.SetStateAction<IOrders>>;
}

const Orders = ({currentUser}: IProps) => {

  const [paidOrders, setPaidOrders] = useState<IOrders['orders']>([])
  const [unpaidOrders, setUnpaidOrders] = useState<IOrders['orders']>([])


  const handleGetOrders = async () => {
    const userDoc: DocumentSnapshot<DocumentData> | undefined = await getDoc(doc(db, 'users', currentUser))
    if (userDoc.data() && userDoc.data()!.orders) {
      const orderArray = [...userDoc.data()!.orders]
      let tempPaid: IOrders['orders'] = []
      let tempUnpaid: IOrders['orders'] = []
      for (let i = 0; i < orderArray.length; i++) {
        if (orderArray[i].paid) {
          tempPaid = [...tempPaid, orderArray[i]]
        } else {
          tempUnpaid = [...tempUnpaid, orderArray[i]]
        } 
      }
      setPaidOrders([...tempPaid])
      setUnpaidOrders([...tempUnpaid])
    } else {
      console.log('error retrieving orders')
    }
  }
  
  const handleShowList = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const target = e.target as HTMLSpanElement
    if (target) {
      if (target.parentElement!.className === "open-list") {
        target.parentElement!.className = ""
      } else {
        target.parentElement!.className = "open-list"
      }
    }
  }

  useEffect(() => {
    if (currentUser) {
      handleGetOrders()
    }
  }, [currentUser])

  return (
    <div className='orders'>
      {(paidOrders.length === 0 && unpaidOrders.length === 0) ? 
      <h3>No previous orders...</h3>  
        :
      <>
        <h3>Unpaid</h3>
        <ul id="orders-list">
          {unpaidOrders.map((order: IOrder) => (
            <li key={order.id} id="orders-item">
              <span>
                <div> #: {order.id}, </div>
                <div>Price: ${order.totalPrice}, </div>
              </span>
              <ol>
                <span onClick={(e) => handleShowList(e)}> Items: &#9660;</span>
                {order.items.map((item: IItems) => (
                  <li>Name: {item.name}, Price: ${item.price}, Quantity: {item.quantity}</li>
                ))}
              </ol> 
            </li>
          ))}
        </ul>
        <h3>Paid</h3>
        <ul id="orders-list">
          {paidOrders.map((order: IOrder) => (
            <li key={order.id} id="orders-item">
            <span>
              <div> #: {order.id}, </div>
              <div>Price: ${order.totalPrice}, </div>
            </span>
            <ol>
              <span onClick={(e) => handleShowList(e)}> Items: &#9660;</span>
              {order.items.map((item: IItems) => (
                <li>Name: {item.name}, Price: {item.price}, Quantity: {item.quantity}</li>
               ))}
            </ol> 
          </li>
          ))}
        </ul>
      </>
    }
  </div>
  )
}

export default Orders