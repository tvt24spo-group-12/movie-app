const URL = "http://localhost:3001/user"




 export async function uploadProfilePicture(picture, user, authFetch){
    
    console.log(user.id, " ", picture);
    const userId = user.id
    try {
        const response = await authFetch(`${URL}/profilePicture/${userId}`, {
            method: 'POST',
           
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ picture})
        });
        console.log("res: ",response)
       return response
    } catch (error) {
        console.error(error);
        return 0;
    }
   
}

 export async function getProfilePicture(user, authFetch) {
  
    const userId = user.id
    try {
        const response = await authFetch(`${URL}/profilePicture/${userId}`, {
            method: 'GET',
           
        });
        console.log("Get ; ",response)
        return response;
    } catch (error) {
        console.error(error);
        return 0;
    }
   
}


