import{getProfilePicture, uploadProfilePicture} from '../models/profilePicture_model.js'

const getProfilePictureById = async(req , res) =>{
    try
     {   const userId = parseInt(req.params.userId, 10)
        const result = await getProfilePicture(userId)
        res.json(result)
    }catch(err){
        throw new Error(err)
    }

}

export{getProfilePictureById}