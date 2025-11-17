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
            document.getElementById("sideBar").style.right = "95%"
            
         }
         if(sideBarOpen === false)
         {
           
            document.getElementById("sideBar").style.right = "84%"
            
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
               
         
        <div id='sideBar' className='page sidebarContainer'>
         <button onClick={closeSidebar} id="closeSidebar" className='btn-primary closeSideBar'>{sideBarOpen ? "<" : ">"}</button>
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
    
         
    <>
 {!loginform && registerPage && (
        <>
        <RegisterPage/>
        </>
    )} 
    {loginform && !registerPage && 
    (    
        <>
        <LoginPage/>
     </>
    )}
    </>
    }
        </div>
    )
}

