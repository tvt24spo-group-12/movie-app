import '../style/buttonStyle.css'
import { useState } from 'react'
import {signUp} from '../api/register'
import '../style/sidebar.css'
export default function RegisterPage(){


 const[Email, setEmail] = useState('')
    const[Password, setPassword] = useState('')
    const[Username, setUsername] = useState('')

    const handleSubmit= async (e) =>{
        e.preventDefault();

    
        const res =await signUp(Email,Password,Username)
        if(!res === 201 | !res === "201" ){
            alert("something went wrong :/");
        }
        else{
            console.log("signedup")
           location.reload(false)
        }
    }
    return(
       < div className='page popupcontainer'>
            <div className='page registerContainer'>
            <form onSubmit={handleSubmit}>
                <input
                className='placeHolder'
                placeholder='Email'
                type='Email'
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                />
                   <input
                   className='placeHolder'
                placeholder='password'
                type='password'
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                />
                   <input
                   className='placeHolder'
                placeholder='username'
                type='username'
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <button
                        onClick={() => {
                        location.reload(false)
                        }}
                        className='btn-primary submitBtn cancelBtn'>
                        X
                       </button>
                <button className='btn-primary submitBtn'>Sign Up</button>
            </form>

            </div>
 </div>

       
    )
}
