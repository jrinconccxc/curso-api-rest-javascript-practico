import apiKey from "./api-key.js";
import dom from './nodes.js';

// Data

// const api = axios.create({
//     baseURL: 'https://api.themoviedb.org/3/',
//     headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//     },
//     params: {
//         'api_key': '7a9bb74ac3e5b5159a3700100ef42ad4',
//     },
// });
let page = 1;
let maxPage;

const urlTrending = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
const urlCategories = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const urlDiscoverMovie = (id) => `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&api_key=${apiKey}`;
const urlSearch = (query) => `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}`;
const urlById = (movieId) => `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
const urlRelatedMovieId = (id) => `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`;
const urlTrendingPage = (page) => `https://api.themoviedb.org/3/trending/movie/day?page=${page}&api_key=${apiKey}`;
const urlSearchPaginatedMovies = (query, page) => `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&api_key=${apiKey}`;
const urlDiscoverMoviePaginatedMovies = (id, page) => `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&page=${page}&api_key=${apiKey}`;

// Usamos un proxy público (solo para desarrollo)
const proxyTrending = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlTrending)}`;
const proxyCategories = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlCategories)}`;
const proxyDiscoverMovie = (id) => `https://corsproxy.io/?${urlDiscoverMovie(id)}`;
const proxySearch = (query) => `https://corsproxy.io/?${urlSearch(query)}`;
const proxyById = (id) => `https://corsproxy.io/?${urlById(id)}`;
const proxyRelatedMovieId = (id) => `https://corsproxy.io/?${urlRelatedMovieId(id)}`;
const proxyTrendingPage = (page) => `https://api.allorigins.win/raw?url=${encodeURIComponent(urlTrendingPage(page))}`;
const proxySearchPaginatedMovies = (query, page) => `https://corsproxy.io/?${urlSearchPaginatedMovies(query, page)}`;
const proxyDiscoverMoviePaginatedMovies = (id, page) => `https://corsproxy.io/?${urlDiscoverMoviePaginatedMovies(id, page)}`;


// Uso del localStorage para guardar y ->
function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }
    return movies;
}

function likedMovie(movie) {
    const likedMovies = likedMoviesList();

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

    getLikedMovies();
}
// -> recuperar datos en JavaScript

// Utils

// Implementación de Lazy Loading 
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
            // configuro el observador
            lazyLoader.unobserve(entry.target);
        }
    });
}); // con Intersection Observer


