var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-search-input");
var currentContainerEl = document.querySelector("#current-container");
var fiveDayContainerEl = document.querySelector("#five-day-container");
var weatherEl = document.createElement("div");
var searchHistoryContainerEl = document.querySelector(
  "#search-history-container"
);
var historyBtnEl = document.querySelector(".history-button");
var cityList = JSON.parse(localStorage.getItem("city")) || [];

// load search history on page load
var loadDashboard = function (cityList) {
  $("#search-history-container").empty();

  // loop through array in local storage and render them to page
  for (var i = 0; i < cityList.length; i++) {
    var cityListItem = document.createElement("button");
    cityListItem.setAttribute("id", cityList[i]);
    cityListItem.classList = "history-button d-block w-100 text-align-left p-2";
    cityListItem.textContent = cityList[i];

    searchHistoryContainerEl.prepend(cityListItem);
  }
};

// fetch Open Weather Map Api and gather data on city submitted
var getCityWeather = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=2c1cfa7d8c1ab09dbd43af544129557a";
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data, city);
          getFiveDayWeather(city);
        });
      } else {
        // error message if an invalid entery/city is submitted
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // catch set up incase Open Weather is down or internet is disconnected
      alert("Unable to connect to Open Weather");
    });
};

// seperate function to gather UV Index Information and display to page.
var displayUVIndex = function (data) {
  var cityUV = data.value;

  var cityUVEl = document.createElement("p");
  cityUVEl.classList = "list-item flex-row align-left";
  cityUVEl.textContent = "UV Index: ";
  var cityUVSpan = document.createElement("span");
  if (data.value === 11 || data.value > 11) {
    cityUVSpan.classList = "bg-dark rounded p-1 text-white";
  }
  if (data.value > 7 && data.value < 11) {
    cityUVSpan.classList = "bg-danger rounded p-1 text-white";
  }
  if (data.value > 2 && data.value < 8) {
    cityUVSpan.classList = "bg-warning rounded p-1 text-white";
  } else if (data.value === 2 || data.value < 2) {
    cityUVSpan.classList = "bg-success rounded p-1 text-white";
  }
  cityUVSpan.textContent = cityUV;
  cityUVEl.appendChild(cityUVSpan);
  weatherEl.appendChild(cityUVEl);
};

// using submitted city to gather needed data and append to current weather forcast
var displayWeather = function (city) {
  // clear old content
  currentContainerEl.innerHTML = "";
  weatherEl.innerHTML = "";

  currentContainerEl.classList =
    "list-group border border-primary rounded p-3 m-2";

  // current weather forcast items
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

  var cityEl = document.createElement("div");
  cityEl.classList = "list-item flex-row justify-space-between align-left";

  var titleEl = document.createElement("h1");
  titleEl.textContent = weatherTitle;

  titleEl.appendChild(iconImgSpan);

  cityEl.appendChild(titleEl);

  weatherEl.classList = "flex-row align-center";

  // get city temmp
  var cityTemp = city.main.temp;
  var cityTempEl = document.createElement("p");
  cityTempEl.classList = "list-item flex-row align-left";
  cityTempEl.textContent = "Temperature: " + Math.round(cityTemp) + " \u00B0F";
  weatherEl.appendChild(cityTempEl);

  // get city humidity
  var cityHumid = city.main.humidity;
  var cityHumidEl = document.createElement("p");
  cityHumidEl.classList = "list-item flex-row align-left";
  cityHumidEl.textContent = "Humidity: " + cityHumid + "%";
  weatherEl.appendChild(cityHumidEl);

  // get city wind speed
  var cityWind = city.wind.speed;
  var cityWindEl = document.createElement("p");
  cityWindEl.classList = "list-item flex-row align-left";
  cityWindEl.textContent =
    "Wind Speed: " + Math.round(cityWind * 10) / 10 + " MPH";
  weatherEl.appendChild(cityWindEl);

  // set up fetch for Open Weather Map UVI
  var cityLatitude = city.coord.lat;
  var cityLongitude = city.coord.lon;

  fetch(
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      cityLatitude +
      "&lon=" +
      cityLongitude +
      "&appid=2c1cfa7d8c1ab09dbd43af544129557a"
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // push data to displayUVIndex function
        displayUVIndex(data);
      });
    }
  });

  // append to container
  cityEl.appendChild(weatherEl);

  // append container to the dom
  currentContainerEl.appendChild(cityEl);
};

// display 5 day weather forcast
var displayFiveDayWeather = function (city) {
  // clear old content
  fiveDayContainerEl.innerHTML = "";

  fiveDayContainerEl.classList =
    "row d-flex justify-content-around border border-primary rounded p-3 m-2";

  var fiveDayForecastHeader = document.createElement("h2");
  fiveDayForecastHeader.classList = "col-12";
  fiveDayForecastHeader.textContent = "5-Day Forecast:";

  fiveDayContainerEl.appendChild(fiveDayForecastHeader);

  // loop through 5 days of data to render a 5 day forcast
  for (var i = 5; i < city.list.length; i = i + 8) {
    var forecastContainer = document.createElement("div");
    forecastContainer.classList = "bg-primary rounded p-2 text-light";

    fiveDayContainerEl.appendChild(forecastContainer);

    // get date
    var date = document.createElement("p");
    date.classList = "mb-8";
    dt = city.list[i].dt * 1000;
    var formatDate = new Date(dt);
    date.textContent = formatDate.toLocaleDateString();
    forecastContainer.appendChild(date);

    // get icon
    var icon = document.createElement("img");
    icon.classList = "mt-0 mb-0";
    icon.setAttribute(
      "src",
      "http://openweathermap.org/img/w/" + city.list[i].weather[0].icon + ".png"
    );
    forecastContainer.appendChild(icon);

    // get temp
    var temp = document.createElement("p");
    tempVal = city.list[i].main.temp;
    temp.textContent = "Temperature: " + Math.round(tempVal) + " \u00B0F";
    forecastContainer.appendChild(temp);

    // get humidty
    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + city.list[i].main.humidity + "%";
    forecastContainer.appendChild(humidity);
  }
};

// display city search history to page
var displaySearchHistory = function (city) {
  // loop through array to get each city and splice for duplicates
  for (var i = 0; i < cityList.length; i++) {
    console.log(cityList[i]);
    if (city === cityList[i]) {
      cityList.splice(i, 1);
    }
  }

  // push new city to array
  cityList.push(city);

  // save array
  localStorage.setItem("city", JSON.stringify(cityList));

  // return to loadDashboard to load search history to page
  loadDashboard(cityList);
};

var getFiveDayWeather = function (city) {
  // fetch Open Weather Map 5-Day Forcast with API and Key
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=2c1cfa7d8c1ab09dbd43af544129557a";

  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayFiveDayWeather(data, city);
          displaySearchHistory(city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
    });
};

// when city is submitted run formSubmit Handler
var formSubmitHandler = function (event) {
  event.preventDefault();

  // get value from input element
  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCityWeather(cityName);
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

// when a city from search history is clicked
var btnSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = event.target.textContent;

  getCityWeather(cityName);
};

loadDashboard(cityList);
cityFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryContainerEl.addEventListener("click", btnSubmitHandler);
