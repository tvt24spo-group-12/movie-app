
import pool from '../database.js'


const addFavoriteMovie = async (user_id, movie_id) =>{ // tallentaa kantaan elokuvan jonka käyttäjä lisää favoriteihin

    try{
        const res = await pool.query('INSERT INTO favourite_movies (user_id, movie_id) VALUES ($1, $2) RETURNING *',
            [user_id,movie_id])
            return res.rows[0];
    }catch(error){
        throw new Error(error)
    }

}
const getAllFavoriteMovies = async(user_id) => { //hakee kaikki Favorite elokuvat kannasta
     try{
        const res = await pool.query('SELECT * FROM favourite_movies WHERE user_id = ($1)',
            [user_id])
            return res.rows;
    }catch(error){
        throw new Error(error)
    }
}
const getFavoriteMovieById = async(user_id,movie_id) => { //hakee favorite elokuvan elokuvan id:llä
    try{
         const res = await pool.query('SELECT * FROM favourite_movies WHERE user_id = ($1) AND movie_id = ($2)',
            [user_id,movie_id])
            return res.rows;
    }catch(error){
        throw new Error(error)
    }
    }

const removeFavoriteMovie = async(user_id, movie_id) => { //poistaa favorite elokuvan kannasta
    try{
        const res = await pool.query('DELETE FROM favourite_movies WHERE user_id = ($1) AND movie_id = ($2)',
            [user_id,movie_id]
        )
        return res.rows
    }catch(error){
        throw new Error(error)
    }
}
export{addFavoriteMovie, getAllFavoriteMovies, removeFavoriteMovie,getFavoriteMovieById}