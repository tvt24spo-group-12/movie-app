import MovieList from "./components/MovieList";

import "./style/App.css";
import "./style/global.css";
import { useEffect, useState } from "react";
import InTheaters from "./components/inTheaters";

function App() {
  return (
    <>
      <MovieList />
      <InTheaters />
    </>
  );
}

export default App;

