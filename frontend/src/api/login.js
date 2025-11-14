
const url = 'http://localhost:3001/user'
const signIn = async ( Identifier, Password) =>{
     
        try{
            const res = await fetch(url+'/signin', 
           { method: "POST",
            headers: {"Content-Type": "application/json"

            },
            body : JSON.stringify({user:{ identifier : Identifier, password:Password}})
        
        })

        console.log(res)
        return res.status;
        }catch(error)
            {
                console.log(error)
            }       
           
    }

    export{signIn}