import{getProfilePicture, insertProfilePicture} from '../models/profilePicture_model.js'

const getProfilePictureById = async(req , res) =>{
    try
     {   
        const userId = parseInt(req.params.userId, 10)
        const result = await getProfilePicture(userId)
        res.json(result)
    }catch(err){
        throw new Error(err)
    }

}
const uploadProfilePicture = async(req,res) => {
    try{
        const {path} = req.body
        const userId = parseInt(req.params.userId, 10)
        const result = await insertProfilePicture(userId, path)
        res.json(result)
    }catch(err){
        throw new Error(err)
    
    }
}

export{getProfilePictureById,uploadProfilePicture}