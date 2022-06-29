import { useEffect, useState } from "react"
import { db } from '../firebase-config'
import { doc, getDoc } from '@firebase/firestore'

interface IProps {
  currentUser: string
}

interface IOrders {
  id: string
  totalPrice: number
  paid: boolean
  timePlaced?: string
  orders: {
    name: string
    size: string
    quantity: number
    price: number
    maxQuantity: number
  }[];
  setOrders: React.Dispatch<React.SetStateAction<IOrders['orders']>>;
}

const Orders = ({currentUser}: IProps) => {

  const [paidOrders, setPaidOrders] = useState<IOrders['orders']>([])
  const [unpaidOrders, setUnpaidOrders] = useState<IOrders['orders']>([])


  const handleGetOrders = async () => {
    const userDoc: any = await getDoc(doc(db, 'users', currentUser))
    const orderArray = [...userDoc.data().orders]
    var tempPaid: IOrders['orders'] = []
    var tempUnpaid: IOrders['orders'] = []
    for (let i = 0; i < orderArray.length; i++) {
      if (orderArray[i].paid) {
        tempPaid = [...tempPaid, orderArray[i]]
      } else {
        tempUnpaid = [...tempUnpaid, orderArray[i]]
      }
      
    }
    setPaidOrders([...tempPaid])
    setUnpaidOrders([...tempUnpaid])
  }
  
  const handleShowList = (e: any) => {
    if (e.target.parentElement.className === "open-list") {
      e.target.parentElement.className = ""
    } else {
      e.target.parentElement.className = "open-list"
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
      <h3>No previous orders</h3>  
        :
      <>
        <h3>Unpaid</h3>
        <ul id="orders-list">
          {unpaidOrders.map((order: any) => (
            <li key={order.id} id="orders-item">
              <span> <div> #: {order.id}, </div><div>Price: ${order.totalPrice}, </div></span>
              <ol><span onClick={(e) => handleShowList(e)}> Items: &#9660;</span>
              {order.items.map((shoe: any) => (
                <li>Name: {shoe.name}, Price: {shoe.price}, Quantity: {shoe.quantity}</li>
              ))}</ol> 
            </li>
          ))}
        </ul>
        <h3>Paid</h3>
        <ul id="orders-list">
          {paidOrders.map((order: any) => (
            <li key={order.id} id="orders-item">
            <span> <div> #: {order.id}, </div><div>Price: ${order.totalPrice}, </div></span>
            <ol><span onClick={(e) => handleShowList(e)}> Items: &#9660;</span>
            {order.items.map((shoe: any) => (
              <li>Name: {shoe.name}, Price: {shoe.price}, Quantity: {shoe.quantity}</li>
            ))}</ol> 
          </li>
          ))}
        </ul>
      </>
    }
  </div>
  )
}

export default Orders