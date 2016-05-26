;(function(){
    
    var zen = window.zen = { };
    
    zen.retrieveForecast = function(lat, lon) {
        
        // Check the localStorage for cached forecasts
        // and the last time checked
        
	    var locations = {
	    	latitude: lat, 
			longitude: lon
		};

		var forecast = new ForecastIO({
			PROXY_SCRIPT: 'proxy.php'
		});

		forecast.getCurrentConditions(locations, function(conditions) {
		    console.log('forecast callback hit');
// 			var items = '';
// 			// echo temperature
// 			for (var i = 0; i < conditions.length; i++) {
// 				items += '<li>' + conditions[i].getTemperature() + '</li>';
// 			}
            var temp = '-';
            if (conditions.length > 0) {
                zen.currentTemp = conditions[0].getTemperature();
                zen.currentConditions = conditions[0].getCurrentConditions();
                temp = zen.currentTemp + ', ' + zen.currentConditions;
            }
			document.getElementById('currentTempAndConditions').innerHTML = temp;
		});

    }

    //zen.forecast = 
    
})();