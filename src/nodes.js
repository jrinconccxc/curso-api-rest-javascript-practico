const domHtmlElements = {
    // Section
    headerSection: document.getElementById('header'),
    tredingPreviewSection: document.getElementById('trendingPreview'),
    categoriesPreviewSection: document.getElementById('categoriesPreview'),
    genericListSection: document.getElementById('genericList'),
    movieDetailSection: document.getElementById('movieDetail'),
    // List & Container
    searchForm: document.getElementById('searchForm'),
    trendingPreviewMovieList: document.querySelector('.trendingPreview-movieList'),
    categoriesPreviewList: document.querySelector('.categoriesPreview-list'),
    movieDetailCategoriesList: document.querySelector('#movieDetail .categories-list'),
    relatedMoviesContainer: document.querySelector('.relatedMovies-scrollContainer'),

    // Elements
    headerTitle: document.querySelector('.header-title'),
    arrowBtn: document.querySelector('.header-arrow'),
    headerCategoryTitle: document.querySelector('.header-title--categoryView'),

    searchFormInput: document.querySelector('#searchForm input'),
    searchFormBtn: document.getElementById('searchBtn'),

    trendingBtn: document.querySelector('.trendingPreview-btn'),

    movieDetailTitle: document.querySelector('.movieDetail-title'),
    movieDetailDescription: document.querySelector('.movieDetail-description'),
    movieDetailScore: document.querySelector('.movieDetail-score'),
}


export default domHtmlElements;