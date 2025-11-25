
import pool from '../database.js'

const addFavoriteMovie = async (user_id, movie_id) =>{

    try{
    
        const [res] = await pool.query('INSERT INTO favourite_movies (user_id, movie_id) VALUES ($1,$2) RETURNING *',
            [user_id,movie_id])
            return res;
    }catch(error){
        throw new Error(error)
    }

}


export{addFavoriteMovie}