const search = document.getElementById("search");
const city = document.getElementById("data");
const form = document.getElementById("form");
const canvasBtn = document.getElementById("canvas");
const high = document.getElementById("high");
const low = document.getElementById("low");
const forecast = document.getElementById("forecast");
const humidity = document.getElementById("humidity");
const label = document.getElementById("offcanvasBottomLabel");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  city.innerHTML = "";
  getWeather(search.value);
});

search.addEventListener("input", () => searchCities(search.value));

const passVal = (val) => {
  search.value = val.value;
  form.dispatchEvent(new Event("submit"));
};

const debounce = (cb, delay = 250) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "5196cc9c05mshcf0c5863377022fp146c98jsnbc8edf15eb0d",
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
};

const showHTML = (data, input) => {
  if (data.data.length > 0) {
    const html = data.data
      .map(
        (info) =>
          `<button onclick="{passVal(this)}" value = "${info.city}" class = "btn btn-warning ms-2 my-1">${info.city} (${info.countryCode})</button><br>`
      )
      .join("");
    city.innerHTML = html;
  }

  if (input === "") {
    city.innerHTML = "";
  }
};

const searchCities = debounce((input) => {
  fetch(
    `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=350000&namePrefix=${input}`,
    options
  )
    .then((res) => res.json())
    .then((data) => {
      showHTML(data, input);
    })
    .catch((err) => {
      console.log(err);
    });
}, 900);

const getWeather = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=40110a829f9b93f3100f7c7c3bc3d6c4&units=imperial`
  );
  const data = await response.json();
  if (typeof data.message === "undefined") {
    label.innerText = `Current weather for ${data.name}`;
    high.innerText = `High: ${data.main.temp_max}°`;
    low.innerText = `Low: ${data.main.temp_min}°`;
    forecast.innerText = `Forecast: ${(() => {
      // converting first letter to uppercase
      return (
        data.weather[0].description.charAt(0).toUpperCase() +
        data.weather[0].description.slice(1)
      );
    })()}`;
    humidity.innerText = `Humidity: ${data.main.humidity}%`;
    canvasBtn.click();
  } else {
    search.value = "";
    alert("City invalid.");
  }
};
