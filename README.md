# 🌤️ WeatherPro - Advanced Weather PWA

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple.svg)

**WeatherPro** is a fully responsive, Progressive Web Application (PWA) that provides real-time weather updates, 7-day forecasts, and interactive location mapping. Built with a modern glassmorphism UI, it leverages the Open-Meteo API for accurate data without requiring API keys.

---

## 🚀 Key Features

* **📍 Geolocation Support:** Automatically detects user location to fetch local weather.
* **🎨 Dynamic UI:** Background gradients change dynamically based on weather conditions (Clear, Rain, Thunderstorm, etc.).
* **📅 7-Day Forecast:** Staggered animation cards showing daily max/min temperatures and weather icons.
* **🗺️ Interactive Maps:** Integrated **Leaflet.js** map to visualize searched cities.
* **📱 PWA Capable:** Includes `manifest.json` and `service worker` for installation on mobile devices.
* **⚡ Real-time Data:** Fetches Temperature, Wind, Humidity, Pressure, and Sunrise/Sunset times.
* **✨ Glassmorphism Design:** Modern, translucent UI components using CSS3 backdrop-filters.

---

## 🛠️ Tech Stack & APIs

### Frontend
| Technology | Usage |
| :--- | :--- |
| **HTML5** | Semantic structure and SEO |
| **CSS3** | Custom properties (variables), Flexbox, CSS Grid, Keyframe Animations |
| **JavaScript (ES6+)** | Async/Await, Fetch API, DOM Manipulation |
| **Bootstrap 5** | Responsive grid system and UI components |
| **Leaflet.js** | Interactive maps rendering |

### APIs Used
* **[Open-Meteo API](https://open-meteo.com/):** For Weather Forecasts & Geocoding (No API Key required).
* **[OpenStreetMap (Nominatim)](https://nominatim.org/):** For Reverse Geocoding (Coords to City Name).

---

## 📂 Project Structure

```text
WeatherPro/
├── index.html          # Main Dashboard (Current Weather)
├── forecast.html       # 7-Day Forecast Page
├── map.html            # Interactive Map Page
├── about.html          # App Info
├── style.css           # Global Styles & Glassmorphism Effects
├── index.js            # Logic for Current Weather & Dynamic Backgrounds
├── forecast.js         # Logic for 7-Day Data Fetching
├── map.js              # Leaflet Map Initialization
├── main.js             # Service Worker Registration
├── sw.js               # Service Worker (PWA caching)
└── manifest.json       # PWA Configuration
