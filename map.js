// map.js

const showMapBtn = document.getElementById('showMapBtn');
const mapCity = document.getElementById('mapCity');
let map;

// Function to get coordinates
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

// Simple map without weather overlay
function initMap(lat, lon) {
  if (map) {
    map.remove(); // Remove previous map instance if exists
  }
  map = L.map('map').setView([lat, lon], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup(`Location: ${mapCity.value}`)
    .openPopup();
}

// Event listener
showMapBtn.addEventListener('click', async () => {
  const city = mapCity.value.trim();
  if (!city) return;
  const coords = await getCoordinates(city);
  if (coords) {
    initMap(coords.lat, coords.lon);
  }
});