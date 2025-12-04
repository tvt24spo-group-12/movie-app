import { useEffect, useState } from 'react'
import RegisterPage from '../components/registerpage'
import LoginPage from '../components/loginpage'
import '../style/sidebar.css'
import '../style/buttonStyle.css'
import { useAuth } from '../context/login'
import {uploadProfilePicture, getProfilePicture} from '../api/profilepicture'


export default function SideBar({sidebar,setsidebar}){
  const url = 'http://localhost:3001'
    const[sideBarOpen, setSideBarOpen] = useState(true)
    const[loginform, setLoginOpenForm] = useState(false)
    const[registerPage, setRegisterPage] = useState(false)
    const[popupOpen, setPopupOpen] = useState(false)
    const{user, logout, loading, authFetch} = useAuth();
  const[picture, setpicture] = useState(null)
  const[preview, setPreview] = useState('')
const[loggedIn,setLoggedIn] = useState(false)
useEffect(()=>{
  if(picture !== null){
    const pfpUrl = URL.createObjectURL(picture[0]);
    setPreview(pfpUrl)
    saveImage(picture);
  }
 
  
},[picture])

    const saveImage = (picture) => {
        uploadProfilePicture(picture, user, authFetch);
    }
useEffect(()=>{


  if(!loggedIn && user !== null)
  {
 getProfilePicture(user, authFetch).then((res) =>  {
  
    const imgurl = url+res

    document.getElementById('ProfilePicture').src=""+imgurl
})

}
},[loggedIn, user])
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
        <img id='ProfilePicture' onClick={() => {document.getElementById('input').click()}} className='profilePicture' alt='profilepicture'src={preview}></img>
        <form className='imageForm'onSubmit={saveImage}><input id='input' type='file' accept='.png' onChange={e => setpicture(e.target.files)}></input>
        
        </form>
        
        <p>{user.username}</p>
        <button onClick={()=>{ setLoggedIn(false);
          logout()
        }} 
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
        <LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
     </>
    )}
    </>
    }
        </div>
    )
}

