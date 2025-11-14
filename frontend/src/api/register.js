
const url = 'http://localhost:3001/user'
const signUp = async ( Email, Password, Username) =>{
     
        try{
            const res = await fetch(url+'/signup', 
           { method: "POST",
            headers: {"Content-Type": "application/json"

            },
            body : JSON.stringify({user:{ email : Email,username:Username, password:Password}})
        
        })

        console.log(res)
        return res.status;
        }catch(error)
            {
                console.log(error)
            }       
           
    }

    export{signUp}