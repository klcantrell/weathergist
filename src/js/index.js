window.addEventListener("DOMContentLoaded", function() {
  getLocation();
  loadSpin(refreshIcon);
});

const rootEl = document.getElementById("weather-viewer"),
    unit = rootEl.querySelector(".js_weather-viewer__unit"),
    refreshIcon = rootEl.querySelector(".js_weather-viewer__refresh-btn"),
    key = rootEl.querySelector(".js_weather-viewer__key"),
    pic = rootEl.querySelector(".js_weather-viewer__pic"),
    splash = rootEl.querySelector(".js_weather-viewer__splash"),
    temperature = rootEl.querySelector(".weather-viewer__temperature"),
    summary = rootEl.querySelector(".weather-viewer__summary"),
    number = rootEl.querySelector(".weather-viewer__number");

const currentDate = new Date(),
    currentHour = currentDate.getHours(),
    myKey = "d13867253fbc52d1aed6c28e266b43b5",
    locOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

let myLatitude,
    myLongitude,
    degreesFahrenheit,
    degreesCelsius;

unit.addEventListener("click", changeUnit);
refreshIcon.addEventListener("click", function(e) {
  reload();
  refreshSpin(e);
});


var model = {
  index: 0,
  value: 0,
  unit: ["p9valk7f2lq0s1x/fahrenheit.png?dl=0","q5nwt7qb5fx0snf/celsius.png?dl=0"],
  summary: "",
  icon: ""
};

function getLocation() {
  navigator.geolocation.getCurrentPosition(setLatLong, timeout, locOptions);
}

function reload() {
  location.reload(true);
}

function loadSpin(el) {
  el.classList.add('full-spin');
}

function refreshSpin(event) {
  event.target.classList.add('half-spin');
}

function removeSplash() {
  splash.classList.add("weather-viewer__splash--hidden");
  key.classList.add("weather-viewier__key--fade-in");
}

function timeout(e) {
  removeSplash();
  unit.style.visibility = "hidden";
  setTimeout(addTimeoutView, 1400);
}

function addTimeoutView() {
  const temperatureContent = html`
      <p class="weather-viewer__timeout-message">
        Please enable location services
      </p>
      <i class="fa fa-refresh weather-viewer__timeout-btn"
          aria-hidden=true>
      </i>
  `;
  temperature.innerHTML = temperatureContent;
  temperature.querySelector('.weather-viewer__timeout-btn')
    .addEventListener('click', function(e) {
      refreshSpin(e);
      reload();
    });
}

function setLatLong(position) {
  myLatitude = position.coords.latitude;
  myLongitude = position.coords.longitude;
  requestDarkSky(myLatitude, myLongitude);
  setTimeout(removeSplash, 2000);
}

function requestDarkSky() {
  var request = document.createElement('script');
  request.setAttribute("src", "https://api.darksky.net/forecast/" + myKey + "/" + myLatitude
                       + ',' + myLongitude + "?callback=updateModel");
  document.head.appendChild(request);
}

function updateModel(res) {
  degreesFahrenheit = Math.floor(res.currently.temperature);
  degreesCelsius = Math.floor(res.currently.temperature) - 32;
  model.summary = res.currently.summary;
  model.icon = res.currently.icon;
  summary.innerHTML = model.summary;
  updateView();
}

function updateView() {
  determineValue();
  number.innerHTML = model.value;
  unit.src = "https://dl.dropboxusercontent.com/s/"
+ model.unit[model.index];
  determinePic();
}

function determineValue() {
  if (model.index === 0) {
    model.value = degreesFahrenheit;
  } else {
    model.value = degreesCelsius;
  }
}

function changeUnit() {
  if (model.index === 0) {
    model.index += 1;
  } else {
    model.index -= 1;
  }
  updateView();
}

function determinePic() {
  switch(model.icon) {
    case ("cloudy"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/myw7l0bedfoklla/cloudy.png?dl=0");
      rootEl.style["border-color"] = "rgb(158, 186, 255)";
      key.style.background = "rgb(158, 186, 255)";
      break;

    case ("partly-cloudy-day"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/8o9oqgepv7msf9j/cloudysun.png?dl=0");
      rootEl.style["border-color"] = "rgb(158, 186, 255)";
      break;

    case ("partly-cloudy-night"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/1rxdf0ibkhm592q/cloudymoon.png?dl=0");
      rootEl.style["border-color"] = "rgb(85, 101, 140)";
      key.style.background = "rgb(85, 101, 140)";
      break;

    case ("rain"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/cc872macp2yuvtq/rain.png?dl=0");
      rootEl.style["border-color"] = "rgb(0, 76, 255)";
      key.style.background = "rgb(0, 76, 255)";
      break;

    case ("clear-day"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/nrr6lcj3ano64ny/sun.png?dl=0");
      rootEl.style["border-color"] = "rgb(249, 255, 76)";
      key.style.background = "rgb(249, 255, 76)";
      break;

    case ("clear-night"):
      pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/isde9hqy0dx3ixb/moon.png?dl=0");
      rootEl.style["border-color"] = "rgb(0, 8, 104)";
      key.style.background = "rgb(0, 50, 255)";
      break;

    default: pic.setAttribute("src", "https://dl.dropboxusercontent.com/s/tryrneq8vp0ftrg/default.png?dl=0");
  }
}

function html(literals, ...customs) {
  let result = '';
  customs.forEach((custom, i) => {
    let lit = literals[i];
    if (Array.isArray(custom)) {
      custom = custom.join('');
    }
    result += lit;
    result += custom;
  });
  result += literals[literals.length - 1];
  return result;
}
