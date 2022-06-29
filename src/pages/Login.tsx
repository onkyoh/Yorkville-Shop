import { SetStateAction, useState } from "react"
import {db, auth} from "../firebase-config"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { setDoc, doc} from 'firebase/firestore'

interface IProps {
    setCurrentUser: React.Dispatch<SetStateAction<string>>
}

const Login = ({setCurrentUser}: IProps) => {

    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [needAccount, setNeedAccount] = useState(true)
    const [error, setError] = useState("")

    const register = async (e: any) => {
        e.preventDefault()
        try {
            const cred = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            console.log(cred)
            const createUser = async () => {
                await setDoc(doc(db, "users", cred.user.uid), {email: cred.user.email, orders: [], cart: []})
                console.log('created')
            }
            createUser()
            setCurrentUser(cred.user.uid)
            console.log(cred.user.uid)
        }
        catch (error: any) {
            setError(error.message)
            console.log(error.message)
        }
        window.location.pathname = "/"
     
    }

    const login = async (e: any) => {
        e.preventDefault()
        try {
            const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            setCurrentUser(cred.user.uid)
            console.log('logged in')
        }
        catch (error: any) {
            setError(error.message)
            console.log(error.message)
        }
        window.location.pathname = "/"
    }

    const handleNeedAccount = () => {
        setNeedAccount(!needAccount)
        setRegisterEmail("")
        setRegisterPassword("")
        setLoginEmail("")
        setLoginPassword("")
        setError("")
    }

  return (
    <div className='login'>
        <div className="form-container">
        {needAccount ?
        <form className="register-form">
            <h2>Register</h2>
            <span>{error}</span>
            <label htmlFor="email-register">Email</label>
            <input type="email" id="email-register" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)}/>
            <label htmlFor="password-register">Password</label>
            <input type="password" id="password-register" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)}/>
            <button onClick={(e) => register(e)}>Create User</button>
            <p>Already have an account?<span onClick={handleNeedAccount}> Click Here.</span></p>
        </form>
        :
        <form className="login-form">
            <h2>Login</h2>
            <span>{error}</span>
            <label htmlFor="email-login">Email</label>
            <input type="email" id="email-login" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}/>
            <label htmlFor="password-login">Password</label>
            <input type="password" id="password-login" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
            <button onClick={(e) => login(e)}>Login</button>
            <p>Need an account?<span onClick={handleNeedAccount}> Click Here.</span></p>
        </form>
        }
       
        </div>
    </div>
  )
}

export default Login