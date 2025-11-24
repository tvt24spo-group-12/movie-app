import {addFavoriteMovie} from "../api/src/models/favoriteMovie_model";

const addFavorite = async (req, res) =>{
    try{
        const{user} = req.body
            const result = await addFavoriteMovie(user.favorite_id,user.user_id, user.movie_id)
            res.json(result);
    }catch(error){
        res.status(500).json({error : "something went wrong"})
    }
    
}

export{addFavorite}