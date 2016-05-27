;(function(){
    
    // Set the amount of motion blur 0..0.9
    var motionBlurAmount = 0;
    
    // Video playback rate. 1: normal speed. 0.25 quarter speed.
    var playbackRate = 0.5;
    
    // Realtime render speed
    var fastFPS = false;
    
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
    video.src = "videos/lighthouse480.webm";
    video.playbackRate = playbackRate;
    video.loop = true;
    video.addEventListener('play', function(){
        draw();
    },false);

    document.body.appendChild(video);
    
    function draw() {
        if(video.paused || video.ended) return false;
        context.globalAlpha = 1 - motionBlurAmount;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (fastFPS) {
            requestAnimationFrame(draw);
        }
        else {
            setTimeout(draw, 60);
        }
    }

    function initialiseVideo() {
        console.log('Loading Video...');
        if (video.readyState >= 3) {
            video.play();
        }
        else {
            window.setTimeout(initialiseVideo, 3000);
        }
    }

    // start video after a short wait
    document.addEventListener("DOMContentLoaded", function(event) {
        window.setTimeout(initialiseVideo, 3000);
    });
    
    
    
})();