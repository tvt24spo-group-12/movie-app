import '../style/buttonStyle.css'
import { useState } from 'react'
import { useAuth } from '../context/login'
import RegisterPage from './registerpage'
import '../style/sidebar.css'

const URL = "http://localhost:3001/user"
export default function LoginPage({loggedIn, setLoggedIn}){
    const[Identifier, setIdentifier] = useState('')
    const[Password, setPassword] = useState('')
    
    const[openRegister, setOpenRegister] = useState(true);
    const[openLogin, setOpenLogin] = useState(true);
    const { signIn } = useAuth();
  const handleSubmit= async (e) =>{
        e.preventDefault();
      
        try{
       const res = await signIn(Identifier,Password)
            
           
            localStorage.setItem("username", Identifier)
           
            setLoggedIn(true)
            location.reload(false)
            }catch(error){
                console.log(error)
            }
    }

return(
    <>
    {openLogin &&(
     <div className='popupcontainer'>
        <h2 style={{alignSelf: 'start'}}>Login</h2>
    <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center'}}>
            <input
            className='placeHolder'
            type='text'
            placeholder='username or email'
            value={Identifier}
            onChange={e => setIdentifier(e.target.value)}
            />
             <input
            className='placeHolder'
            type='password'
            placeholder='password'
            value={Password}
            onChange={e => setPassword(e.target.value)}
            />
            <button
            onClick={() => {
                setOpenRegister(false)
                setOpenLogin(false)
                location.reload(false)
            }}
             className='cancelBtn'>
            X
        </button>
            <button onClick={() =>{
                setOpenRegister(true)
                setOpenLogin(false)
        }} className='goToRegister'>Don't have an account? Register Here!</button>
        <button type='submit' className="btn-primary submitBtn">Log in</button>
        </form>
          </div>
         )}
         {openRegister && !openLogin && (<RegisterPage />)}
      
       </>
)   
}
