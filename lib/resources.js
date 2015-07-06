(function() {
  var resourceCache = {}; //creates an object, which is a cache
  var loading = [];
  var readyCallBacks = [];

  //Loads an image url or an array of image urls
  function load(urlOrArr) { //new function load which takes in a url or an array
    if(urlOrArr instanceof Array) { //If the given parameters are an array
      urlOrArr.forEach(function(url) { //Then for each url
        _load(url); //Each url is loaded
      });
    }
    else {
      _load(urlOrArr);//Otherwise just load the url. Lol.
    }
  }

//New function _load which... surprise. Loads images.
  function _load(url) { //function definition
    if(resourceCache[url]) { //If the url is present in the resourceCache
      return resourceCache[url]; //Then simply return the attached image
    }
    else {
      var img = new Image(); //Otherwise create a new image
      img.onload = function() {
        resourceCache[url] = img; //Load the image into the array

        if(isReady()) { //Once the image is loaded
          readyCallBacks.forEach(function(func) { func(); });
        }
      };
      resourceCache[url] = false; //Tells the computer that there is no url in the cache
      img.src = url; //Sets img.src to the url
    }
  }

  //Function get which returns the associated image of a url
  function get(url){
    return resourceCache[url];
  }

  //new function isReady which checks whether or not the resourceCache
  function isReady() {
    var ready = true;
    for(var k in resourceCache) { //For every element in resourceCache
      if(resourceCache.hasOwnProperty(k) && //If it has the property but it doesn't exist in the cache
        !resourceCache[k]) {
          ready = false; //Tell the computer it is not ready
        }
    }
    return ready; //returns ready
  }

  //Once it's ready
  function onReady(func) {
    readyCallBacks.push(func); //Add the function to the array of functions to be executed
  }

  window.resources = { //Resources of the window object
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
  };
})();
