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
        const ress = await signIn(Identifier,Password)
        if(ress === 201 | ress === "201" |ress === 200 | ress === "200" ){
            console.log("loggedin")
            localStorage.setItem("username", Identifier)
            location.reload(false)
            
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
