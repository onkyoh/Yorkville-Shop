
import { useNavigate } from "react-router-dom";

interface IProps {
  classes: {
    navClass: string
    burgerClass: string
    navBarClass: string
  }
  setClasses: React.Dispatch<React.SetStateAction<IProps['classes']>>
}

const SignupPopup = ({setClasses, classes}: IProps) => {

    const handleModal = (display: string) => {
        const modal: any = document.querySelector(".modal")
        if (display === "show") {
          modal.showModal();
        } else {
          modal.close();
        }
    }
    
    
    const handleCloseNav = () => {
      if ( classes.navClass === "") {
        setClasses({
          navClass: "hide",
          burgerClass: "",
          navBarClass: "navbar not-faded"
        })
      }
    }

    const navigate = useNavigate()
    const handlePopupClicked = () => {
      handleCloseNav()
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