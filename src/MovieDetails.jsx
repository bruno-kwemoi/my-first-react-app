import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactPlayer from 'react-player';

function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [logoPath, setLogoPath] = useState("");
  const [providers, setProviders] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const { type, id } = useParams();
  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie/TV show details
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options);
        const data = await response.json();
        setMovie(data);

        // Set backdrop path
        if (data.backdrop_path) {
          setImagePath(`https://image.tmdb.org/t/p/original${data.backdrop_path}`);
        }

        // Fetch images including logos
        const imagesResponse = await fetch(`https://api.themoviedb.org/3/${type}/${id}/images`, options);
        const imagesData = await imagesResponse.json();
        if (imagesData.logos && imagesData.logos.length > 0) {
          setLogoPath(`https://image.tmdb.org/t/p/original${imagesData.logos[0].file_path}`);
        }

        // Fetch credits (cast and crew)
        const creditsResponse = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits`, options);
        const creditsData = await creditsResponse.json();
        setCredits(creditsData);

        // Fetch watch providers
        const providersResponse = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/watch/providers`,
          options
        );
        const providersData = await providersResponse.json();
        // Use US providers if available
        setProviders(providersData.results?.US || null);

        // Fetch trailers
        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`,
          options
        );
        const videosData = await videosResponse.json();
        setTrailers(
          videosData.results.filter((v) => v.type === "Trailer" && v.site === "YouTube")
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieDetails();
  }, [id, type]);

  return (
    <div className="movie-details" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div className="movie-backdrop" style={{
        backgroundImage: `url(${imagePath})`,
        width: '100%',
        height: '70vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '16px',
        marginBottom: '2rem',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        {logoPath && (
          <img
            src={logoPath}
            alt="movie logo"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '400px',
              maxHeight: '200px',
              zIndex: 2,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))'
            }}
          />
        )}
      </div>
      <div style={{
        color: 'white',
        background: 'rgba(0,0,0,0.6)',
        padding: '3rem',
        borderRadius: '24px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{
          color: '#f9d3b4',
          fontWeight: 800,
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {movie?.title || movie?.name}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '3rem',
          alignItems: 'start'
        }}>
          <div style={{ maxWidth: '700px' }}>
            <p style={{
              fontSize: '1.2rem',
              lineHeight: '1.8',
              color: '#e0e0e0',
              marginBottom: '2rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {movie?.overview}
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              {movie?.genres?.map(genre => (
                <span key={genre.id} style={{
                  background: 'rgba(249, 211, 180, 0.1)',
                  color: '#f9d3b4',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(249, 211, 180, 0.2)',
                  backdropFilter: 'blur(5px)'
                }}>
                  {genre.name}
                </span>
              ))}
            </div>

            {providers && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{
                  color: '#f9d3b4',
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}>
                  Where to Watch
                </h3>

                {providers.flatrate && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      color: '#f9d3b4',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem',
                      opacity: 0.9
                    }}>
                      Stream on
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      {providers.flatrate.map(provider => (
                        <img
                          key={provider.provider_id}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          title={provider.provider_name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {providers.rent && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      color: '#f9d3b4',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem',
                      opacity: 0.9
                    }}>
                      Available for Rent
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      {providers.rent.map(provider => (
                        <img
                          key={provider.provider_id}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          title={provider.provider_name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {providers.buy && (
                  <div>
                    <div style={{
                      color: '#f9d3b4',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem',
                      opacity: 0.9
                    }}>
                      Available to Buy
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      {providers.buy.map(provider => (
                        <img
                          key={provider.provider_id}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          title={provider.provider_name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {trailers.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate(`/${type}/${id}/trailer`)} style={{
                  background: '#f9d3b4',
                  color: '#000',
                  border: 'none',
                  padding: '0.7rem 1.2rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  Watch Trailer
                </button>
              </div>
            )}
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '2rem',
            borderRadius: '16px',
            minWidth: '280px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {type === 'tv' ? (
              <>
                <DetailItem label="Rating" value={`${movie?.vote_average?.toFixed(1)}/10`} />
                <DetailItem label="First Air Date" value={movie?.first_air_date} />
                <DetailItem label="Seasons" value={movie?.number_of_seasons} />
                <DetailItem label="Episodes" value={movie?.number_of_episodes} />
                <DetailItem label="Status" value={movie?.status} />
                <DetailItem label="Creators" value={movie?.created_by?.map(c => c.name).join(', ')} />
              </>
            ) : (
              <>
                <DetailItem label="Rating" value={`${movie?.vote_average?.toFixed(1)}/10`} />
                <DetailItem label="Release Date" value={movie?.release_date} />
                <DetailItem label="Runtime" value={`${movie?.runtime} min`} />
                <DetailItem label="Status" value={movie?.status} />
                <DetailItem label="Budget" value={movie?.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : 'N/A'} />
                <DetailItem label="Revenue" value={movie?.revenue ? `$${(movie.revenue / 1000000).toFixed(1)}M` : 'N/A'} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cast and Crew Section */}
      {credits && (
        <div style={{
          color: 'white',
          background: 'rgba(0,0,0,0.6)',
          padding: '3rem',
          borderRadius: '24px',
          marginTop: '2rem',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
        }}>
          {/* Directors */}
          {credits.crew?.filter(person => person.job === "Director").length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{
                color: '#f9d3b4',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                fontWeight: '600'
              }}>
                Director{credits.crew.filter(person => person.job === "Director").length > 1 ? 's' : ''}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '2rem'
              }}>
                {credits.crew
                  .filter(person => person.job === "Director")
                  .map(director => (
                    <div
                      key={director.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(249, 211, 180, 0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/person/${director.id}`)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(249, 211, 180, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        {director.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                            alt={director.name}
                            style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '3px solid rgba(249, 211, 180, 0.3)',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(249, 211, 180, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            color: '#f9d3b4',
                            border: '3px solid rgba(249, 211, 180, 0.3)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                          }}>
                            {director.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div style={{
                            color: '#fff',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            marginBottom: '0.3rem'
                          }}>{director.name}</div>
                          <div style={{
                            color: '#f9d3b4',
                            fontSize: '0.9rem',
                            opacity: 0.9,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
                              <path d="M9 12l2 2 4-4" />
                            </svg>
                            Director
                          </div>
                        </div>
                      </div>
                      {director.known_for_department && (
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#e0e0e0',
                          opacity: 0.8,
                          marginTop: '0.5rem'
                        }}>
                          Known for: {director.known_for_department}
                        </div>
                      )}
                      {director.popularity && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.9rem',
                          color: '#f9d3b4',
                          opacity: 0.8,
                          marginTop: '0.5rem'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          Popularity: {director.popularity.toFixed(1)}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Cast */}
          {credits.cast && credits.cast.length > 0 && (
            <div>
              <h3 style={{
                color: '#f9d3b4',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                fontWeight: '600'
              }}>
                Cast
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '2rem',
                marginBottom: '1rem'
              }}>
                {credits.cast.slice(0, 6).map(actor => (
                  <div key={actor.id} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(249, 211, 180, 0.1)',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                    onClick={() => navigate(`/person/${actor.id}`)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid rgba(249, 211, 180, 0.3)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'rgba(249, 211, 180, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        color: '#f9d3b4',
                        border: '3px solid rgba(249, 211, 180, 0.3)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                      }}>
                        {actor.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div style={{
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        marginBottom: '0.3rem'
                      }}>{actor.name}</div>
                      <div style={{
                        color: '#f9d3b4',
                        fontSize: '0.95rem',
                        opacity: 0.9
                      }}>{actor.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const DetailItem = ({ label, value }) => (
  <div style={{ marginBottom: '1.2rem' }}>
    <div style={{
      color: '#f9d3b4',
      fontSize: '0.9rem',
      marginBottom: '0.3rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      opacity: 0.9
    }}>
      {label}
    </div>
    <div style={{
      color: 'white',
      fontSize: '1.1rem',
      fontWeight: '500'
    }}>
      {value || 'N/A'}
    </div>
  </div>
);

export default MovieDetails;
