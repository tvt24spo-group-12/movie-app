import '../style/buttonStyle.css'
import { useState } from 'react'
import { useAuth } from '../context/login'
import '../style/sidebar.css'

const URL = "http://localhost:3001/user"
export default function LoginPage({loggedIn, setLoggedIn, setLoginOpenForm, setRegisterPage}){
    const[Identifier, setIdentifier] = useState('')
    const[Password, setPassword] = useState('')
    
    const[openLogin, setOpenLogin] = useState(true);
    const { signIn } = useAuth();
  const handleSubmit= async (e) =>{
        e.preventDefault();
      
        try{
       const res = await signIn(Identifier,Password)
            
           
            localStorage.setItem("username", Identifier)
           
            setLoggedIn(true)
            // Close the modal instead of reloading the page
            setTimeout(() => {
              setOpenLogin(false)
            }, 500)
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
            placeholder='Username or Email'
            value={Identifier}
            onChange={e => setIdentifier(e.target.value)}
            />
             <input
            className='placeHolder'
            type='password'
            placeholder='Password'
            value={Password}
            onChange={e => setPassword(e.target.value)}
            />
            <button
            type='button'
            onClick={() => {
                setOpenLogin(false)
                setLoginOpenForm(false)
            }}
             className='cancelBtn'>
            X
        </button>
        <button type='button' onClick={() =>{
                setLoginOpenForm(false)
                setRegisterPage(true)
        }} className='goToRegister'>Don't have an account? Register Here!</button>
        <button type='submit' className="btn-primary submitBtn">Log In</button>
        </form>
          </div>
         )}
      
       </>
)   
}
