// index.js (Corrected API URL)

window.onload = function() {
  const getWeatherBtn = document.getElementById('getWeatherBtn');
  const getLocationBtn = document.getElementById('getLocationBtn');
  const cityInput = document.getElementById('cityInput');
  const cityNameEl = document.getElementById('cityName');
  const weatherDetailsEl = document.getElementById('weatherDetails');
  const weatherCard = document.querySelector('.weather-card');

  // --- API Functions ---
  
  async function getCoordinates(city) {
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
    const response = await fetch(geoUrl);
    if (!response.ok) {
        throw new Error('Network error while searching for city.');
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('City not found. Please try again.');
    }
    return { 
      lat: data[0].lat, 
      lon: data[0].lon, 
      name: data[0].display_name
    };
  }

  async function reverseGeocode(lat, lon) {
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(geoUrl);
    if (!response.ok) {
        throw new Error('Network error while finding location.');
    }
    const data = await response.json();
    if (!data.display_name) {
      throw new Error('Could not find location name.');
    }
    return data.address.city || data.address.town || data.display_name;
  }

  async function getWeather(lat, lon) {
    // THIS IS THE CORRECTED LINE:
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,pressure_msl&daily=sunrise,sunset&timezone=auto`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Weather API error');
    const data = await response.json();

    const current = data.current_weather;
    const hourIndex = data.hourly.time.findIndex(time => time === current.time);

    return {
      temperature: current.temperature,
      windspeed: current.windspeed,
      winddirection: current.winddirection,
      weathercode: current.weathercode,
      humidity: data.hourly.relativehumidity_2m[hourIndex],
      pressure: data.hourly.pressure_msl[hourIndex],
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0]
    };
  }

  // --- UI Update Functions ---

  function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
        55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
        71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 80: "Slight rain showers",
        81: "Moderate rain showers", 82: "Violent rain showers", 95: "Thunderstorm"
    };
    return weatherCodes[code] || "Unknown";
  }

  function updateWeatherCard(city, weather) {
    const sunriseTime = new Date(weather.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(weather.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    cityNameEl.innerText = `City: ${city}`;
    const details = `
      <li><i class="wi wi-thermometer"></i> Temperature: ${weather.temperature}°C</li>
      <li><i class="wi wi-strong-wind"></i> Wind Speed: ${weather.windspeed} km/h</li>
      <li><i class="wi wi-wind-direction"></i> Wind Direction: ${weather.winddirection}°</li>
      <li><i class="wi wi-humidity"></i> Humidity: ${weather.humidity}%</li>
      <li><i class="wi wi-barometer"></i> Pressure: ${weather.pressure} hPa</li>
      <li><i class="wi wi-sunrise"></i> Sunrise: ${sunriseTime}</li>
      <li><i class="wi wi-sunset"></i> Sunset: ${sunsetTime}</li>
      <li><i class="wi ${getWeatherIcon(weather.weathercode)}"></i> Weather: ${getWeatherDescription(weather.weathercode)}</li>
    `;
    weatherDetailsEl.innerHTML = details;

    // --- NEW FEATURES ---
    
    // 1. Trigger dynamic background
    updateDynamicBackground(weather.weathercode);

    // 2. Trigger fade-in animation for the card
    weatherCard.classList.remove('fade-in-card');
    void weatherCard.offsetWidth;
    weatherCard.classList.add('fade-in-card');

    // 3. NEW: Staggered animation for list items
    const listItems = weatherDetailsEl.querySelectorAll('li');
    listItems.forEach((item, index) => {
      // Apply the animation with a staggered delay
      item.style.animation = `slideInFromLeft 0.5s ease-out ${index * 0.1}s forwards`;
    });
  }

  function getWeatherIcon(code) {
    if (code === 0) return 'wi-day-sunny';
    if (code >= 1 && code <= 3) return 'wi-day-cloudy';
    if (code === 45 || code === 48) return 'wi-fog';
    if (code >= 51 && code <= 65) return 'wi-rain';
    if (code >= 71 && code <= 75) return 'wi-snow';
    if (code >= 80 && code <= 82) return 'wi-showers';
    if (code >= 95) return 'wi-thunderstorm';
    return 'wi-day-sunny';
  }

  function updateDynamicBackground(code) {
    let gradient = 'linear-gradient(to right, #1e3c72, #72f3ee65)';
    if (code === 0) { // Clear sky
      gradient = 'linear-gradient(to top, #4481eb, #04befe)';
    } else if (code >= 1 && code <= 3) { // Cloudy
      gradient = 'linear-gradient(to top, #6e84a4, #b6c4d8)';
    } else if (code >= 51 && code <= 65) { // Rain
      gradient = 'linear-gradient(to top, #3a506b, #5c6b73)';
    } else if (code >= 95) { // Thunderstorm
      gradient = 'linear-gradient(to top, #232526, #414345)';
    }
    document.body.style.background = gradient;
  }

  function setLoadingState(isLoading) {
    if (isLoading) {
      getWeatherBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
      getWeatherBtn.disabled = true;
      getLocationBtn.disabled = true;
    } else {
      getWeatherBtn.innerHTML = 'Get Weather';
      getWeatherBtn.disabled = false;
      getLocationBtn.disabled = false;
    }
  }

  // --- Event Listeners ---
  
  getWeatherBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) return alert('Please enter a city name');

    setLoadingState(true);
    try {
      const coords = await getCoordinates(city);
      const weather = await getWeather(coords.lat, coords.lon);
      updateWeatherCard(coords.name, weather);
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  });

  getLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser.');
    }

    setLoadingState(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      try {
        const cityName = await reverseGeocode(lat, lon);
        const weather = await getWeather(lat, lon);
        updateWeatherCard(cityName, weather);
      } catch (error) {
        alert(error.message);
        console.error(error);
      } finally {
        setLoadingState(false);
      }
    }, (error) => {
      alert('Unable to retrieve your location. Please check permissions.');
      console.error(error);
      setLoadingState(false);
    });
  });

};