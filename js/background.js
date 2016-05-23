;(function(){
    
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
    video.src = "videos/beach.webm";
    video.playbackRate = 0.25;
    video.loop = true;
    video.addEventListener('play', function(){
        draw(this, context, canvas.clientWidth, canvas.clientHeight);
    },false);

    document.body.appendChild(video);
    
    function draw(v,c,w,h) {
        if(v.paused || v.ended) return false;
        c.globalAlpha = 0.1;
        c.drawImage(v,0,0,w,h);
        setTimeout(draw, 100, v, c, w, h);
    }

    function initialiseVideo() {
        if (video.readyState >= 3) {
            video.play();
        }
        else {
            window.setTimeout(initialiseVideo, 3000);
        }
    }

    // start video after a short wait
    window.setTimeout(initialiseVideo, 3000);
    
    
})();