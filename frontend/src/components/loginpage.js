import '../style/buttonStyle.css'
import { useState } from 'react'
import {signIn} from '../api/login'
import '../style/sidebar.css'

export default function LoginPage(){
    const[Identifier, setIdentifier] = useState('')
    const[Password, setPassword] = useState('')
  const handleSubmit= async (e) =>{
        e.preventDefault();

        console.log(Identifier,Password)
        const res = signIn(Identifier,Password)
        if(res === 201 | res === "201" |res === 200 | res === "200" ){
            console.log("loggedin")
        }
        else{
            console.log("something went wrong")
        }
    }

return(
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
        <button className="btn-primary submitBtn">Log in</button>
        </form>
)
}
