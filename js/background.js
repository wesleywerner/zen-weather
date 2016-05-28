;(function(){
    
    var bg = window.zen.background = { };
    
    // Set the amount of motion blur 0..0.9
    bg.motionBlurAmount = 0;
    
    // Video playback rate. 1: normal speed. 0.25 quarter speed.
    bg.playbackRate = 1;
    
    // Realtime render speed
    bg.fastFPS = false;
    
    // playback quality determines the video played, and the rendering frequency.
    bg.quality = 0;
    
    // the theme determines the video and background images displayed.
    bg.theme = 'lighthouse';
    
    // create the still background image. It stays hidden, and is drawn
    // to the canvas once loaded.
    var still = document.createElement('img');
    still.id = 'still';
    still.style.display = 'none';
    document.body.appendChild(still);
    // draw the still once it has loaded
    still.addEventListener('load', draw);
    
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
    //video.src = "videos/lighthouse480.webm";
    video.playbackRate = bg.playbackRate;
    video.loop = true;
    video.addEventListener('play', function(){
        draw();
    },false);

    document.body.appendChild(video);
    
    function draw() {
        
        if (bg.quality == 0) {
            // Draw the still image to the canvsa
            context.globalAlpha = 1;
            context.drawImage(still, 0, 0, canvas.width, canvas.height);
            //setTimeout(draw, 600);
        }
        else {
            
            if(video.paused || video.ended) return false;
            context.globalAlpha = 1 - bg.motionBlurAmount;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            if (bg.fastFPS) {
                requestAnimationFrame(draw);
            }
            else {
                setTimeout(draw, 60);
            }
        }
        
    }
    
    /**
     * Set the theme and playback quality.
     * Values include 0, 480, 720, 1080.
     * 0 displays a still background.
     */
    bg.setThemeAndQuality = function(theme, quality) {
        bg.theme = theme;
        bg.quality = quality;
        ApplyThemeAndQuality();
    }
    
    /**
     * Apply the theme and playback quality settings.
     */
    function ApplyThemeAndQuality() {
        video.pause();
        if (bg.quality == 0) {
            still.src = 'backgrounds/beach-sd.jpg';
            video.src = '';
            // the "still" element onload will draw to the canvas once loaded.
        }
        else {
            video.src = 'videos/'+bg.theme+bg.quality.toString()+'.webm';
            initialiseVideo();
        }
    }

    function initialiseVideo() {
        if (video.readyState >= 3) {
            video.play();
        }
        else {
            // Retry to play the video
            window.setTimeout(initialiseVideo, 3000);
        }
    }

    // start video after a short wait
    document.addEventListener("DOMContentLoaded", function(event) {
        //window.setTimeout(initialiseVideo, 3000);
        ApplyThemeAndQuality();
    });
    
    
    
})();