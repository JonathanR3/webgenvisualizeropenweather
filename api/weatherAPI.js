mapboxgl.accessToken = MAPBOX_KEY
const map = new mapboxgl.Map({
container: "map",
style: "mapbox://styles/mapbox/dark-v11",
center: [-98.35, 39.50],
zoom: 4
});

let currentWeatherLayer = null;

function addWeatherLayer(layerName) {
if (currentWeatherLayer && map.getLayer(currentWeatherLayer)) {
    map.removeLayer(currentWeatherLayer);
    map.removeSource(currentWeatherLayer);
}

const weatherTileURL = `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`;

map.addSource(layerName, {
    type: 'raster',
    tiles: [weatherTileURL],
    tileSize: 256,
});

map.addLayer({
    id: layerName,
    type: 'raster',
    source: layerName,
    paint: {
    'raster-opacity': 0.6
    }
});

currentWeatherLayer = layerName;
}

// Handle button click to fetch selected layer
document.getElementById('fetchData').addEventListener('click', () => {
const selectedLayer = document.getElementById('layerSelector').value;
addWeatherLayer(selectedLayer);
});

