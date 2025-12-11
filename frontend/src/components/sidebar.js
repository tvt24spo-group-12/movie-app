import { useEffect, useState } from 'react'
import RegisterPage from '../components/registerpage'
import LoginPage from '../components/loginpage'
import '../style/sidebar.css'
import '../style/buttonStyle.css'
import { useAuth } from '../context/login'
import { useRouter } from '../routes/RouterContext'
import {uploadProfilePicture, getProfilePicture} from '../api/profilepicture'



export default function SideBar({sidebar,setsidebar}){
  const url = 'http://localhost:3001'
  const { navigate } = useRouter()
    const[sideBarOpen, setSideBarOpen] = useState(true)
    const[loginform, setLoginOpenForm] = useState(false)
    const[registerPage, setRegisterPage] = useState(false)
    const[popupOpen, setPopupOpen] = useState(false)
    const{user, logout, loading, authFetch} = useAuth();
  const[picture, setpicture] = useState(null)
  const[preview, setPreview] = useState('')


useEffect(()=>{
  if(picture !== null){
    const pfpUrl = URL.createObjectURL(picture[0]);

    setPreview(pfpUrl)
    saveImage(picture);
  }
 
  
},[picture])


const resizeImg = (file , maxW, maxH) => {
  return new Promise((resolve)=>{
    const img = new Image();
    const reader = new FileReader();
    reader.onload = e =>{
      img.src = e.target.result;
    }
    img.onload = () => {
      let width = img.width,
      height = img.height

      if(width > maxW){
       height = (maxW / width) * height;
        width = maxW;
      }
      if (height > maxH) {
        width = (maxH / height) * width;
        height = maxH;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => resolve(blob),
        file.type,
        0.9 
      );
    }
      reader.readAsDataURL(file);
  })
}
const saveImage = async(picture) => 
  {
    const file = picture[0]
    const resizedImg = await resizeImg(file, 1024, 768)
    const resizedfile = new File([resizedImg], file.name,{type: file.type})
    console.log("tet : ",resizedfile);
    const response = await uploadProfilePicture(resizedfile, user, authFetch);
    if(response === 404){
      alert("we dont support this file");
      location.reload(false)
    }
    }
useEffect(()=>{

  if(user && user !== null)
  {
 getProfilePicture(user, authFetch).then((res) =>  {
  
    const imgurl = url+res
    console.log(imgurl)
    document.getElementById('ProfilePicture').src=""+imgurl
})

}
},[user])
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

  //sulkee navin jos on mobiilimuotoilu, niin ei tarvi avata ja sulkea sivua vaihtaessa
  function handleNav(path) {
    navigate(path);
    if (window.innerWidth < 768) closeSidebar();
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
        <form className='imageForm'onSubmit={saveImage}><input id='input' type='file' accept='image/*' onChange={e => setpicture(e.target.files)}></input>
        
        </form>
        
        <p>{user.username}</p>
        
        <nav className='navigationLinks'>
          <button onClick={() => handleNav('/')} className='btn-primary Btn'>Home</button>
          <button onClick={() => handleNav('/movies')} className='btn-primary Btn'>Movies</button>
          <button onClick={() => handleNav('/groups')} className='btn-primary Btn'>Groups</button>
          <button onClick={() => handleNav('/reviews')} className='btn-primary Btn'>My Reviews</button>
          <button onClick={() => handleNav('/favorites')} className='btn-primary Btn'>Favorites</button>
          <br></br>
          <button onClick={()=>{ 
            logout()
            navigate('/')
          }} 
          className='btn-primary Btn'>Log out</button>
        </nav>
      </>
    )
      
    }
    {!loginform && !registerPage && !user &&(
      <>
        <nav className='navigationLinks'>
          <button onClick={() => navigate('/')} className='btn-primary Btn'>Home</button>
          <button onClick={() => navigate('/movies')} className='btn-primary Btn'>Movies</button>
          <br></br>
          <button onClick={() => { 
            setLoginOpenForm(true)
            setPopupOpen(true)
          }} className="btn-primary Btn">Login</button>

        <button onClick={()=>{
            setPopupOpen(true)
            setLoginOpenForm(false)
            setRegisterPage(true)
          }}
          className="btn-primary Btn">Register</button>
        </nav>
      </>

    )}
    
     </div>
        </div>
      {popupOpen &&
    
         
    <>
 {!loginform && registerPage && (
        <>
        <RegisterPage setLoginOpenForm={setLoginOpenForm} setRegisterPage={setRegisterPage}/>
        </>
    )} 
    {loginform && !registerPage && 
    (    
        <>
        <LoginPage loggedIn={false} setLoggedIn={() => {
          setPopupOpen(false)
          setLoginOpenForm(false)
        }} setLoginOpenForm={setLoginOpenForm} setRegisterPage={setRegisterPage}/>
     </>
    )}
    </>
    }
        </div>
    )
}

