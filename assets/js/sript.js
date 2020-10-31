var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-search-input");
var currentContainerEl = document.querySelector("#current-container");
var fiveDayContainerEl = document.querySelector("#five-day-container");

var getCityWeather = function (city) {
  // format the github api url
  var apiUrl =
    "api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=2c1cfa7d8c1ab09dbd43af544129557a";
  console.log(apiUrl);
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(city);
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

var displayWeather = function (city) {
  // check if api returned weather
  // if (weather.length === 0) {
  //   repoContainerEl.textContent = "No repositories found.";
  //   return;
  // }

  // clear old content
  currentContainerEl.textContent = "";

  // loop over repos
  //for (var i = 0; i < repos.length; i++) {
  // format repo name
  var cityName = city.name + "/" + city.dt;

  // create a container for each repo
  var cityEl = document.createElement("div");
  cityEl.classList = "list-item flex-row justify-space-between align-left";

  // create a span element to hold repository name
  var titleEl = document.createElement("span");
  titleEl.textContent = cityName;

  // append to container
  cityEl.appendChild(titleEl);

  // create a status element
  var weatherEl = document.createElement("div");
  weatherEl.classList = "flex-row align-center";

  var cityTemp = city.main.temp;
  var cityTempEl = document.createElement("p");
  cityTempEl.classList = "list-item flex-row align-left";
  var tempEl = document.createElement("span");
  tempEl.textContent = cityTemp;
  weatherEl.appendChild(TempEl);

  var cityHumid = city.main.humidity;
  var cityHumidEl = document.createElement("p");
  cityHumidEl.classList = "list-item flex-row align-left";
  var humidEl = document.createElement("span");
  humidEl.textContent = cityHumid;
  weatherEl.appendChild(TempEl);

  var cityWind = city.wind.speed;
  var cityWindEl = document.createElement("p");
  cityWindEl.classList = "list-item flex-row align-left";
  var WindEl = document.createElement("span");
  wildEl.textContent = cityWind;
  weatherEl.appendChild(TempEl);

  // WHERE IS UV INDEX??????
  // var cityTemp = city.main.temp;
  // var cityTempEl = document.createElement("p");
  // cityTempEl.classList = "list-item flex-row align-left";
  // var TempEl = document.createElement("span");
  // TempEl.textContent = cityTemp;
  // weatherEl.appendChild(TempEl);

  //   // check if current repo has issues or not
  //   if (repos[i].open_issues_count > 0) {
  //     statusEl.innerHTML =
  //       "<i class='fas fa-times status-icon icon-danger'></i>" +
  //       repos[i].open_issues_count +
  //       " issue(s)";
  //   } else {
  //     statusEl.innerHTML =
  //       "<i class='fas fa-check-square status-icon icon-success'></i>";
  //   }

  // append to container
  cityEl.appendChild(weatherEl);

  // append container to the dom
  currentContainerEl.appendChild(cityEl);
};

var formSubmitHandler = function (event) {
  console.log("button clicked");
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

cityFormEl.addEventListener("submit", formSubmitHandler);
