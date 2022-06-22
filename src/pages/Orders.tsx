import { useEffect } from "react"
import { db } from '../firebase-config'
import { doc, getDoc } from '@firebase/firestore'

interface IProps {
  orders: {
    name: string
    size: string
    quantity: number
    price: number
    maxQuantity: number
  }[];
  setOrders: React.Dispatch<React.SetStateAction<IProps['orders']>>;
  currentUser: string
}

const Orders = ({orders, setOrders, currentUser}: IProps) => {

  const handleGetOrders = async () => {
    const userDoc: any = await getDoc(doc(db, 'users', currentUser))
    setOrders(userDoc.data().orders)
  }

  useEffect(() => {
    handleGetOrders()
  }, [])

  return (
    <div className='page'>
      {orders.length === 0 ? 
      <div>No previous orders</div>  
        :
      <ul>
        {orders.map((item: any, i: number) => (
          <li key={i}>Shoe: {item.name}, Size: {item.size}, Price: {item.price}, Quantity: {item.quantity}</li>
        ))}
      </ul>
    }
  </div>
  )
}

export default Orders