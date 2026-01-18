const tabs = document.querySelectorAll(".tab");
const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const searchBtn = document.getElementById("searchBtn");
const weatherBox = document.getElementById("weatherBox");

const addTripBtn = document.getElementById("addTripBtn");
const tripList = document.getElementById("tripList");

const WEATHER_API = {
  KEY: "bd5e378503939ddaee76f12ad7a97608",
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather"
};

let currentTab = "flights";

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    currentTab = tab.dataset.type;
    updateInputs();
  });
});

function updateInputs() {
  if (currentTab === "hotels") {
    fromInput.placeholder = "City";
    toInput.style.display = "none";
  } else {
    fromInput.placeholder = "From";
    toInput.style.display = "block";
    toInput.placeholder = "To";
  }
}

searchBtn.addEventListener("click", () => {
  if (!fromInput.value) {
    alert("Please enter location details");
    return;
  }

  if (!startDate.value) {
    alert("Please select a start date");
    return;
  }

  if (endDate.value && startDate.value > endDate.value) {
    alert("End date cannot be before start date");
    return;
  }

  showSearchSummary();

  const city = currentTab === "hotels" ? fromInput.value : toInput.value;
  if (city) getWeather(city);
});

async function getWeather(city) {
  try {
    const response = await fetch(
      `${WEATHER_API.BASE_URL}?q=${city}&units=metric&appid=${WEATHER_API.KEY}`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      weatherBox.style.display = "block";
      weatherBox.innerHTML = "❌ Weather data not found";
      return;
    }

    weatherBox.style.display = "block";
    weatherBox.innerHTML = `
      🌤️ <b>${data.name}</b><br>
      🌡️ Temperature: ${data.main.temp}°C<br>
      ☁️ Condition: ${data.weather[0].description}<br>
      💨 Wind: ${data.wind.speed} km/h
    `;
  } catch (error) {
    weatherBox.style.display = "block";
    weatherBox.innerHTML = "⚠️ Error loading weather data";
  }
}

function showSearchSummary() {
  let message = "";

  if (currentTab === "flights") {
    message = `✈️ Searching flights from ${fromInput.value} to ${toInput.value}`;
  } else if (currentTab === "hotels") {
    message = `🏨 Searching hotels in ${fromInput.value}`;
  } else {
    message = `🌴 Searching holiday packages for ${fromInput.value}`;
  }

  alert(`${message}\n\n📅 Date: ${startDate.value}`);
}

addTripBtn.addEventListener("click", () => {
  const destination = document.getElementById("tripDestination").value;
  const start = document.getElementById("tripStart").value;
  const end = document.getElementById("tripEnd").value;
  const notes = document.getElementById("tripNotes").value;

  if (!destination || !start) {
    alert("Please enter destination and start date");
    return;
  }

  const tripDiv = document.createElement("div");
  tripDiv.classList.add("trip-item");

  tripDiv.innerHTML = `
    <h4>📍 ${destination}</h4>
    <p>📅 ${start} ${end ? "→ " + end : ""}</p>
    <p>📝 ${notes || "No notes added"}</p>
  `;

  tripList.appendChild(tripDiv);

  document.getElementById("tripDestination").value = "";
  document.getElementById("tripStart").value = "";
  document.getElementById("tripEnd").value = "";
  document.getElementById("tripNotes").value = "";
});
