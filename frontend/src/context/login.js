
const url = 'http://localhost:3001/user'
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
  //  const [loading, setLoading] = useState(true)

  
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
    setUser({Identifier : data.identifier});
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
