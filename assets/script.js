var apiKey = fb404b43121bd629a943d011c4a84593;
var today = moment().format("l");
var searchList = [];

// var citySearchEl = document.querySelector("#cityInput");
var searchBtnEl = document.querySelector("#searchBtn");
var todaysWeatherEl = document.querySelector("#todaysWeather");



function getWeather(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";

    fetch(apiUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (searchResponse) {
        var todaysDate = moment().format("MM/DD/YYYY");
        var lat = searchResponse.coord.lat;
        var long = searchResponse.coord.long;
        var currentWeather = searchResponse.main.temp;
        var currentWind = searchResponse.wind.speed;
        var currentHumidity = searchResponse.main.humidity;

        var cityName = document.querySelector("#cityInput");
    })
}

