
import pool from '../database.js'

const uploadProfilePicture = async(user_id, path) => {
    try{
        const res = await pool.query('INSERT INTO users (picture_path) VALUES ($1) WHERE user_id = ($2)'
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

export {uploadProfilePicture,getProfilePicture }