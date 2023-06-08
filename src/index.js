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
function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let currentDate = new Date(local);
  let index = currentDate.getDay();
  let i = 0;
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let daysTransform = [];
  console.log(daysTransform);
  do {
    if (index < 7) {
      daysTransform[i] = days[index];
    } else {
      index = 0;
      daysTransform[i] = days[index];
    }
    i = i + 1;

    index = index + 1;
  } while (i < 6);

  let forecastHTML = `<div class="row mt-5">`;

  daysTransform.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
              <div class="weather-forecast-date" id="day1">${day}</div>
              <div class="weather-forecast-temperature">
                <span class="weather-forecast-temperature-max"> 18° </span>
                <span class="weather-forecast-temperature-min"> 10° </span>
              </div>
              <img
                src="http://openweathermap.org/img/wn/04d@2x.png"
                alt=""
                width="50"
              />
            </div>`;
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
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(`${apiUrl}`).then(displayForecast);
}

function showTemp() {
  let cityInput = document.querySelector("#city-input").value;
  let apiKey = "445905dadb3d2b0c6f1b916c9d0e3860";
  //let apiKey = "25fad9f7e87157d33dde0f82ab269ee8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(displayWeatherCondition);
}

function displayWeatherCondition(response) {
  let city = response.data.name;
  let country = response.data.sys.country;
  let description = response.data.weather[0].description.toUpperCase();
  let humidity = response.data.main.humidity;
  let wind = Math.round(response.data.wind.speed);
  let temperature = Math.round(response.data.main.temp);
  local = (response.data.dt + response.data.timezone) * 1000;
  celsiusTemperature = Math.round(response.data.main.temp);
  document.querySelector("#city-input").value = `${city}`;
  document.querySelector(".city").innerHTML = `${city}, ${country}`;
  document.querySelector("#description").innerHTML = `${description}`;
  document.querySelector("#humidity").innerHTML = `${humidity}`;
  document.querySelector("#wind").innerHTML = `${wind}`;
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
  document.querySelector("#flexRadioCelsius").checked = true;
  if (celsiusTemperature > 0) {
    document.querySelector("#currentTemp").innerHTML = `+${celsiusTemperature}`;
  } else {
    document.querySelector("#currentTemp").innerHTML = `${celsiusTemperature}`;
  }
  getForecast(response.data.coord);
}

function showTempCelsius() {
  let current_temp = document.querySelector("#currentTemp");
  if (celsiusTemperature > 0) {
    current_temp.innerHTML = `+${celsiusTemperature}`;
  } else {
    current_temp.innerHTML = `${celsiusTemperature}`;
  }
}
function showTempFahrenheit() {
  let current_temp = document.querySelector("#currentTemp");
  if (celsiusTemperature > 0) {
    current_temp.innerHTML = `+${Math.round(
      (celsiusTemperature * 9) / 5 + 32
    )}`;
  } else {
    current_temp.innerHTML = `${Math.round((celsiusTemperature * 9) / 5 + 32)}`;
  }
}

function searchCity(city) {
  let apiKey = "445905dadb3d2b0c6f1b916c9d0e3860";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(displayWeatherCondition);
}

function searchCityInput(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  cityInput.value = cityInput.value.toLowerCase();
  cityInput.value = remove_extra_char_spaces_within_a_string(cityInput.value);
  cityInput.value = correctSpellingCityName(cityInput.value);
  searchCity(cityInput.value);
}

function showWeather_currentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let unit = "metric";
  let apiKey = "25fad9f7e87157d33dde0f82ab269ee8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(`${apiUrl}`).then(displayWeatherCondition);
}

function searchLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showWeather_currentLocation);
}

let celsiusTemperature = null;
let local = null;
document
  .querySelector("#id-search-form")
  .addEventListener("submit", searchCityInput);

document
  .querySelector("#currentLocation")
  .addEventListener("click", searchLocation);

document
  .querySelector("#flexRadioCelsius")
  .addEventListener("click", showTempCelsius);

document
  .querySelector("#flexRadioFahrenheit")
  .addEventListener("click", showTempFahrenheit);

searchCity("Kyiv");
