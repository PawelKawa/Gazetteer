const map = L.map('map').setView([51, 0], 3);

//--------------------------- Maps ---------------------------

// Basic map
let jawgAccessToken = '9tUsGbTtcQUCBmQ3GGrRXDrKSn3flDcP1TKVP0FtDelTij2ISYoC3HKhuL0S9EuC';
const basicMap = L.tileLayer(
  'https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}',
  {
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors || <a href="https://www.flaticon.com" target="_blank" title="Icons source">Icons created by Stockio - Flaticon</a> ',
    minZoom: 0,
    maxZoom: 22,
    subdomains: 'abcd',
    accessToken: jawgAccessToken
  }
).addTo(map);


// other maps

let lights = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
});

let terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

let = googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

let = googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});


// maps overlay

let appid = '0f03b00173b58e7509c8411978ab491d';
let cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${appid}`);
let precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${appid}`);
let pressureLayer = L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${appid}`);
let windSpeedLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${appid}`);
let temperatureLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${appid}`);

let differentMaps = {
  "Basic map": basicMap,
  "Lights during the night": lights,
  "Terrain": terrain,
  "Google street": googleStreets,
  "Google sattelite": googleSat,
  "Google terrain": googleTerrain
};
let overlayMaps = {
  "Clouds Layer": cloudsLayer,
  "Precipitation": precipitationLayer,
  "Sea level pressure": pressureLayer,
  "Wind speed": windSpeedLayer,
  "Temperature Layer": temperatureLayer,
}

L.control.layers(differentMaps, overlayMaps).addTo(map);

L.control.scale().addTo(map);


//--------------------------- Current Position ---------------------------

let currentLocationCode = "";
let currentCountryName = "";

let successCurPos = function (position) {

  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  
  $.ajax({
    url: './php/getCurrentPosition.php',
    type: 'POST',
    dataType: 'JSON',
    data: {
      lat: lat,
      long: long,
    },
    success: function (results) {
      currentLocationCode = results['data']['countryCode'];
      currentCountryName = results['data']['countryName'];
      $('#country').val(currentLocationCode).change();
      $('#preloader').remove();
      $("#welcomeModalAllow").modal("show");
      $('#localCountry').html(currentCountryName)
    }
  });
};

let errorCurPos = function (error) {
  $('#preloader').remove();
  $("#welcomeModalBlock").modal("show");
}

navigator.geolocation.getCurrentPosition(successCurPos, errorCurPos);


//--------------------------- Click on map to choose country ---------------------------

function currentMouseClick(clickOnMapLat, clickOnMapLong) {
  $.ajax({
    url: './php/getCurrentPosition.php',
    type: 'POST',
    dataType: 'JSON',
    data: {
      lat: clickOnMapLat,
      long: clickOnMapLong,
    },
    success: function (results) {
      currentLocationCode = results['data']['countryCode'];
      currentCountryName = results['data']['countryName'];

      if (currentLocationCode) {
        if(currentLocationCode != chosenCountryValue){
          $('#country').val(currentLocationCode).change();
        }
      } else {
        console.log(results.data.status.message);
      }
    }
  });
};

map.on('click', (e) => {
let clickOnMapLat = e.latlng.lat;
let clickOnMapLong = e.latlng.lng;
currentMouseClick(clickOnMapLat, clickOnMapLong);
})


//---------------------------location of ISS---------------------------

let issIcon = L.icon({
  iconUrl: './img/iss.png',
  iconSize: [80, 50],
  iconAnchor: [40, 25],
});
let latISS = '';
let longISS = '';
let markerISS = L.marker([0, 0], { icon: issIcon }).addTo(map);
function ajaxISS() {
  $.ajax({
    type: 'POST',
    url: './php/getISS.php',
    data: {},
    dataType: 'json',
    success: function (data) {
      latISS = data['data']['latitude'];
      longISS = data['data']['longitude'];
      markerISS.setLatLng([latISS, longISS]);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
ajaxISS();
setInterval(ajaxISS, 5000);


// ---------------------------Country list to select---------------------------

$.ajax({
  type: 'GET',
  url: 'php/getCountryList.php',
  data: {},
  dataType: 'json',
  success: function (data) {
    let countryToSelect = data['data'];
    countryToSelect.sort();
    let addCountryToSelect = [];
    
    addCountryToSelect += `<option value="Select" selected>Select country  ...</option>`;
    for (i = 0; i < countryToSelect.length; i++) {
      addCountryToSelect += `<option value="${countryToSelect[i][1]}"> ${countryToSelect[i][0]}</option>`;
    }
    $('#country').html(addCountryToSelect);
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
  },
});


//--------------------------- Borders for countries---------------------------

let countryBorder = new L.geoJson();
countryBorder.addTo(map);

function borderColour() {
  return {
    color: '#83cc89'
  }
}

function getBorders(chosenCountryValue) {
  $.ajax({
    type: 'GET',
    url: 'php/getBorders.php',
    data: {
      iso2: chosenCountryValue
    },
    dataType: 'json',
    success: function (results) {
      let i2 = results['data']['0']['0'];
      let geo = results['data']['0']['1'];
      let borders = {
        type: 'Feature',
        properties: { iso_a2: i2 },
        geometry: geo,
        };
      countryBorder.addData(borders);
      countryBorder.setStyle(borderColour)
      map.fitBounds(countryBorder.getBounds());
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//--------------------------- Modals ---------------------------

// Modal info about country

let capitalLat = "";
let capitalLong = "";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function capitalize(a) {
    return a[0].toUpperCase() + a.slice(1);
}

function getInfo(chosenCountryValue) {
  $.ajax({
    type: 'GET',
    url: './php/getInfo.php',
    data: {iso_a2:chosenCountryValue},
    dataType: 'json',
    success: function (results) {
      let data = results['data'][0];
      if (results['status']['name'] == 'ok') {
        let coatOfArms = data['coatOfArms']['png'];
        let flag = data['flags']['png'];
        capitalLat = data['capitalInfo']['latlng'][0];
        capitalLong = data['capitalInfo']['latlng'][1];
        let cur = data['currencies'];
        let lang = data['languages'];
        let currencies = [];
        let languages = [];
        $('#weatherModalLabel').html('Weather for: ' + '<span>' + data.capital + '</span>');
        $('#capital').html(data['capital']);
        $('#infoModalLabel').html(data['name']['common']);
        $('.wiki').on('click', function () {
          $('.wiki').attr('href', `https://en.wikipedia.org/wiki/${data['name']['common']}`);
          console.log(data);
        });
        $('#newsModalLabel').html('News for: ' + '<span>' + data['name']['common'] + '</span>' );
        $('#officalName').html(data['name']['official']);
        $('#area').html(numberWithCommas(data['area'] + 'km<sup>2</sup>'));
        $('#ds').html(capitalize(data['car']['side']));
        $('#cc').html('Longitude: ' + data['capitalInfo']['latlng'][0] + ' </br>Latitude: ' + data['capitalInfo']['latlng'][1]);
        $('#coatOfArms').attr('src', coatOfArms);
        $('.flag').attr('src', flag);
        $('#flag').attr('src', flag);
        $('#continent').html(data['continents']);
        const propOwn = Object.getOwnPropertyNames(cur);
        for (let i = 0; i < propOwn.length; i++){ 
          currencies +=  `${data['currencies'][Object.keys(data['currencies'])[i]]['name']} <br>`
          $('#currencies').html(currencies)
        }
        const propOwn2 = Object.getOwnPropertyNames(lang);
        for (let i = 0; i < propOwn2.length; i++){ 
          languages +=  `${data['languages'][Object.keys(data['languages'])[i]]} <br>`
          $('#languages').html(languages)
        }
        $('#population').html(numberWithCommas(data['population']));
        $('#subregion').html(data['subregion']);
        $('#curSymbol').html(data['currencies'][Object.keys(data['currencies'])[0]]['symbol'])
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  setTimeout(getWeather,2000,chosenCountryValue)
};


