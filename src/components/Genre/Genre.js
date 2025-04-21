import React, { useState, useEffect } from 'react';
import './genre.css'

export default function Genre({ genreIds }) {
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=514672082404a98e787157e73017cdb5')
      .then((res) => res.json())
      .then((json) => setGenreList(json.genres));
  }, []);

  return (
    <div>
        {genreList.filter(genre => genreIds?.includes(genre.id)).map((genre) => (<div key={genre.id} className='genre'>{genre.name}</div>))}
    </div>
  );
}
