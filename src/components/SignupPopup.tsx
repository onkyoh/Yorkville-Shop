
import { useNavigate } from "react-router-dom";


const SignupPopup = () => {

    const handleModal = (display: string) => {
        const modal: any = document.querySelector(".modal")
        if (display === "show") {
          modal.showModal();
        } else {
          modal.close();
        }
      }

    const navigate = useNavigate()

    const handlePopupClicked = () => {
       navigate('/Login')
    }

  return (
    <dialog className='modal'>
         <div id="close-modal">
            <span  onClick={() => handleModal('hide')}>x</span>
        </div>
        <h3>Welcome!</h3>
        <p>See a product you like? Sign up for an account now and make your purchase before it's too late!</p>
        <button onClick={handlePopupClicked}>SIGN UP</button>
    </dialog>
  )
}

export default SignupPopup