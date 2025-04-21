import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Rate, ConfigProvider, Pagination, Input } from 'antd';
import Genre from '../Genre/Genre';
import Loader from '../Loader/Loader'
import { debounce } from 'lodash'
import './movie.css';
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator';


export default function Movie({ sessionId }) {
  const [movieList, setMovieList] = useState([]);
  const [totalResults, setTotalResults] = useState([]);
  const [val, setVal] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const debounceSearch = useRef(null)

  const onError = (error) => {
    console.log(error)
    setError(true)
    setLoading(false)
  }

  const onChangePage = (page) => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=514672082404a98e787157e73017cdb5&page=${page}`)
      .then((res) => res.json())
      .then((json) => {
        setTotalResults(json.total_pages);
        setMovieList(json.results);
        setLoading(false)
      })
      .catch((error) => onError(error));
    setCurrentPage(page);
  };

  const getMovie = () => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=514672082404a98e787157e73017cdb5`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTQ2NzIwODI0MDRhOThlNzg3MTU3ZTczMDE3Y2RiNSIsIm5iZiI6MTc0MzMyMzI1My4xNDcsInN1YiI6IjY3ZTkwMDc1YWY3NTJhM2IyNGY2ZGY4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WpXzeSQIoBqc8NP1bDswjrKpdsqXvjHBu9f6yoyWCaY'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        setTotalResults(json.total_pages);
        setMovieList(json.results);
        setLoading(false)
      })
  };

  const findMovie = (event) => {
    setVal(event.target.value)

    if (val) {
      debounceSearch.current(event.target.value)
    }
  }

  const addRatedMovie = (movieId, rating) => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTQ2NzIwODI0MDRhOThlNzg3MTU3ZTczMDE3Y2RiNSIsIm5iZiI6MTc0MzMyMzI1My4xNDcsInN1YiI6IjY3ZTkwMDc1YWY3NTJhM2IyNGY2ZGY4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WpXzeSQIoBqc8NP1bDswjrKpdsqXvjHBu9f6yoyWCaY'
      },
      body: JSON.stringify({ value: rating }),
    })
      .then((res) => res.json())
  }

  function truncateAtWord(str, max, ellipsis = '…') {
    if (str.length <= max) return str;
    let trimmed = str.substr(0, max);
    if (str[max] !== ' ') {
      trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
    }
    return trimmed + ellipsis;
  }

  function a(val) {
    console.log(val)
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=514672082404a98e787157e73017cdb5&query=${val}`)
      .then((res) => res.json())
      .then((json) => {
        setTotalResults(json.total_pages);
        setMovieList(json.results);
        setLoading(false)
      })
      .catch((e) => onError(e));
  }

  useEffect(() => {
    debounceSearch.current = debounce((val) => { a(val) }, 500)
  }, [])

  useEffect(() => {
    getMovie();
  }, []);

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <ErrorIndicator />
  }

  return (
    <>
      <Input placeholder="Type to search..." className="search-input" onChange={findMovie} value={val} />
      <ul>
        {movieList.map((movie) => (
          <li key={movie.id}>
            <div className="poster">
              <img
                style={{ width: '183px', height: '281px' }}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt="movie"
              />
            </div>
            <div className="desc">
              <div className="title-wrapper">
                <h5>{movie.title}</h5>
                <div className={`rating ${Number(movie.vote_average).toFixed(1) >= 7 ? 'green' : Number(movie.vote_average).toFixed(1) >= 5 ? 'yellow' : Number(movie.vote_average).toFixed(1) >= 3 ? 'orange' : 'red'}`}>
                  <p className="vote_average">{Number(movie.vote_average).toFixed(1)}</p>
                </div>
              </div>
              <p className="release_date">{format(new Date(movie.release_date ? movie.release_date : null), 'MMMM dd, yyyy')}</p>
              <Genre genreIds={movie.genre_ids} />
              <p>{truncateAtWord(movie.overview, 130)}</p>
              <div className="rated_stars">
                {
                  <ConfigProvider
                    theme={{
                      components: {
                        Rate: {
                          starSize: 15,
                        },
                      },
                    }}
                  >
                    <Rate allowHalf value={movie.rating} count={10} className="stars" onChange={(value) => addRatedMovie(movie.id, value)} />
                  </ConfigProvider>
                }
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Pagination
        className="pagination-movies"
        align="center"
        defaultCurrent={1}
        current={currentPage}
        onChange={onChangePage}
        total={totalResults}
        size="small"
      />
    </>
  );
}
