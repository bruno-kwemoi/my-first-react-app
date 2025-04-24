import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import './App.css';
import MovieCard from "./MovieCard";
import MovieDetails from "./MovieDetails";
import PersonDetails from "./PersonDetails";
import Header from "./Header";
import WatchTrailer from "./WatchTrailer";

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
    }
};

const App = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('trending');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    const searchMovies = async (title, page = 1) => {
        if (!title) return;
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?include_adult=true&query=${encodeURIComponent(title)}&language=en-US&page=${page}`,
                options
            );
            const data = await response.json();
            setMovies(data.results || []);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setCurrentPage(page);
            setSearchTerm(title);
            setActiveCategory('search');
            navigate(`/search/${encodeURIComponent(title)}?page=${page}`);
        } catch (error) {
            console.error(error);
            setMovies([]);
        }
    }

    const fetchTrending = async (page = 1) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?language=en-US&page=${page}`, options);
            const data = await response.json();
            setMovies(data.results || []);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setCurrentPage(data.page);
            setActiveCategory('trending');
            navigate('/');
        } catch (error) {
            console.error(error);
            setMovies([]);
        }
    };

    const fetchMovies = async (page = 1) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, options);
            const data = await response.json();
            setMovies(data.results || []);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setCurrentPage(data.page);
            setActiveCategory('movies');
            navigate('/movies');
        } catch (error) {
            console.error(error);
            setMovies([]);
        }
    };

    const fetchTVSeries = async (page = 1) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/trending/tv/day?language=en-US&page=${page}`, options);
            const data = await response.json();
            setMovies(data.results || []);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setCurrentPage(data.page);
            setActiveCategory('tv');
            navigate('/tv');
        } catch (error) {
            console.error(error);
            setMovies([]);
        }
    };

    // Fetch anime category using Animation genre
    const fetchAnime = async (page = 1) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/tv?with_genres=16&language=en-US&page=${page}`, options);
            const data = await response.json();
            setMovies(data.results || []);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setCurrentPage(data.page);
            setActiveCategory('anime');
            navigate('/anime');
        } catch (error) {
            console.error(error);
            setMovies([]);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        
        switch (activeCategory) {
            case 'search':
                searchMovies(searchTerm, newPage);
                break;
            case 'trending':
                fetchTrending(newPage);
                break;
            case 'movies':
                fetchMovies(newPage);
                break;
            case 'tv':
                fetchTVSeries(newPage);
                break;
            case 'anime':
                fetchAnime(newPage);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        fetchTrending(1);
    }, []);

    const renderPagination = () => {
        const pageRange = 2; 
        let startPage = Math.max(1, currentPage - pageRange);
        let endPage = Math.min(totalPages, currentPage + pageRange);

        const totalPagesToShow = pageRange * 2 + 1;
        if (endPage - startPage + 1 < totalPagesToShow) {
            if (currentPage - startPage < pageRange) {
                endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);
            } else {
                startPage = Math.max(1, endPage - totalPagesToShow + 1);
            }
        }

        const pageNumbers = [];
        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) pageNumbers.push('...');
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        const pageButtonStyle = (page) => ({
            padding: '0.5rem 1rem',
            background: currentPage === page ? '#f9d3b4' : 'transparent',
            color: currentPage === page ? '#000' : '#f9d3b4',
            border: currentPage === page ? '1px solid #f9d3b4' : '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
            minWidth: '40px',
            textAlign: 'center',
            display: 'inline-block',
            transition: 'all 0.2s ease-in-out'
        });

        const navigationButtonStyle = (disabled) => ({
            padding: '0.5rem 1rem',
            background: '#f9d3b4',
            border: 'none',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            minWidth: '100px'
        });

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '2rem',
                alignItems: 'center',
                color: '#f9d3b4',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={navigationButtonStyle(currentPage === 1)}
                >
                    Previous
                </button>
                {pageNumbers.map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} style={{ color: '#f9d3b4' }}>...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`page-button ${currentPage === page ? 'active' : ''}`}
                            style={pageButtonStyle(page)}
                        >
                            {page}
                        </button>
                    )
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={navigationButtonStyle(currentPage === totalPages)}
                >
                    Next
                </button>
            </div>
        );
    };

    const renderMovieList = () => (
        <>
            {movies?.length > 0 ? (
                <div className="container">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            ) : (
                <div className="empty">
                    <h2>No movies found</h2>
                </div>
            )}
            {movies.length > 0 && renderPagination()}
        </>
    );

    return (
        <div className="app">
            <Header 
                searchMovies={searchMovies} 
                onMoviesClick={() => fetchMovies(1)}
                onTrendingClick={() => fetchTrending(1)}
                onTVSeriesClick={() => fetchTVSeries(1)}
                onAnimeClick={() => fetchAnime(1)}
                activeCategory={activeCategory}
            />
            <Routes>
                <Route path="/movies" element={renderMovieList()} />
                <Route path="/tv" element={renderMovieList()} />
                <Route path="/anime" element={renderMovieList()} />
                <Route path="/:type/:id/trailer" element={<WatchTrailer />} />
                <Route path="/:type/:id" element={<MovieDetails />} />
                <Route path="/person/:id" element={<PersonDetails />} />
                <Route path="/search/:title" element={renderMovieList()} />
                <Route path="/" element={renderMovieList()} />
            </Routes>
            <style>
                {`.page-button:hover {
                    border: 1px solid #f9d3b4 !important;
                    transform: scale(1.05);
                }
                .page-button.active:hover {
                    transform: none;
                }`}
            </style>
        </div>
    );
}

export default App;