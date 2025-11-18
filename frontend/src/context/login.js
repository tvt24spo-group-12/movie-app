
const url = 'http://localhost:3001/user'
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
  //  const [loading, setLoading] = useState(true)

  useEffect(()=>{ //näkee tallentuiko muutokset ja (setUser & setAccessToken)
    console.log("use: ",accessToken)
    console.log("user: ",user)

  },[accessToken,user])
    const signIn = async ( Identifier, Password) =>{
         const res = await fetch(url+'/signin', 
           { method: "POST",
            headers: {"Content-Type": "application/json",
            credentials: "include",
            },
             body : JSON.stringify({user:{ identifier : Identifier, password:Password}})
           
            })
    
            
    if(!res.ok){
        const error = await res.json()
        throw new Error(error.error)
    }
    const data = await res.json()
    setUser({
      id: data.user_id,
      email: data.email,
      username: data.username
    });
    
    setAccessToken(data.token)
   
    return data
}
const value = {
    user,
    accessToken,
    signIn,
};
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  return useContext(AuthContext);
}
