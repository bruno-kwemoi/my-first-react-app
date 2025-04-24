import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PersonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
    }
  };

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        // Fetch person details
        const personResponse = await fetch(
          `https://api.themoviedb.org/3/person/${id}?language=en-US`,
          options
        );
        const personData = await personResponse.json();
        setPerson(personData);

        // Fetch person credits
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`,
          options
        );
        const creditsData = await creditsResponse.json();
        setCredits(creditsData);
      } catch (error) {
        console.error('Error fetching person details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f9d3b4'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 2rem'
    }}>
      {/* Person Info Section */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        background: 'rgba(0,0,0,0.6)',
        padding: '2rem',
        borderRadius: '24px',
        marginBottom: '2rem',
        boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ flexShrink: 0 }}>
          {person?.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
              alt={person.name}
              style={{
                width: '300px',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}
            />
          ) : (
            <div style={{
              width: '300px',
              height: '450px',
              borderRadius: '16px',
              background: 'rgba(249, 211, 180, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              color: '#f9d3b4'
            }}>
              {person?.name?.charAt(0)}
            </div>
          )}
        </div>

        <div style={{ color: 'white' }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: '#f9d3b4'
          }}>{person?.name}</h1>
          
          {person?.known_for_department && (
            <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
              Known for: {person.known_for_department}
            </div>
          )}

          {person?.birthday && (
            <div style={{ marginBottom: '0.5rem' }}>
              Born: {new Date(person.birthday).toLocaleDateString()}
              {person.place_of_birth && ` in ${person.place_of_birth}`}
            </div>
          )}

          {person?.biography && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{
                color: '#f9d3b4',
                marginBottom: '0.5rem'
              }}>Biography</h3>
              <p style={{
                lineHeight: '1.6',
                opacity: 0.9
              }}>{person.biography}</p>
            </div>
          )}
        </div>
      </div>

      {/* Filmography Section */}
      {credits && (
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '2rem',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{
            color: '#f9d3b4',
            fontSize: '1.8rem',
            marginBottom: '1.5rem'
          }}>Filmography</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            {credits.cast
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 12)
              .map(work => (
                <div
                  key={work.id}
                  onClick={() => navigate(`/${work.media_type}/${work.id}`)}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(249, 211, 180, 0.1)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(249, 211, 180, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {work.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${work.poster_path}`}
                      alt={work.title || work.name}
                      style={{
                        width: '100%',
                        aspectRatio: '2/3',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      aspectRatio: '2/3',
                      background: 'rgba(249, 211, 180, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f9d3b4'
                    }}>
                      No Image
                    </div>
                  )}
                  <div style={{ padding: '1rem' }}>
                    <div style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '500',
                      marginBottom: '0.3rem'
                    }}>
                      {work.title || work.name}
                    </div>
                    {work.character && (
                      <div style={{
                        color: '#f9d3b4',
                        fontSize: '0.9rem',
                        opacity: 0.9
                      }}>
                        as {work.character}
                      </div>
                    )}
                    {work.release_date && (
                      <div style={{
                        color: '#e0e0e0',
                        fontSize: '0.8rem',
                        marginTop: '0.5rem'
                      }}>
                        {new Date(work.release_date).getFullYear()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
