;(function(){
  var modalBlock       = document.querySelector(".modal-content");
  var modalMap         = document.querySelector(".modal-map");
  var modalMapCloseBtn = modalMap.querySelector(".modal-map__close");
  var showMapBtn       = document.querySelector(".main-nav__link--map");
  var overlay          = document.querySelector(".modal-content-overlay");
  var modalClsBtn      = modalBlock.querySelector(".modal-close-btn");

  modalClsBtn.addEventListener("click", function() {
    hideModal();
  })
  // VK.init({apiId: 5903616, onlyWidgets: true});

  var Tap = {};
  var utils = {};

  utils.attachEvent = function(element, eventName, callback) {
      if ('addEventListener' in window) {
          return element.addEventListener(eventName, callback, false);
      }
  };

  utils.fireFakeEvent = function(e, eventName) {
      if (document.createEvent) {
          return e.target.dispatchEvent(utils.createEvent(eventName));
      }
  };

  utils.createEvent = function(name) {
      if (document.createEvent) {
          var evnt = window.document.createEvent('HTMLEvents');

          evnt.initEvent(name, true, true);
          evnt.eventName = name;

          return evnt;
      }
  };

  utils.getRealEvent = function(e) {
      if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length) {
          return e.originalEvent.touches[0];
      } else if (e.touches && e.touches.length) {
          return e.touches[0];
      }

      return e;
  };

  var eventMatrix = [{
      // Touchable devices
      test: ('propertyIsEnumerable' in window || 'hasOwnProperty' in document) && (window.propertyIsEnumerable('ontouchstart') || document.hasOwnProperty('ontouchstart') || window.hasOwnProperty('ontouchstart')),
      events: {
          start: 'touchstart',
          move: 'touchmove',
          end: 'touchend'
      }
  }, {
      // IE10
      test: window.navigator.msPointerEnabled,
      events: {
          start: 'MSPointerDown',
          move: 'MSPointerMove',
          end: 'MSPointerUp'
      }
  }, {
      // Modern device agnostic web
      test: window.navigator.pointerEnabled,
      events: {
          start: 'pointerdown',
          move: 'pointermove',
          end: 'pointerup'
      }
  }];

  Tap.options = {
      eventName: 'tap',
      fingerMaxOffset: 11
  };

  var attachDeviceEvent, init, handlers, deviceEvents,
      coords = {};

  attachDeviceEvent = function(eventName) {
      return utils.attachEvent(document.documentElement, deviceEvents[eventName], handlers[eventName]);
  };

  handlers = {
      start: function(e) {
          e = utils.getRealEvent(e);

          coords.start = [e.pageX, e.pageY];
          coords.offset = [0, 0];
      },

      move: function(e) {
          if (!coords.start && !coords.move) {
              return false;
          }

          e = utils.getRealEvent(e);

          coords.move = [e.pageX, e.pageY];
          coords.offset = [
              Math.abs(coords.move[0] - coords.start[0]),
              Math.abs(coords.move[1] - coords.start[1])
          ];
      },

      end: function(e) {
          e = utils.getRealEvent(e);

          if (coords.offset[0] < Tap.options.fingerMaxOffset && coords.offset[1] < Tap.options.fingerMaxOffset && !utils.fireFakeEvent(e, Tap.options.eventName)) {
              // Windows Phone 8.0 trigger `click` after `pointerup` firing
              // #16 https://github.com/pukhalski/tap/issues/16
              if (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) {
                  var preventDefault = function(clickEvent) {
                      clickEvent.preventDefault();
                      e.target.removeEventListener('click', preventDefault);
                  };

                  e.target.addEventListener('click', preventDefault, false);
              }

              e.preventDefault();
          }

          coords = {};
      },

      click: function(e) {
          if (!utils.fireFakeEvent(e, Tap.options.eventName)) {
              return e.preventDefault();
          }
      }
  };

  init = function() {
      var i = 0;

      for (; i < eventMatrix.length; i++) {
          if (eventMatrix[i].test) {
              deviceEvents = eventMatrix[i].events;

              attachDeviceEvent('start');
              attachDeviceEvent('move');
              attachDeviceEvent('end');

              break;
          }
      }

      return utils.attachEvent(document.documentElement, 'click', handlers.click);
  };

  utils.attachEvent(window, 'load', init);

  if (typeof define === 'function' && define.amd) {
      define(function() {
          init();

          return Tap;
      });
  } else {
      window.Tap = Tap;
  }

  initModal();

  function initModal() {    
    modalBlock.classList.add("modal-content--show");
    overlay.classList.add("modal-content--show");
  }

  function hideModal() {
    modalBlock.classList.remove("modal-content--show");
    overlay.classList.remove("modal-content--show");  
  }

  showMapBtn.addEventListener("tap", function(event) {
    event.preventDefault();       
    modalMap.classList.add("modal-map--show"); 
    overlay.classList.add("modal-content--show"); 
    initialize();      
  })

  modalMapCloseBtn.addEventListener("tap", function(event) {
    event.preventDefault();
    modalMap.classList.remove("modal-map--show");    
    overlay.classList.remove("modal-content--show");    
  });

 
  function opacity(block) {
    overlay.classList.add("modal-content--opacity");
    setTimeout(function() {
    modalBlock.classList.remove("modal-content--show");
     overlay.classList.remove("modal-content--show");
     overlay.classList.remove("modal-content--opacity");
     // initSlider();
    }, 300);
  }

  setTimeout(function() {    
    opacity(modalBlock)}, 7000);  

  function initialize() {
   var myLatlng = new google.maps.LatLng(53.599323, 55.890861);
   var myOptions = {
     zoom: 15,
     center: myLatlng,
     mapTypeId: google.maps.MapTypeId.ROADMAP
   }    
   var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
   var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title:"А-гараж",
        icon: {
              url: "img/marker.png",
              scaledSize: new google.maps.Size(130, 110)
      }
    });
  }  

})();
