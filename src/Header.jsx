import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from './search.svg';
import './App.css'

function Header({ searchMovies, onMoviesClick, onTrendingClick, onTVSeriesClick, onAnimeClick, activeCategory }) {
    const [searchTerm, setsearchTerm] = useState('');

    const handleSearch = () => {
        if (!searchTerm) return;
        searchMovies(searchTerm);
        setsearchTerm('');
    }

    const getLinkStyle = (category) => ({
        textDecoration: 'none',
        color: '#f9d3b4',
        fontSize: '1.1rem',
        cursor: 'pointer',
        borderBottom: activeCategory === category ? '2px solid #f9d3b4' : 'none',
        paddingBottom: '3px'
    });

    return (
        <div className="header-responsive" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 className="logo" style={{ color: '#f9d3b4' }}>Entertainmet Hub</h1>
            </Link>
            <div style={{ display: 'flex', gap: '2rem', flex: 1, justifyContent: 'center' }}>
                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/" onClick={onTrendingClick} style={getLinkStyle('trending')}>Trending</Link>
                    <Link to="/movies" onClick={onMoviesClick} style={getLinkStyle('movies')}>Movies</Link>
                    <Link to="/tv" onClick={onTVSeriesClick} style={getLinkStyle('tv')}>TV Series</Link>
                    <Link to="/anime" onClick={onAnimeClick} style={getLinkStyle('anime')}>Anime</Link>
                </nav>
            </div>
            <div className="search">
                <input
                    placeholder="Search for movies"
                    value={searchTerm}
                    onChange={(e) => setsearchTerm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                />
                <img
                    src={SearchIcon}
                    alt="search"
                    onClick={handleSearch}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
}

export default Header;