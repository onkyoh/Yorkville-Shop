import { FC } from 'react'

const Policies:FC = () => {
  return (
    <div className='policies'>
      <h2>Policies:</h2>
      <div>
        <ol>
          <li> All sales are final, no exchanges or returns.</li>
          <li> All items are 100% authentic! Most if not all pairs have proof of purchase.</li>
          <li> All deposits are non-refundable! Deposits are used to secure your item so that no one else can purchase it.</li>
          <li> If you would like your item to be shipped out, there is an additional cost for shipping! Items will be shipped out within 2 weeks of purchase.</li>
          <li> After paying the non-refundable deposit, you must pick up or request shipping. If not, your item may be sold to someone else.</li>
        </ol>
      </div>
    </div>
  )
}

export default Policies