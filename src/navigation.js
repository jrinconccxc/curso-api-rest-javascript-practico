import { getTrendingMoviesPreview, getCategoriesPreview, getMoviesByCategory, getMoviesBySearch, getTrendingMovies, getMovieById, getPaginatedTrendingMovies, getPaginatedMoviesBySearch, getPaginatedMoviesByCategory, getLikedMovies } from './main.js';
import dom from './nodes.js';

let infiniteScroll;

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);


function navigator() {

    // Eliminamos el scroll
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false });
        infiniteScroll = undefined;
    }

    // Location y hash navigation
    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoeriesPage();
    } else {
        homePage();
    }

    // Al darle click a una categoria aparezca mi scrollTop arriba
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Volvemos agregar scroll
    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false });
    }
}

// Mostrando y ocultando secciones
function homePage() {
    console.log('HOME!!');

    dom.headerSection.classList.remove('header-container--long');
    dom.headerSection.style.background = '';
    dom.arrowBtn.classList.add('inactive');
    dom.arrowBtn.classList.remove('header-arrow--white');
    dom.headerTitle.classList.remove('inactive');
    dom.headerCategoryTitle.classList.add('inactive');
    dom.searchForm.classList.remove('inactive');

    dom.tredingPreviewSection.classList.remove('inactive');
    dom.categoriesPreviewSection.classList.remove('inactive');
    dom.likedMoviesSection.classList.remove('inactive');
    dom.genericListSection.classList.add('inactive');
    dom.movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}

function categoeriesPage() {
    console.log('CATEGORIES!!!');

    dom.headerSection.classList.remove('header-container--long');
    dom.headerSection.style.background = '';
    dom.arrowBtn.classList.remove('inactive');
    dom.arrowBtn.classList.remove('header-arrow--white');
    dom.headerTitle.classList.add('inactive');
    dom.headerCategoryTitle.classList.remove('inactive');
    dom.searchForm.classList.add('inactive');

    dom.tredingPreviewSection.classList.add('inactive');
    dom.categoriesPreviewSection.classList.add('inactive');
    dom.likedMoviesSection.classList.add('inactive');
    dom.genericListSection.classList.remove('inactive');
    dom.movieDetailSection.classList.add('inactive');

    // ['#category', 'id-name'];
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');

    dom.headerCategoryTitle.textContent = categoryName;
    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}

function movieDetailsPage() {
    console.log('MOVIE!!!');

    dom.headerSection.classList.add('header-container--long');
    // dom.headerSection.style.background = '';
    dom.arrowBtn.classList.remove('inactive');
    dom.arrowBtn.classList.add('header-arrow--white');
    dom.headerTitle.classList.add('inactive');
    dom.headerCategoryTitle.classList.add('inactive');
    dom.searchForm.classList.add('inactive');

    dom.tredingPreviewSection.classList.add('inactive');
    dom.categoriesPreviewSection.classList.add('inactive');
    dom.likedMoviesSection.classList.add('inactive');
    dom.genericListSection.classList.add('inactive');
    dom.movieDetailSection.classList.remove('inactive');


    // ['#movie', '414545'];
    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}

function searchPage() {
    console.log('SEARCH!!!');

    dom.headerSection.classList.remove('header-container--long');
    dom.headerSection.style.background = '';
    dom.arrowBtn.classList.remove('inactive');
    dom.arrowBtn.classList.remove('header-arrow--white');
    dom.headerTitle.classList.add('inactive');
    dom.headerCategoryTitle.classList.add('inactive');
    dom.searchForm.classList.remove('inactive');

    dom.tredingPreviewSection.classList.add('inactive');
    dom.categoriesPreviewSection.classList.add('inactive');
    dom.likedMoviesSection.classList.add('inactive');
    dom.genericListSection.classList.remove('inactive');
    dom.movieDetailSection.classList.add('inactive');

    // ['#search', 'buscado'];
    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query);

}

function trendsPage() {
    console.log('TRENDS!!!');

    dom.headerSection.classList.remove('header-container--long');
    dom.headerSection.style.background = '';
    dom.arrowBtn.classList.remove('inactive');
    dom.arrowBtn.classList.remove('header-arrow--white');
    dom.headerTitle.classList.add('inactive');
    dom.headerCategoryTitle.classList.remove('inactive');
    dom.searchForm.classList.add('inactive');

    dom.tredingPreviewSection.classList.add('inactive');
    dom.categoriesPreviewSection.classList.add('inactive');
    dom.likedMoviesSection.classList.add('inactive');
    dom.genericListSection.classList.remove('inactive');
    dom.movieDetailSection.classList.add('inactive');


    dom.headerCategoryTitle.textContent = 'Tendencias';

    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;
}


// Eventos 
dom.searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + dom.searchFormInput.value;
});

dom.trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});

dom.arrowBtn.addEventListener('click', () => {
    const previousUrl = document.referrer;
    // Aca validamos si el dominio de la url de nuestro servidor es la misma de previousUrl
    if (previousUrl.includes(location.hostname)) {
        history.back();
    } else {
        location.hash = '#home';
    }
    // location.hash = '#home';
});