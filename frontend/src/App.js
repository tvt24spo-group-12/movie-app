import MovieList from "./components/MovieList";
import "./style/App.css";
import "./style/intheaters.css";
import "./style/global.css";
import { useEffect, useState } from "react";
import InTheaters from "./components/inTheaters";
import SideBar from "./components/sidebar";
import { useAuth } from "./context/login";
import GroupPage from "./components/GroupPage";
import UserMovieReviews from "./components/reviews/UserMovieReviews";

function App() {
  const { acceesToken, user, logout } = useAuth();

  return (
    <>
      <SideBar />
      <UserMovieReviews user_id={-1} />

      {/*

      <GroupPage />
      <MovieList />
      <InTheaters/>
      */}
    </>
  );
}

export default App;
