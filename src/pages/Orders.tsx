import { useEffect, useState } from "react"
import { db } from '../firebase-config'
import { doc, getDoc } from '@firebase/firestore'

interface IProps {
  currentUser: string
}

interface IOrders {
  id: string
  totalPrice: number
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

  const [orders, setOrders] = useState<IOrders["orders"]>([])

  const handleGetOrders = async () => {
    const userDoc: any = await getDoc(doc(db, 'users', currentUser))
    setOrders(userDoc.data().orders)
    console.log(userDoc.data().orders)
  }

  useEffect(() => {
    handleGetOrders()
  }, [])

  return (
    <div className='orders'>
      {orders.length === 0 ? 
      <div>No previous orders</div>  
        :
      <ul>
        {orders.map((order: any) => (
          <li key={order.id}>#: {order.id}, Price: ${order.totalPrice}</li>
        ))}
      </ul>
    }
  </div>
  )
}

export default Orders