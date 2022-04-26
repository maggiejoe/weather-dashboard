var apiKey = fb404b43121bd629a943d011c4a84593;
var today = moment().format("l");
// var userFormEl = document.querySelector("#form-container");
// var cityInputEl = document.querySelector("#cityName");
// var todaysForecastEl = document.querySelector("#todays-forecast-list");
// var futureForecastEl = document.querySelector("#future-forecast-list");
// var cityNameEl = document.querySelector("#city-search-name");
// var searchHistoryEl = document.querySelector("#search-history-list");



var getCurrentForecast = function(search) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";

    fetch(apiUrl)
    .then(function(response) {
        return response.json()
    })
    .then(function (searchResponse) {
        var latitude = searchResponse.coord.lat
        var longitude = searchResponse.coord.lon
        getFutureForecast(latitude, longitude, search)
    })
};

var getFutureForecast = function(latitude, longitude, search) {

    var futureForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;

    fetch(futureForecastUrl)
    .then(function (response) {
        return response.json()
    })
    .then(function(futureForecast) {
        $("#display-wather").css("display", "block");
        $("#future-forecast-list").empty();

        var weatherIcon = futureForecast.current.weather[0].weatherIcon
        var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

        // Display Current Weather
        var curentWeatherHTML = `
        <h4>${search} ${today} <img src="${weatherIcon}</h4>
        <div id="current-weather-list">
            <p>Temperature: ${futureForecast.current.temp}</p>
            <p>Wind Speed: ${futureForecast.current.wind_speed}</p>
            <p>Humidity: ${futureForecast.current.humidit}</p>
            <p>UV Index: <span id="UVColor">${futureForecast.current.uvi}</span></p>
        </div>`

        var UVIndex = futureForecast.current.uvi

        if (UVIndex >= 0 && UVIndex <=2) {
            $("#UVColor").css("background-color", "green")
        } else if (UVIndex <= 3 && UVIndex <=5) {
            $("UVColor").css("background-color", "yellow")
        } else {
            $("UVColor").css("background-color", "red")
        }

        // Display Future Forecast
        var futureWeatherHTML = "";
        for (var i = 0; i < 5; i++) {
            var fiveDayForecastInfo = {
                date: futureForecast.daily[i].dt,
                icon: futureForecast.daiy[i].weather[i].icon,
                description: futureForecast.daily[i].weather[i].description,
                tMin: futureForecast.daily[i].temp.min,
                tMax: futureForecast.daily[i].temp.max,
                humidity: futureForecast.daily[i].humidity,
                wind: futureForecast.daily[i].wind_speed
            };

            var futureForecastIconUrl = <img src="http://openweathermap.org/img/wn/" + fiveDayForecastInfo.icon + "@2x.png">
            
            futureWeatherHTML
        }
    });
}




