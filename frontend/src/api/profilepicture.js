const URL = "http://localhost:3001/"




 export async function uploadProfilePicture(picture, user, authFetch){
    
    //console.log(user.id, " ", picture);
    const userId = user.id
     
 
      const formData = new FormData();
   formData.append('file', picture[0])
       console.log(user.id, " ", formData);
    try {
        const response = await authFetch(`${URL}user/profilePicture/${userId}`, {
            method: 'POST',
           
          body : formData,
        });
     
       return response
    } catch (error) {
        console.error(error);
        return 0;
    }
   
}

 export async function getProfilePicture(user, authFetch) {
  
    const userId = user.id
    try {
        const response = await authFetch(`${URL}user/profilePicture/${userId}`, {
            method: 'GET',
           
        });
        const data = await response.json();
        
      
        return data.picture_path
    } catch (error) {
        console.error(error);
        return 0;
    }
   
}


