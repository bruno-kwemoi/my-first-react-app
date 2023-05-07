import React from "react";
import { useState } from "react";
import SearchIcon from './search.svg';
import './App.css'

 function Header(props) { 
    const [searchTerm, setsearchTerm] = useState('');

    const handleSearch = () => {
        props.searchMovies(searchTerm);
    }
    return (
        <div>
            <h1>Entertainmet Hub</h1>
                <h2>Search for your favorite movies</h2>
                <div className="search">
                    <input 
                        placeholder="Search for movies"
                        value={searchTerm}
                        onChange={(e) => setsearchTerm(e.target.value)}
                    />
                    <img 
                        src={SearchIcon}
                        alt="search"
                        onClick={handleSearch}
                    />
                </div>
        </div>
    );
 }

 export default Header;