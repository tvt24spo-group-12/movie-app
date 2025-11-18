import '../style/buttonStyle.css'
import { useState } from 'react'
import { useAuth } from '../context/login'
import '../style/sidebar.css'
import RegisterPage from '../components/registerpage'
const URL = "http://localhost:3001/user"
export default function LoginPage(){
    const[Identifier, setIdentifier] = useState('')
    const[Password, setPassword] = useState('')
    
    const[openRegister, setOpenRegister] = useState(true);
    const[openLogin, setOpenLogin] = useState(true);
    const { signIn } = useAuth();
  const handleSubmit= async (e) =>{
        e.preventDefault();
        console.log(Identifier,Password)
        try{
       const res = await signIn(Identifier,Password)
            
            console.log("result : ",res)
            localStorage.setItem("username", Identifier)
            location.reload(false)
            }catch(error){
                console.log(error)
            }
    }

return(
    <>
    {openLogin &&(
     < div className='page popupcontainer'>
        
    <form onSubmit={handleSubmit}>
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
             className='btn-primary submitBtn cancelBtn'>
            X
        </button>
            <button onClick={() =>{
                setOpenRegister(true)
                setOpenLogin(false)
        }} className='goToRegister'>Don't have an account? Register Here!</button>
        <button className="btn-primary submitBtn">Log in</button>
        </form>
          </div>
         )}
         {openRegister && !openLogin && (<RegisterPage/>)}
      
       </>
)   
}
//       
