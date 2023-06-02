function formatDate(timestamp) {
  let date = new Date(timestamp);
  console.log(date);
  let offset = date.getTimezoneOffset();
  console.log(offset);
  let local = new Date(date.getTime() + offset * 60000);
  console.log(local);
  let dayIndex = local.getDay();
  console.log(dayIndex);
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

function showTemp() {
  let cityInput = document.querySelector("#city-input").value;
  let apiKey = "25fad9f7e87157d33dde0f82ab269ee8";
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
  let local = (response.data.dt + response.data.timezone) * 1000;

  document.querySelector("#city-input").value = `${city}`;
  document.querySelector(".city").innerHTML = `${city}, ${country}`;
  document.querySelector("#description").innerHTML = `${description}`;
  document.querySelector("#humidity").innerHTML = `${humidity}`;
  document.querySelector("#wind").innerHTML = `${wind}`;
  document.querySelector("#day").innerHTML = formatDate(local);

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

function searchCity(city) {
  let apiKey = "25fad9f7e87157d33dde0f82ab269ee8";
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

searchCity("Kyiv");

document
  .querySelector("#id-search-form")
  .addEventListener("submit", searchCityInput);

document
  .querySelector("#currentLocation")
  .addEventListener("click", searchLocation);

document.querySelector("#flexRadioCelsius").addEventListener("click", showTemp);

document
  .querySelector("#flexRadioFahrenheit")
  .addEventListener("click", showTemp);
