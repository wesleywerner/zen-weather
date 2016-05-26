;(function(){
    
    var zen = window.zen = { };
    
    zen.lat = -29.858680;
    zen.lon = 31.021840;
    
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
        
        console.log('creating mock data for ' + lat + ',' + lon);
        zen.createMockData();
        window.disk.save('conditions', zen.conditions);
        window.disk.save('last-api-call', new Date());
        return;
        
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
            
            // Save the data in local storage.
            window.disk.save('conditions', zen.conditions);
            window.disk.save('last-api-call', new Date());
            
		});

    };
    

    /**
     * Load forecast data. Either from cache if available, or via the API.
     */
    zen.LoadData = function() {
    
        var lastCall = window.disk.load('last-api-call');
        var data = window.disk.load('conditions');
        
        if (data && lastCall) {
            // Stored data is available. Check how old it is.
            var thisMoment = moment();
            var lastMoment = moment(lastCall);
            var lastMinutes = thisMoment.diff(lastMoment, 'minutes');
            if (lastMinutes > 60) {
                zen.retrieveForecast(zen.lat, zen.lon);
            }
            else {
                // Use cached data
                zen.conditions = data;
            }
        }
        else {
            // No cached data available.
            zen.retrieveForecast(zen.lat, zen.lon);
        }
        
        window.setTimeout(zen.LoadData, 60000);
        
        zen.DisplayData()
        
    };
    
    /**
     * Display data points.
     */
    zen.DisplayData = function() {
        var el = document.getElementById('currentTempAndConditions');
        var t = '';
        Object.keys(zen.conditions[0]).forEach(function(key){
            t = t + key + ': ' + zen.conditions[0][key] + '</br>';
        })
        el.innerHTML = t;
    };
    
    window.setTimeout(zen.LoadData, 5000);
    
})();