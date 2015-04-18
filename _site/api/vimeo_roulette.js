var videoID = getRandomVideoID();

// This is the URL of the video you want to load
var videoUrl = 'http://www.vimeo.com/' + videoID;

// This is the oEmbed endpoint for Vimeo (we're using JSON)
// (Vimeo also supports oEmbed discovery. See the PHP example.)
var endpoint = 'http://www.vimeo.com/api/oembed.json';

// Tell Vimeo what function to call
var callback = 'embedVideo';

// Put together the URL
var url = endpoint + '?url=' + encodeURIComponent(videoUrl) + '&callback=' + callback + '&width=640';

console.log(url);

// This function puts the video on the page
function embedVideo(video) {
  document.getElementById('embed').innerHTML = unescape(video.html);
}

// This function loads the data from Vimeo
function init() {
  var js = document.createElement('script');
  js.setAttribute('type', 'text/javascript');
  js.setAttribute('src', url);
  document.getElementsByTagName('head').item(0).appendChild(js);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomVideoID() {
  var largestID = 200000000;
  var idValid = false;

  while (idValid == false ) {
    var videoID = getRandomInt(1,largestID);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        idValid = true;
      }
    }
    xhr.open("HEAD", "https://vimeo.com/api/v2/video/" + videoID + ".json", false);
    xhr.send();
  }

  return videoID;
}

// Call our init function when the page loads
window.onload = init;
