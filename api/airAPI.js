mapboxgl.accessToken = MAPBOX_KEY;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  center: [-98.35, 39.50],
  zoom: 4
});

document.getElementById("fetchData").addEventListener("click", fetchAirPollutionData);

async function fetchAirPollutionData() {
  const features = [];

  for (const state of stateCoordinates) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${state.lat}&lon=${state.lon}&appid=${WEATHER_API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error ${response.status} for ${state.name}`);

      const data = await response.json();
      console.log(data);
      if (data.list && data.list.length > 0) {
        const airQuality = data.list[0].main.aqi;
        const pollutantsCo = data.list[0].components.co;
        const pollutantsNo = data.list[0].components.no;
        const pollutantsNo2 = data.list[0].components.no2;
        const pollutantsO3 = data.list[0].components.o3;
        const pollutantsSo2 = data.list[0].components.so2;
        const pollutantsPm25 = data.list[0].components.pm2_5;
        const pollutantsPm10 = data.list[0].components.pm10;
        const pollutantsNh3 = data.list[0].components.nh3;

        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [state.lon, state.lat]
          },
          properties: {
            name: state.name,
            airQuality,
            pollutantsCo,
            pollutantsNo,
            pollutantsNo2,
            pollutantsO3,
            pollutantsSo2,
            pollutantsPm25,
            pollutantsPm10,
            pollutantsNh3
          }
        });
      }
    } catch (error) {
      console.error(`Failed to fetch air pollution data for ${state.name}:`, error);
    }
  }

  if (features.length > 0) {
    addPointsLayer(features);
  } else {
    console.error("No features were created. Check API responses and coordinates.");
  }
}

function addPointsLayer(features) {
  if (!map.getSource('air-pollution')) {
    map.addSource('air-pollution', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features
      }
    });

    map.addLayer({
      id: 'air-pollution-points',
      type: 'circle',
      source: 'air-pollution',
      paint: {
        'circle-radius': 12,
        'circle-color': [
          "match",
          ["get", "airQuality"],
          1, "green",
          2, "yellow",
          3, "orange",
          4, "red",
          5, "purple",
          "gray"
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 2,
        'circle-opacity': 0.7
      }
    });

    map.on('click', 'air-pollution-points', (event) => {
      const { name, airQuality, pollutantsCo, pollutantsNo, pollutantsNo2, pollutantsO3, pollutantsSo2, pollutantsPm25, pollutantsPm10, pollutantsNh3 } = event.features[0].properties;
      const color = getAQIColor(airQuality);

      new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`
          <strong>${name}</strong><br>
          AQI: <span style="color:${color}; font-weight:bold;">${airQuality}</span><br>
          CO: ${pollutantsCo} µg/m³<br>
          NO: ${pollutantsNo} µg/m³<br>
          NO₂: ${pollutantsNo2} µg/m³<br>
          O₃: ${pollutantsO3} µg/m³<br>
          SO₂: ${pollutantsSo2} µg/m³<br>
          PM2.5: ${pollutantsPm25} µg/m³<br>
          PM10: ${pollutantsPm10} µg/m³<br>
          NH₃: ${pollutantsNh3} µg/m³
        `)
        .addTo(map);
    });
  } else {
    console.warn("Source or layer already exists.");
    map.getSource('air-pollution').setData({
      type: 'FeatureCollection',
      features
    });
  }
}

function getAQIColor(aqi) {
  switch (aqi) {
    case 1:
      return "green";
    case 2:
      return "yellow";
    case 3:
      return "orange";
    case 4:
      return "red";
    case 5:
      return "purple";
    default:
      return "gray";
  }
}