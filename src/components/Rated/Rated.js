import React, { useEffect, useState } from 'react'
import Genre from '../Genre/Genre'
import { format } from 'date-fns'
import { ConfigProvider, Pagination, Rate } from 'antd';
import Loader from '../Loader/Loader';
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator';

export default function RatedMovie({ sessionId }) {
    const [totalResults, setTotalResults] = useState([]);
    const [ratedMovies, setRatedMovies] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const onError = (error) => {
        setError(true)
        setLoading(false)
    }

    const getRatedMovie = () => {
        fetch(`https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?language=en-US&page=${currentPage}&sort_by=created_at.asc&api_key=514672082404a98e787157e73017cdb5`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTQ2NzIwODI0MDRhOThlNzg3MTU3ZTczMDE3Y2RiNSIsIm5iZiI6MTc0MzMyMzI1My4xNDcsInN1YiI6IjY3ZTkwMDc1YWY3NTJhM2IyNGY2ZGY4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WpXzeSQIoBqc8NP1bDswjrKpdsqXvjHBu9f6yoyWCaY'
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setTotalResults(json.total_pages);
                setRatedMovies(json.results);
                setLoading(false)
                console.log(json)
            })
    };


    useEffect(() => {
        getRatedMovie()
    }, [])

    const onChangePage = (page) => {
        fetch(`https://api.themoviedb.org/3/guest_session/${sessionId}?api_key=514672082404a98e787157e73017cdb5/rated/movies?language=en-US&page=${currentPage}&sort_by=created_at.asc`)
            .then((res) => res.json())
            .then((json) => {
                setTotalResults(json.total_pages);
                setRatedMovies(json.results);
                setLoading(false)
            })
            .catch(onError(error));
        setCurrentPage(page);
    };

    const addRatedMovie = (movieId, rating) => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=514672082404a98e787157e73017cdb5?guest_session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTQ2NzIwODI0MDRhOThlNzg3MTU3ZTczMDE3Y2RiNSIsIm5iZiI6MTc0MzMyMzI1My4xNDcsInN1YiI6IjY3ZTkwMDc1YWY3NTJhM2IyNGY2ZGY4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WpXzeSQIoBqc8NP1bDswjrKpdsqXvjHBu9f6yoyWCaY'
            },
            body: JSON.stringify({ value: rating }),
        })
            .then((res) => res.json())
            .then((json) => console.log(json))
    }

    function truncateAtWord(str, max, ellipsis = '…') {
        if (str.length <= max) return str;
        let trimmed = str.substr(0, max);
        if (str[max] !== ' ') {
            trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
        }
        return trimmed + ellipsis;
    }

    if (loading) {
        return <Loader />
    }

    if (error) {
        return <ErrorIndicator />
    }

    console.log(ratedMovies)

    if (ratedMovies) {
        return (
        <>
            <ul>
                {ratedMovies.map((movie) => (
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
                                <div className="rating">
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
    )}
}