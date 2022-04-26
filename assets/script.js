var apiKey = fb404b43121bd629a943d011c4a84593;
var today = moment().format("l");
var searchBtnEl = document.querySelector("#searchBtn");
var citySearchHistoryEl = [];
var cityHistoryEl = document.querySelector("#search-history-list");
var cityEl = document.querySelector("#cityInput");
var currentForecastEl = document.querySelector("#current-forecast-list");

// saving cities to localStorage
var saveCities = JSON.parse(localStorage.getItem("recentCitiesSearched"));

// turning city searches into a string with JSON
function saveCitySearches(city) {
    saveCities.push(city);
    localStorage.setItem("recentCitiesSearched", JSON.stringify(saveCities));
    showCitySearches();
};

// display city searches
function showCitySearches() {
    cityHistoryEl.innerHTML = "";
    for (var historyIndex = 0; historyIndex < saveCities.length; historyIndex++) {
        var recentSearch = document.createElement("li");
        recentSearch.setAttribute("class", "col-12");
        recentSearch.textContent = ("cities", saveCities[historyIndex]);
        cityHistoryEl.appendChild(recentSearch);
        recentSearch.addEventListener("click", function(index) {
            var searchedCity = index.target.textContent;
            cityEl.value = searchedCity;
            // call function that displays current weather
        })
    }
}

var searchedCity = function() {
    var cityName = cityEl.value;
    currentForecastEl.innerHTML = "";
    currentForecastEl(cityName);
    saveCitySearches(cityName);
}

