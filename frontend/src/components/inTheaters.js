
import { useEffect, useState } from "react"
import {getNowPlaying, getNowPlayingPoster} from "../api/moviesInTheaters"
import '../style/intheaters.css'

export default function InTheaters() 
{

const imgurl = 'https://image.tmdb.org/t/p/w300'

const [urls, setUrls] = useState('')
const [title, setTitle] = useState([])

useEffect(() =>{
   const showNowPlaying = async () =>{
        const posters = await getNowPlayingPoster();
        const movieTitles = await getNowPlaying();
        console.log(posters)
        console.log(movieTitles)

        setTitle( movieTitles.slice(0,6))
        setUrls(posters.slice(0,6))
    }
    showNowPlaying()
},[]);

    return ( 
        <>
    <h1 className="nowPlayingh1">Now Playing</h1>
        <article className="movie-card movieContainer">
        
           {title.map((titles,index)=>(
          <div className="movie-card__poster smallposter"><div className="movie-card__poster-placeholder">
                <img  src={imgurl+urls[index]}></img>
         </div>
         <div className="movie-card__content ">
                <h3 key={index}  className="movie-card__title movieTitle">{titles}</h3>
        </div>
        </div>
           ))}
        </article>
       </>
    )
}