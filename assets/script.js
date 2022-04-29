var apiKey = "fb404b43121bd629a943d011c4a84593";
var searchBtnEl = document.querySelector("#searchBtn");
var cityHistoryEl = document.querySelector("#search-history-list");
var cityEl = document.querySelector("#cityInput");
var currentForecastEl = document.querySelector("#current-forecast-list");
var cityTitleEl = document.querySelector("#city-search-name");
var fiveDayForecast = document.querySelector("#future-forecast");

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

            // have to fix that when the city in the search is clicked,
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

        // futureForecast(todaysLat, todaysLon);

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

        for (var i = 0; i < 5; i++) {
            var futureDate = new Date (data.daily[i].dt);
            var futureIcon = data.daily[i].weather[0].icon;
            var futureTemp = data.daily[i].temp.day;
            var futureHumidity = data.daily[i].humidity;
            var futureWind = data.daily[i].wind_speed;

            var date = moment().add(futureDate, "d").format("MM/DD/YYYY");
            var iconURL = document.setAttribute("src", "https://openweathermap.org/img/wn/" + futureIcon + "@2x.png");

            var fiveDayDiv = document.createElement("div");

            // futureDate = document.createElement("h6");
            // futureWeather = document.createElement("p");
            // futureHumidity = document.createElement("p");
            // futureWind = document.createElement("p");

            fiveDayDiv.appendChild(futureDate);

            fiveDayForecast.appendChild(fiveDayDiv);

            // appendChild to day1 -> day5 variables ??
            date[i].append(fiveDayForecast);
        }
    });
};

// // function to get future 5 day forcast
var futureForecast = function (lon, lat) {
    fetch ("https://api.openweathermap.org/data/2.5/onecall?lon=" + lon + "&lat=" + lat + "&appid=" + apiKey + "&units=metric")
    
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // displaying future forecasts for 5 days
        for (var i = 0; i < 5; i++) {
            var futureDate = new Date (data.daily[i].dt);
            var futureIcon = data.daily[i].weather[0].icon;
            var futureTemp = data.daily[i].temp.day;
            var futureHumidity = data.daily[i].humidity;
            var futureWind = data.daily[i].wind_speed;

            var date = moment().add(futureDate, "d").format("MM/DD/YYYY");
            var iconURL = document.setAttribute("src", "https://openweathermap.org/img/wn/" + futureIcon + "@2x.png");

            var fiveDayDiv = document.createElement("div");

            // futureDate = document.createElement("h6");
            // futureWeather = document.createElement("p");
            // futureHumidity = document.createElement("p");
            // futureWind = document.createElement("p");

            fiveDayDiv.appendChild(futureDate);

            fiveDayForecast.appendChild(fiveDayDiv);

            // appendChild to day1 -> day5 variables ??
            date[i].append(fiveDayForecast);
        }
    });
};

// event listener to display searched cities and weather
searchBtnEl.addEventListener("click", function(event) {
    event.preventDefault();
    if (cityEl.value === null || cityEl.value === "") {
        alert("Please enter a city");
        return
    }
    currentForecastEl.innerHTML = ""
    searchedCity();
    futureForecast();
})

// event listener to clear history
var clearBtnEl = document.querySelector("#clearBtn");

clearBtnEl.addEventListener("click", function () {
    // would like to make this only clear the city history list and not the entire page
    localStorage.clear();
    window.location.reload();
})
