const URL = process.env.REACT_APP_API_URL || "http://localhost:3001/"




 export async function uploadProfilePicture(picture, user, authFetch){
    

        const userId = user.id
        if(String(picture.name).includes(".png") | String(picture.name).includes(".jpg")){ //tarkistaa onko tiedosto hyväksytty kuva/tiedostonmuoto
        const formData = new FormData();
        formData.append('file', picture)
     

  try {
        const response = await authFetch(`${URL}user/profilePicture/${userId}`, {
            method: 'POST',

          body : formData,
        });

       return response

        } catch (error) {
      
        return 0;
        }
    }else{ //palauttaa 404 jos tiedosto ei ole hyväksytty
    return 404;
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
      
        return 0;
    }
   
}


