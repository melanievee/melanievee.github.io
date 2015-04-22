var VimeoWidget =
{

  init: function()
  {

    // Get handlers for key elements & setup clickListener
    var videoEmbed = document.getElementById("embed");
    var reSpin = document.getElementById("respin");
    $(vimeo__respin).bind("click",VimeoWidget.clickListener);

    // Fetch random Video, build Vimeo URL, and embed Video
    var url = VimeoWidget.buildURL();
    VimeoWidget.loadVimeoData(url);
  },

  buildURL: function()
  {
    var videoID = VimeoWidget.getRandomVideoID();
    var videoUrl = 'http://www.vimeo.com/' + videoID;
    // This is the JSON oEmbed endpoint for Vimeo
    var endpoint = 'http://www.vimeo.com/api/oembed.json';
    // Tell Vimeo what function to call
    var callback = 'VimeoWidget.embedVideo';
    // Put together the URL
    var url = endpoint + '?url=' + encodeURIComponent(videoUrl) + '&callback=' + callback + '&width=640';
    console.log(url);
    return url;
  },

  loadVimeoData: function(url)
  {
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', url);
    document.getElementsByTagName('head').item(0).appendChild(js);
  },

  clickListener: function(event)
  {
    var vimeoWidget = document.getElementById('embed');
    vimeoWidget.removeChild(vimeoWidget.firstChild);
    vimeoWidget.appendChild(document.createTextNode("Loading video..."));
    var url = VimeoWidget.buildURL();
    VimeoWidget.loadVimeoData(url);
  },

  // This function puts the video on the page
  embedVideo: function(video)
  {
    document.getElementById('embed').innerHTML = unescape(video.html);
  },

  getRandomInt: function(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getRandomVideoID: function()
  {
    var largestID = 200000000;
    var idValid = false;

    while (idValid == false ) {
      var videoID = VimeoWidget.getRandomInt(1,largestID);
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
};

VimeoWidget.init();
