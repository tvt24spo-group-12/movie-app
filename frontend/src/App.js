
import MovieList from "./components/MovieList";
import './style/App.css';
import './style/intheaters.css';
import './style/global.css';
import { useEffect, useState } from "react";
import InTheaters from "./components/inTheaters";
import SideBar from "./components/sidebar";

function App() {

  return (
    
    
   
    
    <>
       <SideBar/>
      <MovieList />
      <InTheaters/>
      
    </>
   
  );
}

export default App;