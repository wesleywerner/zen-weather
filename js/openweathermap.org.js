;(function(){
    
    var zen = window.zen = { };
    
    zen.config = { };
    
    // set the callback fired when the conditions change
    zen.callback = null;
    
    // Store forecast data as an array on the zen object.
    // Each item represents a lat/lon location.
    zen.conditions = null;
    
    /**
     * Get the data point for a given location.
     * Returns the given default if the data point is unavailable.
     */
    zen.getDataPoint = function(name, def) {
       def = def || '-';
       if (zen.conditions) {
           return zen.conditions[name] || def;
       }
       else {
           // data point not available
           return def;
       }
    }
    
    /**
     * Create mock data for testing.
     */
    zen.createMockData = function() {
        zen.config.LastAPICall = new Date();
        return JSON.parse("{\"coord\":{\"lon\":31.03,\"lat\":-29.86},\"weather\":[{\"id\":800,\"main\":\"Clear\",\"description\":\"clear sky\",\"icon\":\"01n\"}],\"base\":\"cmc stations\",\"main\":{\"temp\":293.778,\"pressure\":1036.34,\"humidity\":100,\"temp_min\":293.778,\"temp_max\":293.778,\"sea_level\":1039.83,\"grnd_level\":1036.34},\"wind\":{\"speed\":2.72,\"deg\":30.5007},\"clouds\":{\"all\":0},\"dt\":1464290372,\"sys\":{\"message\":0.0086,\"country\":\"ZA\",\"sunrise\":1464237638,\"sunset\":1464275118},\"id\":1007311,\"name\":\"Durban\",\"cod\":200}");
    }
    
    /**
     * Retrieve JSON data.
     */
    zen.getJSON = function(url, callback) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.responseType = "json";
            xhr.onload = function() {
              var status = xhr.status;
              if (status == 200) {
                callback(null, xhr.response);
              } else {
                callback(status);
              }
            };
            xhr.send();
        }
        catch (err) {
            if (err.result == 2153644038 && err.message == '') err.message = 'Unknown error. Possibly caused by a cross-domain http request, or the target domain is of a varying secure protocol (http/https).';
            callback(err, null);
        }
    };
    
    /**
     * Retrieve the current weather from the Forecast.IO proxy.
     */
    zen.retrieveForecast = function(lat, lon) {
        
        var APIKEY = '2d7a3774b61ccfe3951871dd2e4148ee';
        var APIURL = null;
        
        if (zen.config.cityid) {
            APIURL = 'http://api.openweathermap.org/data/2.5/weather?id='+zen.config.cityid+'&appid='+APIKEY;
        }
        else if (zen.config.lat && zen.config.lon) {
            APIURL = 'http://api.openweathermap.org/data/2.5/weather?lat='+zen.config.lat+'&lon='+zen.config.lon+'&appid='+APIKEY;
        } else if (zen.config.cityname) {
            APIURL = 'http://api.openweathermap.org/data/2.5/weather?q='+zen.config.cityname+'&appid='+APIKEY;
        }
        
        if (!APIURL) {
            console.log('no city id, name or coordinates configured.');
            return;
        }
        
        // Call the API for weather conditions
        zen.getJSON(APIURL, function(err, data) {
          if (err != null) {
            console.log("Something went wrong: " + err);
          } else {
            
            // Capture the city id, name and coordinates.
            if (!zen.config.cityid && data.id) { zen.config.cityid = data.id };
            if (!zen.config.cityname && data.name) { zen.config.cityname = data.name };
            if (!zen.config.lat || data.coord.lat) { zen.config.lat = data.coord.lat };
            if (!zen.config.lon || data.coord.lon) { zen.config.lon = data.coord.lon };
            
            // Save the data in local storage.
            zen.conditions = data;
            zen.config.LastAPICall = new Date();
            window.disk.save('conditions', zen.conditions);
            window.disk.save('config', zen.config);
            zen.DisplayData();
          }
        });

    };
    

    /**
     * Load forecast data. Either from cache if available, or via the API.
     */
    zen.LoadData = function(forced) {
    
        var data = window.disk.load('conditions');
        var config = window.disk.load('config');
        
        config = config || { };
        zen.config = config;

        //console.log('creating mock data');
        //data = zen.createMockData();
        
        if (data && config.LastAPICall && !forced) {
            // Stored data is available. Check how old it is.
            var thisMoment = moment();
            var lastMoment = moment(config.LastAPICall);
            var lastMinutes = thisMoment.diff(lastMoment, 'minutes');
            if (lastMinutes > 60) {
                zen.retrieveForecast();
            }
            else {
                // Use cached data
                if (!zen.conditions) {
                  zen.conditions = data;
                  zen.DisplayData();
                }
            }
        }
        else {
            // No cached data available, or foced.
            zen.retrieveForecast();
        }
        
        window.setTimeout(zen.LoadData, 10000);
        
    };
    
    /**
     * Display data points.
     */
    zen.DisplayData = function() {
        
        if (zen.callback) {
            zen.callback(zen.conditions);
        }
        
        // zen.conditions.name
        // "Durban"
        // zen.conditions.main.temp
        // 294.495
        // zen.conditions.weather[0].description
        // "clear sky"
        // zen.conditions.weather[0].icon
        // "01d"
        // zen.conditions.weather[0].id
        // 800
        // zen.conditions.weather[0].main
        // "Clear"
        // zen.conditions.wind.deg
        // 4.50061
        // zen.conditions.wind.speed
        // 4.12

    };
    
    /**
     * Sets a new city name and forces reload of forecast.
     */
    zen.SetCityName = function(name) {
        zen.config.cityname = name;
        zen.config.cityid = null;
        zen.config.lat = null;
        zen.config.lon = null;
        window.disk.save('config', zen.config);
        zen.LoadData(true);
    }
    
    document.addEventListener("DOMContentLoaded", function(event) {
        window.setTimeout(zen.LoadData, 1000);
    });
    
})();