
import pool from '../database.js'

const addFavoriteMovie = async (favorite_id,user_id, movie_id) =>{

    try{
        const res = await pool.query('INSERT INTO favourite_movies (favorite_id, user_id, movie_id) VALUES (?,?,?)',
            [favorite_id,user_id,movie_id])
            return res
    }catch(error){
        throw new Error(error)
    }

}


export{addFavoriteMovie}