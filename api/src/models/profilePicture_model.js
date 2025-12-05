
import pool from '../database.js'

const insertProfilePicture = async(user_id, path) => {
    try{
        const res = await pool.query('UPDATE users SET picture_path = ($1) WHERE user_id = ($2)'
            ,[path, user_id])
            return res.rows[0]
    }catch(error){
        throw new Error(error)
    }
}

const getProfilePicture = async(user_id) => {
     try{
        const res = await pool.query('SELECT picture_path FROM users WHERE user_id = ($1)'
            ,[user_id])
            return res.rows[0]
    }catch(error){
        throw new Error(error)
    }
}

export {insertProfilePicture,getProfilePicture }