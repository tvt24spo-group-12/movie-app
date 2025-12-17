import {addFavoriteMovie, getAllFavoriteMovies, removeFavoriteMovie, getFavoriteMovieById} from "../models/favoriteMovie_model.js"
import { saveMovie } from "../models/movie_model.js";
import { getMovieDetailsByID } from "../models/tmdb_model.js";
import { getById } from "../models/movie_model.js";

const addFavorite = async (req, res) =>{
    try{
        const userId = req.user.user_id
        const movieId = parseInt(req.params.movieId, 10)
        const tmdbData = await getMovieDetailsByID(movieId); //hakee tarvittavat tiedot elokuvasta
        
        if((await getById(movieId)).length > 0){ //tarkistaa onko elokuva taulussa elokuvan tietoja
           
            const result = await addFavoriteMovie(userId, movieId)    
            res.json(result);
        }else{//jos ei ole. hakee sitten elokuvan tiedot ja tallentaa elokuva tauluun
           

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

            const existing = await getFavoriteMovieById(userId, movieId); //hakee elokuvan favoritemovies taulusta movieid:n ja userid:n perusteellla

            if (existing && existing.length > 0) { // jos löytyy elokuva niin älä tallenna
            
              return res.status(409).json({
                message: "Movie already in favorites",
                favoriteId: existing[0].id ?? null,
              });
            }

            // jos ei löydy tallentaa favorite movie tauluun elokuvan
            const result = await addFavoriteMovie(userId, movieId);

        }    
    }catch(error){
     console.log(error)
    }
    
}
const getAllFavorite = async (req, res) =>{//hakee kaikki favoriteelokuvat käyttäjä on lisännyt
    try{
            const userId = req.user.user_id
            const result = await getAllFavoriteMovies(userId)    
            res.json(result);

        }catch(error){
            console.log(error)
        }   
    }

// Public endpoint for sharing favorites by user id
const getFavoritesByUserIdPublic = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);

        if (Number.isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const result = await getAllFavoriteMovies(userId);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch favorites" });
    }
};

const removeFavorite = async (req, res) => {//poistaa käyttäjän valitseman favorite elokuvan
    try{
        const userId = req.user.user_id
        const movieId = parseInt(req.params.movieId, 10)
        const result = await removeFavoriteMovie(userId,movieId)
        res.json(result)
    }catch(error){
        console.log(error)
    }
}
const getFavoriteById = async (req, res) =>{ //hakee favorite elokuvan user- ja movie_id:n perusteella
    try{
            const userId = req.user.user_id
            const movieId = parseInt(req.params.movieId, 10)
            const result = await getFavoriteMovieById(userId,movieId)
            if(result.length <= 0){
                console.log("couldn't find a that movie")
            }
            res.json(result);

        }catch(error){
            console.log(error)
        }   
    }

export{addFavorite, getAllFavorite, removeFavorite, getFavoriteById, getFavoritesByUserIdPublic}
