
/**
 * The display updates the UI with the zen weather dtaa.
 */
 
;(function(){
  
  function UpdateUI (data) {
    
            
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
        
        var temp = Math.round(data.main.temp-273.15) + ' degrees';
        var overview = data.name + ', ' + data.weather[0].description;
        
        document.getElementById('currentOverview').innerHTML = overview;
        document.getElementById('currentTemp').innerHTML = temp;
        document.getElementById('weatherIcon').src = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';

  }
  
  // Register our update method with the zen weather method.
  // We get called every time the weather data changes.
  zen.callback = UpdateUI;
  
})();