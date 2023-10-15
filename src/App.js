import { useEffect, useState } from "react";

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
function MovieDetail({ selectedId, OnCloseMovie, OnAddWatched, Watched }) {
  const [MoveDetail, SetMovieDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [UserRating, SetUserRating] = useState(5);
  const IsWatched = Watched.map((movie) => movie.imdbID).includes(selectedId);
  console.log(IsWatched);
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

  function HandleAdd() {
    const NewWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: UserRating,
    };

    OnAddWatched(NewWatchedMovie);
    OnCloseMovie();
  }
  function AlreadyWatched() {
    return (
      <p className="AlreadyWatched">
        <span>⛔</span> This movie is Already Watched{" "}
      </p>
    );
  }
  //listening to the keyboard
  useEffect(
    function () {
      function CallBack(e) {
        if (e.code === "Escape") {
          OnCloseMovie();
          console.log("Closing");
        }
      }
      document.addEventListener("keydown",CallBack);

      //the cleaning function for the event  
      //listner so the request will not be repeated 
      return function (){
        document.removeEventListener('keydown',CallBack);
      }
    },
    [OnCloseMovie]
  );
  //get the details about the movie
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
  //change the page title and cleang the effect
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie:${title}`;

      return function () {
        document.title = "usepopCorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
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
              {!IsWatched ? (
                <button className="btn-add" onClick={HandleAdd}>
                  + Add to WAtched
                </button>
              ) : (
                <AlreadyWatched />
              )}
            </div>
          </header>
          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actros}</p>
            <p>Directed by: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function WatchedMovie({ movie, OnDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
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
        <button
          onClick={() => OnDeleteWatched(movie.imdbID)}
          className="btn-delete"
        >
          X
        </button>
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

function WatcheMovieList({ Watched, OnDeleteWatched }) {
  return (
    <ul className="list">
      {Watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          OnDeleteWatched={OnDeleteWatched}
        />
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
  const [Watched, setWatched] = useState([]);

  const [Query, SetQuery] = useState("");
  const [IsLoading, SetIsLoading] = useState(false);
  const [errorMesssage, setErrorMesssage] = useState("");
  const [selectedId, setSelectedId] = useState("");

  function HandelSelectMovie(ID) {
    setSelectedId((selectedId) => (ID === selectedId ? null : ID));
  }
  function HandleCloseMovie() {
    setSelectedId(null);
    console.log(`selected movie id is : ${selectedId ? selectedId : "NA"}`);
  }
  function HandleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function HandleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function FetchMovies() {
        try {
          SetIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${Query}`,
            //to abort the us used fetch requests
            { signal: controller.signal }
          );
          // console.log(Query ? Query : "No Query Found");
          if (!res.ok)
            throw new Error("Something went Wrong With Fetching Movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setErrorMesssage("");
          // console.log(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") setErrorMesssage(err.message);
          console.log(err.message);
        } finally {
          SetIsLoading(false);
        }
      }
      if (Query.length < 3) {
        setMovies([]);
        setErrorMesssage("");
        return;
      }
      HandleCloseMovie();
      FetchMovies();

      //clean up function to prevent multi requests 
      return function () {
        controller.abort();
      };
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
              OnAddWatched={HandleAddWatched}
              Watched={Watched}
            />
          ) : (
            <>
              <WatchedSummary Watched={Watched} />

              <WatcheMovieList
                Watched={Watched}
                OnDeleteWatched={HandleDeleteWatched}
              />
            </>
          )}
        </WatchedBox>
      </Main>
    </>
  );
}
