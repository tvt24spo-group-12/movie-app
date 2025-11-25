import {addFavoriteMovie} from "../models/favoriteMovie_model.js"

const addFavorite = async (req, res) =>{
    try{
            const result = await addFavoriteMovie(user_id, movie_id)
            res.json({insertId: result.insertId, });
    }catch(error){
        res.status(500).json({error : "something went wrong"})
    }
    
}

export{addFavorite}