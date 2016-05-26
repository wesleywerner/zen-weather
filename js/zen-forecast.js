;(function(){
    
    var zen = window.zen = { };
    
    // Store forecast data as an array on the zen object.
    // Each item represents a lat/lon location.
    zen.conditions = [ ];
    
    /**
     * Get the data point for a given location.
     * Returns the given default if the data point is unavailable.
     */
    zen.getDataPoint = function(location, name, def) {
       def = def || '-';
       if (location < zen.conditions.length) {
           return zen.conditions[location][name] || def;
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
        var spam = { };
        spam.Summary = 'Partly Cloudy';
        spam.CloudCover = 0.28;
        spam.Humidity = 0.77;
        spam.Icon = '"partly-cloudy-night"';
        spam.PrecipitationProbability = 0.06;
        spam.Temperature = 62.82;
        spam.WindBearing = 238;
        spam.WindSpeed = 7.61;
        spam.ApparentTemperature = 62.82;
        zen.conditions.push(spam);
    }
    
    /**
     * Retrieve the current weather from the Forecast.IO proxy.
     */
    zen.retrieveForecast = function(lat, lon) {
        
        // Check the localStorage for cached forecasts
        // and the last time checked
        
	    var locations = {
	    	latitude: lat, 
			longitude: lon
		};

		var forecast = new ForecastIO({
			PROXY_SCRIPT: 'forecast.io-javascript-api/proxy.php'
		});

		forecast.getCurrentConditions(locations, function(conditions) {

            // See "Data Points" on https://developer.forecast.io/docs/v2

            for (var i=0; i<conditions.length; i++) {
                var point = { };
                point.Summary = conditions[i].getSummary();
                point.CloudCover = conditions[i].getCloudCover();
                point.Humidity = conditions[i].getHumidity();
                point.Icon = conditions[i].getIcon();
                point.PrecipitationProbability = conditions[i].getPrecipitationProbability();
                point.Temperature = conditions[i].getTemperature();
                point.WindBearing = conditions[i].getWindBearing();
                point.WindSpeed = conditions[i].getWindSpeed();
                point.ApparentTemperature = conditions[i].getApparentTemperature();
                zen.conditions.push(point);
            }
            
		});

    }
    
    /**
     * Store the forecast data in local storage.
     */
    zen.SaveData = function() {
        
    }

    /**
     * Load forecast data. Either from cache if available, or via the API.
     */
    zen.LoadData = function() {
        
        
    }
    
})();