// Modal Weather

function getWeather() {
  $.ajax({
    url: './php/getWeather.php',
    type: 'POST',
  dataType: 'JSON',
  data: {
    lat: capitalLat,
    long: capitalLong,
  },
  success: function (results) {
    let data = results.data;
    let condition = data['current']['condition']['icon'];
    let conditionTmr = data['forecast']['forecastday'][1]['day']['condition']['icon'];
    $('#temperature').html(data['current']['temp_c'] + ' &#8451');
    $('#temperatureTmr').html(data['forecast']['forecastday'][1]['day']['avgtemp_c'] + ' &#8451');
    $('#humidity').html(data['current']['humidity'] + ' %');
    $('#humidityTmr').html(data['forecast']['forecastday'][1]['day']['avghumidity'] + ' %');
    $('#perc').html(data['current']['precip_in'] + ' "');
    $('#percTmr').html(data['forecast']['forecastday'][1]['day']['totalprecip_in'] + ' "');
    $('#wind').html(data['current']['wind_mph'] + ' mph');
    $('#windTmr').html(data['forecast']['forecastday'][1]['day']['maxwind_mph'] + ' mph');
    $('#sunrise').html(data['forecast']['forecastday'][0]['astro']['sunrise']);
    $('#sunriseTmr').html(data['forecast']['forecastday'][1]['astro']['sunrise']);
    $('#sunset').html(data['forecast']['forecastday'][0]['astro']['sunset']);
    $('#sunsetTmr').html(data['forecast']['forecastday'][1]['astro']['sunset']);
    $('#localTime').html(data['location']['localtime']);
    $('#lastUpdated').html(data['current']['last_updated']);
    $('#condition').attr('src', condition);
    $('#conditionTmr').attr('src', conditionTmr);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
})
};


//Modal Covid

function getCovid(chosenCountryValue) {
  $.ajax({
    url: './php/getCovid.php',
    type: 'GET',
    dataType: 'JSON',
    data: { iso2: chosenCountryValue },
    success: function (results) {
      let data = results['data'];
      $('#covidModalLabel').html('Covid info for: '+ data['country']);
      $('#totalCases').html(numberWithCommas(data['cases']));
      $('#totalDeaths').html(numberWithCommas(data['deaths']));
      $('#totalRec').html(numberWithCommas(data['recovered']));
      $('#tt').html(numberWithCommas(data['tests']));
      $('#t1m').html(numberWithCommas(data['testsPerOneMillion']));
      $('#todayCases').html(numberWithCommas(data['todayCases']));
      $('#todayDeaths').html(numberWithCommas(data['todayDeaths']));
      $('#todayRecover').html(numberWithCommas(data['todayRecovered']));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  })
};


// Modal News

function btnNews(a) {
  if (a) {
    $('#btnNews').show();
  } else { 
    $('#btnNews').hide();
  }
};

function getNews(chosenCountryValue) {
  $.ajax({
    url: './php/getNews.php',
    type: 'POST',
    dataType: 'JSON',
    data: { iso2: chosenCountryValue },
    success: function (results) {
      let isNews = (results['data']['totalResults']);
      btnNews(isNews);
      let data = (results['data']['articles']);
      $('#news1source').html('Source of information: ' + '<span>' + data[0]['source']['name']) + '</span>';
      $('#news1img').attr('src', data[0]['urlToImage']);
      $('#news1title').html(data[0]['title']);
      $('.news1href').attr('href', data[0]['url']);
      $('#news2source').html('Source of information: ' + '<span>' + data[1]['source']['name']) + '</span>';
      $('#news2img').attr('src', data[1]['urlToImage']);
      $('#news2title').html(data[1]['title']);
      $('.news2href').attr('href', data[1]['url']);
      $('#news3source').html('Source of information: ' + '<span>' + data[2]['source']['name']) + '</span>';
      $('#news3img').attr('src', data[2]['urlToImage']);
      $('#news3title').html(data[2]['title']);
      $('.news3href').attr('href', data[2]['url']);
      $('#news4source').html('Source of information: ' + '<span>' + data[3]['source']['name']) + '</span>';
      $('#news4img').attr('src', data[3]['urlToImage']);
      $('#news4title').html(data[3]['title']);
      $('.news4href').attr('href', data[3]['url']);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};


//---------------------------Markers on map---------------------------

// Cities Markers

let groupMarkers = L.markerClusterGroup();

function getCitiesMarkers(chosenCountryValue) {
  $.ajax({
    url: './php/getCitiesMarkers.php',
    type: 'POST',
    dataType: 'JSON',
    data: {
      iso2: chosenCountryValue,
    },
    success: function (results) {
      let cities = [];
      let citiesOnMap = [];
      let citiesIcon = L.icon({
        iconUrl: './img/icons/cityscape.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });
      let data = results['data']['geonames'];
      let length = results['data']['geonames'].length;
      for (let i = 0; i < length; i++){
        let lat = data[i]['lat'];
        let long = data[i]['lng'];
        let population = data[i]['population'];
        let name = data[i]['name'];
        cities.push([name, population, lat, long])    
      };
      for (let i = 0; i < cities.length; i++){
        citiesOnMap = L.marker(new L.LatLng(cities[i][2], cities[i][3]), { icon: citiesIcon }).bindPopup('City: ' + cities[i][0] + '<br> Population: ' + numberWithCommas(cities[i][1])  + '<br> Latitude: ' + cities[i][2] + '<br> Longitude: ' + cities[i][3]);
        groupMarkers.addLayer(citiesOnMap);
      };
      map.addLayer(groupMarkers);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  })
};

//Capital Markers

function getCapitalMarker(chosenCountryValue) {
  $.ajax({
    url: './php/getCapitalMarker.php',
    type: 'POST',
    dataType: 'JSON',
    data: {
      iso2: chosenCountryValue,
    },
    success: function (results) {
      let capital = [];
      let capitalOnMap = [];
      let capitalIcon = L.icon({
        iconUrl: './img/icons/government.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });
      let data = results['data']['geonames'][0];
      let lat = data['lat'];
      let long = data['lng'];
      let population = data['population'];
      let name = data['name'];
      capital.push([name, population, lat, long]);
      capitalOnMap = L.marker(new L.LatLng(lat, long), { icon: capitalIcon })
        .bindPopup('Capital: ' +name + '<br> Population: ' + numberWithCommas(population) + '<br> Latitude: ' + lat + '<br> Longitude: ' + long);
      map.addLayer(groupMarkers);
      groupMarkers.addLayer(capitalOnMap);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  })
}

//Airports Markers

function getAirportsMarkers(chosenCountryValue) {
  $.ajax({
    url: './php/getAirportsMarkers.php',
    type: 'POST',
    dataType: 'JSON',
    data: {
      iso2 : chosenCountryValue,
    },
    success: function (results) {
      let airports = [];
      let airportsOnMap = [];
      let airportsIcon = L.icon({
        iconUrl: './img/icons/airport.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });
      let data = results['data']['geonames'];
      let length = data.length;
      for (let i = 0; i < length; i++){
        let lat = data[i]['lat'];
        let long = data[i]['lng'];
        let name = data[i]['name'];
        airports.push([name, lat, long]);
      };
      for (let i = 0; i < airports.length; i++){
        airportsOnMap = L.marker(new L.LatLng(airports[i][1], airports[i][2]), {icon: airportsIcon}).bindPopup(airports[i][0])
        groupMarkers.addLayer(airportsOnMap);
      }
      map.addLayer(groupMarkers);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  })
}

//Casinos Markers

function getCasinosMarkers(chosenCountryValue) {
  $.ajax({
    url: './php/getCasinoMarkers.php',
    type: 'POST',
    dataType: 'JSON',
    data: {
      iso2 : chosenCountryValue,
    },
    success: function (results) {
      let casinos = [];
      let casinosOnMap = [];
      let casinosIcon = L.icon({
        iconUrl: './img/icons/slot-machine.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });
      let data = results['data']['geonames'];
      for (let i = 0; i < data.length; i++){
        let lat = data[i]['lat'];
        let long = data[i]['lng'];
        let name = data[i]['name'];
        casinos.push([name, lat, long]);
      };
      for (let i = 0; i < casinos.length; i++){
        casinosOnMap = L.marker(new L.LatLng(casinos[i][1], casinos[i][2]), { icon: casinosIcon }).bindPopup(casinos[i][0]);
        groupMarkers.addLayer(casinosOnMap);
      }
      map.addLayer(groupMarkers);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  })
}

//Castles Markers

function getCastlesMarkers(chosenCountryValue) {
  $.ajax({
    url: './php/getCastlesMarkers.php',
    type: 'POST',
    dataType: 'JSON',
    data: {
      iso2 : chosenCountryValue,
    },
    success: function (results) {
      let castles = [];
      let castlesOnMap = [];
      let castleIcon = L.icon({
        iconUrl: './img/icons/castle.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });
      let data = results['data']['geonames'];
      for (let i = 0; i < data.length; i++){
        let lat = data[i]['lat'];
        let long = data[i]['lng'];
        let name = data[i]['name'];
        castles.push([name, lat, long]);
      };
      for (let i = 0; i < castles.length; i++){
        castlesOnMap = L.marker(new L.LatLng(castles[i][1], castles[i][2]), { icon: castleIcon }).bindPopup(castles[i][0]);
        groupMarkers.addLayer(castlesOnMap);
      }
      map.addLayer(groupMarkers);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  })
}


//---------------------------After chosing country from list ---------------------------

let chosenCountryValue = "";
let chosenCountry = "";

function clearMap() {
  if (groupMarkers) {
    groupMarkers.clearLayers();
  };
  if (countryBorder) {
    countryBorder.clearLayers();
  }
}

$('#country').on('change', function () {
  clearMap();
  chosenCountryValue = $('#country').children('option:selected').val();
  chosenCountry = $('#country').children('option:selected').text();
  console.log(chosenCountry);
  console.log(chosenCountryValue);
  getBorders(chosenCountryValue);
  getInfo(chosenCountryValue);
  getCovid(chosenCountryValue);
  getNews(chosenCountryValue);
  getCitiesMarkers(chosenCountryValue);
  getCapitalMarker(chosenCountryValue);
  getAirportsMarkers(chosenCountryValue);
  getCasinosMarkers(chosenCountryValue);
  getCastlesMarkers(chosenCountryValue);
});


//---------------------------Buttons---------------------------


// button ISS

L.easyButton({
  id: 'btnISS',
  states: [{
      icon: "none",
      title: 'Show position of ISS',
      onClick: function(btn,map) {
        map.setView([latISS, longISS], 4)
      }
  },]
}).addTo(map);


// button show chosen country

L.easyButton({
  id: 'btnCountry',
  states: [{
      icon: "none",
      title: 'Show chosen country',
    onClick: function (btn, map) {
      if (chosenCountry != "") {
        map.fitBounds(countryBorder.getBounds())
      } else {
        alert("Choose a country from the list")
        }
      }
  },]
}).addTo(map);

// button change between capital and 'bigger picture'

L.easyButton({
  id: 'btnCapital',
  states: [{
    stateName: 'zoomcapital',
    icon: '<img src="./img/icons/government.png" alt="iss icon" style="width:50px">',
    title: 'Zoom in to capital',
    onClick: function (btn, map) {
      if (chosenCountry != "") {
        map.setView([capitalLat, capitalLong], 10);
        btn.state('zoomcountry');
        
      } else {
        alert("Choose a country from the list")
      }
    }
  },
  {
    id: 'btnCity',
    stateName: 'zoomcountry',
    icon: '<img src="./img/icons/earth.png" alt="iss icon" style="width:50px">',
    title: 'Show country on world map',
    onClick: function (btn, map) {
      map.setView([capitalLat, capitalLong], 3);
      btn.state('zoomcapital');
    }
  }]
}).addTo(map)


// button show info about chosen country

L.easyButton({
  id: 'btnInfo',
  states: [{
      icon: "none",
      title: 'Show info about chosen country',
    onClick: function (btn, map) {
      if (chosenCountry != "") {
        $("#infoModal").modal("show");
      } else {
        alert("Choose a country from the list")
        }
      }
  },]
}).addTo(map);


//Button Weather

L.easyButton({
  id: 'btnWeather',
  states: [{
    icon: "none",
    title: 'Show weather for the capital of chosen country',
    onClick: function (btn, map) {
      if (chosenCountry != "") {
        $("#weatherModal").modal("show");
      } else {
        alert("Choose a country from the list")
      }
    }
  },]
}).addTo(map);


// BUtton Covid

L.easyButton({
  id: 'btnCovid',
  states: [{
    icon: "none",
    title: 'Show covid-19 info of chosen country',
    onClick: function (btn, map) {
      if (chosenCountry != "") {
        $("#covidModal").modal("show");
      } else {
        alert("Choose a country from the list")
        }
      }
    },]
  }).addTo(map);
  

  //Button News

  L.easyButton({
    id: 'btnNews',
    states: [{
        icon: "none",
        title: 'Show News for chosen country',
      onClick: function (btn, map) {
        if (chosenCountryValue != "") {
          $("#newsModal").modal("show");
        } else {
          alert("Choose a country from the list")
        }
        }
    },]
  }).addTo(map);