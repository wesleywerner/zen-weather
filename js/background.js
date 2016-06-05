;(function(){
    
    var bg = window.zen.background = { };
    
    // Set the amount of motion blur 0..0.9
    bg.motionBlurAmount = 0;
    
    // Video playback rate. 1: normal speed. 0.25 quarter speed.
    bg.playbackRate = 1;
    
    // Realtime render speed
    bg.fastFPS = false;
    
    // playback quality determines the video played, and the rendering frequency.
    bg.quality = 480;
    
    // Sets if the background is an animated video
    bg.animated = false;
    
    // the theme determines the video and background images displayed.
    bg.theme = 'lighthouse';
    
    // create the still background image. It stays hidden, and is drawn
    // to the canvas once loaded.
    var still = document.createElement('img');
    still.id = 'still';
    still.style.display = 'none';
    document.body.appendChild(still);

    // create the background canvas
    var canvas = document.createElement('canvas');
    canvas.id = "backgroundcanvas";
    document.body.appendChild(canvas);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var context = canvas.getContext('2d');
    
    // create the video container
    var video = document.createElement('video');
    video.id = "backgroundvideo";
    video.playbackRate = bg.playbackRate;

    document.body.appendChild(video);
    
    function draw() {
        
        // scale canvas to ratio
        var ratio = still.height / still.width;
        canvas.width = canvas.clientWidth;
        canvas.height = Math.min( window.innerHeight - 10, canvas.width * ratio);
        var topMargin = (window.innerHeight - canvas.height) / 2;
        canvas.style.marginTop = topMargin.toString() + 'px';
        
        if (bg.animated) {
            context.globalAlpha = 1 - bg.motionBlurAmount;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            if (bg.fastFPS) {
                requestAnimationFrame(draw);
            }
            else {
                setTimeout(draw, 60);
            }
        }
        else {
            context.globalAlpha = 1;
            context.drawImage(still, 0, 0, canvas.width, canvas.height);
            setTimeout(draw, 5000);
        }
        
    }
    
    /**
     * Set the theme and playback quality.
     * Values include 0, 480, 720, 1080.
     * 0 displays a still background.
     */
    bg.setThemeAndQuality = function(theme, quality, animated) {
        bg.theme = theme;
        bg.quality = quality;
        bg.animated = animated;
        ApplyThemeAndQuality();
    }
    
    /**
     * Apply the theme and playback quality settings.
     */
    function ApplyThemeAndQuality() {
        video.pause();

        // always display background, especially when video is still loading
        still.src = 'themes/'+bg.theme+bg.quality.toString()+'.jpg';
        video.src = '';

        if (bg.animated) {
            video.src = 'themes/'+bg.theme+bg.quality.toString()+'.webm';
            video.loop = true;
            initialiseVideo();
        }
        
        // Save settings
        disk.save('background', bg);
    }

    function initialiseVideo() {
        if (video.readyState >= 3) {
            video.play();
        }
        // Retry to play the video
        window.setTimeout(initialiseVideo, 3000);
    }

    // start video after a short wait
    document.addEventListener("DOMContentLoaded", function(event) {
        
        // load saved settings
        var settings = disk.load('background');
        
        if (settings) {
            bg.setThemeAndQuality('lighthouse', settings.quality, settings.animated);
        }
        else {
            bg.setThemeAndQuality('lighthouse', 720, false);
        }
        draw();
    });
    
    
    
})();