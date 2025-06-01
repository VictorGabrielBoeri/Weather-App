const apiKey = "42a45de446e9e7a06264855601d80501";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const weatherIcon = document.getElementById("weather-icon");
const cityElement = document.getElementById("city");
const dateElement = document.getElementById("date");
const tempElement = document.getElementById("temp");
const descriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const feelsLikeElement = document.getElementById("feels-like");

const suggestionsBox = document.createElement("div");
suggestionsBox.className = "suggestions-box";
searchInput.parentNode.appendChild(suggestionsBox);

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("pt-BR", options);
}

async function getCitySuggestions(query) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar sugestões");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    return [];
  }
}

function displaySuggestions(suggestions) {
  suggestionsBox.innerHTML = "";

  if (suggestions.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  suggestions.forEach((city) => {
    const suggestion = document.createElement("div");
    suggestion.className = "suggestion-item";
    suggestion.textContent = `${city.name}, ${city.country}`;

    suggestion.addEventListener("click", () => {
      searchInput.value = `${city.name}, ${city.country}`;
      suggestionsBox.style.display = "none";
      getWeather(city.name);
    });

    suggestionsBox.appendChild(suggestion);
  });

  suggestionsBox.style.display = "block";
}

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Cidade não encontrada");
    }

    const data = await response.json();

    cityElement.textContent = data.name;
    dateElement.textContent = formatDate(data.dt);
    tempElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `${data.main.humidity}%`;
    windElement.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.querySelector(".weather-box").style.display = "block";
  } catch (error) {
    alert(
      "Erro ao buscar o clima. Verifique se o nome da cidade está correto."
    );
  }
}

let timeoutId;
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();

  clearTimeout(timeoutId);

  if (query.length < 3) {
    suggestionsBox.style.display = "none";
    return;
  }

  timeoutId = setTimeout(async () => {
    const suggestions = await getCitySuggestions(query);
    displaySuggestions(suggestions);
  }, 300);
});

searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) {
      getWeather(city);
    }
  }
});

document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.style.display = "none";
  }
});

getWeather("São Paulo");
