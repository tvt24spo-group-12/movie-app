import MovieList from "./components/MovieList";
import './style/App.css';
import './style/intheaters.css';
import './style/global.css';
//import { useEffect, useState } from "react";
import InTheaters from "./components/inTheaters";
import SideBar from "./components/sidebar";
import { useAuth } from "./context/login";
import { useState } from "react";
//import GroupPage from "./components/GroupPage";
//import GroupPage from "./GroupPage";

function App() {
  const{acceesToken, user, logout} = useAuth();
  const[sidebar, setsidebar] = useState(false)
  return (
    
    
   
    
    <>
       <SideBar sidebar={sidebar} setsidebar={setsidebar}/>
      {/*<GroupPage />*/}
      
       

      <MovieList />
      <InTheaters sidebar={sidebar}/>
      

    
    </>
   
  );
}

export default App;