function createMovies(movies, container, options = {}) {
    // Desestructuramos los objetos
    const { useLazyLoader = false, observer = lazyLoader, clean = true } = options;

    if (clean) {
        container.innerHTML = '';
    }

    movies.forEach(movie => {
        if (movie.poster_path) {

            const moviesContainer = document.createElement('div');
            moviesContainer.classList.add('movie-container');

            const movieImg = document.createElement('img');
            movieImg.setAttribute(lazyLoader ? 'data-img' : 'src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', movie.title || 'Sin título');

            movieImg.addEventListener('click', () => {
                location.hash = `#movie=${movie.id}`
            });

            // Agregar imagen 
            movieImg.addEventListener('error', () => {
                movieImg.setAttribute(
                    'src',
                    './images/image.png'
                );
            }); // por defecto 

            const movieBtn = document.createElement('button');
            movieBtn.classList.add('movie-btn');
            likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
            movieBtn.addEventListener('click', () => {
                movieBtn.classList.toggle('movie-btn--liked');
                likedMovie(movie);
            });

            if (useLazyLoader && observer) {
                lazyLoader.observe(movieImg);
            }

            moviesContainer.appendChild(movieImg);
            moviesContainer.appendChild(movieBtn);
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


// Llamando a la API

//  Mostrando tendencias de peliculas
export async function getTrendingMoviesPreview() {
    try {
        const response = await fetch(proxyTrending);
        const data = await response.json();
        const movies = data.results;

        console.log("Películas recibidas:", movies);

        createMovies(movies, dom.trendingPreviewMovieList, {
            useLazyLoader: true, // Le damos el valor de true en el objeto
            clean: true,
            observer: lazyLoader // Mostramos la funcion del observer 
        });

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

        maxPage = data.total_pages;

        console.log("Películas recibidas:", movies);

        createMovies(movies, dom.genericListSection, {
            useLazyLoader: true,
            observer: lazyLoader,
            clean: true,
        });
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

export function getPaginatedMoviesByCategory(id) {
    // Implementación de Closures en Paginación Infinita con JavaScript
    return async function () {
        // Mira el alto de la pagina y el total de scroll que se hace
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        const scrollIsButton = (scrollTop + clientHeight) >= (scrollHeight - 15);

        // Limite de infinite scrolling
        const pageIsNotMax = page < maxPage;

        if (scrollIsButton && pageIsNotMax) {
            const response = await fetch(proxyDiscoverMoviePaginatedMovies(id, page));
            const data = await response.json();

            const movies = data.results;

            createMovies(movies, dom.genericListSection, {
                useLazyLoader: true,
                observer: lazyLoader,
                clean: false,
            });
            page++;
        }
    }
}

export async function getMoviesBySearch(query) {
    try {
        const response = await fetch(proxySearch(query));
        const data = await response.json();

        console.log("Datos recibidos:", data);

        const movies = data.results;
        maxPage = data.total_pages;

        createMovies(movies, dom.genericListSection, {
            useLazyLoader: true,
            observer: lazyLoader,
            clean: true,
        });

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

export function getPaginatedMoviesBySearch(query) {
    return async function () {
        // Mira el alto de la pagina y el total de scroll que se hace
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        const scrollIsButton = (scrollTop + clientHeight) >= (scrollHeight - 15);

        // Limite de infinite scrolling
        const pageIsNotMax = page < maxPage;

        if (scrollIsButton && pageIsNotMax) {
            const response = await fetch(proxySearchPaginatedMovies(query, page));
            const data = await response.json();
            const movies = data.results;

            createMovies(movies, dom.genericListSection, {
                useLazyLoader: true,
                observer: lazyLoader,
                clean: false,
            });
            page++;
        }
    }
}

export async function getTrendingMovies() {
    try {
        const response = await fetch(proxyTrending);
        const data = await response.json();
        const movies = data.results;
        maxPage = data.total_pages;

        createMovies(movies, dom.genericListSection, {
            useLazyLoader: true,
            observer: lazyLoader,
            clean: true,
        });
        // Agregando button 
        // const btnLoadMore = document.createElement('button');
        // btnLoadMore.innerHTML = 'Cargar más';
        // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
        // dom.genericListSection.appendChild(btnLoadMore);

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

// Scroll Infinito en Aplicaciones Web: Implementación y Mejores Prácticas
export async function getPaginatedTrendingMovies() {
    try {
        // Mira el alto de la pagina y el total de scroll que se hace
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        const scrollIsButton = (scrollTop + clientHeight) >= (scrollHeight - 15);

        // Limite de infinite scrolling
        const pageIsNotMax = page < maxPage;

        if (scrollIsButton && pageIsNotMax) {
            const response = await fetch(proxyTrendingPage(page));
            const data = await response.json();
            const movies = data.results;

            createMovies(movies, dom.genericListSection, {
                useLazyLoader: true,
                observer: lazyLoader,
                clean: false,
            });
            page++;
        }
        // const btnLoadMore = document.createElement('button');
        // btnLoadMore.innerHTML = 'Cargar más';
        // btnLoadMore.addEventListener('click', () => {
        //     // Eliminamos el button al darle click
        //     if (btnLoadMore) {
        //         btnLoadMore.style.display = 'none';
        //     }
        //     getPaginatedTrendingMovies();
        // });
        // dom.genericListSection.appendChild(btnLoadMore);

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

        createMovies(relatedMovie, dom.relatedMoviesContainer, {
            useLazyLoader: true,
            observer: lazyLoader,
            clean: false,
        });

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

export async function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, dom.likedMoviesListArticle,
        {
            useLazyLoader: true,
            clean: true,
            observer: lazyLoader,
        });

    console.log(likedMovies)
};

