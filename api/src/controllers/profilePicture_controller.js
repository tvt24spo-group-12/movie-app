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



const uploadProfilePicture = async(req,res) => {

 const userId = parseInt(req.params.userId, 10)
    const storagePath = path.join(__dirname, '../../public/ProfilePictures');
  

 const storage = multer.diskStorage({
     destination: storagePath, 
    filename: (_, file, cb) => {
        cb(null, `${userId}_${file.originalname}`);
    }
});
 const upload = multer({ storage }).single('file')
    try{
 

        upload(req, res, async (err) => {
            if (err) {
                res.status(500).json({ error: err.message })
                return
            }

            const path = `/public/ProfilePictures/${req.file.filename}`
           
            const res = await checkifExists(userId); //tarkistaa onko käyttäjä tallentanu jo kuvaa
          
            if(!res.toString().split(".png", ".jpg").includes(path.toString().split(".png", ".jpg"))){ //tarkistaa onko palautettu res muuttuja kuvan path (.png tai .jpg)
            await insertProfilePicture(userId, path) // jos ei löydy kuvaa tallentaa se kuvan kantaan
         
            return path;
            }
           
        })
    }catch(err){
        res.status(500).json({ error: err.message })
    }
}
const checkifExists = async(userId) => {
       const result = await getProfilePicture(userId)
        return result;
}
export{getProfilePictureById,uploadProfilePicture}