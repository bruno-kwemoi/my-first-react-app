import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
    // For TMDB: use title/name, release_date/first_air_date, poster_path, overview, vote_average
    const title = movie.title || movie.name;
    const date = movie.release_date || movie.first_air_date;
    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
        : 'https://via.placeholder.com/400';
    
    // Determine media type based on available properties or explicit media_type
    const getMediaType = () => {
        if (movie.media_type) return movie.media_type;
        if (movie.first_air_date) return 'tv';
        return 'movie';
    };

    const mediaType = getMediaType();
    
    return (
        <div className="movie">
            <div>
                <p>{date}</p>
            </div>
            <div>
                <Link to={`/${mediaType}/${movie.id}`}>
                    <img src={poster} alt={title} />
                </Link>
            </div>
            <div>
                <span>{mediaType.toUpperCase()}</span>
                <h3>{title}</h3>
            </div>
        </div>
    );
}

export default MovieCard