
interface IProps {
    ship: boolean
    handleModal: (display: string) => void
}

const Instructions = ({handleModal, ship}: IProps) => {
  return (
    <>
      {ship ? 
       <dialog className='modal' > 
            <div id="close-modal">
                <h3>Shipping Instructions</h3>
                <span  onClick={() => handleModal('hide')}>x</span>
            </div>
            <h4>1.</h4> Please e-transfer the designated email &#40;email will be provided after purchase&#41; within 24 hours of placing order. 
            The e-transfer must amount to 100% of the ORDER PRICE and must contain the ORDER ID and your ACCOUNT EMAIL in the message section.
            <h4>Please note:</h4>
            If you do not e-transfer the entire order price within 24 hours after placing the order, your order will be cancelled.
        </dialog>
      :
        <dialog className='modal' > 
            <div id="close-modal">
                <h3>Pickup Instructions</h3>
                <span  onClick={() => handleModal('hide')}>x</span>
            </div>
            <h4>1.</h4>A deposit of 50% of the price of the CART is required via e-transfer &#40;email will be provided after purchase&#41;. 
            This deposit must be paid within 24 hours otherwise your order will be CANCELLED. 
            The deposit is non-refundable. The rest of the payment is paid upon pickup IN CASH.
            <h4>2.</h4> Please send a direct message to yorkville.shop on instagram with your ACCOUNT EMAIL and ORDER ID &#40;ID will be provided after purchase&#41; 
            to confirm pick up time and location. Further communication will be done there.
            <h4>Please note:</h4>
            If you do not contact us within 24 hours after sending a deposit, your order will be cancelled and the deposit will not be refunded.
        </dialog>
        }
    </>
  )
}

export default Instructions