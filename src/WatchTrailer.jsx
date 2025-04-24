import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const WatchTrailer = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [trailers, setTrailers] = useState([]);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
    }
  };

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`, options);
        const data = await response.json();
        setTrailers(data.results.filter(v => v.type === 'Trailer' && v.site === 'YouTube'));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrailers();
  }, [type, id]);

  if (!trailers.length) {
    return <div style={{ color: 'white', padding: '2rem' }}>No trailer available.</div>;
  }

  return (
    <div style={{ width: '100%', maxWidth: '1140px', margin: '2rem auto', padding: '2rem', background: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: '8px', minHeight: 'max-content' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: '#f9d3b4', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
        Back
      </button>
      <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', borderRadius: '8px', maxHeight: '80vh' }}>
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${trailers[0].key}`}
          controls
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    </div>
  );
};

export default WatchTrailer;
