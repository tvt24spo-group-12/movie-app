import MovieList from "../components/MovieList";
import GroupPage from "../components/GroupPage";
import UserMovieReviews from "../components/reviews/UserMovieReviews";
import MoviePage from "../components/MoviePage";
import HomePage from "../components/HomePage";
import FavoritesPage from "../components/FavoritesPage";
// import LoginPage from "../components/loginpage";
// import RegisterPage from "../components/registerpage";
// import DeleteUser from "../components/DeleteUser";

export const routes = [
  {
    path: "/",
    component: HomePage,
    exact: true,
  },
  {
    path: "/movies",
    component: MovieList,
  },
  {
    path: "/movie/:id",
    component: MoviePage,
    paramMap: {
      id: "movie_id", // Map URL param 'id' to component prop 'movie_id'
    },
  },
  {
    path: "/groups",
    component: GroupPage,
  },
  {
    path: "/favorites",
    component: FavoritesPage,
  },
  {
    path: "/favorites/:userId",
    component: FavoritesPage,
    paramMap: {
      userId: "targetUserId",
    },
  },
  {
    path: "/reviews",
    component: UserMovieReviews,
    props: {
      user_id: -1, // Default to current user's reviews
    },
  },
  {
    path: "/reviews/:user_id",
    component: UserMovieReviews,
  },
  // just in case we need auth routes later
  /* {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/register",
    component: RegisterPage,
  },
  {
    path: "/delete-user",
    component: DeleteUser,
  }, */
];

// Default route (404 or home fallback)
export const defaultRoute = "/";
