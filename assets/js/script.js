var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-search-input");
var currentContainerEl = document.querySelector("#current-container");
var fiveDayContainerEl = document.querySelector("#five-day-container");
var weatherEl = document.createElement("div");
searchHistoryContainerEl = document.querySelector("#search-history-container");
var historyBtnEl = document.querySelector(".history-button");

var getCityWeather = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=2c1cfa7d8c1ab09dbd43af544129557a";
  console.log(apiUrl);
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to Open Weather");
    });
};

var displayUVIndex = function (data) {
  var cityUV = data.value;
  cityUV.classList = "bg-danger rounded";
  var cityUVEl = document.createElement("p");
  cityUVEl.classList = "list-item flex-row align-left";
  cityUVEl.textContent = "UV Index: ";
  varCityUVSpan = document.createElement("span");
  varCityUVSpan.classList = "bg-danger rounded p-1 text-white";
  varCityUVSpan.textContent = cityUV;
  cityUVEl.appendChild(varCityUVSpan);
  weatherEl.appendChild(cityUVEl);
};

var displayWeather = function (city) {
  // clear old content
  currentContainerEl.innerHTML = "";
  weatherEl.innerHTML = "";
  currentContainerEl.classList =
    "list-group border border-primary rounded p-3 m-2";
  console.log(city.name);
  console.log(city.main.temp);
  console.log(city.main.humidity);
  console.log(city.wind.speed);

  var cityName = city.name;
  var todaysDate = moment().format("(MM/DD/YYYY)");
  var cityIcon = city.weather[0].icon;
  var iconImgSpan = document.createElement("span");
  var iconImg = document.createElement("img");
  iconImg.setAttribute(
    "src",
    "http://openweathermap.org/img/w/" + cityIcon + ".png"
  );
  iconImgSpan.appendChild(iconImg);

  var weatherTitle = cityName + " " + todaysDate + " ";
  weatherTitle.classList = "city-title";
  console.log(weatherTitle);

  var cityEl = document.createElement("div");
  cityEl.classList = "list-item flex-row justify-space-between align-left";

  var titleEl = document.createElement("h1");
  titleEl.textContent = weatherTitle;

  titleEl.appendChild(iconImgSpan);

  cityEl.appendChild(titleEl);

  weatherEl.classList = "flex-row align-center";

  var cityTemp = city.main.temp;
  var cityTempEl = document.createElement("p");
  cityTempEl.classList = "list-item flex-row align-left";
  cityTempEl.textContent = "Temperature: " + Math.round(cityTemp) + " \u00B0F";
  weatherEl.appendChild(cityTempEl);

  var cityHumid = city.main.humidity;
  var cityHumidEl = document.createElement("p");
  cityHumidEl.classList = "list-item flex-row align-left";
  cityHumidEl.textContent = "Humidity: " + cityHumid + "%";
  weatherEl.appendChild(cityHumidEl);

  var cityWind = city.wind.speed;
  var cityWindEl = document.createElement("p");
  cityWindEl.classList = "list-item flex-row align-left";
  cityWindEl.textContent =
    "Wind Speed: " + Math.round(cityWind * 10) / 10 + " MPH";
  weatherEl.appendChild(cityWindEl);

  var cityLatitude = city.coord.lat;
  var cityLongitude = city.coord.lon;

  console.log(cityLatitude);
  console.log(cityLongitude);

  fetch(
    "http://api.openweathermap.org/data/2.5/uvi?lat=" +
      cityLatitude +
      "&lon=" +
      cityLongitude +
      "&appid=2c1cfa7d8c1ab09dbd43af544129557a"
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayUVIndex(data);
      });
    }
  });

  // append to container
  cityEl.appendChild(weatherEl);

  // append container to the dom
  currentContainerEl.appendChild(cityEl);
};

var displayFiveDayWeather = function (city) {
  fiveDayContainerEl.innerHTML = "";

  fiveDayContainerEl.classList =
    "row d-flex justify-content-around border border-primary rounded p-3 m-2";

  var fiveDayForecastHeader = document.createElement("h2");
  fiveDayForecastHeader.classList = "col-12";
  fiveDayForecastHeader.textContent = "5-Day Forecast:";

  fiveDayContainerEl.appendChild(fiveDayForecastHeader);

  console.log(city);
  console.log(city.city.name);

  for (var i = 5; i < city.list.length; i = i + 8) {
    var forecastContainer = document.createElement("div");
    forecastContainer.classList = "bg-primary rounded p-2 text-light";

    fiveDayContainerEl.appendChild(forecastContainer);

    var date = document.createElement("p");
    date.classList = "mb-8";
    dt = city.list[i].dt * 1000;
    var formatDate = new Date(dt);
    date.textContent = formatDate.toLocaleDateString();
    forecastContainer.appendChild(date);

    var icon = document.createElement("img");
    icon.classList = "mt-0 mb-0";
    icon.setAttribute(
      "src",
      "http://openweathermap.org/img/w/" + city.list[i].weather[0].icon + ".png"
    );
    forecastContainer.appendChild(icon);

    var temp = document.createElement("p");
    tempVal = city.list[i].main.temp;
    console.log(Math.round(tempVal));
    temp.textContent = "Temperature: " + Math.round(tempVal) + " \u00B0F";
    forecastContainer.appendChild(temp);

    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + city.list[i].main.humidity + "%";
    forecastContainer.appendChild(humidity);
  }

  // console.log(city.list[5].dt_txt);
  // console.log(city.list[5].weather[0].icon);
  // console.log(city.list[5].main.temp);
  // console.log(city.list[5].main.humidity);

  // console.log(city.list[13].dt_txt);
  // console.log(city.list[13].weather[0].icon);
  // console.log(city.list[13].main.temp);
  // console.log(city.list[13].main.humidity);

  // console.log(city.list[21].dt_txt);
  // console.log(city.list[21].weather[0].icon);
  // console.log(city.list[21].main.temp);
  // console.log(city.list[21].main.humidity);

  // console.log(city.list[29].dt_txt);
  // console.log(city.list[29].weather[0].icon);
  // console.log(city.list[29].main.temp);
  // console.log(city.list[29].main.humidity);

  // console.log(city.list[37].dt_txt);
  // console.log(city.list[37].weather[0].icon);
  // console.log(city.list[37].main.temp);
  // console.log(city.list[37].main.humidity);

  // var cityName = city.name;
  // var todaysDate = moment().format("(MM/DD/YYYY)");
  // var cityIcon = city.weather[0].icon;
};

var getFiveDayWeather = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=2c1cfa7d8c1ab09dbd43af544129557a";
  console.log(apiUrl);
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayFiveDayWeather(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to Open Weather");
    });
};

var displaySearchHistory = function (city) {
  pastCityBtnEl = document.createElement("button");
  pastCityBtnEl.classList = "history-button d-block w-100 text-align-left p-2";
  pastCityBtnEl.setAttribute("id", city);
  // pastCityBtnEl.setAttribute("onclick", "(this.id)");
  pastCityBtnEl.textContent = city;
  searchHistoryContainerEl.appendChild(pastCityBtnEl);
};

var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element

  var cityName = cityInputEl.value.trim();

  if (cityName) {
    getCityWeather(cityName);
    getFiveDayWeather(cityName);
    displaySearchHistory(cityName);
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

var btnSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = $(this).getElementById();
  console.log(cityName);
  getCityWeather(cityName);
  getFiveDayWeather(cityName);
};

cityFormEl.addEventListener("submit", formSubmitHandler);
historyBtnEl.addEventListener("click", btnSubmitHandler);
