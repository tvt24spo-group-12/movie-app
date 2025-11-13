

const url = 'http://localhost:3001/user'
const signUp = async ( Email, Password, Username) =>{
     
        try{
            const res = await axios.post(url+'/signup', 
           { user : { email : Email,username:Username, password:Password,}},
            {headers: {'Content-Type' : 'application/json'}}
         
        );
        console.log(res)
        return res;
        }catch(error)
            {
                console.log(error)
            }       
           
    }

    export{signUp}