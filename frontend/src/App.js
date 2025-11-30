import MovieList from "./components/MovieList";
import "./style/App.css";
import "./style/intheaters.css";
import "./style/global.css";
import { useEffect, useState } from "react";
import { useAuth } from "./context/login";
import GroupPage from "./components/GroupPage";
import UserMovieReviews from "./components/reviews/UserMovieReviews";
import MoviePage from "./components/MoviePage";
import InTheaters from "./components/inTheaters";
import SideBar from "./components/sidebar";

function App() {
  const { acceesToken, user, logout } = useAuth();
  const [sidebar, setsidebar] = useState(false);
  return (
    <>
      <SideBar sidebar={sidebar} setsidebar={setsidebar} />
      <MoviePage movie_id={100} />
      <UserMovieReviews user_id={-1} />

      <InTheaters sidebar={sidebar} />
      {/*

      <GroupPage />
      <MovieList />
      */}
    </>
  );
}

export default App;
