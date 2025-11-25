
import pool from '../database.js'
import userRouter from '../routers/user_router.js';

const addFavoriteMovie = async (user_id, movie_id) =>{

    try{
        const res = await pool.query('INSERT INTO favourite_movies (user_id, movie_id) VALUES ($1, $2) RETURNING *',
            [user_id,movie_id])
            return res.rows[0];
    }catch(error){
        throw new Error(error)
    }

}
const getAllFavoriteMovies = async(user_id) => {
     try{
        const res = await pool.query('SELECT * FROM favourite_movies WHERE user_id = ($1)',
            [user_id])
            return res.rows;
    }catch(error){
        throw new Error(error)
    }
}

export{addFavoriteMovie, getAllFavoriteMovies}