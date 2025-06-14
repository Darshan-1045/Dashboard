// Initialize Chart.js
const ctx = document.getElementById('cryptoChart').getContext('2d');
let chartData = {
  labels: [],
  datasets: [{
    label: 'Bitcoin (USD)',
    data: [],
    backgroundColor: 'rgba(255, 206, 86, 0.2)',
    borderColor: 'rgba(255, 206, 86, 1)',
    borderWidth: 2
  }]
};

const cryptoChart = new Chart(ctx, {
  type: 'line',
  data: chartData,
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: false }
    }
  }
});

// Fetch Crypto Data
async function fetchCryptoData(){
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  const data = await res.json();
  return data.bitcoin.usd;
}

// Update Crypto Chart
async function updateCryptoChart() {
  const price = await fetchCryptoData();
  const now = new Date().toLocaleTimeString();
  chartData.labels.push(now);
  chartData.datasets[0].data.push(price);

  if (chartData.labels.length > 10) {
    chartData.labels.shift();
    chartData.datasets[0].data.shift();
  }

  cryptoChart.update();
}

// Fetch Weather Data
async function fetchWeather() {
  const apiKey = 'f593a0c683939642bb99650568cbd2e1'; // Replace with your OpenWeatherMap API key
  const city = 'Bangalore';
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  return {
    temp: data.main.temp,
    humidity: data.main.humidity,
    description: data.weather[0].description
  };
}

// Display Weather Data
async function displayWeather() {
  const weather = await fetchWeather();
  document.getElementById('weatherData').innerHTML = `
    <p>🌡️ Temperature: ${weather.temp}°C</p>
    <p>💧 Humidity: ${weather.humidity}%</p>
    <p>☁️ Condition: ${weather.description}</p>
  `;
}

// Initial Calls
updateCryptoChart();
displayWeather();

// Set Intervals
setInterval(updateCryptoChart, 5000); // every 5 seconds
setInterval(displayWeather, 60000);   // every 60 seconds
