function formatDate(date) {
  let dayIndex = date.getDay();
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
  let currentDate = date.getDate();
  let monthIndex = date.getMonth();
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
  let hours = date.getHours();
  if (hours < 10) hours = `0${hours}`;
  let minutes = date.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;
  let formattedDate = `${day}, ${currentDate} ${month}, ${hours}:${minutes}`;

  return formattedDate;
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
function showTempC() {
  let tempC = document.querySelector(".temperature");
  let tempF = Number(tempC.innerHTML);
  tempF = Math.round(((tempF - 32) * 5) / 9);
  if (tempF > 0) {
    tempC.innerHTML = `+${tempF}`;
  } else {
    tempC.innerHTML = `${tempF}`;
  }
}
function showTempF() {
  let tempF = document.querySelector(".temperature");
  let tempC = Number(tempF.innerHTML);
  tempC = Math.round((tempC * 9) / 5 + 32);
  if (tempC > 0) {
    tempF.innerHTML = `+${tempC}`;
  } else {
    tempF.innerHTML = `${tempC}`;
  }
}

function displayWeatherCondition(response) {
  //console.log(response.data);
  let city = response.data.name;
  let country = response.data.sys.country;
  let description = response.data.weather[0].description.toUpperCase();
  let humidity = response.data.main.humidity;
  let wind = Math.round(response.data.wind.speed);
  let temperature = Math.round(response.data.main.temp);
  document.querySelector("#city-input").value = `${city}`;
  document.querySelector(".city").innerHTML = `${city}, ${country}`;
  document.querySelector("#description").innerHTML = `${description}`;
  document.querySelector("#humidity").innerHTML = `${humidity}`;
  document.querySelector("#wind").innerHTML = `${wind}`;
  let current_temp = document.querySelector("#currentTemp");
  if (document.querySelector("#flexRadioCelsius").checked) {
    if (temperature > 0) {
      current_temp.innerHTML = `+${temperature}`;
    } else {
      current_temp.innerHTML = `${temperature}`;
    }
  } else {
    if (temperature > 0) {
      temperature = Math.round((temperature * 9) / 5 + 32);
      current_temp.innerHTML = `+${temperature}`;
    } else {
      temperature = Math.round((temperature * 9) / 5 + 32);
      current_temp.innerHTML = `${temperature}`;
    }
  }

  if (document.querySelector("#flexRadioFahrenheit")) {
    let f = document.querySelector("#flexRadioFahrenheit");
    f.addEventListener("click", showTempF);
  }

  if (document.querySelector("#flexRadioCelsius")) {
    let c = document.querySelector("#flexRadioCelsius");
    c.addEventListener("click", showTempC);
  }

  let currentDate = new Date();
  let index = currentDate.getDay();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let i = 0;
  do {
    i = i + 1;
    index = index + 1;
    if (index < 7) {
      document.querySelector("#day" + i).innerHTML = `${days[index]}`;
    } else {
      index = 0;
      document.querySelector("#day" + i).innerHTML = `${days[index]}`;
    }
  } while (i < 5);
}

/*function displayWeatherConditionForecast(response) {
  console.log(response.data);
  //let city = response.data.name;
}
*/
function searchCity(city) {
  let apiKey = "25fad9f7e87157d33dde0f82ab269ee8";
  //let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(displayWeatherCondition);
}
/*
function searchCityForecast(city) {
  let apiKey = "25fad9f7e87157d33dde0f82ab269ee8";
  //let unit = "metric";
  //let cnt = 5;
  let apiUrl1 = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=metric&cnt=7&appid=${apiKey}`;
  axios.get(`${apiUrl1}`).then(displayWeatherConditionForecast);
}
*/
function searchCityInput(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  cityInput.value = cityInput.value.toLowerCase();
  cityInput.value = remove_extra_char_spaces_within_a_string(cityInput.value);
  cityInput.value = correctSpellingCityName(cityInput.value);
  searchCity(cityInput.value);
  //searchCityForecast(cityInput.value);
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

let currentDate = new Date();

let showCurrentDate = document.querySelector(".date");
showCurrentDate.innerHTML = formatDate(currentDate);

searchCity("Warsaw");
let cityForm = document.querySelector("#id-search-form");
cityForm.addEventListener("submit", searchCityInput);

let currentLocation = document.querySelector("#currentLocation");
currentLocation.addEventListener("click", searchLocation);
