import MediaCard from "./MovieCard";
import { Movies } from "./data.js";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { createContext, useState } from "react";
import Filter from "./Filter";
import { Routes, Route, Link } from "react-router-dom";
import TrailerCard from "./TrailerCard";
import { Card } from "@mui/material";
const MoviesContext = createContext([]);

const Add = ({ handleChanges }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    posterUrl: "",
    rating: 0,
    trailerUrl: "",
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !data.title ||
      !data.description ||
      !data.posterUrl ||
      !data.rating ||
      !data.trailerUrl
    ) {
      alert("All fields are required!");
      return;
    }
    const newMovie = {
      id: Movies.length + 1,
      title: data.title,
      description: data.description,
      posterUrl: data.posterUrl,
      rating: data.rating,
      trailerUrl: data.trailerUrl,
    };
    setData([...Movies, newMovie]);
    handleChanges(data);
    setData({
      title: "",
      description: "",
      posterUrl: "",
      rating: 0,
      trailerUrl: "",
    });
  };
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  // useEffect(() => {
  //   handleChanges(data);
  // }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Your name here"
          value={data.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          value={data.description}
          placeholder="Your Description here"
          onChange={handleChange}
        />
        <input
          type="number"
          name="rating"
          value={data.rating}
          placeholder="Your rating here in integers"
          onChange={handleChange}
        />
        <input
          type="text"
          name="posterUrl"
          value={data.posterUrl}
          placeholder="Your image URL (ends with a .'image extention' here"
          onChange={handleChange}
        />{" "}
        <input
          type="text"
          name="trailerUrl"
          value={data.trailerUrl}
          placeholder="Your Trailer URL (ends with a .'image extention' here"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

const MovieList = () => {
  const moviesLoc = JSON.stringify(Movies);
  localStorage.setItem("locMovies", moviesLoc);
  const [movies, setMovies] = useState(Movies || []);
  const handleChanges = (data) => {
    const currentData = localStorage.getItem("locMovies") || "[]";
    const currentDataJ = JSON.parse(currentData);
    const newData = [...Movies, ...currentDataJ, data];
    localStorage.setItem("locMovies", JSON.stringify(newData));
    setMovies([...movies, data]);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(0);
  const handleRating = (data) => setMinRating(data);
  const handleSearchTerm = (data) => setSearchTerm(data);

  let filteredMoviesLoc = [];
  searchTerm || minRating
    ? (filteredMoviesLoc = movies.filter((movies) => {
        return (
          movies.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          movies.rating >= minRating
        );
      }))
    : (filteredMoviesLoc = movies);

  const MoviesContext = createContext(movies);

  console.log("filtered");
  return (
    <div>
      <Filter minrating={handleRating} searchterm={handleSearchTerm}></Filter>

      <br />
      <Add
        handleChanges={handleChanges}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Add>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{ marginTop: 10 }}
      >
        {filteredMoviesLoc.map(
          ({ title, description, posterUrl, rating }, key) => (
            <Grid
              key={key}
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              sx={{ m: 10 }}
            >
              {/* <Link to={`/description/${key}`}></Link> */}
              <MediaCard
                key={key}
                title={title}
                description={description}
                posterUrl={posterUrl}
                rating={Number(rating)}
              ></MediaCard>
              <Card>
                <Link key={key} to={`/trailer/${key}`}>
                  Learn More
                </Link>
              </Card>
            </Grid>
          )
        )}
      </Grid>
      <Routes>
        <Route path="/"></Route>
        <Route path="/movies" element={<MovieList></MovieList>}>
          {" "}
        </Route>

        <Route path="/trailer/:id" element={<TrailerCard />} />
        {/* <Route
          path="/trailer/:id"
          component={(props) => <TrailerCard {...props} movies={movies} />}
          element={<TrailerCard />}
        /> */}
      </Routes>
    </div>
  );
};
export default MovieList;
