import { Routes, Route } from "react-router-dom";
import {useEffect, useState} from "react";

import './App.css';
import MovieCard from "./MovieCard";
import MovieDetails from "./MovieDetails";
import Header from "./Header";


const API_URL = 'https://www.omdbapi.com?apikey=cb68e3a0';

const App = () => {
    const [movies, setMovies] = useState([]);


    const searchMovies = async (title) => {
        try {
            const response = await fetch(`${API_URL}&s=${title}`);
            const data = await response.json();
            console.log(data);
            setMovies(data.Search);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect (() => {
        searchMovies('Batman');
    }, []);


    return (
        <div className="app">
                <Header searchMovies={searchMovies} />
                <Routes>
                    <Route path="/:Title/:imdbID" element={<MovieDetails />} />
                    <Route path="/" element ={
                        movies?.length > 0? (
                            <div className="container">
                                {movies.map((movie) => (
                                    < MovieCard movie={movie } key={movie.imdbID} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty">
                                <h2>No movies found</h2>
                            </div>
                        )
                    } />
                </Routes>
    
            
        </div>
    );
}


export default App;