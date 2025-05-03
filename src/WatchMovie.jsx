import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WatchMovie = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState([]);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
    }
  };

  const [imdbId, setImdbId] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedStream, setSelectedStream] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch IMDb ID for TV series
  useEffect(() => {
    if (type === 'tv') {
      const getExternalIds = async () => {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/external_ids?language=en-US`, options);
          const data = await res.json();
          setImdbId(data.imdb_id);
        } catch (e) { console.error(e); }
      };
      getExternalIds();
    }
  }, [type, id]);

  // Fetch seasons for TV series
  useEffect(() => {
    if (type === 'tv') {
      const fetchSeasons = async () => {
        try {
          const tvRes = await fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-US`, options);
          const tvData = await tvRes.json();
          const seasonPromises = tvData.seasons.map(season =>
            fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?language=en-US`, options)
              .then(res => res.json())
          );
          const allSeasons = await Promise.all(seasonPromises);
          setSeasons(allSeasons);
        } catch (error) {
          console.error(error);
        }
      };
      fetchSeasons();
    }
  }, [type, id]);

  // Build embed URL based on type and selections
  useEffect(() => {
    let url;
    if (type === 'tv' && imdbId) {
      url = `https://vidsrc.xyz/embed/tv?imdb=${imdbId}&season=${selectedSeason}&episode=${selectedEpisode}`;
    } else {
      url = `https://vidsrc.xyz/embed/${type}/${id}`;
    }
    setSelectedStream(url);
    setLoading(false);
  }, [type, id, imdbId, selectedSeason, selectedEpisode]);

  if (loading) return <div style={{ color: '#f9d3b4', padding: '2rem' }}>Loading stream...</div>;

  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '2rem auto', padding: '1rem', background: 'rgba(0,0,0,0.85)', borderRadius: '8px', color: 'white' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: '#f9d3b4', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
        Back
      </button>
      {selectedStream && (
        <div style={{ position: 'relative', paddingTop: '56.25%', marginBottom: '1.5rem', borderRadius: '8px', overflow: 'hidden', maxHeight: '80vh' }}>
          <iframe src={selectedStream} width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, border: 0 }} allowFullScreen />
        </div>
      )}
      {type === 'tv' && seasons.length > 0 && imdbId && (
        <div style={{ marginTop: '1rem', color: '#f9d3b4' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {seasons.map(se => (
              <button
                key={se.season_number}
                onClick={() => {
                  setSelectedSeason(se.season_number);
                  const sd = seasons.find(x => x.season_number === se.season_number);
                  if (sd?.episodes?.length) setSelectedEpisode(sd.episodes[0].episode_number);
                }}
                style={{
                  background: se.season_number === selectedSeason ? '#f9d3b4' : 'transparent',
                  color: se.season_number === selectedSeason ? '#000' : '#f9d3b4',
                  border: '1px solid #f9d3b4',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer'
                }}
              >
                {se.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {(() => {
              const sd = seasons.find(x => x.season_number === selectedSeason);
              return sd?.episodes.map(ep => (
                <button
                  key={ep.episode_number}
                  onClick={() => setSelectedEpisode(ep.episode_number)}
                  style={{
                    background: ep.episode_number === selectedEpisode ? '#f9d3b4' : 'transparent',
                    color: ep.episode_number === selectedEpisode ? '#000' : '#f9d3b4',
                    border: '1px solid #f9d3b4',
                    borderRadius: '4px',
                    padding: '0.3rem 0.7rem',
                    fontWeight: ep.episode_number === selectedEpisode ? 700 : 400,
                    cursor: 'pointer',
                    minWidth: '32px'
                  }}
                >
                  {ep.episode_number}
                </button>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchMovie;
