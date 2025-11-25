import {addFavoriteMovie, getAllFavoriteMovies} from "../models/favoriteMovie_model.js"
import { saveMovie } from "../models/movie_model.js";
import { getMovieDetailsByID } from "../models/tmdb_model.js";
import { getByName } from "../models/movie_model.js";
const addFavorite = async (req, res) =>{
    try{
        const userId = req.user.user_id
        const movieId = parseInt(req.params.movieId, 10)
        const tmdbData = await getMovieDetailsByID(movieId);
        
        if((await getByName(tmdbData.name)).length > 0){
            console.log("now rawdata")
            const result = await addFavoriteMovie(userId, movieId)    
            res.json(result);
        }else{
            console.log("rawdata")

        const rawData = tmdbData.raw || tmdbData;
              const movieToSave = {
                movie_id: rawData.id,
                title: rawData.title,
                original_title: rawData.original_title || rawData.title,
                overview: rawData.overview || null,
                genres: rawData.genres ? rawData.genres.map(g => `(${g.id},"${g.name}")`) : null,
                status: rawData.status || null,
                release_date: rawData.release_date || null,
                in_theaters: false,
                poster_path: rawData.poster_path || null,
                backdrop_path: rawData.backdrop_path || null,
                vote_count: rawData.vote_count || 0,
                vote_average: rawData.vote_average || 0,
                runtime: rawData.runtime || null,
              };

            await saveMovie(movieToSave);
            const result = await addFavoriteMovie(userId, movieId)    
            res.json({insertId: result.insertId, });

        }    
    }catch(error){
     console.log(error)
    }
    
}
const getAllFavorite = async (req, res) =>{
    try{
            const userId = req.user.user_id
            const result = await getAllFavoriteMovies(userId)    
            res.json(result);

        }catch(error){
            console.log(error)
        }   
    }



export{addFavorite, getAllFavorite}