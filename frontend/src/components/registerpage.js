import '../style/buttonStyle.css'
import { useState } from 'react'
import {signUp} from '../api/register'

export default function RegisterPage(){


 const[Email, setEmail] = useState('')
    const[Password, setPassword] = useState('')
    const[Username, setUsername] = useState('')
    const handleSubmit= (e) =>{
        e.preventDefault();
signUp(Email,Password,Username)
    }
    return(
            <div className='page registerContainer'>
            <form onSubmit={handleSubmit}>
                <input
                placeholder='Email'
                type='Email'
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                />
                   <input
                placeholder='password'
                type='password'
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                />
                   <input
                placeholder='username'
                type='username'
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <button className='btn-primary'>Sign Up</button>
            </form>

            </div>


       
    )
}
