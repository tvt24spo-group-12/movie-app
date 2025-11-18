import MovieList from "./components/MovieList";
import './style/App.css';
import './style/intheaters.css';
import './style/global.css';
import { useEffect, useState } from "react";
import InTheaters from "./components/inTheaters";
import SideBar from "./components/sidebar";
import { useAuth } from "./context/login";

function App() {
  const{acceesToken, user, logout} = useAuth();

  return (
    
    
   
    
    <>
       <SideBar/>
      <MovieList />
      <InTheaters/>
      
    
    </>
   
  );
}

export default App;

