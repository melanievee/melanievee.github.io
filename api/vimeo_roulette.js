var VimeoWidget =
{

  init: function()
  {
    $(vimeo__respin).bind("click",VimeoWidget.clickListener);

    VimeoWidget.getRandomVideo();
  },

  getRandomVideo: function(tryCount)
  {
    tryCount = tryCount || 0;
    var largestID = 200000000;
    var videoID = VimeoWidget.getRandomInt(1,largestID);
    var xhr = new XMLHttpRequest();
    var retryLimit = 3;

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var url = VimeoWidget.buildURL(videoID);
          VimeoWidget.loadVimeoData(url);
        } else if (xhr.status === 404) {
          // Video Not Found, generate new ID
          videoID = VimeoWidget.getRandomVideo(tryCount);
        } else {
          // Limit tries to 3 for all non-404 and non-200 responses.
          tryCount++;
          if ( tryCount <= retryLimit ) {
            videoID = VimeoWidget.getRandomVideo(tryCount);
          } else {
            VimeoWidget.problemGettingVideo(tryCount);
          }
        }
      }
    }
    xhr.open("HEAD", "https://vimeo.com/api/v2/video/" + videoID + ".json", true);
    xhr.send();
  },

  getRandomInt: function(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  buildURL: function(videoID)
  {
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

  embedVideo: function(video)
  {
    document.getElementById('vimeo__embed').innerHTML = unescape(video.html);
  },

  clickListener: function(event)
  {
    VimeoWidget.replaceVideoWithMessage("Loading video...");
    VimeoWidget.getRandomVideo();
  },

  problemGettingVideo: function()
  {
    VimeoWidget.replaceVideoWithMessage("We're sorry, there appears to be a problem connecting with Vimeo. Please try again later.");
  },

  replaceVideoWithMessage: function(message)
  {
    var vimeoWidget = document.getElementById('vimeo__embed');
    vimeoWidget.removeChild(vimeoWidget.firstChild);
    vimeoWidget.appendChild(document.createTextNode(message));
  }
};

VimeoWidget.init();
