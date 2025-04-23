import { useState, useEffect } from 'react';
import { Popover, Button, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Movies list
  const [moviesData, setMoviesData] = useState([])
  
  useEffect(() => {
    fetch('https://my-moviz-backend-red.vercel.app/movies')
      .then(response => response.json())
      .then(data => {
        setMoviesData(data.movies);
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredMovies = moviesData.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const movies = filteredMovies.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    const overview = data.overview.length <= 250 ? data.overview : data.overview.substring(0, 250) + "...";
    
    return (
      <Movie
        key={i}
        updateLikedMovies={updateLikedMovies}
        isLiked={isLiked}
        title={data.title}
        overview={overview}
        poster={'https://image.tmdb.org/t/p/original/' + data.poster_path}
        voteAverage={data.vote_average}
        voteCount={data.vote_count}
      />
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <div><Input.Search placeholder="Search" 
        onSearch={(value) => setSearchTerm(value)} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={{ width: 200, marginRight: '1rem' }}/>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
        </div>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;