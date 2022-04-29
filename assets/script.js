var apiKey = "fb404b43121bd629a943d011c4a84593";
var searchBtnEl = document.querySelector("#searchBtn");
var cityHistoryEl = document.querySelector("#search-history-list");
var cityEl = document.querySelector("#cityInput");
var currentForecastEl = document.querySelector("#current-forecast-list");
var cityTitleEl = document.querySelector("#city-search-name");

var day1 = document.querySelector("#dayOne");
var day2 = document.querySelector("#dayTwo");
var day3 = document.querySelector("#dayThree");
var day4 = document.querySelector("#dayFour");
var day5 = document.querySelector("#dayFive");

// saving cities to localStorage
var saveCities = JSON.parse(localStorage.getItem("recentCitiesSearched")) || [];

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
        recentSearch.setAttribute("class", "col-12 mb-2 list-unstyled text-center bg-light p-2 rounded-3");
        recentSearch.textContent = ("cities", saveCities[historyIndex]);
        cityHistoryEl.appendChild(recentSearch);
        recentSearch.addEventListener("click", function(index) {
            var searchedCities = index.target.textContent;
            cityEl.value = searchedCities;
            getCurrentForecast(city);
        })
    }
}

var searchedCity = function() {
    var cityName = cityEl.value;
    getCurrentForecast(cityName);
    saveCitySearches(cityName);
}

var getCurrentForecast = function(city) {
    fetch ("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var today = moment().format("(MM/DD/YYYY)");
        var todaysWeather = data.main.temp;
        var todaysWind = data.wind.speed;
        var todaysHumidity = data.main.humidity;
        var todaysLon = data.coord.lon;
        var todaysLat = data.coord.lat;

        cityTitleEl.innerHTML = city + ", " + today;

        // displaying current weather
        var currentWeather = document.createElement("p");
        currentWeather.innerHTML = "Temperature: " + todaysWeather + " C";
        currentForecastEl.append(currentWeather);

        var currentWind = document.createElement("p");
        currentWind.innerHTML = "Wind: " + todaysWind + "m/s";
        currentForecastEl.append(currentWind);

        var currentHumidity = document.createElement("p");
        currentHumidity.innerHTML = "Humidity: " + todaysHumidity + " %";
        currentForecastEl.append(currentHumidity);

        // calling UVIndex()
        UVIndex(todaysLon, todaysLat);
        cityEl.value = "";

        // fix getCurrentForecast
        // if submitButton cilcked again, remove exisiting current weather data and replace it with new weather data
    });
};

// getting the UV Index to display in getCurrentWeather()
var UVIndex = function(lon, lat) {
    fetch ("https://api.openweathermap.org/data/2.5/onecall?lon=" + lon + "&lat=" + lat + "&exclude=hourly,daily&appid=" + apiKey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var currentUVIndex = data.current.uvi;
        var currentUVIndexEl = document.createElement("p");
        currentUVIndexEl.innerHTML = "UV Index " + currentUVIndex;
        currentForecastEl.append(currentUVIndexEl);

        // changing background color to reflect UV Index Severity
        if (currentUVIndex >= 0 && currentUVIndex <=2) {
            // need to fix this so the color is just covering the UV and not the entire line
            currentUVIndexEl.style.backgroundColor = "green";
        } else if (currentUVIndex <= 3 && currentUVIndex <= 5) {
            currentUVIndexEl.style.backgroundColor = "yellow";
        } else {
            currentUVIndexEl.style.backgroundColor = "red";
        }
    });
};

// // function to get future 5 day forcast
var futureForecast = function (lon, lat) {
    fetch ("https://api.openweathermap.org/data/2.5/forecast?lon=" + lon + "&lat=" + lat + "&appid=" + apiKey + "&units=metric")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // displaying future forecasts for 5 days
        // need to turn this data into a for loop\

        for (futureIndex = 0; futureIndex < 5; futureIndex++) {
            var futureWeatherData = {
                date: data.daily[futureIndex].dt,
                icon: data.daily[futureIndex].weather[0].icon,
                temp: data.daily[futureIndex].temp.day,
                humidity: data.daily[futureIndex].humidity,
                wind: data.daily[futureIndex].wind_speed
            };

            var date = moment().add(futureWeatherData.date, "d").format("MM/DD/YYYY");
            var iconURL = "https://openweathermap.org/img/wn/" + futureWeatherData.icon + "@2x.png";

            futureWeatherData.date = document.createElement("h6");
            futureWeatherData.icon = document.createElement("img");
            futureWeatherData.temp = document.createElement("p");
            futureWeatherData.humidity = document.createElement("p");
            futureWeatherData.wind = document.createElement("p");

        }
    })
}

// event listener to display searched cities and weather
searchBtnEl.addEventListener("click", function(event) {
    event.preventDefault();
    if (cityEl.value === null || cityEl.value === "") {
        alert("Please enter a city");
        return
    }
    currentForecastEl.innerHTML = ""
    searchedCity();
})

// event listener to clear history
var clearBtnEl = document.querySelector("#clearBtn");

clearBtnEl.addEventListener("click", function () {
    // would like to make this only clear the city history list and not the entire page
    localStorage.clear();
    window.location.reload();
})
