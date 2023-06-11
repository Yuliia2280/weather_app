function formatDate(timestamp) {
  let date = new Date(timestamp);
  let offset = date.getTimezoneOffset();
  let local = new Date(date.getTime() + offset * 60000);
  let dayIndex = local.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  let currentDate = local.getDate();
  let monthIndex = local.getMonth();
  let months = [
    "January",
    "Fabruary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[monthIndex];
  let hours = local.getHours();
  if (hours < 10) hours = `0${hours}`;
  let minutes = local.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;
  let formattedDate = `${day}, ${currentDate} ${month}, ${hours}:${minutes}`;
  return formattedDate;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  //console.log(forecast);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row mt-5">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
              <div class="weather-forecast-date" id="day1">${formatDay(
                forecastDay.dt
              )}</div>
              <div class="weather-forecast-temperature">
                <span class="weather-forecast-temperature-max"> ${Math.round(
                  forecastDay.temp.max
                )}º </span>
                <span class="weather-forecast-temperature-min"> ${Math.round(
                  forecastDay.temp.min
                )}º </span>
              </div>
              <img
                src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt=""
                width="50"
              />
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function remove_extra_char_spaces_within_a_string(city) {
  //удаляет лишние знаки и пробелы в строке
  city = city.trim();
  let city1 = city.split(" ");
  city1 = city1.filter(function (value) {
    return value !== "";
  });
  city = city1.join(" ");
  city = city.replace(/[^a-zа-яё\s]/gi, "");
  //удаляем все кроме букв и пробелов
  return city;
}

function correctSpellingCityName(city) {
  // каждое слово в названии города заменяет на заглавную
  for (let index = 0; index < city.length - 1; index++) {
    if (city[index] === " " && city[index + 1] !== " ") {
      city = city.replace(city[index + 1], city[index + 1].toUpperCase());
    }
  }
  city = city.charAt(0).toUpperCase() + city.slice(1);
  return city;
}

function getForecast(coordinates) {
  let apiKey = "445905dadb3d2b0c6f1b916c9d0e3860";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(`${apiUrl}`).then(displayForecast);
}

function showTemp() {
  let cityInput = document.querySelector("#city-input").value;
  let apiKey = "445905dadb3d2b0c6f1b916c9d0e3860";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=${unit}`;
  axios.get(`${apiUrl}`).then(displayWeatherCondition);
}

function displayWeatherCondition(response) {
  let city = response.data.name;
  let country = response.data.sys.country;
  let description = response.data.weather[0].description.toUpperCase();
  let humidity = response.data.main.humidity;
  let wind = Math.round(response.data.wind.speed);
  local = (response.data.dt + response.data.timezone) * 1000;
  celsiusTemperature = Math.round(response.data.main.temp);
  document.querySelector("#city-input").value = `${city}`;
  document.querySelector(".city").innerHTML = `${city}, ${country}`;
  document.querySelector("#description").innerHTML = `${description}`;
  document.querySelector("#humidity").innerHTML = `${humidity}`;
  if (unit === "metric") {
    document.querySelector("#wind").innerHTML = `${wind} meter/sec`;
  } else {
    document.querySelector("#wind").innerHTML = `${wind} miles/hour`;
  }
  document.querySelector("#day").innerHTML = formatDate(local);
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", `${response.data.weather[0].description}`);

  if (celsiusTemperature > 0) {
    document.querySelector("#currentTemp").innerHTML = `+${celsiusTemperature}`;
  } else {
    document.querySelector("#currentTemp").innerHTML = `${celsiusTemperature}`;
  }
  getForecast(response.data.coord);
}

function showTempCelsius() {
  unit = "metric";
  document.querySelector("#flexRadioCelsius").checked = "true";
  searchCity(cityInput.value);
}

function showTempFahrenheit() {
  unit = "imperial";
  document.querySelector("#flexRadioFahrenheit").checked = "true";
  searchCity(cityInput.value);
}

function searchCity(city) {
  let apiKey = "445905dadb3d2b0c6f1b916c9d0e3860";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(`${apiUrl}`).then(displayWeatherCondition);
}

function searchCityInput(event) {
  event.preventDefault();
  cityInput.value = cityInput.value.toLowerCase();
  cityInput.value = remove_extra_char_spaces_within_a_string(cityInput.value);
  cityInput.value = correctSpellingCityName(cityInput.value);
  searchCity(cityInput.value);
}

function showWeather_currentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "445905dadb3d2b0c6f1b916c9d0e3860";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(`${apiUrl}`).then(displayWeatherCondition);
}

function searchLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showWeather_currentLocation);
}

let celsiusTemperature = null;
let local = null;
let unit = "metric";
let cityInput = document.querySelector("#city-input");
searchCity("Kyiv");

document
  .querySelector("#id-search-form")
  .addEventListener("submit", searchCityInput);

document
  .querySelector("#currentLocation")
  .addEventListener("click", searchLocation);

document
  .querySelector("#flexRadioFahrenheit")
  .addEventListener("click", showTempFahrenheit);

document
  .querySelector("#flexRadioCelsius")
  .addEventListener("click", showTempCelsius);
