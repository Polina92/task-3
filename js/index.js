var video = document.querySelector('.camera__video'),
    canvas = document.querySelector('.camera__canvas'),
    button = document.getElementById('button'),
    context = canvas.getContext('2d'),
    select = document.querySelector('.controls__filter'),
    hid = document.querySelector('.hidden'),
    imageData,
    pixels,
    i,
    r,
    g,
    b;

//Make img and canvas from video
function makePhoto() {
    hid.style.display = 'none';
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
}

//Get video stream
function getVideoStream() {
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia(
            {video: true},
            function (stream) {
                video.src = window.URL.createObjectURL(stream);
            },
            function (err) {
                console.log("The following error occured: " + err.name);
            }
        );
    } else {
        console.log("getUserMedia not supported");
    }
}

//Apply filter
function applyFilter() {
    imageData = context.getImageData(0, 0, 1000, 1000);
    imageDataFiltered = applyFilterToPixel(imageData);
    context.putImageData(imageDataFiltered, 0, 0);
}

//Select filter
function applyFilterToPixel(imageData) {
    pixels = imageData.data;
    opt = document.querySelector('.controls__filter').value;
    if (opt === 'invert') {
        for (i = 0; i < pixels.length; i += 4) {
            r = pixels[i];
            g = pixels[i + 1];
            b = pixels[i + 2];
            pixels[i] = 255 - r; // red
            pixels[i + 1] = 255 - g; // green
            pixels[i + 2] = 255 - b; // blue
        }

        return imageData;
    } else if (opt === 'grayscale') {
        for (i = 0; i < pixels.length; i += 4) {
            r = pixels[i];
            g = pixels[i + 1];
            b = pixels[i + 2];
            pixels[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b; // red
            pixels[i + 1] = pixels[i]; // green
            pixels[i + 2] = pixels[i]; // blue
        }

        return imageData;
    } else if (opt === 'threshold') {
        for (i = 0; i < pixels.length; i += 4) {
            r = pixels[i];
            g = pixels[i + 1];
            b = pixels[i + 2];
            pixels[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0; // red
            pixels[i + 1] = pixels[i]; // green
            pixels[i + 2] = pixels[i]; // blue
        }

        return imageData;
    } else {
        return imageData;
    }
}

window.onload = function () {
    getVideoStream();
    applyFilter();
    button.addEventListener('click', makePhoto);
    select.onchange = function () {
        applyFilter();
    }
};
