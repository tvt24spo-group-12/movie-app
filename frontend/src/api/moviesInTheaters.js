const url = "http://localhost:3001"

  let movieTitle = [];
  let moviePosterPath = [];

const getNowPlayingPoster = async () =>{
  const res = await fetch(url+'/movie/nowplaying');
  const data = await res.json();   
    for(let i = 0; i<= 5; i++){
 moviePosterPath.push(data[i].moviePicture);
  console.log("bomboclad" + data)
    }
  
  return moviePosterPath;
}
const getNowPlaying = async () =>{
const res = await fetch(url+'/movie/nowplaying');
    const data = await res.json();
    for(let i = 0; i<= 5; i++){
 movieTitle.push(data[i].name);
  console.log("bomboclad" + data)
    }
      return movieTitle;
   
   
}

export {getNowPlaying, getNowPlayingPoster}