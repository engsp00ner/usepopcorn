import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "/images/inception.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster: "/images/the matrix.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster: "/images/parasite.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "/images/inception.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster: "/images/Back to the Future.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ Query, SetQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={Query}
      onChange={(e) => SetQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      {children}
    </nav>
  );
}

function Movie({ movie, OnSelectMovie }) {
  return (
    <li onClick={() => OnSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MoviesList({ movies, OnSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} OnSelectMovie={OnSelectMovie} />
      ))}
    </ul>
  );
}
function Button(HandleClick) {
  return <button className="btn-toggle" onClick={() => HandleClick}></button>;
}
function ListBox({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <Button></Button>
      {isOpen1 && children}
    </div>
  );
}
function MovieDetail({ selectedId, OnCloseMovie }) {
  const [MoveDetail, SetMovieDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actros,
    Director: director,
    Genre: genre,
  } = MoveDetail;
  console.log(title, year);
  useEffect(
    function () {
      async function GetMovieDetails() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
          );
          console.log(selectedId ? selectedId : "No selectedId Found");
          if (!res.ok)
            throw new Error("Something went Wrong With Fetching Movie details");
          const data = await res.json();
          SetMovieDetail(data);
          if (data.Response === "False")
            throw new Error("Movie Details not found");
          // setMovies(data.Search);
          console.log(data);
        } catch (err) {
          // setErrorMesssage(err.message);
          // console.log(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      GetMovieDetails();
    },
    [selectedId]
  );
  return (

    <div className="details">
    {isLoading ? <Loader/> :
    <>
      <header>
        <button className="btn-black" onClick={OnCloseMovie}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${title} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDB Rating
          </p>
        </div>
      </header>
      <section>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring: {actros}</p>
        <p>Directed by: {director}</p>
      </section>
      </>}
    </div>
  
  );
  
}
function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ Watched }) {
  const avgImdbRating = average(Watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(Watched.map((movie) => movie.userRating));
  const avgRuntime = average(Watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{Watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatcheMovieList({ Watched }) {
  return (
    <ul className="list">
      {Watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function WatchedBox({ children }) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && children}
    </div>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Loader() {
  return (
    <div>
      <p className="loader">Loading....</p>
    </div>
  );
}
function ErrorMesssage({ message }) {
  return (
    <p className="error">
      <span>🧿 </span>
      {message}
      {/* {console.log({ message })} */}
    </p>
  );
}
const key = "a38520de";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [Watched, setWatched] = useState(tempWatchedData);

  const [Query, SetQuery] = useState("heat");
  const [IsLoading, SetIsLoading] = useState(false);
  const [errorMesssage, setErrorMesssage] = useState("");
  const [selectedId, setSelectedId] = useState("tt0113277");

  function HandelSelectMovie(ID) {
    setSelectedId((selectedId) => (ID === selectedId ? null : ID));
  }
  function HandleCloseMovie() {
    setSelectedId(null);
    console.log(`selected movie id is : ${selectedId ? selectedId : "NA"}`);
  }
  

  useEffect(
    function () {
      async function FetchMovies() {
        try {
          SetIsLoading(true);
          setErrorMesssage("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${Query}`
          );
          // console.log(Query ? Query : "No Query Found");
          if (!res.ok)
            throw new Error("Something went Wrong With Fetching Movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          // console.log(data.Search);
        } catch (err) {
          setErrorMesssage(err.message);
          // console.log(err.message);
        } finally {
          SetIsLoading(false);
        }
      }
      if (Query.length < 3) {
        setMovies([]);
        setErrorMesssage("");
        return;
      }
      FetchMovies();
    },
    [Query]
  );

  return (
    <>
      <NavBar>
        <Search Query={Query} SetQuery={SetQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <ListBox>
          {/* if the system is still loading a loading message will be displayed  */}
          {IsLoading && <Loader />}
          {/* if the loading is false and there is no error message then the process is completed succesfully  */}
          {!IsLoading && !errorMesssage && (
            <MoviesList
              movies={movies}
              OnSelectMovie={HandelSelectMovie}
            ></MoviesList>
          )}
          {/* if the system throw an error the the error message will be displayed  */}
          {errorMesssage && <ErrorMesssage message={errorMesssage} />}
        </ListBox>

        <WatchedBox>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              OnCloseMovie={HandleCloseMovie}
            />
          ) : (
            <>
              <WatchedSummary Watched={Watched} />

              <WatcheMovieList Watched={Watched} />
            </>
          )}
        </WatchedBox>
      </Main>
    </>
  );
}
