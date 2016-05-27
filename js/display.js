
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
        
        var temp = Math.round((data.main.temp-273.15)*10)/10;

        document.getElementById('city').innerHTML = data.name;
        document.getElementById('temperature').innerHTML = temp;
        document.getElementById('description').innerHTML = data.weather[0].description;
        document.getElementById('weatherIcon').src = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
        
        document.getElementById('main-overlay').style.display = '';
        document.getElementById('main-overlay').classList.remove('zoomIn');
        document.getElementById('main-overlay').classList.add('zoomIn');

  }
  
  function ShowZenConfig() {
    var el = document.getElementById('zen-config-city');
    el.value = zen.config.cityname || '';
    var el = document.getElementById('zen-config-overlay');
    el.classList.remove('zoomIn');
    el.classList.remove('zoomOut');
    el.classList.add('zoomIn');
    el.style.display = '';
  }
  
  function HideZenConfig() {
    var el = document.getElementById('zen-config-overlay');
    el.classList.remove('zoomOut');
    el.classList.add('zoomOut');
  }
  
  function SaveZenConfig() {
    var el = document.getElementById('zen-config-city');
    HideZenConfig();
    zen.SetCityName(el.value);
  }
  

  // May need to call these on dom ready:
  document.getElementById('zen-config-show').addEventListener('click', ShowZenConfig);
  document.getElementById('zen-config-cancel').addEventListener('click', HideZenConfig);
  document.getElementById('zen-config-submit').addEventListener('click', SaveZenConfig);
  
  // Register our update method with the zen weather method.
  // We get called every time the weather data changes.
  zen.callback = UpdateUI;
  
})();