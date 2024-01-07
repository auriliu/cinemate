import { useEffect, useState } from "react";

import logo from "./logo.resized.png";

// import { StarRating } from "./components/StarRating";

// OMDB API KEY db7c17fa
const OMDBkey = "db7c17fa";

// http://www.omdbapi.com/?apikey=[OMDBkey]&
// http://img.omdbapi.com/?apikey=[OMDBkey]&

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedMovie(id) {
    setSelectedId((prev) => (id === prev ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDBkey}&s=${query}`
        );

        if (!res.ok)
          throw new Error("something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("movie not found");

        setMovies(data.Search);
        console.log(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();
  }, [query]);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMsg error={error} />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              handleSelectedMovie={handleSelectedMovie}
            />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
            />
          ) : (
            <>
              {/* <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} /> */}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">loading...</p>;
}
function ErrorMsg({ error }) {
  return <p className="error">{error}</p>;
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  return (
    <div className="logo">
      <img src={logo} alt="" className="logo-img" />
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
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
//
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}
function MovieList({ movies, handleSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectedMovie={handleSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectedMovie }) {
  return (
    <li onClick={() => handleSelectedMovie(movie.imdbID)}>
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

function MovieDetails({ selectedId, onCloseMovie }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    async function getMovieDetails() {
      // ERROR part missing.
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDBkey}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);

      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <img src={poster} alt="" />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>❤</span>
                {imdbRating} IMDB imdbRating
              </p>
            </div>
          </header>
          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
