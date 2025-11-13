import { useState } from 'react'
import RegisterPage from '../components/registerpage'
import '../style/sidebar.css'
import '../style/buttonStyle.css'

export default function SideBar(){
    const[sideBarOpen, setSideBarOpen] = useState(true)
    const[loginform, setLoginOpenForm] = useState(false)
    const[email, setEmail] = useState('')
    const[password, setpassword] = useState('')
    const[registerPage, setRegisterPage] = useState(false)
    const handleLogin = async () =>{
         
    }
 
    return(
        <div className='page sidebarContainer'>
            <div className='buttonContainer'>
              
    
    <img className='profilePicture' alt='profilepicture'src=''></img>
    {!loginform && !registerPage &&(
      <><button onClick={() => { setLoginOpenForm(true) } } className="btn-primary Btn">login</button>
      <button onClick={()=>{
        setLoginOpenForm(false)
        setRegisterPage(true)}}
        className="btn-primary Btn">register</button>
      </>

    )}
    {loginform && (
        <form onSubmit={handleLogin}>
            <input
            className='placeHolder'
            type='email'
            placeholder='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
             <input
            className='placeHolder'
            type='password'
            placeholder='password'
            value={password}
            onChange={e => setpassword(e.target.value)}
            />
        <button className="btn-primary submitBtn" type='sumbit'>Log in</button>
        <button onClick={() =>{
            setRegisterPage(true)
            setLoginOpenForm(false)
        }} className='goToRegister'>Got an account? Register Here!</button>
        </form>
    )  
    }


    {!loginform && registerPage && (
        
      
     <RegisterPage/>
        
    ) 
    }
     </div>
        </div>
    )
}

