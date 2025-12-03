import { useEffect, useState } from 'react'
import RegisterPage from '../components/registerpage'
import LoginPage from '../components/loginpage'
import '../style/sidebar.css'
import '../style/buttonStyle.css'
import { useAuth } from '../context/login'
import {uploadProfilePicture} from '../api/profilepicture'

export default function SideBar({sidebar,setsidebar}){
    const[sideBarOpen, setSideBarOpen] = useState(true)
    const[loginform, setLoginOpenForm] = useState(false)
    const[registerPage, setRegisterPage] = useState(false)
    const[popupOpen, setPopupOpen] = useState(false)
    const{user, logout, loading} = useAuth();
  const[picture, setpicture] = useState('')
  const[preview, setPreview] = useState('')
useEffect(()=>{
  if(picture){
    const pfpUrl = URL.createObjectURL(picture[0]);
    setPreview(pfpUrl)
  }
  console.log("test",picture )
  saveImage(picture);
},[picture,setpicture])
    const saveImage = (picture) => {
        uploadProfilePicture(picture);
    }

    const closeSidebar = () =>{
         
         if(sideBarOpen === true){
            setSideBarOpen(false)
            setsidebar(false)
         }
         if(sideBarOpen === false)
         {
             setSideBarOpen(true)
             setsidebar(true)
         }
    }
    if(loading) return null;
    return(
        <div >
               
         
        <div id='sideBar' className={sideBarOpen === true ? "sidebarContainer" : "sideBarClosed"}>
         <button onClick={closeSidebar} id="closeSidebar" className='btn-primary closeSideBar'>{sideBarOpen ? "<" : ">"}</button>
            <div className='buttonContainer'>
              
 
   
    
    
    {user &&(
      <>
        <img className='profilePicture' alt='profilepicture'src={preview}></img>
        <button className={!picture ? 'btn-primary' : 'hideBtn'}onClick={() => {document.getElementById('input').click()}}>set profilepicture</button>
        <form className='imageForm'onSubmit={saveImage}><input id='input' type='file' accept='.png' onChange={e => setpicture(e.target.files)}></input>
        
        </form>
        
        <p>{user.username}</p>
        <button onClick={logout} 
        className='btn-primary Btn'>Log out</button>
      </>
    )
      
    }
    {!loginform && !registerPage && !user &&(
      <><button onClick={() => { 
        setLoginOpenForm(true)
        setPopupOpen(true)
        }} className="btn-primary Btn">Login</button>

      <button onClick={()=>{
        setPopupOpen(true)
        setLoginOpenForm(false)
        setRegisterPage(true)}}
        className="btn-primary Btn">Register</button>
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

