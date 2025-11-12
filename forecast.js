// forecast.js (With Staggered Card Animation)

const getForecastBtn = document.getElementById('getForecastBtn');
const forecastCity = document.getElementById('forecastCity');
const forecastResults = document.getElementById('forecastResults');

const weatherIcons = {
  0: 'wi-day-sunny', 1: 'wi-day-sunny-overcast', 2: 'wi-day-cloudy', 3: 'wi-cloudy',
  45: 'wi-fog', 48: 'wi-fog', 51: 'wi-sprinkle', 53: 'wi-sprinkle', 55: 'wi-sprinkle',
  61: 'wi-rain', 63: 'wi-rain', 65: 'wi-rain', 71: 'wi-snow', 73: 'wi-snow',
  75: 'wi-snow', 80: 'wi-showers', 81: 'wi-showers', 82: 'wi-showers',
  95: 'wi-thunderstorm', 96: 'wi-thunderstorm', 99: 'wi-thunderstorm',
};

async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
  const response = await fetch(geoUrl);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return { lat: data.results[0].latitude, lon: data.results[0].longitude };
  } else {
    alert('City not found!');
    return null;
  }
}

async function getForecast(city) {
  const coords = await getCoordinates(city);
  if (!coords) return;

  // Add loading spinner to button
  getForecastBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
  getForecastBtn.disabled = true;

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    forecastResults.innerHTML = ''; // Clear previous results

    const days = data.daily.time;
    const tempMax = data.daily.temperature_2m_max;
    const tempMin = data.daily.temperature_2m_min;
    const weatherCode = data.daily.weathercode;

    for (let i = 0; i < days.length; i++) {
      const iconClass = weatherIcons[weatherCode[i]] || 'wi-day-sunny';
      const dayName = new Date(days[i]).toLocaleDateString('en-US', { weekday: 'long' });

      const card = document.createElement('div');
      card.className = 'col-md-3';
      card.innerHTML = `
        <div class="card text-dark mb-3">
          <div class="card-body text-center">
            <h5 class="card-title">${dayName}</h5>
            <p class="card-text text-muted small">${days[i]}</p>
            <i class="wi ${iconClass}"></i>
            <p class="card-text mt-2 fs-5">Max: ${tempMax[i]}°C</p>
            <p class="card-text fs-6">Min: ${tempMin[i]}°C</p>
          </div>
        </div>
      `;
      
      // NEW: Apply staggered animation
      card.style.animation = `fadeIn 0.5s ease-out ${i * 0.1}s forwards`;
      
      forecastResults.appendChild(card);
    }
  } catch (error) {
    alert('Failed to fetch forecast.');
    console.error(error);
  } finally {
    // Restore button
    getForecastBtn.innerHTML = 'Get Forecast';
    getForecastBtn.disabled = false;
  }
}

getForecastBtn.addEventListener('click', () => {
  const city = forecastCity.value.trim();
  if (city) getForecast(city);
});