
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
    
    // Load city value
    var el = document.getElementById('zen-config-city');
    el.value = zen.config.cityname || '';
    
    // Load quality value
    var el = document.getElementsByName('zen-config-quality');
    for (var i=0; i<el.length; i++) {
        if (el[i].value == zen.background.quality.toString()) el[i].checked = true;
    }
    
    // Load the animated background value
    var el = document.getElementsByName('zen-config-animated')[0];
    el.checked = zen.background.animated;
    
    // Show the config overlay
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
    
    // Read city name
    var el = document.getElementById('zen-config-city');
    
    // Read quality
    var quality = 0;
    var el = document.getElementsByName('zen-config-quality');
    for (var i=0; i<el.length; i++) {
        if (el[i].checked) quality = parseInt(el[i].value);
    }
    
    // Read animated background
    var el = document.getElementsByName('zen-config-animated')[0];
    var animated = el.checked || false;
    
    // Hide config overlay and apply values
    HideZenConfig();
    zen.SetCityName(el.value);
    if (quality > 0) zen.background.setThemeAndQuality('lighthouse', quality, animated);
  }
  

  // May need to call these on dom ready:
  document.getElementById('zen-config-show').addEventListener('click', ShowZenConfig);
  document.getElementById('zen-config-cancel').addEventListener('click', HideZenConfig);
  document.getElementById('zen-config-submit').addEventListener('click', SaveZenConfig);
  
  // Register our update method with the zen weather method.
  // We get called every time the weather data changes.
  zen.callback = UpdateUI;
  
  // An ongoing timer to show the video loading spinner
  // and flash the configuration wrench
  setInterval(function(){
    
    // wrench
    if ((zen.config.cityname || '') == '') {
      var el = document.getElementById('zen-config-show');
      el.opacity = 1;
      if (el.classList.contains('flash')) {
        el.classList.remove('flash');
      }
      else {
        el.classList.add('flash');
      }
    }
    else {
      document.getElementById('zen-config-show').style.opacity = 0.1;
    }
    
    // spinner
    var video = document.getElementById('backgroundvideo');
    if (video && video.readyState > 0 && video.readyState < 3) {
      document.getElementById('video-loading-spinner').style.display = 'block';
    }
    else {
      document.getElementById('video-loading-spinner').style.display = 'none';
    }
  }, 5000);
  
})();