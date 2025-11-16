import { useEffect, useState } from 'react'
import RegisterPage from '../components/registerpage'
import LoginPage from '../components/loginpage'
import '../style/sidebar.css'
import '../style/buttonStyle.css'

export default function SideBar(){
    const[sideBarOpen, setSideBarOpen] = useState(true)
    const[loginform, setLoginOpenForm] = useState(false)
    const[registerPage, setRegisterPage] = useState(false)
    const[popupOpen, setPopupOpen] = useState(false)
    const[loggedin, setloggedin] = useState(false)
    const[username, setUsername] = useState('')

    //tämmönen  väliaikainen ratkaisu hakee localstoragesta usernamen joka tallentuu jos sisään kirjautuminen onnistuu
    //  myöhemmin authentikointi lisätä
   useEffect(()=>{
    
    
      const usrname = window.localStorage.getItem('username')
      console.log(usrname)
      if(usrname === null){
        setloggedin(false);
       

      }else{
         setLoginOpenForm(false)
        setloggedin(true)
        setUsername(usrname)
      
      }
   },[username, setUsername])

    const closeSidebar = () =>{
         
         if(sideBarOpen === true){
            setSideBarOpen(false)
            document.getElementById("sideBar").style.right = "95vw"
            document.getElementById("closeSidebar").style.left = "2vw";
         }
         if(sideBarOpen === false)
         {
           
            document.getElementById("sideBar").style.right = "85vw"
            document.getElementById("closeSidebar").style.left = " 12vw";
             setSideBarOpen(true)
         }
    }


    
    const handleLogout = () => {
      window.localStorage.removeItem("username");
         setLoginOpenForm(false)
        setloggedin(false)
      
    }
    return(
        <div >
                <button onClick={closeSidebar} id="closeSidebar" className='btn-primary closeSideBar'>{sideBarOpen ? "<" : ">"}</button>
         
        <div id='sideBar' className='page sidebarContainer'>
        
            <div className='buttonContainer'>
              
    
    <img className='profilePicture' alt='profilepicture'src=''></img>
    {loggedin &&(
      <>
        <p>{username}</p>
        <button onClick={
          handleLogout
          
        } className='btn-primary Btn'>Log out</button>
      </>
    )
      
    }
    {!loginform && !registerPage && !loggedin &&(
      <><button onClick={() => { 
        setLoginOpenForm(true)
        setPopupOpen(true)
        }} className="btn-primary Btn">login</button>

      <button onClick={()=>{
        setPopupOpen(true)
        setLoginOpenForm(false)
        setRegisterPage(true)}}
        className="btn-primary Btn">register</button>
      </>

    )}
    
     </div>
        </div>
      {popupOpen &&
      <div className='page popupcontainer'>
         <button
            onClick={() => {
            setRegisterPage(false)
            setLoginOpenForm(false)
            setPopupOpen(false)
            }}
             className='btn-primary submitBtn cancelBtn'>
            X
        </button>
    
 {!loginform && registerPage && (

        <>
       
        <RegisterPage/>
        </>
        
      
    )} 
    {loginform && !registerPage && 
    (
      
        <>
        <LoginPage/>
        <button onClick={() =>{
            setRegisterPage(true)
            setLoginOpenForm(false)
        }} className='goToRegister'>Don't have an account? Register Here!</button>
        </>
       
    )  
    }
    </div>

    }
      
   
    
        </div>
    )
}

