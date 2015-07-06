(function() {
  var resourceCache = {};
  var loading = [];
  var readyCallbacks = [];

  //Loads an image url or an array of image urls
  function load(urlOrArr) {
    if(urlOrArr instanceof Array) {
      urlOrArr.forEach(function(url) {
        _load(url);
      });
    }
    else {
      _load(urlOrArr);
    }
  }

  function _load(url) {
    if(resourceCache[url]) {
      return resourceCache[url];
    }
    else {
      var img = new Image();
      img.onload = function() {
        resourcheCache[url] = img;

        if(isReady()) {
          readyCallBacks.forEach(function(func) { func(); });
        }
      };
      resourcheCache[url] = false;
      img.src = url;
    }
  }

  function get(url){
    return resourcheCache[url];
  }

  function isReady() {
    var ready = true;
    for(var k in resourcheCache) {
      if(resourcheCache.hasOwnProperty(k) &&
        !resourcheCache[k]) {
          ready = false;
        }
    }
    return ready;
  }

  function onReady(func) {
    readyCallbacks.push(func);
  }

  window.resources = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
  };
})();
