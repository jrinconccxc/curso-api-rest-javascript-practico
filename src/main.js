import apiKey from "./api-key.js";
import dom from './nodes.js';

// const api = axios.create({
//     baseURL: 'https://api.themoviedb.org/3/',
//     headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//     },
//     params: {
//         'api_key': '7a9bb74ac3e5b5159a3700100ef42ad4',
//     },
// });

const urlTrending = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
const urlCategories = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const urlDiscoverMovie = (id) => `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&api_key=${apiKey}`;
const urlSearch = (query) => `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}`;
const urlById = (movieId) => `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
const urlRelatedMovieId = (id) => `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`;




// Usamos un proxy público (solo para desarrollo)
const proxyTrending = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlTrending)}`;
const proxyCategories = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlCategories)}`;
const proxyDiscoverMovie = (id) => `https://corsproxy.io/?${urlDiscoverMovie(id)}`;
const proxySearch = (query) => `https://corsproxy.io/?${urlSearch(query)}`;
const proxyById = (id) => `https://corsproxy.io/?${urlById(id)}`;
const proxyRelatedMovieId = (id) => `https://corsproxy.io/?${urlRelatedMovieId(id)}`;



// Utils
function createMovies(movies, container) {
    container.innerHTML = '';

    movies.forEach(movie => {
        if (movie.poster_path) {

            const moviesContainer = document.createElement('div');
            moviesContainer.classList.add('movie-container');

            moviesContainer.addEventListener('click', () => {
                location.hash = `#movie=${movie.id}`
            })

            const movieImg = document.createElement('img');
            movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', movie.title || 'Sin título');

            moviesContainer.appendChild(movieImg);
            container.appendChild(moviesContainer);

        } else {
            console.log(`Película sin poster: ${movie.title}`);
        }
    });
}

function createCategories(categories, container) {
    container.innerHTML = '';

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', `id${category.id}`);

        // Filtramos peliculas 
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        }); // por categorias

        const categoryTitleText = document.createTextNode(category.name || 'Sin titulo');

        container.appendChild(categoryContainer);
        categoryContainer.appendChild(categoryTitle);
        categoryTitle.appendChild(categoryTitleText);
    });
}

//  Mostrando tendencias de peliculas
export async function getTrendingMoviesPreview() {
    try {
        const response = await fetch(proxyTrending);
        const data = await response.json();
        const movies = data.results;

        console.log("Películas recibidas:", movies);

        createMovies(movies, dom.trendingPreviewMovieList);

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

// Mostrando categorias de peliculas
export async function getCategoriesPreview() {
    try {
        const response = await fetch(proxyCategories);
        const data = await response.json();
        const categories = data.genres;

        console.log("Películas recibidas:", categories);

        createCategories(categories, dom.categoriesPreviewList);

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

// Mostrando peliculas por su id
export async function getMoviesByCategory(id) {
    try {
        const response = await fetch(proxyDiscoverMovie(id));
        const data = await response.json();
        const movies = data.results;

        console.log("Películas recibidas:", movies);

        createMovies(movies, dom.genericListSection);
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

export async function getMoviesBySearch(query) {
    try {
        const response = await fetch(proxySearch(query));
        const data = await response.json();
        console.log("Datos recibidos:", data);
        const movies = data.results;

        createMovies(movies, dom.genericListSection);

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

export async function getTrendingMovies() {
    try {
        const response = await fetch(proxyTrending);
        const data = await response.json();
        const movies = data.results;

        createMovies(movies, dom.genericListSection);

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

export async function getMovieById(id) {
    try {
        const response = await fetch(proxyById(id));
        const data = await response.json();

        // console.log("Respuesta de la API:", data);

        const movieImgUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        dom.headerSection.style.background = `
        linear-gradient(
                180deg,
                rgba(0, 0, 0, 0.35) 19.27%,
                rgba(0, 0, 0, 0) 29.17%),
        url(${movieImgUrl})
        `;

        dom.movieDetailTitle.textContent = data.title;
        dom.movieDetailDescription.textContent = data.overview;
        dom.movieDetailScore.textContent = data.vote_average;

        // Mostrar las categorias al seleccionar una imagen
        createCategories(data.genres, dom.movieDetailCategoriesList);

        getRelatedMovieId(id);

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

export async function getRelatedMovieId(id) {
    try {
        const response = await fetch(proxyRelatedMovieId(id));
        const data = await response.json();
        const relatedMovie = data.results;

        createMovies(relatedMovie, dom.relatedMoviesContainer);

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}
