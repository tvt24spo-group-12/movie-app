import{getProfilePicture, insertProfilePicture} from '../models/profilePicture_model.js'
import multer from "multer"
import path from 'path';
import { fileURLToPath } from 'url';


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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, '../../public/ProfilePictures');
console.log("sotatgerf : ", storagePath)
 const storage = multer.diskStorage({
     destination: storagePath, 
    filename: (_, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});
 const upload = multer({ storage }).single('file')

const uploadProfilePicture = async(req,res) => {
    try{
        const userId = parseInt(req.params.userId, 10)
        upload(req, res, async (err) => {
            if (err) {
                res.status(500).json({ error: err.message })
                return
            }
            const path = `/public/ProfilePictures/${req.file.filename}`
            const result = await insertProfilePicture(userId, path)
            res.json(result)
            return path;
        })
    }catch(err){
        res.status(500).json({ error: err.message })
    }
}

export{getProfilePictureById,uploadProfilePicture}