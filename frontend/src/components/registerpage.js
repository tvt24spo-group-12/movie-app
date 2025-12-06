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
       <div className='popupcontainer'>
        <h2 style={{alignSelf: 'start'}}>Register</h2>
            <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center'}}>
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
                        className='cancelBtn'>
                        X
                       </button>
                <button type='submit' className='btn-primary submitBtn'>Sign Up</button>
            </form>
 </div>

       
    )
}
