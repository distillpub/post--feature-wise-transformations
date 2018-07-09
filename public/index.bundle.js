/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(1)
  , _browser = 'unknown'
  ;

// http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
if (/*@cc_on!@*/false || !!document.documentMode) { // internet explorer
  _browser = 'ie';
}

module.exports = {
  svgNS:  'http://www.w3.org/2000/svg'
, xmlNS:  'http://www.w3.org/XML/1998/namespace'
, xmlnsNS:  'http://www.w3.org/2000/xmlns/'
, xlinkNS:  'http://www.w3.org/1999/xlink'
, evNS:  'http://www.w3.org/2001/xml-events'

  /**
   * Get svg dimensions: width and height
   *
   * @param  {SVGSVGElement} svg
   * @return {Object}     {width: 0, height: 0}
   */
, getBoundingClientRectNormalized: function(svg) {
    if (svg.clientWidth && svg.clientHeight) {
      return {width: svg.clientWidth, height: svg.clientHeight}
    } else if (!!svg.getBoundingClientRect()) {
      return svg.getBoundingClientRect();
    } else {
      throw new Error('Cannot get BoundingClientRect for SVG.');
    }
  }

  /**
   * Gets g element with class of "viewport" or creates it if it doesn't exist
   *
   * @param  {SVGSVGElement} svg
   * @return {SVGElement}     g (group) element
   */
, getOrCreateViewport: function(svg, selector) {
    var viewport = null

    if (Utils.isElement(selector)) {
      viewport = selector
    } else {
      viewport = svg.querySelector(selector)
    }

    // Check if there is just one main group in SVG
    if (!viewport) {
      var childNodes = Array.prototype.slice.call(svg.childNodes || svg.children).filter(function(el){
        return el.nodeName !== 'defs' && el.nodeName !== '#text'
      })

      // Node name should be SVGGElement and should have no transform attribute
      // Groups with transform are not used as viewport because it involves parsing of all transform possibilities
      if (childNodes.length === 1 && childNodes[0].nodeName === 'g' && childNodes[0].getAttribute('transform') === null) {
        viewport = childNodes[0]
      }
    }

    // If no favorable group element exists then create one
    if (!viewport) {
      var viewportId = 'viewport-' + new Date().toISOString().replace(/\D/g, '');
      viewport = document.createElementNS(this.svgNS, 'g');
      viewport.setAttribute('id', viewportId);

      // Internet Explorer (all versions?) can't use childNodes, but other browsers prefer (require?) using childNodes
      var svgChildren = svg.childNodes || svg.children;
      if (!!svgChildren && svgChildren.length > 0) {
        for (var i = svgChildren.length; i > 0; i--) {
          // Move everything into viewport except defs
          if (svgChildren[svgChildren.length - i].nodeName !== 'defs') {
            viewport.appendChild(svgChildren[svgChildren.length - i]);
          }
        }
      }
      svg.appendChild(viewport);
    }

    // Parse class names
    var classNames = [];
    if (viewport.getAttribute('class')) {
      classNames = viewport.getAttribute('class').split(' ')
    }

    // Set class (if not set already)
    if (!~classNames.indexOf('svg-pan-zoom_viewport')) {
      classNames.push('svg-pan-zoom_viewport')
      viewport.setAttribute('class', classNames.join(' '))
    }

    return viewport
  }

  /**
   * Set SVG attributes
   *
   * @param  {SVGSVGElement} svg
   */
  , setupSvgAttributes: function(svg) {
    // Setting default attributes
    svg.setAttribute('xmlns', this.svgNS);
    svg.setAttributeNS(this.xmlnsNS, 'xmlns:xlink', this.xlinkNS);
    svg.setAttributeNS(this.xmlnsNS, 'xmlns:ev', this.evNS);

    // Needed for Internet Explorer, otherwise the viewport overflows
    if (svg.parentNode !== null) {
      var style = svg.getAttribute('style') || '';
      if (style.toLowerCase().indexOf('overflow') === -1) {
        svg.setAttribute('style', 'overflow: hidden; ' + style);
      }
    }
  }

/**
 * How long Internet Explorer takes to finish updating its display (ms).
 */
, internetExplorerRedisplayInterval: 300

/**
 * Forces the browser to redisplay all SVG elements that rely on an
 * element defined in a 'defs' section. It works globally, for every
 * available defs element on the page.
 * The throttling is intentionally global.
 *
 * This is only needed for IE. It is as a hack to make markers (and 'use' elements?)
 * visible after pan/zoom when there are multiple SVGs on the page.
 * See bug report: https://connect.microsoft.com/IE/feedback/details/781964/
 * also see svg-pan-zoom issue: https://github.com/ariutta/svg-pan-zoom/issues/62
 */
, refreshDefsGlobal: Utils.throttle(function() {
    var allDefs = document.querySelectorAll('defs');
    var allDefsCount = allDefs.length;
    for (var i = 0; i < allDefsCount; i++) {
      var thisDefs = allDefs[i];
      thisDefs.parentNode.insertBefore(thisDefs, thisDefs);
    }
  }, this ? this.internetExplorerRedisplayInterval : null)

  /**
   * Sets the current transform matrix of an element
   *
   * @param {SVGElement} element
   * @param {SVGMatrix} matrix  CTM
   * @param {SVGElement} defs
   */
, setCTM: function(element, matrix, defs) {
    var that = this
      , s = 'matrix(' + matrix.a + ',' + matrix.b + ',' + matrix.c + ',' + matrix.d + ',' + matrix.e + ',' + matrix.f + ')';

    element.setAttributeNS(null, 'transform', s);
    if ('transform' in element.style) {
      element.style.transform = s;
    } else if ('-ms-transform' in element.style) {
      element.style['-ms-transform'] = s;
    } else if ('-webkit-transform' in element.style) {
      element.style['-webkit-transform'] = s;
    }

    // IE has a bug that makes markers disappear on zoom (when the matrix "a" and/or "d" elements change)
    // see http://stackoverflow.com/questions/17654578/svg-marker-does-not-work-in-ie9-10
    // and http://srndolha.wordpress.com/2013/11/25/svg-line-markers-may-disappear-in-internet-explorer-11/
    if (_browser === 'ie' && !!defs) {
      // this refresh is intended for redisplaying the SVG during zooming
      defs.parentNode.insertBefore(defs, defs);
      // this refresh is intended for redisplaying the other SVGs on a page when panning a given SVG
      // it is also needed for the given SVG itself, on zoomEnd, if the SVG contains any markers that
      // are located under any other element(s).
      window.setTimeout(function() {
        that.refreshDefsGlobal();
      }, that.internetExplorerRedisplayInterval);
    }
  }

  /**
   * Instantiate an SVGPoint object with given event coordinates
   *
   * @param {Event} evt
   * @param  {SVGSVGElement} svg
   * @return {SVGPoint}     point
   */
, getEventPoint: function(evt, svg) {
    var point = svg.createSVGPoint()

    Utils.mouseAndTouchNormalize(evt, svg)

    point.x = evt.clientX
    point.y = evt.clientY

    return point
  }

  /**
   * Get SVG center point
   *
   * @param  {SVGSVGElement} svg
   * @return {SVGPoint}
   */
, getSvgCenterPoint: function(svg, width, height) {
    return this.createSVGPoint(svg, width / 2, height / 2)
  }

  /**
   * Create a SVGPoint with given x and y
   *
   * @param  {SVGSVGElement} svg
   * @param  {Number} x
   * @param  {Number} y
   * @return {SVGPoint}
   */
, createSVGPoint: function(svg, x, y) {
    var point = svg.createSVGPoint()
    point.x = x
    point.y = y

    return point
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
  /**
   * Extends an object
   *
   * @param  {Object} target object to extend
   * @param  {Object} source object to take properties from
   * @return {Object}        extended object
   */
  extend: function(target, source) {
    target = target || {};
    for (var prop in source) {
      // Go recursively
      if (this.isObject(source[prop])) {
        target[prop] = this.extend(target[prop], source[prop])
      } else {
        target[prop] = source[prop]
      }
    }
    return target;
  }

  /**
   * Checks if an object is a DOM element
   *
   * @param  {Object}  o HTML element or String
   * @return {Boolean}   returns true if object is a DOM element
   */
, isElement: function(o){
    return (
      o instanceof HTMLElement || o instanceof SVGElement || o instanceof SVGSVGElement || //DOM2
      (o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string')
    );
  }

  /**
   * Checks if an object is an Object
   *
   * @param  {Object}  o Object
   * @return {Boolean}   returns true if object is an Object
   */
, isObject: function(o){
    return Object.prototype.toString.call(o) === '[object Object]';
  }

  /**
   * Checks if variable is Number
   *
   * @param  {Integer|Float}  n
   * @return {Boolean}   returns true if variable is Number
   */
, isNumber: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * Search for an SVG element
   *
   * @param  {Object|String} elementOrSelector DOM Element or selector String
   * @return {Object|Null}                   SVG or null
   */
, getSvg: function(elementOrSelector) {
    var element
      , svg;

    if (!this.isElement(elementOrSelector)) {
      // If selector provided
      if (typeof elementOrSelector === 'string' || elementOrSelector instanceof String) {
        // Try to find the element
        element = document.querySelector(elementOrSelector)

        if (!element) {
          throw new Error('Provided selector did not find any elements. Selector: ' + elementOrSelector)
          return null
        }
      } else {
        throw new Error('Provided selector is not an HTML object nor String')
        return null
      }
    } else {
      element = elementOrSelector
    }

    if (element.tagName.toLowerCase() === 'svg') {
      svg = element;
    } else {
      if (element.tagName.toLowerCase() === 'object') {
        svg = element.contentDocument.documentElement;
      } else {
        if (element.tagName.toLowerCase() === 'embed') {
          svg = element.getSVGDocument().documentElement;
        } else {
          if (element.tagName.toLowerCase() === 'img') {
            throw new Error('Cannot script an SVG in an "img" element. Please use an "object" element or an in-line SVG.');
          } else {
            throw new Error('Cannot get SVG.');
          }
          return null
        }
      }
    }

    return svg
  }

  /**
   * Attach a given context to a function
   * @param  {Function} fn      Function
   * @param  {Object}   context Context
   * @return {Function}           Function with certain context
   */
, proxy: function(fn, context) {
    return function() {
      return fn.apply(context, arguments)
    }
  }

  /**
   * Returns object type
   * Uses toString that returns [object SVGPoint]
   * And than parses object type from string
   *
   * @param  {Object} o Any object
   * @return {String}   Object type
   */
, getType: function(o) {
    return Object.prototype.toString.apply(o).replace(/^\[object\s/, '').replace(/\]$/, '')
  }

  /**
   * If it is a touch event than add clientX and clientY to event object
   *
   * @param  {Event} evt
   * @param  {SVGSVGElement} svg
   */
, mouseAndTouchNormalize: function(evt, svg) {
    // If no clientX then fallback
    if (evt.clientX === void 0 || evt.clientX === null) {
      // Fallback
      evt.clientX = 0
      evt.clientY = 0

      // If it is a touch event
      if (evt.touches !== void 0 && evt.touches.length) {
        if (evt.touches[0].clientX !== void 0) {
          evt.clientX = evt.touches[0].clientX
          evt.clientY = evt.touches[0].clientY
        } else if (evt.touches[0].pageX !== void 0) {
          var rect = svg.getBoundingClientRect();

          evt.clientX = evt.touches[0].pageX - rect.left
          evt.clientY = evt.touches[0].pageY - rect.top
        }
      // If it is a custom event
      } else if (evt.originalEvent !== void 0) {
        if (evt.originalEvent.clientX !== void 0) {
          evt.clientX = evt.originalEvent.clientX
          evt.clientY = evt.originalEvent.clientY
        }
      }
    }
  }

  /**
   * Check if an event is a double click/tap
   * TODO: For touch gestures use a library (hammer.js) that takes in account other events
   * (touchmove and touchend). It should take in account tap duration and traveled distance
   *
   * @param  {Event}  evt
   * @param  {Event}  prevEvt Previous Event
   * @return {Boolean}
   */
, isDblClick: function(evt, prevEvt) {
    // Double click detected by browser
    if (evt.detail === 2) {
      return true;
    }
    // Try to compare events
    else if (prevEvt !== void 0 && prevEvt !== null) {
      var timeStampDiff = evt.timeStamp - prevEvt.timeStamp // should be lower than 250 ms
        , touchesDistance = Math.sqrt(Math.pow(evt.clientX - prevEvt.clientX, 2) + Math.pow(evt.clientY - prevEvt.clientY, 2))

      return timeStampDiff < 250 && touchesDistance < 10
    }

    // Nothing found
    return false;
  }

  /**
   * Returns current timestamp as an integer
   *
   * @return {Number}
   */
, now: Date.now || function() {
    return new Date().getTime();
  }

  // From underscore.
  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
// jscs:disable
// jshint ignore:start
, throttle: function(func, wait, options) {
    var that = this;
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : that.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = that.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }
// jshint ignore:end
// jscs:enable

  /**
   * Create a requestAnimationFrame simulation
   *
   * @param  {Number|String} refreshRate
   * @return {Function}
   */
, createRequestAnimationFrame: function(refreshRate) {
    var timeout = null

    // Convert refreshRate to timeout
    if (refreshRate !== 'auto' && refreshRate < 60 && refreshRate > 1) {
      timeout = Math.floor(1000 / refreshRate)
    }

    if (timeout === null) {
      return window.requestAnimationFrame || requestTimeout(33)
    } else {
      return requestTimeout(timeout)
    }
  }
}

/**
 * Create a callback that will execute after a given timeout
 *
 * @param  {Function} timeout
 * @return {Function}
 */
function requestTimeout(timeout) {
  return function(callback) {
    window.setTimeout(callback, timeout)
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var SvgPanZoom = __webpack_require__(4);

module.exports = SvgPanZoom;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
    d3.selectAll(".collapsible").on("click", function () {
        d3.selectAll('.content[content-name="' + d3.select(this).attr("content-name") + '"]').style("display", function () {
            return d3.select(this).style("display") === "block" ? "none" : "block";
        });
        var symbolSpan = d3.select(this).select("span");
        symbolSpan.html(symbolSpan.html() === "+" ? "-" : "+");
    });
    d3.selectAll(".expand-collapse-button").on("click", function () {
        var mode = d3.select(this).html();
        var contentType = d3.select(this).attr("content-type");
        d3.select(this).html(mode === "expand all" ? "collapse all" : "expand all");
        d3.selectAll('.content[content-type="' + contentType + '"]').style("display", function () {
            return mode === "expand all" ? "block" : "none";
        });
        d3.selectAll('.collapsible[content-type="' + contentType + '"]').select("span").html(function () {
            return mode === "expand all" ? "-" : "+";
        });
    });
})();

(function () {
    var svg = d3.select("#film-layer-diagram > svg");
    var features = [0.9, -0.5, -0.8];
    var featureMaps = [[[-0.6, -0.6, 0.8], [0.6, 0.7, 0.4], [-0.8, 0.8, 0.9]], [[0.9, -0.1, 0.5], [-0.8, -0.7, 0.5], [-0.3, -0.9, -0.2]], [[-0.5, -0.9, 0.6], [-0.2, -0.4, 0.2], [-0.6, 0.1, -0.3]]];
    var gammas = [-1.6, 0.8, 1.8];
    var betas = [1.0, 0.5, -0.5];
    var data = [];
    for (var i = 0; i < 3; i++) {
        data.push({ feature: features[i], featureMap: [], gamma: gammas[i], beta: betas[i] });
    }
    var convData = [];
    for (var k = 0; k < 3; k++) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var d = { feature: featureMaps[i][j][k], gamma: gammas[k], beta: betas[k] };
                convData.push(d);
                data[2 - k].featureMap.push(d);
            }
        }
    }
    var amplitudeScale = d3.scaleSqrt().domain([0.0, 2.0]).range([0.0, 0.8]).clamp(true);
    var mouseScale = d3.scaleLinear().domain([0.0, 40.0]).range([2.0, -2.0]).clamp(true);
    svg.select("g#mlp-figure g#input-layer").selectAll("g.feature").data(data);
    svg.select("g#mlp-figure g#gamma").selectAll("g.feature").data(data);
    svg.select("g#mlp-figure g#beta").selectAll("g.feature").data(data);
    svg.select("g#mlp-figure g#scaled-layer").selectAll("g.feature").data(data);
    svg.select("g#mlp-figure g#shifted-layer").selectAll("g.feature").data(data);
    svg.select("g#cnn-figure g#input-layer").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure g#scaled-layer").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure g#shifted-layer").selectAll("g.feature").data(convData);

    function updateSingle(selection, accessor) {
        selection.selectAll("g.feature").each(function (d, i) {
            var r = accessor(d);
            var s = Math.sign(r) * amplitudeScale(Math.abs(r));
            d3.select(this).select(".vector-patch").attr("opacity", Math.abs(s)).attr("href", r < 0 ? "#vector-patch-negative" : "#vector-patch-positive");
            d3.select(this).select(".figure-line").attr("transform", "matrix(" + [s, 0, 0, s, 20, 20] + ")");
        });
    }
    function updateSingleConv(selection, accessor) {
        selection.selectAll("g.feature").each(function (d, i) {
            var r = accessor(d);
            var s = Math.sign(r) * amplitudeScale(Math.abs(r));
            d3.select(this).select(".convolutional-patch").attr("opacity", Math.abs(s)).attr("href", r < 0 ? "#convolutional-patch-negative" : "#convolutional-patch-positive");
            d3.select(this).select(".vector-patch").attr("opacity", Math.abs(s)).attr("href", r < 0 ? "#vector-patch-negative" : "#vector-patch-positive");
            d3.select(this).select(".figure-line").attr("transform", "matrix(" + [s, 0, 0, s, 15, 15] + ")");
        });
    }
    function update() {
        updateSingle(svg.select("g#mlp-figure g#input-layer"), function (d) {
            return d.feature;
        });
        updateSingle(svg.select("g#mlp-figure g#gamma"), function (d) {
            return d.gamma;
        });
        updateSingle(svg.select("g#mlp-figure g#beta"), function (d) {
            return d.beta;
        });
        updateSingle(svg.select("g#mlp-figure g#scaled-layer"), function (d) {
            return d.gamma * d.feature;
        });
        updateSingle(svg.select("g#mlp-figure g#shifted-layer"), function (d) {
            return d.gamma * d.feature + d.beta;
        });
        updateSingleConv(svg.select("g#cnn-figure g#input-layer"), function (d) {
            return d.feature;
        });
        updateSingleConv(svg.select("g#cnn-figure g#scaled-layer"), function (d) {
            return d.gamma * d.feature;
        });
        updateSingleConv(svg.select("g#cnn-figure g#shifted-layer"), function (d) {
            return d.gamma * d.feature + d.beta;
        });
    }
    update();
    svg.select("g#mlp-figure g#gamma").selectAll("g.feature").style("cursor", "pointer").on("mousemove", function (d) {
        var newValue = mouseScale(d3.mouse(this)[1]);
        d.gamma = newValue;
        for (var i = 0; i < 9; i++) {
            d.featureMap[i].gamma = newValue;
        }
        update();
    });
    svg.select("g#mlp-figure g#beta").selectAll("g.feature").style("cursor", "pointer").on("mousemove", function (d, i) {
        var newValue = mouseScale(d3.mouse(this)[1]);
        d.beta = newValue;
        for (var i = 0; i < 9; i++) {
            d.featureMap[i].beta = newValue;
        }
        update();
    });
})();

(function () {
    var svg = d3.select("#film-vs-attention-diagram > svg");
    var featureMaps = [[[-0.6, -0.6, 0.8], [0.6, 0.7, 0.4], [-0.8, 0.8, 0.9]], [[0.9, -0.1, 0.5], [-0.8, -0.7, 0.5], [-0.3, -0.9, -0.2]], [[0.8, -0.9, 0.6], [-0.2, -0.4, 0.2], [-0.6, 0.1, -0.3]]];

    var gammas = [-1.6, 0.8, 1.8];
    var betas = [1.0, 0.5, -0.5];

    // Note Alpha must be positif
    var alpha = [[0.6, 1.7, 1], [0.5, 4, 10], [0.8, 3, 7]];
    var alpha_norm = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            alpha_norm = alpha_norm + alpha[i][j];
        }
    }
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            alpha[i][j] = 2 * alpha[i][j] / alpha_norm;
        }
    }

    var data = [];
    for (var k = 0; k < 3; k++) {
        data.push({ featureMap: featureMaps[k], gamma: gammas[k], beta: betas[k], alpha: alpha });
    }

    var convData = [];
    for (var k = 0; k < 3; k++) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var d = { feature: featureMaps[k][i][j], gamma: gammas[k], beta: betas[k], alpha: alpha[i][j] };
                convData.push(d);
            }
        }
    }

    var amplitudeScale = d3.scaleSqrt().domain([0.0, 2.0]).range([0.0, 0.8]).clamp(true);

    function updatePatch(selection, accessor) {
        selection.selectAll("g.feature").each(function (d, i) {
            var r = accessor(d);
            var s = Math.sign(r) * amplitudeScale(Math.abs(r));
            d3.select(this).select(".convolutional-patch").attr("opacity", Math.abs(s)).attr("href", r < 0 ? "#convolutional-patch-negative" : "#convolutional-patch-positive");
        });
    }

    // Attention pipeline
    svg.select("g#cnn-figure-attention g#input-conv-att").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure-attention g#alpha-conv-att").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure-attention g#out-conv-att").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure-attention g#out-feat-att").selectAll("g.feature").data(data);

    // FiLM pipeline
    svg.select("g#cnn-figure-film g#input-conv-film").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure-film g#gamma-conv-film").selectAll("g.feature").data(data);
    svg.select("g#cnn-figure-film g#out-conv-film").selectAll("g.feature").data(convData);

    function update() {
        // Attention pipeline
        updatePatch(svg.select("g#cnn-figure-attention g#input-conv-att"), function (d) {
            return d.feature;
        });
        updatePatch(svg.select("g#cnn-figure-attention g#alpha-conv-att"), function (d) {
            return d.alpha;
        });
        updatePatch(svg.select("g#cnn-figure-attention g#out-conv-att"), function (d) {
            return d.alpha * d.feature;
        });
        updatePatch(svg.select("g#cnn-figure-attention g#out-feat-att"), function (d) {
            var attention_pool = 0;
            var n = 0;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    attention_pool = attention_pool + d.alpha[i][j] * d.featureMap[i][j];
                    n = n + 1;
                }
            }
            return attention_pool;
        });

        // FiLM pipeline
        updatePatch(svg.select("g#cnn-figure-film g#input-conv-film"), function (d) {
            return d.feature;
        });
        updatePatch(svg.select("g#cnn-figure-film g#gamma-conv-film"), function (d) {
            return d.gamma;
        });
        updatePatch(svg.select("g#cnn-figure-film g#out-conv-film"), function (d) {
            return d.gamma * d.feature;
        });
    }
    update();
})();

(function () {
    var setUp = function setUp(filename, keyword) {
        // Get references to important tags
        var svg = d3.select("#gamma-beta-diagram > svg");
        var scatterPlot = svg.select("#" + keyword + "-plot");
        var boundingBox = scatterPlot.select("rect");
        var legend = svg.select("#" + keyword + "-legend");

        // Retrieve scatter plot bounding box coordinates
        var xMin = parseInt(boundingBox.attr("x"));
        var xMax = xMin + parseInt(boundingBox.attr("width"));
        var yMin = parseInt(boundingBox.attr("y"));
        var yMax = yMin + parseInt(boundingBox.attr("height"));

        var colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FF9800", "#795548", "#9E9E9E"];

        var dataset;
        var xScale;
        var yScale;

        d3.json(filename, function (data) {
            dataset = data;

            // Create scales mapping gamma and beta values to bounding box
            // coordinates
            xScale = d3.scaleLinear().domain([1.15 * d3.min(dataset, function (d) {
                return d.gamma;
            }), 1.15 * d3.max(dataset, function (d) {
                return d.gamma;
            })]).rangeRound([xMin, xMax]);
            yScale = d3.scaleLinear().domain([1.15 * d3.min(dataset, function (d) {
                return d.beta;
            }), 1.15 * d3.max(dataset, function (d) {
                return d.beta;
            })]).rangeRound([yMax, yMin]);

            // Set up axes
            scatterPlot.select("#x-axis").attr("d", "M" + xMin + " " + yScale(0) + " L " + xMax + " " + yScale(0));
            scatterPlot.select("#x-axis-label").attrs({ "x": xMax - 10, "y": yScale(0.0) + 10 });
            scatterPlot.select("#y-axis").attr("d", "M" + xScale(0) + " " + yMax + " L " + xScale(0) + " " + yMin);
            scatterPlot.select("#y-axis-label").attrs({ "x": xScale(0.0) + 10, "y": yMin });

            // Dispatch data points into groups by feature map
            scatterPlot.selectAll("g").data(colors).enter().append("g").style("opacity", 1.0).each(function (c, i) {
                d3.select(this).selectAll("circle").data(dataset.filter(function (d) {
                    return d.feature_map == i;
                })).enter().append("circle").attrs({
                    "cx": function cx(d) {
                        return xScale(d.gamma);
                    },
                    "cy": function cy(d) {
                        return yScale(d.beta);
                    },
                    "r": 3.0
                }).style("fill", function (d) {
                    return colors[i];
                }).style("opacity", 0.6);
            });

            // Create legend
            legend.selectAll("circle").data(colors).enter().append("circle").attrs({
                "cx": function cx(d, i) {
                    return 18 * i;
                },
                "cy": 0,
                "r": 6,
                "stroke-width": 10,
                "stroke-opacity": 0,
                "stroke": "red"
            }).style("fill", function (d, i) {
                return colors[i];
            }).style("cursor", "pointer").style("opacity", 0.6);

            // Focuses on all points by resetting the opacities
            var focusAll = function focusAll() {
                legend.selectAll("circle").style("opacity", 0.6);
                scatterPlot.selectAll("g").style("opacity", 1.0);
            };

            // Focuses on a single feature map by lowering other feature map
            // opacities
            var focus = function focus(j) {
                legend.selectAll("circle").style("opacity", function (d, i) {
                    return i == j ? 0.6 : 0.1;
                });
                scatterPlot.selectAll("g").style("opacity", function (d, i) {
                    return i == j ? 1.0 : 0.1;
                });
            };

            // Add hovering behavior to legend
            legend.selectAll("circle").on("mouseover", function (d, i) {
                focus(i);
            }).on("mouseout", focusAll);

            focusAll();
        });
    };
    setUp('data/clevr_gamma_beta_subsampled.json', 'clevr');
    setUp('data/style_gamma_beta_subsampled.json', 'style-transfer');
})();

(function () {
    var processExample = function processExample() {
        var svg = d3.select("#style-interpolation-diagram > svg");
        var styleSelect1 = svg.selectAll("#style-1-select image").attr('cursor', 'pointer');
        var styleSelect2 = svg.selectAll("#style-2-select image").attr('cursor', 'pointer');
        var contentSelect = svg.selectAll("#content-select image").attr('cursor', 'pointer');
        var interpolationImages = svg.selectAll("#interpolation image");
        var selectedImages = {
            'content': 0,
            'style1': 0,
            'style2': 0
        };

        var updateImages = function updateImages() {
            interpolationImages.attr("xlink:href", function (d, i) {
                var content = selectedImages.content,
                    style1 = selectedImages.style1,
                    style2 = selectedImages.style2;

                var href = "images/stylized-" + (content + 1) + "-" + (style1 + 1) + "-" + (style2 + 1) + "-" + (i + 1) + ".jpg";
                return href;
            });

            styleSelect1.style('opacity', function (d, i) {
                return i == selectedImages['style1'] ? 1 : 0.1;
            });
            styleSelect2.style('opacity', function (d, i) {
                return i == selectedImages['style2'] ? 1 : 0.1;
            });
            contentSelect.style('opacity', function (d, i) {
                return i == selectedImages['content'] ? 1 : 0.1;
            });
        };

        var updateStyle = function updateStyle(key) {
            return function (d, i) {
                selectedImages[key] = i;
                updateImages();
            };
        };

        styleSelect1.on("click", updateStyle('style1'));
        styleSelect2.on("click", updateStyle('style2'));
        contentSelect.on("click", updateStyle('content'));

        updateImages();
    };
    processExample();
})();

(function () {
    var processExample = function processExample(example) {
        var svg = d3.select("#question-interpolation-diagram > svg");
        var imageSelector = svg.select("#example-" + example + " > .image-selector");

        var xMin = +imageSelector.select("line").attr("x1");
        var xMax = +imageSelector.select("line").attr("x2");
        var nTicks = 11;
        var length = (xMax - xMin) / (nTicks - 1.0);
        var ticks = [];
        for (var i = 0; i < nTicks; i++) {
            ticks.push(xMin + i * length);
        }

        var circle = imageSelector.append("circle").attrs({ "cx": ticks[0], "cy": 0, "r": 6 }).style("cursor", "pointer").classed("figure-path", true);

        var drag = d3.drag().on("drag", function () {
            var newX = Math.min(ticks[nTicks - 1], Math.max(ticks[0], d3.event.x));
            var newTick = Math.round((newX - ticks[0]) / length);
            newX = ticks[0] + length * newTick;
            d3.select(this).attr("cx", newX);
            svg.select("mask#m-" + example + " > image").attr("xlink:href", "images/question-interpolation-" + example + "-mask-" + (+newTick + 1) + ".png");
        });

        drag(circle);
    };
    processExample("1");
    processExample("2");
})();

(function () {
    var setUp = function setUp(filename, keyword, color) {
        // Get references to important tags
        var svg = d3.select("#clevr-subcluster-diagram > svg");
        var scatterPlot = svg.select("#" + keyword + "-plot");
        var boundingBox = scatterPlot.select("rect");
        var legend = svg.select("#" + keyword + "-legend");

        // Retrieve scatter plot bounding box coordinates
        var xMin = parseInt(boundingBox.attr("x"));
        var xMax = xMin + parseInt(boundingBox.attr("width"));
        var yMin = parseInt(boundingBox.attr("y"));
        var yMax = yMin + parseInt(boundingBox.attr("height"));

        var colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FF9800", "#795548", "#9E9E9E"];

        var dataset;
        var xScale;
        var yScale;

        d3.json(filename, function (data) {
            dataset = data;

            // Create scales mapping gamma and beta values to bounding box
            // coordinates
            xScale = d3.scaleLinear().domain([1.15 * d3.min(dataset, function (d) {
                return d.gamma;
            }), 1.15 * d3.max(dataset, function (d) {
                return d.gamma;
            })]).rangeRound([xMin, xMax]);
            yScale = d3.scaleLinear().domain([1.15 * d3.min(dataset, function (d) {
                return d.beta;
            }), 1.15 * d3.max(dataset, function (d) {
                return d.beta;
            })]).rangeRound([yMax, yMin]);

            // Set up axes
            scatterPlot.select("#x-axis").attr("d", "M" + xMin + " " + yScale(0) + " L " + xMax + " " + yScale(0));
            scatterPlot.select("#x-axis-label").attrs({ "x": xMax - 10, "y": yScale(0.0) + 10 });
            scatterPlot.select("#y-axis").attr("d", "M" + xScale(0) + " " + yMax + " L " + xScale(0) + " " + yMin);
            scatterPlot.select("#y-axis-label").attrs({ "x": xScale(0.0) + 10, "y": yMin });

            var tooltip = d3.select("body").append("div").attr("id", "tooltip-clevr").attr("class", "tooltip figure-text").style("background", "#ddd").style("border-radius", "6px").style("padding", "10px").style("opacity", 0);

            // Display data points
            scatterPlot.selectAll("circle").data(dataset).enter().append("circle").attrs({
                "cx": function cx(d) {
                    return xScale(d.gamma);
                },
                "cy": function cy(d) {
                    return yScale(d.beta);
                },
                "r": 3.0
            }).style("fill", colors[color]).style("opacity", 0.6).style("cursor", "pointer").on("mouseover", function (d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.question.join(" ") + "?").style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
            }).on("mouseout", function (d) {
                tooltip.transition().duration(500).style("opacity", 0);
            });
        });
    };
    setUp('data/clevr_gamma_beta_words_subcluster_fm_26.json', 'first', 0);
    setUp('data/clevr_gamma_beta_words_subcluster_fm_76.json', 'second', 6);
})();

(function () {
    var colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B"];

    var question_words = ["front", "behind", "left", "right", "material", "rubber", "matte", "metal", "metallic", "shiny"];

    var setUp = function setUp(filename, keyword, color) {
        // Get references to important tags
        var svg = d3.select("#clevr-subcluster-color-words-diagram > svg");
        var scatterPlot = svg.select("#" + keyword + "-plot");
        var boundingBox = scatterPlot.select("rect");

        // Retrieve scatter plot bounding box coordinates
        var xMin = parseInt(boundingBox.attr("x"));
        var xMax = xMin + parseInt(boundingBox.attr("width"));
        var yMin = parseInt(boundingBox.attr("y"));
        var yMax = yMin + parseInt(boundingBox.attr("height"));

        var dataset;
        var xScale;
        var yScale;

        d3.json(filename, function (data) {
            dataset = data;

            // Create scales mapping gamma and beta values to bounding box
            // coordinates
            xScale = d3.scaleLinear().domain([1.15 * d3.min(dataset, function (d) {
                return d.gamma;
            }), 1.15 * d3.max(dataset, function (d) {
                return d.gamma;
            })]).rangeRound([xMin, xMax]);
            yScale = d3.scaleLinear().domain([1.15 * d3.min(dataset, function (d) {
                return d.beta;
            }), 1.15 * d3.max(dataset, function (d) {
                return d.beta;
            })]).rangeRound([yMax, yMin]);

            // Set up axes
            scatterPlot.select("#x-axis").attr("d", "M" + xMin + " " + yScale(0) + " L " + xMax + " " + yScale(0));
            scatterPlot.select("#x-axis-label").attrs({ "x": xMax - 10, "y": yScale(0.0) + 10 });
            scatterPlot.select("#y-axis").attr("d", "M" + xScale(0) + " " + yMax + " L " + xScale(0) + " " + yMin);
            scatterPlot.select("#y-axis-label").attrs({ "x": xScale(0.0) + 10, "y": yMin });

            var tooltip = d3.select("body").append("div").attr("id", "tooltip-clevr-words-clever").attr("class", "tooltip figure-text").style("background", "#ddd").style("border-radius", "6px").style("padding", "10px").style("opacity", 0);

            // Dispatch data points into groups by question type
            scatterPlot.selectAll("circle").data(dataset).enter().append("circle").attrs({
                "cx": function cx(d) {
                    return xScale(d.gamma);
                },
                "cy": function cy(d) {
                    return yScale(d.beta);
                },
                "r": 3.0
            }).style("fill", colors[color]).style("opacity", 0.6).style("cursor", "pointer").on("mouseover", function (d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.question.join(" ") + "?").style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
            }).on("mouseout", function (d) {
                tooltip.transition().duration(500).style("opacity", 0);
            });

            legend.selectAll("text").data(question_words).enter().append("text").attrs({
                "x": 20,
                "y": function y(d, i) {
                    return 20 * i;
                },
                "dy": "0.4em"
            }).classed("figure-text", true).style("cursor", "pointer").style("opacity", 0.6).text(function (d) {
                return d;
            });
        });
    };
    setUp('data/clevr_gamma_beta_words_subcluster_fm_26.json', 'first', 0);
    setUp('data/clevr_gamma_beta_words_subcluster_fm_92.json', 'second', 8);

    var svg = d3.select("#clevr-subcluster-color-words-diagram > svg");
    var legend = svg.select("#legend");
    var firstPlot = svg.select("#first-plot");
    var secondPlot = svg.select("#second-plot");

    // Create legend
    legend.selectAll("circle").data(question_words).enter().append("circle").attrs({
        "cx": 0,
        "cy": function cy(d, i) {
            return 20 * i;
        },
        "r": 6,
        "stroke-width": 10,
        "stroke-opacity": 0,
        "stroke": "red"
    }).style("stroke", "black").style("fill", "none").style("cursor", "pointer").style("opacity", 0.6);
    legend.selectAll("text").data(question_words).enter().append("text").attrs({
        "x": 20,
        "y": function y(d, i) {
            return 20 * i;
        },
        "dy": "0.4em"
    }).classed("figure-text", true).style("cursor", "pointer").text(function (d) {
        return d;
    });

    // Focuses on all points by resetting the opacities
    var focusAll = function focusAll() {
        legend.selectAll("circle").style("opacity", 0.6);
        legend.selectAll("text").style("opacity", 0.6);
        firstPlot.selectAll("circle").style("opacity", 1.0);
        secondPlot.selectAll("circle").style("opacity", 1.0);
    };

    // Focuses on a single question type by lowering other
    // question type opacities
    var focus = function focus(word) {
        legend.selectAll("circle").style("opacity", function (d, i) {
            return d == word ? 0.6 : 0.1;
        });
        legend.selectAll("text").style("opacity", function (d, i) {
            return d == word ? 0.6 : 0.1;
        });
        firstPlot.selectAll("circle").style("opacity", function (d, i) {
            return d.question.indexOf(word) >= 0 ? 1.0 : 0.1;
        });
        secondPlot.selectAll("circle").style("opacity", function (d, i) {
            return d.question.indexOf(word) >= 0 ? 1.0 : 0.1;
        });
    };

    // Add hovering behavior to legend
    legend.selectAll("text").on("mouseover", function (d, i) {
        focus(d);
    }).on("mouseout", focusAll);

    focusAll();
})();

(function () {
    var colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B"];

    var question_types = ["Exists", "Less than", "Greater than", "Count", "Query material", "Query size", "Query color", "Query shape", "Equal color", "Equal integer", "Equal shape", "Equal size", "Equal material"];

    // Ugly workaround for permuted question types in JSON file.
    var question_type_mapping = [0, 2, 5, 8, 1, 4, 9, 10, 3, 6, 12, 7, 11];

    var setUp = function setUp(filename, keyword, color) {
        // Get references to important tags
        var svg = d3.select("#clevr-subcluster-color-diagram > svg");
        var scatterPlot = svg.select("#" + keyword + "-plot");
        var boundingBox = scatterPlot.select("rect");

        // Retrieve scatter plot bounding box coordinates
        var xMin = parseInt(boundingBox.attr("x"));
        var xMax = xMin + parseInt(boundingBox.attr("width"));
        var yMin = parseInt(boundingBox.attr("y"));
        var yMax = yMin + parseInt(boundingBox.attr("height"));

        var dataset;
        var xScale;
        var yScale;

        d3.json(filename, function (data) {
            dataset = data;

            // Create scales mapping gamma and beta values to bounding box
            // coordinates
            xScale = d3.scaleLinear().domain([1.15 * d3.min(dataset, function (d) {
                return d.gamma;
            }), 1.15 * d3.max(dataset, function (d) {
                return d.gamma;
            })]).rangeRound([xMin, xMax]);
            yScale = d3.scaleLinear().domain([1.15 * d3.min(dataset, function (d) {
                return d.beta;
            }), 1.15 * d3.max(dataset, function (d) {
                return d.beta;
            })]).rangeRound([yMax, yMin]);

            // Set up axes
            scatterPlot.select("#x-axis").attr("d", "M" + xMin + " " + yScale(0) + " L " + xMax + " " + yScale(0));
            scatterPlot.select("#x-axis-label").attrs({ "x": xMax - 10, "y": yScale(0.0) + 10 });
            scatterPlot.select("#y-axis").attr("d", "M" + xScale(0) + " " + yMax + " L " + xScale(0) + " " + yMin);
            scatterPlot.select("#y-axis-label").attrs({ "x": xScale(0.0) + 10, "y": yMin });

            var tooltip = d3.select("body").append("div").attr("id", "tooltip-clevr-question-type-clever").attr("class", "tooltip figure-text").style("background", "#ddd").style("border-radius", "6px").style("padding", "10px").style("opacity", 0);

            // Dispatch data points into groups by question type
            scatterPlot.selectAll("g").data(colors).enter().append("g").style("opacity", 1.0).each(function (c, i) {
                d3.select(this).selectAll("circle").data(dataset.filter(function (d) {
                    return question_type_mapping[d.type] == i;
                })).enter().append("circle").attrs({
                    "cx": function cx(d) {
                        return xScale(d.gamma);
                    },
                    "cy": function cy(d) {
                        return yScale(d.beta);
                    },
                    "r": 3.0
                }).style("fill", function (d) {
                    return colors[i];
                }).style("opacity", 0.6).style("cursor", "pointer").on("mouseover", function (d) {
                    focus(question_type_mapping[d.type]);
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(d.question.join(" ") + "?").style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                }).on("mouseout", function (d) {
                    focusAll();
                    tooltip.transition().duration(500).style("opacity", 0);
                });
            });
        });
    };
    setUp('data/clevr_gamma_beta_words_subcluster_fm_26.json', 'first', 0);
    setUp('data/clevr_gamma_beta_words_subcluster_fm_76.json', 'second', 6);

    var svg = d3.select("#clevr-subcluster-color-diagram > svg");
    var legend = svg.select("#legend");
    var firstPlot = svg.select("#first-plot");
    var secondPlot = svg.select("#second-plot");

    // Create legend
    legend.selectAll("circle").data(colors).enter().append("circle").attrs({
        "cx": 0,
        "cy": function cy(d, i) {
            return 20 * i;
        },
        "r": 6,
        "stroke-width": 20,
        "stroke-opacity": 0,
        "stroke": "red"
    }).style("fill", function (d, i) {
        return colors[i];
    }).style("cursor", "pointer").style("opacity", 0.6);
    legend.selectAll("text").data(question_types).enter().append("text").attrs({
        "x": 20,
        "y": function y(d, i) {
            return 20 * i;
        },
        "dy": "0.4em"
    }).classed("figure-text", true).style("cursor", "pointer").text(function (d) {
        return d;
    });

    // Focuses on all points by resetting the opacities
    var focusAll = function focusAll() {
        legend.selectAll("circle").style("opacity", 0.6);
        legend.selectAll("text").style("opacity", 0.6);
        firstPlot.selectAll("g").style("opacity", 1.0);
        secondPlot.selectAll("g").style("opacity", 1.0);
    };

    // Focuses on a single question type by lowering other
    // question type opacities
    var focus = function focus(j) {
        legend.selectAll("circle").style("opacity", function (d, i) {
            return i == j ? 0.6 : 0.1;
        });
        legend.selectAll("text").style("opacity", function (d, i) {
            return i == j ? 0.6 : 0.1;
        });
        firstPlot.selectAll("g").style("opacity", function (d, i) {
            return i == j ? 1.0 : 0.1;
        });
        secondPlot.selectAll("g").style("opacity", function (d, i) {
            return i == j ? 1.0 : 0.1;
        });
    };

    // Add hovering behavior to legend
    legend.selectAll("circle").on("mouseover", function (d, i) {
        focus(i);
    }).on("mouseout", focusAll);
    legend.selectAll("text").on("mouseover", function (d, i) {
        focus(i);
    }).on("mouseout", focusAll);

    focusAll();
})();

(function () {
    // Get references to important tags
    var svg = d3.select("#clevr-plot-svg");
    var scatterPlot = svg.select("#clevr-plot");
    var boundingBox = scatterPlot.select("rect");
    var legend = svg.select("#clevr-legend");

    // Retrieve scatter plot bounding box coordinates
    var xMin = parseInt(boundingBox.attr("x"));
    var xMax = xMin + parseInt(boundingBox.attr("width"));
    var yMin = parseInt(boundingBox.attr("y"));
    var yMax = yMin + parseInt(boundingBox.attr("height"));

    var colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FF9800", "#795548", "#9E9E9E"];
    var question_types = ["Exists", "Less than", "Greater than", "Count", "Query material", "Query size", "Query color", "Query shape", "Equal color", "Equal integer", "Equal shape", "Equal size", "Equal material"];

    // Ugly workaround for permuted question types in JSON file.
    var question_type_mapping = [1, 5, 11, 6, 8, 0, 9, 7, 12, 3, 10, 2, 4];

    var dataset;
    var xScale;
    var yScale;
    d3.json("data/clevr_tsne.json", function (data) {
        dataset = data.slice(0, 1024);

        // Create scales
        xScale = d3.scaleLinear().domain([d3.min(dataset, function (d) {
            return d.layer_all.x;
        }), d3.max(dataset, function (d) {
            return d.layer_all.x;
        })]).rangeRound([xMin, xMax]);
        yScale = d3.scaleLinear().domain([d3.min(dataset, function (d) {
            return d.layer_all.y;
        }), d3.max(dataset, function (d) {
            return d.layer_all.y;
        })]).rangeRound([yMin, yMax]);

        var tooltip = d3.select("body").append("div").attr("id", "tooltip-tsne-clever").attr("class", "tooltip figure-text").style("background", "#ddd").style("border-radius", "6px").style("padding", "10px").style("opacity", 0);

        // Dispatch data points into groups by question type
        scatterPlot.selectAll("g").data(colors).enter().append("g").style("opacity", 1.0).each(function (c, i) {
            d3.select(this).selectAll("circle").data(dataset.filter(function (d) {
                return question_type_mapping[d.question_type] == i;
            })).enter().append("circle").attrs({
                "cx": function cx(d) {
                    return xScale(d.layer_all.x);
                },
                "cy": function cy(d) {
                    return yScale(d.layer_all.y);
                },
                "r": 3.0
            }).style("cursor", "pointer").style("fill", function (d) {
                return colors[i];
            }).style("opacity", 0.6).on("mouseover", function (d) {
                focusType(question_type_mapping[d.question_type]);
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.question + "?").style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
            }).on("mouseout", function (d) {
                focusAll();
                tooltip.transition().duration(500).style("opacity", 0);
            });
        });

        // Create legend
        legend.selectAll("circle").data(question_types).enter().append("circle").attrs({
            "cx": 0,
            "cy": function cy(d, i) {
                return 20 * i;
            },
            "r": 6,
            "stroke-width": 10,
            "stroke-opacity": 0,
            "stroke": "red"
        }).style("fill", function (d, i) {
            return colors[i];
        }).style("cursor", "pointer").style("opacity", 0.6);
        legend.selectAll("text").data(question_types).enter().append("text").attrs({
            "x": 20,
            "y": function y(d, i) {
                return 20 * i;
            },
            "dy": "0.4em"
        }).classed("figure-text", true).style("cursor", "pointer").text(function (d) {
            return d;
        });

        // Focuses on all points by resetting the opacities
        var focusAll = function focusAll() {
            legend.selectAll("circle").style("opacity", 0.6);
            legend.selectAll("text").style("opacity", 0.6);
            scatterPlot.selectAll("g").style("opacity", 1.0);
        };

        // Focuses on a single question type by lowering other
        // question type opacities
        var focus = function focus(j) {
            legend.selectAll("circle").style("opacity", function (d, i) {
                return i == j ? 0.6 : 0.1;
            });
            legend.selectAll("text").style("opacity", function (d, i) {
                return i == j ? 0.6 : 0.1;
            });
            scatterPlot.selectAll("g").style("opacity", function (d, i) {
                return i == j ? 1.0 : 0.1;
            });
        };

        var focusType = function focusType(j) {
            legend.selectAll("circle").style("opacity", function (d, i) {
                return i == j ? 0.6 : 0.1;
            });
        };

        // Add hovering behavior to legend
        legend.selectAll("circle").on("mouseover", function (d, i) {
            focus(i);
        }).on("mouseout", focusAll);
        legend.selectAll("text").on("mouseover", function (d, i) {
            focus(i);
        }).on("mouseout", focusAll);

        focusAll();
    });
    svgPanZoom = __webpack_require__(2);
    var panZoom = svgPanZoom('#clevr-plot-svg', {
        viewportSelector: '#tsne-diagram #clevr-plot',
        zoomEnabled: true,
        fit: true,
        center: true,
        minZoom: 0.1,
        controlIconsEnabled: false
    }).zoomAtPointBy(0.6, { x: -10, y: 180 });

    svg.select("#clevr-zoom").on("click", function (d) {
        panZoom.resetZoom();
        panZoom.resetPan();
        panZoom.zoomAtPointBy(0.6, { x: -10, y: 180 });
    });
})();
(function () {
    // Get references to important tags
    var svg = d3.select("#style-transfer-plot-svg");
    var scatterPlot = svg.select("#style-transfer-plot");
    var boundingBox = scatterPlot.select("rect");
    var legend = svg.select("#style-transfer-legend");

    // Retrieve scatter plot bounding box coordinates
    var xMin = parseInt(boundingBox.attr("x"));
    var xMax = xMin + parseInt(boundingBox.attr("width"));
    var yMin = parseInt(boundingBox.attr("y"));
    var yMax = yMin + parseInt(boundingBox.attr("height"));

    var colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4"];

    var dataset;
    var xScale;
    var yScale;
    d3.json("data/style_tsne.json", function (data) {
        dataset = { "artists": data.artists, "points": data.points.slice(0, 512) };

        // Create scales
        xScale = d3.scaleLinear().domain([d3.min(dataset.points, function (d) {
            return d.x;
        }), d3.max(dataset.points, function (d) {
            return d.x;
        })]).rangeRound([xMin, xMax]);
        yScale = d3.scaleLinear().domain([d3.min(dataset.points, function (d) {
            return d.y;
        }), d3.max(dataset.points, function (d) {
            return d.y;
        })]).rangeRound([yMin, yMax]);

        var tooltip = d3.select("body").append("div").attr("id", "tooltip-tsne-style-transfer").attr("class", "tooltip").style("opacity", 0);

        // Dispatch data points into groups by question type
        scatterPlot.selectAll("g").data(colors).enter().append("g").style("opacity", 1.0).each(function (c, i) {
            d3.select(this).selectAll("circle").data(dataset.points.filter(function (d) {
                return d.artist_index == i;
            })).enter().append("circle").attrs({
                "cx": function cx(d) {
                    return xScale(d.x);
                },
                "cy": function cy(d) {
                    return yScale(d.y);
                },
                "r": 3.0
            }).style("cursor", "pointer").style("fill", function (d) {
                return colors[i];
            }).style("opacity", 0.6).on("mouseover", function (d) {
                focusType(d.artist_index);
                tooltip.transition().duration(200).style("opacity", .9);

                var url = "images/style_images/" + d.filename;

                tooltip.html("<img src=" + url + " class='loading'/>").style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
            }).on("mouseout", function (d) {
                focusAll();
                tooltip.transition().duration(500).style("opacity", 0);
            });
        });

        // Create legend
        legend.selectAll("circle").data(Object.keys(dataset.artists)).enter().append("circle").attrs({
            "cx": 0,
            "cy": function cy(d, i) {
                return 20 * i;
            },
            "r": 6,
            "stroke-width": 10,
            "stroke-opacity": 0,
            "stroke": "red"
        }).style("fill", function (d) {
            return colors[d];
        }).style("cursor", "pointer").style("opacity", 0.6);
        legend.selectAll("text").data(Object.keys(dataset.artists)).enter().append("text").attrs({
            "x": 20,
            "y": function y(d, i) {
                return 20 * i;
            },
            "dy": "0.4em"
        }).classed("figure-text", true).style("cursor", "pointer").text(function (d) {
            return dataset.artists[d];
        });

        // Focuses on all points by resetting the opacities
        var focusAll = function focusAll() {
            legend.selectAll("circle").style("opacity", 0.6);
            legend.selectAll("text").style("opacity", 0.6);
            scatterPlot.selectAll("g").style("opacity", 1.0);
        };

        // Focuses on a single question type by lowering other
        // question type opacities
        var focus = function focus(j) {
            legend.selectAll("circle").style("opacity", function (d, i) {
                return i == j ? 0.6 : 0.1;
            });
            legend.selectAll("text").style("opacity", function (d, i) {
                return i == j ? 0.6 : 0.1;
            });
            scatterPlot.selectAll("g").style("opacity", function (d, i) {
                return i == j ? 1.0 : 0.1;
            });
        };

        var focusType = function focusType(j) {
            legend.selectAll("circle").style("opacity", function (d, i) {
                return i == j ? 0.6 : 0.1;
            });
        };

        // Add hovering behavior to legend
        legend.selectAll("circle").on("mouseover", function (d, i) {
            focus(i);
        }).on("mouseout", focusAll);
        legend.selectAll("text").on("mouseover", function (d, i) {
            focus(i);
        }).on("mouseout", focusAll);

        focusAll();
    });

    svgPanZoom = __webpack_require__(2);
    var panZoom = svgPanZoom('#style-transfer-plot-svg', {
        viewportSelector: '#tsne-diagram #style-transfer-plot',
        zoomEnabled: true,
        fit: true,
        center: true,
        minZoom: 0.1,
        controlIconsEnabled: false
    });
    panZoom.zoomAtPointBy(0.6, { x: -10, y: 180 });

    d3.select("#style-zoom").on("click", function (d) {
        panZoom.resetZoom();
        panZoom.resetPan();
        panZoom.zoomAtPointBy(0.6, { x: -10, y: 180 });
    });
})();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var Wheel = __webpack_require__(5)
, ControlIcons = __webpack_require__(6)
, Utils = __webpack_require__(1)
, SvgUtils = __webpack_require__(0)
, ShadowViewport = __webpack_require__(7)

var SvgPanZoom = function(svg, options) {
  this.init(svg, options)
}

var optionsDefaults = {
  viewportSelector: '.svg-pan-zoom_viewport' // Viewport selector. Can be querySelector string or SVGElement
, panEnabled: true // enable or disable panning (default enabled)
, controlIconsEnabled: false // insert icons to give user an option in addition to mouse events to control pan/zoom (default disabled)
, zoomEnabled: true // enable or disable zooming (default enabled)
, dblClickZoomEnabled: true // enable or disable zooming by double clicking (default enabled)
, mouseWheelZoomEnabled: true // enable or disable zooming by mouse wheel (default enabled)
, preventMouseEventsDefault: true // enable or disable preventDefault for mouse events
, zoomScaleSensitivity: 0.1 // Zoom sensitivity
, minZoom: 0.5 // Minimum Zoom level
, maxZoom: 10 // Maximum Zoom level
, fit: true // enable or disable viewport fit in SVG (default true)
, contain: false // enable or disable viewport contain the svg (default false)
, center: true // enable or disable viewport centering in SVG (default true)
, refreshRate: 'auto' // Maximum number of frames per second (altering SVG's viewport)
, beforeZoom: null
, onZoom: null
, beforePan: null
, onPan: null
, customEventsHandler: null
, eventsListenerElement: null
, onUpdatedCTM: null
}

SvgPanZoom.prototype.init = function(svg, options) {
  var that = this

  this.svg = svg
  this.defs = svg.querySelector('defs')

  // Add default attributes to SVG
  SvgUtils.setupSvgAttributes(this.svg)

  // Set options
  this.options = Utils.extend(Utils.extend({}, optionsDefaults), options)

  // Set default state
  this.state = 'none'

  // Get dimensions
  var boundingClientRectNormalized = SvgUtils.getBoundingClientRectNormalized(svg)
  this.width = boundingClientRectNormalized.width
  this.height = boundingClientRectNormalized.height

  // Init shadow viewport
  this.viewport = ShadowViewport(SvgUtils.getOrCreateViewport(this.svg, this.options.viewportSelector), {
    svg: this.svg
  , width: this.width
  , height: this.height
  , fit: this.options.fit
  , contain: this.options.contain
  , center: this.options.center
  , refreshRate: this.options.refreshRate
  // Put callbacks into functions as they can change through time
  , beforeZoom: function(oldScale, newScale) {
      if (that.viewport && that.options.beforeZoom) {return that.options.beforeZoom(oldScale, newScale)}
    }
  , onZoom: function(scale) {
      if (that.viewport && that.options.onZoom) {return that.options.onZoom(scale)}
    }
  , beforePan: function(oldPoint, newPoint) {
      if (that.viewport && that.options.beforePan) {return that.options.beforePan(oldPoint, newPoint)}
    }
  , onPan: function(point) {
      if (that.viewport && that.options.onPan) {return that.options.onPan(point)}
    }
  , onUpdatedCTM: function(ctm) {
      if (that.viewport && that.options.onUpdatedCTM) {return that.options.onUpdatedCTM(ctm)}
    }
  })

  // Wrap callbacks into public API context
  var publicInstance = this.getPublicInstance()
  publicInstance.setBeforeZoom(this.options.beforeZoom)
  publicInstance.setOnZoom(this.options.onZoom)
  publicInstance.setBeforePan(this.options.beforePan)
  publicInstance.setOnPan(this.options.onPan)
  publicInstance.setOnUpdatedCTM(this.options.onUpdatedCTM)

  if (this.options.controlIconsEnabled) {
    ControlIcons.enable(this)
  }

  // Init events handlers
  this.lastMouseWheelEventTime = Date.now()
  this.setupHandlers()
}

/**
 * Register event handlers
 */
SvgPanZoom.prototype.setupHandlers = function() {
  var that = this
    , prevEvt = null // use for touchstart event to detect double tap
    ;

  this.eventListeners = {
    // Mouse down group
    mousedown: function(evt) {
      var result = that.handleMouseDown(evt, prevEvt);
      prevEvt = evt
      return result;
    }
  , touchstart: function(evt) {
      var result = that.handleMouseDown(evt, prevEvt);
      prevEvt = evt
      return result;
    }

    // Mouse up group
  , mouseup: function(evt) {
      return that.handleMouseUp(evt);
    }
  , touchend: function(evt) {
      return that.handleMouseUp(evt);
    }

    // Mouse move group
  , mousemove: function(evt) {
      return that.handleMouseMove(evt);
    }
  , touchmove: function(evt) {
      return that.handleMouseMove(evt);
    }

    // Mouse leave group
  , mouseleave: function(evt) {
      return that.handleMouseUp(evt);
    }
  , touchleave: function(evt) {
      return that.handleMouseUp(evt);
    }
  , touchcancel: function(evt) {
      return that.handleMouseUp(evt);
    }
  }

  // Init custom events handler if available
  if (this.options.customEventsHandler != null) { // jshint ignore:line
    this.options.customEventsHandler.init({
      svgElement: this.svg
    , eventsListenerElement: this.options.eventsListenerElement
    , instance: this.getPublicInstance()
    })

    // Custom event handler may halt builtin listeners
    var haltEventListeners = this.options.customEventsHandler.haltEventListeners
    if (haltEventListeners && haltEventListeners.length) {
      for (var i = haltEventListeners.length - 1; i >= 0; i--) {
        if (this.eventListeners.hasOwnProperty(haltEventListeners[i])) {
          delete this.eventListeners[haltEventListeners[i]]
        }
      }
    }
  }

  // Bind eventListeners
  for (var event in this.eventListeners) {
    // Attach event to eventsListenerElement or SVG if not available
    (this.options.eventsListenerElement || this.svg)
      .addEventListener(event, this.eventListeners[event], false)
  }

  // Zoom using mouse wheel
  if (this.options.mouseWheelZoomEnabled) {
    this.options.mouseWheelZoomEnabled = false // set to false as enable will set it back to true
    this.enableMouseWheelZoom()
  }
}

/**
 * Enable ability to zoom using mouse wheel
 */
SvgPanZoom.prototype.enableMouseWheelZoom = function() {
  if (!this.options.mouseWheelZoomEnabled) {
    var that = this

    // Mouse wheel listener
    this.wheelListener = function(evt) {
      return that.handleMouseWheel(evt);
    }

    // Bind wheelListener
    Wheel.on(this.options.eventsListenerElement || this.svg, this.wheelListener, false)

    this.options.mouseWheelZoomEnabled = true
  }
}

/**
 * Disable ability to zoom using mouse wheel
 */
SvgPanZoom.prototype.disableMouseWheelZoom = function() {
  if (this.options.mouseWheelZoomEnabled) {
    Wheel.off(this.options.eventsListenerElement || this.svg, this.wheelListener, false)
    this.options.mouseWheelZoomEnabled = false
  }
}

/**
 * Handle mouse wheel event
 *
 * @param  {Event} evt
 */
SvgPanZoom.prototype.handleMouseWheel = function(evt) {
  if (!this.options.zoomEnabled || this.state !== 'none') {
    return;
  }

  if (this.options.preventMouseEventsDefault){
    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
      evt.returnValue = false;
    }
  }

  // Default delta in case that deltaY is not available
  var delta = evt.deltaY || 1
    , timeDelta = Date.now() - this.lastMouseWheelEventTime
    , divider = 3 + Math.max(0, 30 - timeDelta)

  // Update cache
  this.lastMouseWheelEventTime = Date.now()

  // Make empirical adjustments for browsers that give deltaY in pixels (deltaMode=0)
  if ('deltaMode' in evt && evt.deltaMode === 0 && evt.wheelDelta) {
    delta = evt.deltaY === 0 ? 0 :  Math.abs(evt.wheelDelta) / evt.deltaY
  }

  delta = -0.3 < delta && delta < 0.3 ? delta : (delta > 0 ? 1 : -1) * Math.log(Math.abs(delta) + 10) / divider

  var inversedScreenCTM = this.svg.getScreenCTM().inverse()
    , relativeMousePoint = SvgUtils.getEventPoint(evt, this.svg).matrixTransform(inversedScreenCTM)
    , zoom = Math.pow(1 + this.options.zoomScaleSensitivity, (-1) * delta); // multiplying by neg. 1 so as to make zoom in/out behavior match Google maps behavior

  this.zoomAtPoint(zoom, relativeMousePoint)
}

/**
 * Zoom in at a SVG point
 *
 * @param  {SVGPoint} point
 * @param  {Float} zoomScale    Number representing how much to zoom
 * @param  {Boolean} zoomAbsolute Default false. If true, zoomScale is treated as an absolute value.
 *                                Otherwise, zoomScale is treated as a multiplied (e.g. 1.10 would zoom in 10%)
 */
SvgPanZoom.prototype.zoomAtPoint = function(zoomScale, point, zoomAbsolute) {
  var originalState = this.viewport.getOriginalState()

  if (!zoomAbsolute) {
    // Fit zoomScale in set bounds
    if (this.getZoom() * zoomScale < this.options.minZoom * originalState.zoom) {
      zoomScale = (this.options.minZoom * originalState.zoom) / this.getZoom()
    } else if (this.getZoom() * zoomScale > this.options.maxZoom * originalState.zoom) {
      zoomScale = (this.options.maxZoom * originalState.zoom) / this.getZoom()
    }
  } else {
    // Fit zoomScale in set bounds
    zoomScale = Math.max(this.options.minZoom * originalState.zoom, Math.min(this.options.maxZoom * originalState.zoom, zoomScale))
    // Find relative scale to achieve desired scale
    zoomScale = zoomScale/this.getZoom()
  }

  var oldCTM = this.viewport.getCTM()
    , relativePoint = point.matrixTransform(oldCTM.inverse())
    , modifier = this.svg.createSVGMatrix().translate(relativePoint.x, relativePoint.y).scale(zoomScale).translate(-relativePoint.x, -relativePoint.y)
    , newCTM = oldCTM.multiply(modifier)

  if (newCTM.a !== oldCTM.a) {
    this.viewport.setCTM(newCTM)
  }
}

/**
 * Zoom at center point
 *
 * @param  {Float} scale
 * @param  {Boolean} absolute Marks zoom scale as relative or absolute
 */
SvgPanZoom.prototype.zoom = function(scale, absolute) {
  this.zoomAtPoint(scale, SvgUtils.getSvgCenterPoint(this.svg, this.width, this.height), absolute)
}

/**
 * Zoom used by public instance
 *
 * @param  {Float} scale
 * @param  {Boolean} absolute Marks zoom scale as relative or absolute
 */
SvgPanZoom.prototype.publicZoom = function(scale, absolute) {
  if (absolute) {
    scale = this.computeFromRelativeZoom(scale)
  }

  this.zoom(scale, absolute)
}

/**
 * Zoom at point used by public instance
 *
 * @param  {Float} scale
 * @param  {SVGPoint|Object} point    An object that has x and y attributes
 * @param  {Boolean} absolute Marks zoom scale as relative or absolute
 */
SvgPanZoom.prototype.publicZoomAtPoint = function(scale, point, absolute) {
  if (absolute) {
    // Transform zoom into a relative value
    scale = this.computeFromRelativeZoom(scale)
  }

  // If not a SVGPoint but has x and y then create a SVGPoint
  if (Utils.getType(point) !== 'SVGPoint') {
    if('x' in point && 'y' in point) {
      point = SvgUtils.createSVGPoint(this.svg, point.x, point.y)
    } else {
      throw new Error('Given point is invalid')
    }
  }

  this.zoomAtPoint(scale, point, absolute)
}

/**
 * Get zoom scale
 *
 * @return {Float} zoom scale
 */
SvgPanZoom.prototype.getZoom = function() {
  return this.viewport.getZoom()
}

/**
 * Get zoom scale for public usage
 *
 * @return {Float} zoom scale
 */
SvgPanZoom.prototype.getRelativeZoom = function() {
  return this.viewport.getRelativeZoom()
}

/**
 * Compute actual zoom from public zoom
 *
 * @param  {Float} zoom
 * @return {Float} zoom scale
 */
SvgPanZoom.prototype.computeFromRelativeZoom = function(zoom) {
  return zoom * this.viewport.getOriginalState().zoom
}

/**
 * Set zoom to initial state
 */
SvgPanZoom.prototype.resetZoom = function() {
  var originalState = this.viewport.getOriginalState()

  this.zoom(originalState.zoom, true);
}

/**
 * Set pan to initial state
 */
SvgPanZoom.prototype.resetPan = function() {
  this.pan(this.viewport.getOriginalState());
}

/**
 * Set pan and zoom to initial state
 */
SvgPanZoom.prototype.reset = function() {
  this.resetZoom()
  this.resetPan()
}

/**
 * Handle double click event
 * See handleMouseDown() for alternate detection method
 *
 * @param {Event} evt
 */
SvgPanZoom.prototype.handleDblClick = function(evt) {
  if (this.options.preventMouseEventsDefault) {
    if (evt.preventDefault) {
      evt.preventDefault()
    } else {
      evt.returnValue = false
    }
  }

  // Check if target was a control button
  if (this.options.controlIconsEnabled) {
    var targetClass = evt.target.getAttribute('class') || ''
    if (targetClass.indexOf('svg-pan-zoom-control') > -1) {
      return false
    }
  }

  var zoomFactor

  if (evt.shiftKey) {
    zoomFactor = 1/((1 + this.options.zoomScaleSensitivity) * 2) // zoom out when shift key pressed
  } else {
    zoomFactor = (1 + this.options.zoomScaleSensitivity) * 2
  }

  var point = SvgUtils.getEventPoint(evt, this.svg).matrixTransform(this.svg.getScreenCTM().inverse())
  this.zoomAtPoint(zoomFactor, point)
}

/**
 * Handle click event
 *
 * @param {Event} evt
 */
SvgPanZoom.prototype.handleMouseDown = function(evt, prevEvt) {
  if (this.options.preventMouseEventsDefault) {
    if (evt.preventDefault) {
      evt.preventDefault()
    } else {
      evt.returnValue = false
    }
  }

  Utils.mouseAndTouchNormalize(evt, this.svg)

  // Double click detection; more consistent than ondblclick
  if (this.options.dblClickZoomEnabled && Utils.isDblClick(evt, prevEvt)){
    this.handleDblClick(evt)
  } else {
    // Pan mode
    this.state = 'pan'
    this.firstEventCTM = this.viewport.getCTM()
    this.stateOrigin = SvgUtils.getEventPoint(evt, this.svg).matrixTransform(this.firstEventCTM.inverse())
  }
}

/**
 * Handle mouse move event
 *
 * @param  {Event} evt
 */
SvgPanZoom.prototype.handleMouseMove = function(evt) {
  if (this.options.preventMouseEventsDefault) {
    if (evt.preventDefault) {
      evt.preventDefault()
    } else {
      evt.returnValue = false
    }
  }

  if (this.state === 'pan' && this.options.panEnabled) {
    // Pan mode
    var point = SvgUtils.getEventPoint(evt, this.svg).matrixTransform(this.firstEventCTM.inverse())
      , viewportCTM = this.firstEventCTM.translate(point.x - this.stateOrigin.x, point.y - this.stateOrigin.y)

    this.viewport.setCTM(viewportCTM)
  }
}

/**
 * Handle mouse button release event
 *
 * @param {Event} evt
 */
SvgPanZoom.prototype.handleMouseUp = function(evt) {
  if (this.options.preventMouseEventsDefault) {
    if (evt.preventDefault) {
      evt.preventDefault()
    } else {
      evt.returnValue = false
    }
  }

  if (this.state === 'pan') {
    // Quit pan mode
    this.state = 'none'
  }
}

/**
 * Adjust viewport size (only) so it will fit in SVG
 * Does not center image
 */
SvgPanZoom.prototype.fit = function() {
  var viewBox = this.viewport.getViewBox()
    , newScale = Math.min(this.width/viewBox.width, this.height/viewBox.height)

  this.zoom(newScale, true)
}

/**
 * Adjust viewport size (only) so it will contain the SVG
 * Does not center image
 */
SvgPanZoom.prototype.contain = function() {
  var viewBox = this.viewport.getViewBox()
    , newScale = Math.max(this.width/viewBox.width, this.height/viewBox.height)

  this.zoom(newScale, true)
}

/**
 * Adjust viewport pan (only) so it will be centered in SVG
 * Does not zoom/fit/contain image
 */
SvgPanZoom.prototype.center = function() {
  var viewBox = this.viewport.getViewBox()
    , offsetX = (this.width - (viewBox.width + viewBox.x * 2) * this.getZoom()) * 0.5
    , offsetY = (this.height - (viewBox.height + viewBox.y * 2) * this.getZoom()) * 0.5

  this.getPublicInstance().pan({x: offsetX, y: offsetY})
}

/**
 * Update content cached BorderBox
 * Use when viewport contents change
 */
SvgPanZoom.prototype.updateBBox = function() {
  this.viewport.simpleViewBoxCache()
}

/**
 * Pan to a rendered position
 *
 * @param  {Object} point {x: 0, y: 0}
 */
SvgPanZoom.prototype.pan = function(point) {
  var viewportCTM = this.viewport.getCTM()
  viewportCTM.e = point.x
  viewportCTM.f = point.y
  this.viewport.setCTM(viewportCTM)
}

/**
 * Relatively pan the graph by a specified rendered position vector
 *
 * @param  {Object} point {x: 0, y: 0}
 */
SvgPanZoom.prototype.panBy = function(point) {
  var viewportCTM = this.viewport.getCTM()
  viewportCTM.e += point.x
  viewportCTM.f += point.y
  this.viewport.setCTM(viewportCTM)
}

/**
 * Get pan vector
 *
 * @return {Object} {x: 0, y: 0}
 */
SvgPanZoom.prototype.getPan = function() {
  var state = this.viewport.getState()

  return {x: state.x, y: state.y}
}

/**
 * Recalculates cached svg dimensions and controls position
 */
SvgPanZoom.prototype.resize = function() {
  // Get dimensions
  var boundingClientRectNormalized = SvgUtils.getBoundingClientRectNormalized(this.svg)
  this.width = boundingClientRectNormalized.width
  this.height = boundingClientRectNormalized.height

  // Recalculate original state
  var viewport = this.viewport
  viewport.options.width = this.width
  viewport.options.height = this.height
  viewport.processCTM()

  // Reposition control icons by re-enabling them
  if (this.options.controlIconsEnabled) {
    this.getPublicInstance().disableControlIcons()
    this.getPublicInstance().enableControlIcons()
  }
}

/**
 * Unbind mouse events, free callbacks and destroy public instance
 */
SvgPanZoom.prototype.destroy = function() {
  var that = this

  // Free callbacks
  this.beforeZoom = null
  this.onZoom = null
  this.beforePan = null
  this.onPan = null
  this.onUpdatedCTM = null

  // Destroy custom event handlers
  if (this.options.customEventsHandler != null) { // jshint ignore:line
    this.options.customEventsHandler.destroy({
      svgElement: this.svg
    , eventsListenerElement: this.options.eventsListenerElement
    , instance: this.getPublicInstance()
    })
  }

  // Unbind eventListeners
  for (var event in this.eventListeners) {
    (this.options.eventsListenerElement || this.svg)
      .removeEventListener(event, this.eventListeners[event], false)
  }

  // Unbind wheelListener
  this.disableMouseWheelZoom()

  // Remove control icons
  this.getPublicInstance().disableControlIcons()

  // Reset zoom and pan
  this.reset()

  // Remove instance from instancesStore
  instancesStore = instancesStore.filter(function(instance){
    return instance.svg !== that.svg
  })

  // Delete options and its contents
  delete this.options

  // Delete viewport to make public shadow viewport functions uncallable
  delete this.viewport

  // Destroy public instance and rewrite getPublicInstance
  delete this.publicInstance
  delete this.pi
  this.getPublicInstance = function(){
    return null
  }
}

/**
 * Returns a public instance object
 *
 * @return {Object} Public instance object
 */
SvgPanZoom.prototype.getPublicInstance = function() {
  var that = this

  // Create cache
  if (!this.publicInstance) {
    this.publicInstance = this.pi = {
      // Pan
      enablePan: function() {that.options.panEnabled = true; return that.pi}
    , disablePan: function() {that.options.panEnabled = false; return that.pi}
    , isPanEnabled: function() {return !!that.options.panEnabled}
    , pan: function(point) {that.pan(point); return that.pi}
    , panBy: function(point) {that.panBy(point); return that.pi}
    , getPan: function() {return that.getPan()}
      // Pan event
    , setBeforePan: function(fn) {that.options.beforePan = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
    , setOnPan: function(fn) {that.options.onPan = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
      // Zoom and Control Icons
    , enableZoom: function() {that.options.zoomEnabled = true; return that.pi}
    , disableZoom: function() {that.options.zoomEnabled = false; return that.pi}
    , isZoomEnabled: function() {return !!that.options.zoomEnabled}
    , enableControlIcons: function() {
        if (!that.options.controlIconsEnabled) {
          that.options.controlIconsEnabled = true
          ControlIcons.enable(that)
        }
        return that.pi
      }
    , disableControlIcons: function() {
        if (that.options.controlIconsEnabled) {
          that.options.controlIconsEnabled = false;
          ControlIcons.disable(that)
        }
        return that.pi
      }
    , isControlIconsEnabled: function() {return !!that.options.controlIconsEnabled}
      // Double click zoom
    , enableDblClickZoom: function() {that.options.dblClickZoomEnabled = true; return that.pi}
    , disableDblClickZoom: function() {that.options.dblClickZoomEnabled = false; return that.pi}
    , isDblClickZoomEnabled: function() {return !!that.options.dblClickZoomEnabled}
      // Mouse wheel zoom
    , enableMouseWheelZoom: function() {that.enableMouseWheelZoom(); return that.pi}
    , disableMouseWheelZoom: function() {that.disableMouseWheelZoom(); return that.pi}
    , isMouseWheelZoomEnabled: function() {return !!that.options.mouseWheelZoomEnabled}
      // Zoom scale and bounds
    , setZoomScaleSensitivity: function(scale) {that.options.zoomScaleSensitivity = scale; return that.pi}
    , setMinZoom: function(zoom) {that.options.minZoom = zoom; return that.pi}
    , setMaxZoom: function(zoom) {that.options.maxZoom = zoom; return that.pi}
      // Zoom event
    , setBeforeZoom: function(fn) {that.options.beforeZoom = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
    , setOnZoom: function(fn) {that.options.onZoom = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
      // Zooming
    , zoom: function(scale) {that.publicZoom(scale, true); return that.pi}
    , zoomBy: function(scale) {that.publicZoom(scale, false); return that.pi}
    , zoomAtPoint: function(scale, point) {that.publicZoomAtPoint(scale, point, true); return that.pi}
    , zoomAtPointBy: function(scale, point) {that.publicZoomAtPoint(scale, point, false); return that.pi}
    , zoomIn: function() {this.zoomBy(1 + that.options.zoomScaleSensitivity); return that.pi}
    , zoomOut: function() {this.zoomBy(1 / (1 + that.options.zoomScaleSensitivity)); return that.pi}
    , getZoom: function() {return that.getRelativeZoom()}
      // CTM update
    , setOnUpdatedCTM: function(fn) {that.options.onUpdatedCTM = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
      // Reset
    , resetZoom: function() {that.resetZoom(); return that.pi}
    , resetPan: function() {that.resetPan(); return that.pi}
    , reset: function() {that.reset(); return that.pi}
      // Fit, Contain and Center
    , fit: function() {that.fit(); return that.pi}
    , contain: function() {that.contain(); return that.pi}
    , center: function() {that.center(); return that.pi}
      // Size and Resize
    , updateBBox: function() {that.updateBBox(); return that.pi}
    , resize: function() {that.resize(); return that.pi}
    , getSizes: function() {
        return {
          width: that.width
        , height: that.height
        , realZoom: that.getZoom()
        , viewBox: that.viewport.getViewBox()
        }
      }
      // Destroy
    , destroy: function() {that.destroy(); return that.pi}
    }
  }

  return this.publicInstance
}

/**
 * Stores pairs of instances of SvgPanZoom and SVG
 * Each pair is represented by an object {svg: SVGSVGElement, instance: SvgPanZoom}
 *
 * @type {Array}
 */
var instancesStore = []

var svgPanZoom = function(elementOrSelector, options){
  var svg = Utils.getSvg(elementOrSelector)

  if (svg === null) {
    return null
  } else {
    // Look for existent instance
    for(var i = instancesStore.length - 1; i >= 0; i--) {
      if (instancesStore[i].svg === svg) {
        return instancesStore[i].instance.getPublicInstance()
      }
    }

    // If instance not found - create one
    instancesStore.push({
      svg: svg
    , instance: new SvgPanZoom(svg, options)
    })

    // Return just pushed instance
    return instancesStore[instancesStore.length - 1].instance.getPublicInstance()
  }
}

module.exports = svgPanZoom;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// uniwheel 0.1.2 (customized)
// A unified cross browser mouse wheel event handler
// https://github.com/teemualap/uniwheel

module.exports = (function(){

  //Full details: https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel

  var prefix = "", _addEventListener, _removeEventListener, onwheel, support, fns = [];

  // detect event model
  if ( window.addEventListener ) {
    _addEventListener = "addEventListener";
    _removeEventListener = "removeEventListener";
  } else {
    _addEventListener = "attachEvent";
    _removeEventListener = "detachEvent";
    prefix = "on";
  }

  // detect available wheel event
  support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
            document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
            "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox


  function createCallback(element,callback,capture) {

    var fn = function(originalEvent) {

      !originalEvent && ( originalEvent = window.event );

      // create a normalized event object
      var event = {
        // keep a ref to the original event object
        originalEvent: originalEvent,
        target: originalEvent.target || originalEvent.srcElement,
        type: "wheel",
        deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
        deltaX: 0,
        delatZ: 0,
        preventDefault: function() {
          originalEvent.preventDefault ?
            originalEvent.preventDefault() :
            originalEvent.returnValue = false;
        }
      };

      // calculate deltaY (and deltaX) according to the event
      if ( support == "mousewheel" ) {
        event.deltaY = - 1/40 * originalEvent.wheelDelta;
        // Webkit also support wheelDeltaX
        originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
      } else {
        event.deltaY = originalEvent.detail;
      }

      // it's time to fire the callback
      return callback( event );

    };

    fns.push({
      element: element,
      fn: fn,
      capture: capture
    });

    return fn;
  }

  function getCallback(element,capture) {
    for (var i = 0; i < fns.length; i++) {
      if (fns[i].element === element && fns[i].capture === capture) {
        return fns[i].fn;
      }
    }
    return function(){};
  }

  function removeCallback(element,capture) {
    for (var i = 0; i < fns.length; i++) {
      if (fns[i].element === element && fns[i].capture === capture) {
        return fns.splice(i,1);
      }
    }
  }

  function _addWheelListener( elem, eventName, callback, useCapture ) {

    var cb;

    if (support === "wheel") {
      cb = callback;
    } else {
      cb = createCallback(elem,callback,useCapture);
    }

    elem[ _addEventListener ]( prefix + eventName, cb, useCapture || false );

  }

  function _removeWheelListener( elem, eventName, callback, useCapture ) {

    var cb;

    if (support === "wheel") {
      cb = callback;
    } else {
      cb = getCallback(elem,useCapture);
    }

    elem[ _removeEventListener ]( prefix + eventName, cb, useCapture || false );

    removeCallback(elem,useCapture);

  }

  function addWheelListener( elem, callback, useCapture ) {
    _addWheelListener( elem, support, callback, useCapture );

    // handle MozMousePixelScroll in older Firefox
    if( support == "DOMMouseScroll" ) {
        _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture);
    }
  }

  function removeWheelListener(elem,callback,useCapture){
    _removeWheelListener(elem,support,callback,useCapture);

    // handle MozMousePixelScroll in older Firefox
    if( support == "DOMMouseScroll" ) {
        _removeWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
    }
  }

  return {
    on: addWheelListener,
    off: removeWheelListener
  };

})();


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var SvgUtils = __webpack_require__(0);

module.exports = {
  enable: function(instance) {
    // Select (and create if necessary) defs
    var defs = instance.svg.querySelector('defs')
    if (!defs) {
      defs = document.createElementNS(SvgUtils.svgNS, 'defs')
      instance.svg.appendChild(defs)
    }

    // Check for style element, and create it if it doesn't exist
    var styleEl = defs.querySelector('style#svg-pan-zoom-controls-styles');
    if (!styleEl) {
      var style = document.createElementNS(SvgUtils.svgNS, 'style')
      style.setAttribute('id', 'svg-pan-zoom-controls-styles')
      style.setAttribute('type', 'text/css')
      style.textContent = '.svg-pan-zoom-control { cursor: pointer; fill: black; fill-opacity: 0.333; } .svg-pan-zoom-control:hover { fill-opacity: 0.8; } .svg-pan-zoom-control-background { fill: white; fill-opacity: 0.5; } .svg-pan-zoom-control-background { fill-opacity: 0.8; }'
      defs.appendChild(style)
    }

    // Zoom Group
    var zoomGroup = document.createElementNS(SvgUtils.svgNS, 'g');
    zoomGroup.setAttribute('id', 'svg-pan-zoom-controls');
    zoomGroup.setAttribute('transform', 'translate(' + ( instance.width - 70 ) + ' ' + ( instance.height - 76 ) + ') scale(0.75)');
    zoomGroup.setAttribute('class', 'svg-pan-zoom-control');

    // Control elements
    zoomGroup.appendChild(this._createZoomIn(instance))
    zoomGroup.appendChild(this._createZoomReset(instance))
    zoomGroup.appendChild(this._createZoomOut(instance))

    // Finally append created element
    instance.svg.appendChild(zoomGroup)

    // Cache control instance
    instance.controlIcons = zoomGroup
  }

, _createZoomIn: function(instance) {
    var zoomIn = document.createElementNS(SvgUtils.svgNS, 'g');
    zoomIn.setAttribute('id', 'svg-pan-zoom-zoom-in');
    zoomIn.setAttribute('transform', 'translate(30.5 5) scale(0.015)');
    zoomIn.setAttribute('class', 'svg-pan-zoom-control');
    zoomIn.addEventListener('click', function() {instance.getPublicInstance().zoomIn()}, false)
    zoomIn.addEventListener('touchstart', function() {instance.getPublicInstance().zoomIn()}, false)

    var zoomInBackground = document.createElementNS(SvgUtils.svgNS, 'rect'); // TODO change these background space fillers to rounded rectangles so they look prettier
    zoomInBackground.setAttribute('x', '0');
    zoomInBackground.setAttribute('y', '0');
    zoomInBackground.setAttribute('width', '1500'); // larger than expected because the whole group is transformed to scale down
    zoomInBackground.setAttribute('height', '1400');
    zoomInBackground.setAttribute('class', 'svg-pan-zoom-control-background');
    zoomIn.appendChild(zoomInBackground);

    var zoomInShape = document.createElementNS(SvgUtils.svgNS, 'path');
    zoomInShape.setAttribute('d', 'M1280 576v128q0 26 -19 45t-45 19h-320v320q0 26 -19 45t-45 19h-128q-26 0 -45 -19t-19 -45v-320h-320q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h320v-320q0 -26 19 -45t45 -19h128q26 0 45 19t19 45v320h320q26 0 45 19t19 45zM1536 1120v-960 q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5t84.5 -203.5z');
    zoomInShape.setAttribute('class', 'svg-pan-zoom-control-element');
    zoomIn.appendChild(zoomInShape);

    return zoomIn
  }

, _createZoomReset: function(instance){
    // reset
    var resetPanZoomControl = document.createElementNS(SvgUtils.svgNS, 'g');
    resetPanZoomControl.setAttribute('id', 'svg-pan-zoom-reset-pan-zoom');
    resetPanZoomControl.setAttribute('transform', 'translate(5 35) scale(0.4)');
    resetPanZoomControl.setAttribute('class', 'svg-pan-zoom-control');
    resetPanZoomControl.addEventListener('click', function() {instance.getPublicInstance().reset()}, false);
    resetPanZoomControl.addEventListener('touchstart', function() {instance.getPublicInstance().reset()}, false);

    var resetPanZoomControlBackground = document.createElementNS(SvgUtils.svgNS, 'rect'); // TODO change these background space fillers to rounded rectangles so they look prettier
    resetPanZoomControlBackground.setAttribute('x', '2');
    resetPanZoomControlBackground.setAttribute('y', '2');
    resetPanZoomControlBackground.setAttribute('width', '182'); // larger than expected because the whole group is transformed to scale down
    resetPanZoomControlBackground.setAttribute('height', '58');
    resetPanZoomControlBackground.setAttribute('class', 'svg-pan-zoom-control-background');
    resetPanZoomControl.appendChild(resetPanZoomControlBackground);

    var resetPanZoomControlShape1 = document.createElementNS(SvgUtils.svgNS, 'path');
    resetPanZoomControlShape1.setAttribute('d', 'M33.051,20.632c-0.742-0.406-1.854-0.609-3.338-0.609h-7.969v9.281h7.769c1.543,0,2.701-0.188,3.473-0.562c1.365-0.656,2.048-1.953,2.048-3.891C35.032,22.757,34.372,21.351,33.051,20.632z');
    resetPanZoomControlShape1.setAttribute('class', 'svg-pan-zoom-control-element');
    resetPanZoomControl.appendChild(resetPanZoomControlShape1);

    var resetPanZoomControlShape2 = document.createElementNS(SvgUtils.svgNS, 'path');
    resetPanZoomControlShape2.setAttribute('d', 'M170.231,0.5H15.847C7.102,0.5,0.5,5.708,0.5,11.84v38.861C0.5,56.833,7.102,61.5,15.847,61.5h154.384c8.745,0,15.269-4.667,15.269-10.798V11.84C185.5,5.708,178.976,0.5,170.231,0.5z M42.837,48.569h-7.969c-0.219-0.766-0.375-1.383-0.469-1.852c-0.188-0.969-0.289-1.961-0.305-2.977l-0.047-3.211c-0.03-2.203-0.41-3.672-1.142-4.406c-0.732-0.734-2.103-1.102-4.113-1.102h-7.05v13.547h-7.055V14.022h16.524c2.361,0.047,4.178,0.344,5.45,0.891c1.272,0.547,2.351,1.352,3.234,2.414c0.731,0.875,1.31,1.844,1.737,2.906s0.64,2.273,0.64,3.633c0,1.641-0.414,3.254-1.242,4.84s-2.195,2.707-4.102,3.363c1.594,0.641,2.723,1.551,3.387,2.73s0.996,2.98,0.996,5.402v2.32c0,1.578,0.063,2.648,0.19,3.211c0.19,0.891,0.635,1.547,1.333,1.969V48.569z M75.579,48.569h-26.18V14.022h25.336v6.117H56.454v7.336h16.781v6H56.454v8.883h19.125V48.569z M104.497,46.331c-2.44,2.086-5.887,3.129-10.34,3.129c-4.548,0-8.125-1.027-10.731-3.082s-3.909-4.879-3.909-8.473h6.891c0.224,1.578,0.662,2.758,1.316,3.539c1.196,1.422,3.246,2.133,6.15,2.133c1.739,0,3.151-0.188,4.236-0.562c2.058-0.719,3.087-2.055,3.087-4.008c0-1.141-0.504-2.023-1.512-2.648c-1.008-0.609-2.607-1.148-4.796-1.617l-3.74-0.82c-3.676-0.812-6.201-1.695-7.576-2.648c-2.328-1.594-3.492-4.086-3.492-7.477c0-3.094,1.139-5.664,3.417-7.711s5.623-3.07,10.036-3.07c3.685,0,6.829,0.965,9.431,2.895c2.602,1.93,3.966,4.73,4.093,8.402h-6.938c-0.128-2.078-1.057-3.555-2.787-4.43c-1.154-0.578-2.587-0.867-4.301-0.867c-1.907,0-3.428,0.375-4.565,1.125c-1.138,0.75-1.706,1.797-1.706,3.141c0,1.234,0.561,2.156,1.682,2.766c0.721,0.406,2.25,0.883,4.589,1.43l6.063,1.43c2.657,0.625,4.648,1.461,5.975,2.508c2.059,1.625,3.089,3.977,3.089,7.055C108.157,41.624,106.937,44.245,104.497,46.331z M139.61,48.569h-26.18V14.022h25.336v6.117h-18.281v7.336h16.781v6h-16.781v8.883h19.125V48.569z M170.337,20.14h-10.336v28.43h-7.266V20.14h-10.383v-6.117h27.984V20.14z');
    resetPanZoomControlShape2.setAttribute('class', 'svg-pan-zoom-control-element');
    resetPanZoomControl.appendChild(resetPanZoomControlShape2);

    return resetPanZoomControl
  }

, _createZoomOut: function(instance){
    // zoom out
    var zoomOut = document.createElementNS(SvgUtils.svgNS, 'g');
    zoomOut.setAttribute('id', 'svg-pan-zoom-zoom-out');
    zoomOut.setAttribute('transform', 'translate(30.5 70) scale(0.015)');
    zoomOut.setAttribute('class', 'svg-pan-zoom-control');
    zoomOut.addEventListener('click', function() {instance.getPublicInstance().zoomOut()}, false);
    zoomOut.addEventListener('touchstart', function() {instance.getPublicInstance().zoomOut()}, false);

    var zoomOutBackground = document.createElementNS(SvgUtils.svgNS, 'rect'); // TODO change these background space fillers to rounded rectangles so they look prettier
    zoomOutBackground.setAttribute('x', '0');
    zoomOutBackground.setAttribute('y', '0');
    zoomOutBackground.setAttribute('width', '1500'); // larger than expected because the whole group is transformed to scale down
    zoomOutBackground.setAttribute('height', '1400');
    zoomOutBackground.setAttribute('class', 'svg-pan-zoom-control-background');
    zoomOut.appendChild(zoomOutBackground);

    var zoomOutShape = document.createElementNS(SvgUtils.svgNS, 'path');
    zoomOutShape.setAttribute('d', 'M1280 576v128q0 26 -19 45t-45 19h-896q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h896q26 0 45 19t19 45zM1536 1120v-960q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5 t84.5 -203.5z');
    zoomOutShape.setAttribute('class', 'svg-pan-zoom-control-element');
    zoomOut.appendChild(zoomOutShape);

    return zoomOut
  }

, disable: function(instance) {
    if (instance.controlIcons) {
      instance.controlIcons.parentNode.removeChild(instance.controlIcons)
      instance.controlIcons = null
    }
  }
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var SvgUtils = __webpack_require__(0)
  , Utils = __webpack_require__(1)
  ;

var ShadowViewport = function(viewport, options){
  this.init(viewport, options)
}

/**
 * Initialization
 *
 * @param  {SVGElement} viewport
 * @param  {Object} options
 */
ShadowViewport.prototype.init = function(viewport, options) {
  // DOM Elements
  this.viewport = viewport
  this.options = options

  // State cache
  this.originalState = {zoom: 1, x: 0, y: 0}
  this.activeState = {zoom: 1, x: 0, y: 0}

  this.updateCTMCached = Utils.proxy(this.updateCTM, this)

  // Create a custom requestAnimationFrame taking in account refreshRate
  this.requestAnimationFrame = Utils.createRequestAnimationFrame(this.options.refreshRate)

  // ViewBox
  this.viewBox = {x: 0, y: 0, width: 0, height: 0}
  this.cacheViewBox()

  // Process CTM
  var newCTM = this.processCTM()

  // Update viewport CTM and cache zoom and pan
  this.setCTM(newCTM)

  // Update CTM in this frame
  this.updateCTM()
}

/**
 * Cache initial viewBox value
 * If no viewBox is defined, then use viewport size/position instead for viewBox values
 */
ShadowViewport.prototype.cacheViewBox = function() {
  var svgViewBox = this.options.svg.getAttribute('viewBox')

  if (svgViewBox) {
    var viewBoxValues = svgViewBox.split(/[\s\,]/).filter(function(v){return v}).map(parseFloat)

    // Cache viewbox x and y offset
    this.viewBox.x = viewBoxValues[0]
    this.viewBox.y = viewBoxValues[1]
    this.viewBox.width = viewBoxValues[2]
    this.viewBox.height = viewBoxValues[3]

    var zoom = Math.min(this.options.width / this.viewBox.width, this.options.height / this.viewBox.height)

    // Update active state
    this.activeState.zoom = zoom
    this.activeState.x = (this.options.width - this.viewBox.width * zoom) / 2
    this.activeState.y = (this.options.height - this.viewBox.height * zoom) / 2

    // Force updating CTM
    this.updateCTMOnNextFrame()

    this.options.svg.removeAttribute('viewBox')
  } else {
    this.simpleViewBoxCache()
  }
}

/**
 * Recalculate viewport sizes and update viewBox cache
 */
ShadowViewport.prototype.simpleViewBoxCache = function() {
  var bBox = this.viewport.getBBox()

  this.viewBox.x = bBox.x
  this.viewBox.y = bBox.y
  this.viewBox.width = bBox.width
  this.viewBox.height = bBox.height
}

/**
 * Returns a viewbox object. Safe to alter
 *
 * @return {Object} viewbox object
 */
ShadowViewport.prototype.getViewBox = function() {
  return Utils.extend({}, this.viewBox)
}

/**
 * Get initial zoom and pan values. Save them into originalState
 * Parses viewBox attribute to alter initial sizes
 *
 * @return {CTM} CTM object based on options
 */
ShadowViewport.prototype.processCTM = function() {
  var newCTM = this.getCTM()

  if (this.options.fit || this.options.contain) {
    var newScale;
    if (this.options.fit) {
      newScale = Math.min(this.options.width/this.viewBox.width, this.options.height/this.viewBox.height);
    } else {
      newScale = Math.max(this.options.width/this.viewBox.width, this.options.height/this.viewBox.height);
    }

    newCTM.a = newScale; //x-scale
    newCTM.d = newScale; //y-scale
    newCTM.e = -this.viewBox.x * newScale; //x-transform
    newCTM.f = -this.viewBox.y * newScale; //y-transform
  }

  if (this.options.center) {
    var offsetX = (this.options.width - (this.viewBox.width + this.viewBox.x * 2) * newCTM.a) * 0.5
      , offsetY = (this.options.height - (this.viewBox.height + this.viewBox.y * 2) * newCTM.a) * 0.5

    newCTM.e = offsetX
    newCTM.f = offsetY
  }

  // Cache initial values. Based on activeState and fix+center opitons
  this.originalState.zoom = newCTM.a
  this.originalState.x = newCTM.e
  this.originalState.y = newCTM.f

  return newCTM
}

/**
 * Return originalState object. Safe to alter
 *
 * @return {Object}
 */
ShadowViewport.prototype.getOriginalState = function() {
  return Utils.extend({}, this.originalState)
}

/**
 * Return actualState object. Safe to alter
 *
 * @return {Object}
 */
ShadowViewport.prototype.getState = function() {
  return Utils.extend({}, this.activeState)
}

/**
 * Get zoom scale
 *
 * @return {Float} zoom scale
 */
ShadowViewport.prototype.getZoom = function() {
  return this.activeState.zoom
}

/**
 * Get zoom scale for pubilc usage
 *
 * @return {Float} zoom scale
 */
ShadowViewport.prototype.getRelativeZoom = function() {
  return this.activeState.zoom / this.originalState.zoom
}

/**
 * Compute zoom scale for pubilc usage
 *
 * @return {Float} zoom scale
 */
ShadowViewport.prototype.computeRelativeZoom = function(scale) {
  return scale / this.originalState.zoom
}

/**
 * Get pan
 *
 * @return {Object}
 */
ShadowViewport.prototype.getPan = function() {
  return {x: this.activeState.x, y: this.activeState.y}
}

/**
 * Return cached viewport CTM value that can be safely modified
 *
 * @return {SVGMatrix}
 */
ShadowViewport.prototype.getCTM = function() {
  var safeCTM = this.options.svg.createSVGMatrix()

  // Copy values manually as in FF they are not itterable
  safeCTM.a = this.activeState.zoom
  safeCTM.b = 0
  safeCTM.c = 0
  safeCTM.d = this.activeState.zoom
  safeCTM.e = this.activeState.x
  safeCTM.f = this.activeState.y

  return safeCTM
}

/**
 * Set a new CTM
 *
 * @param {SVGMatrix} newCTM
 */
ShadowViewport.prototype.setCTM = function(newCTM) {
  var willZoom = this.isZoomDifferent(newCTM)
    , willPan = this.isPanDifferent(newCTM)

  if (willZoom || willPan) {
    // Before zoom
    if (willZoom) {
      // If returns false then cancel zooming
      if (this.options.beforeZoom(this.getRelativeZoom(), this.computeRelativeZoom(newCTM.a)) === false) {
        newCTM.a = newCTM.d = this.activeState.zoom
        willZoom = false
      } else {
        this.updateCache(newCTM);
        this.options.onZoom(this.getRelativeZoom())
      }
    }

    // Before pan
    if (willPan) {
      var preventPan = this.options.beforePan(this.getPan(), {x: newCTM.e, y: newCTM.f})
          // If prevent pan is an object
        , preventPanX = false
        , preventPanY = false

      // If prevent pan is Boolean false
      if (preventPan === false) {
        // Set x and y same as before
        newCTM.e = this.getPan().x
        newCTM.f = this.getPan().y

        preventPanX = preventPanY = true
      } else if (Utils.isObject(preventPan)) {
        // Check for X axes attribute
        if (preventPan.x === false) {
          // Prevent panning on x axes
          newCTM.e = this.getPan().x
          preventPanX = true
        } else if (Utils.isNumber(preventPan.x)) {
          // Set a custom pan value
          newCTM.e = preventPan.x
        }

        // Check for Y axes attribute
        if (preventPan.y === false) {
          // Prevent panning on x axes
          newCTM.f = this.getPan().y
          preventPanY = true
        } else if (Utils.isNumber(preventPan.y)) {
          // Set a custom pan value
          newCTM.f = preventPan.y
        }
      }

      // Update willPan flag
      // Check if newCTM is still different
      if ((preventPanX && preventPanY) || !this.isPanDifferent(newCTM)) {
        willPan = false
      } else {
        this.updateCache(newCTM);
        this.options.onPan(this.getPan());
      }
    }

    // Check again if should zoom or pan
    if (willZoom || willPan) {
      this.updateCTMOnNextFrame()
    }
  }
}

ShadowViewport.prototype.isZoomDifferent = function(newCTM) {
  return this.activeState.zoom !== newCTM.a
}

ShadowViewport.prototype.isPanDifferent = function(newCTM) {
  return this.activeState.x !== newCTM.e || this.activeState.y !== newCTM.f
}


/**
 * Update cached CTM and active state
 *
 * @param {SVGMatrix} newCTM
 */
ShadowViewport.prototype.updateCache = function(newCTM) {
  this.activeState.zoom = newCTM.a
  this.activeState.x = newCTM.e
  this.activeState.y = newCTM.f
}

ShadowViewport.prototype.pendingUpdate = false

/**
 * Place a request to update CTM on next Frame
 */
ShadowViewport.prototype.updateCTMOnNextFrame = function() {
  if (!this.pendingUpdate) {
    // Lock
    this.pendingUpdate = true

    // Throttle next update
    this.requestAnimationFrame.call(window, this.updateCTMCached)
  }
}

/**
 * Update viewport CTM with cached CTM
 */
ShadowViewport.prototype.updateCTM = function() {
  var ctm = this.getCTM()

  // Updates SVG element
  SvgUtils.setCTM(this.viewport, ctm, this.defs)

  // Free the lock
  this.pendingUpdate = false

  // Notify about the update
  if(this.options.onUpdatedCTM) {
    this.options.onUpdatedCTM(ctm)
  }
}

module.exports = function(viewport, options){
  return new ShadowViewport(viewport, options)
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzdiNzRkNTJiMzlkOTI5NGE3ODYiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvc3ZnLXV0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3ZnLXBhbi16b29tL3NyYy91dGlsaXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvYnJvd3NlcmlmeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvc3ZnLXBhbi16b29tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL3VuaXdoZWVsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL2NvbnRyb2wtaWNvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvc2hhZG93LXZpZXdwb3J0LmpzIl0sIm5hbWVzIjpbImQzIiwic2VsZWN0QWxsIiwib24iLCJzZWxlY3QiLCJhdHRyIiwic3R5bGUiLCJzeW1ib2xTcGFuIiwiaHRtbCIsIm1vZGUiLCJjb250ZW50VHlwZSIsInN2ZyIsImZlYXR1cmVzIiwiZmVhdHVyZU1hcHMiLCJnYW1tYXMiLCJiZXRhcyIsImRhdGEiLCJpIiwicHVzaCIsImZlYXR1cmUiLCJmZWF0dXJlTWFwIiwiZ2FtbWEiLCJiZXRhIiwiY29udkRhdGEiLCJrIiwiaiIsImQiLCJhbXBsaXR1ZGVTY2FsZSIsInNjYWxlU3FydCIsImRvbWFpbiIsInJhbmdlIiwiY2xhbXAiLCJtb3VzZVNjYWxlIiwic2NhbGVMaW5lYXIiLCJ1cGRhdGVTaW5nbGUiLCJzZWxlY3Rpb24iLCJhY2Nlc3NvciIsImVhY2giLCJyIiwicyIsIk1hdGgiLCJzaWduIiwiYWJzIiwidXBkYXRlU2luZ2xlQ29udiIsInVwZGF0ZSIsIm5ld1ZhbHVlIiwibW91c2UiLCJhbHBoYSIsImFscGhhX25vcm0iLCJ1cGRhdGVQYXRjaCIsImF0dGVudGlvbl9wb29sIiwibiIsInNldFVwIiwiZmlsZW5hbWUiLCJrZXl3b3JkIiwic2NhdHRlclBsb3QiLCJib3VuZGluZ0JveCIsImxlZ2VuZCIsInhNaW4iLCJwYXJzZUludCIsInhNYXgiLCJ5TWluIiwieU1heCIsImNvbG9ycyIsImRhdGFzZXQiLCJ4U2NhbGUiLCJ5U2NhbGUiLCJqc29uIiwibWluIiwibWF4IiwicmFuZ2VSb3VuZCIsImF0dHJzIiwiZW50ZXIiLCJhcHBlbmQiLCJjIiwiZmlsdGVyIiwiZmVhdHVyZV9tYXAiLCJmb2N1c0FsbCIsImZvY3VzIiwicHJvY2Vzc0V4YW1wbGUiLCJzdHlsZVNlbGVjdDEiLCJzdHlsZVNlbGVjdDIiLCJjb250ZW50U2VsZWN0IiwiaW50ZXJwb2xhdGlvbkltYWdlcyIsInNlbGVjdGVkSW1hZ2VzIiwidXBkYXRlSW1hZ2VzIiwiY29udGVudCIsInN0eWxlMSIsInN0eWxlMiIsImhyZWYiLCJ1cGRhdGVTdHlsZSIsImtleSIsImV4YW1wbGUiLCJpbWFnZVNlbGVjdG9yIiwiblRpY2tzIiwibGVuZ3RoIiwidGlja3MiLCJjaXJjbGUiLCJjbGFzc2VkIiwiZHJhZyIsIm5ld1giLCJldmVudCIsIngiLCJuZXdUaWNrIiwicm91bmQiLCJjb2xvciIsInRvb2x0aXAiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJxdWVzdGlvbiIsImpvaW4iLCJwYWdlWCIsInBhZ2VZIiwicXVlc3Rpb25fd29yZHMiLCJ0ZXh0IiwiZmlyc3RQbG90Iiwic2Vjb25kUGxvdCIsIndvcmQiLCJpbmRleE9mIiwicXVlc3Rpb25fdHlwZXMiLCJxdWVzdGlvbl90eXBlX21hcHBpbmciLCJ0eXBlIiwic2xpY2UiLCJsYXllcl9hbGwiLCJ5IiwicXVlc3Rpb25fdHlwZSIsImZvY3VzVHlwZSIsInN2Z1Bhblpvb20iLCJyZXF1aXJlIiwicGFuWm9vbSIsInZpZXdwb3J0U2VsZWN0b3IiLCJ6b29tRW5hYmxlZCIsImZpdCIsImNlbnRlciIsIm1pblpvb20iLCJjb250cm9sSWNvbnNFbmFibGVkIiwiem9vbUF0UG9pbnRCeSIsInJlc2V0Wm9vbSIsInJlc2V0UGFuIiwiYXJ0aXN0cyIsInBvaW50cyIsImFydGlzdF9pbmRleCIsInVybCIsIk9iamVjdCIsImtleXMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxjQUFjO0FBQzVCLGNBQWMsT0FBTyxNQUFNO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsY0FBYztBQUM1QixjQUFjLFdBQVc7QUFDekI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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RUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDOztBQUU3QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsUUFBUTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJpbmRleC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjN2I3NGQ1MmIzOWQ5Mjk0YTc4NiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJylcbiAgLCBfYnJvd3NlciA9ICd1bmtub3duJ1xuICA7XG5cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTg0NzU4MC9ob3ctdG8tZGV0ZWN0LXNhZmFyaS1jaHJvbWUtaWUtZmlyZWZveC1hbmQtb3BlcmEtYnJvd3NlclxuaWYgKC8qQGNjX29uIUAqL2ZhbHNlIHx8ICEhZG9jdW1lbnQuZG9jdW1lbnRNb2RlKSB7IC8vIGludGVybmV0IGV4cGxvcmVyXG4gIF9icm93c2VyID0gJ2llJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN2Z05TOiAgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJ1xuLCB4bWxOUzogICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnXG4sIHhtbG5zTlM6ICAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nXG4sIHhsaW5rTlM6ICAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaydcbiwgZXZOUzogICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL3htbC1ldmVudHMnXG5cbiAgLyoqXG4gICAqIEdldCBzdmcgZGltZW5zaW9uczogd2lkdGggYW5kIGhlaWdodFxuICAgKlxuICAgKiBAcGFyYW0gIHtTVkdTVkdFbGVtZW50fSBzdmdcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAge3dpZHRoOiAwLCBoZWlnaHQ6IDB9XG4gICAqL1xuLCBnZXRCb3VuZGluZ0NsaWVudFJlY3ROb3JtYWxpemVkOiBmdW5jdGlvbihzdmcpIHtcbiAgICBpZiAoc3ZnLmNsaWVudFdpZHRoICYmIHN2Zy5jbGllbnRIZWlnaHQpIHtcbiAgICAgIHJldHVybiB7d2lkdGg6IHN2Zy5jbGllbnRXaWR0aCwgaGVpZ2h0OiBzdmcuY2xpZW50SGVpZ2h0fVxuICAgIH0gZWxzZSBpZiAoISFzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpIHtcbiAgICAgIHJldHVybiBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGdldCBCb3VuZGluZ0NsaWVudFJlY3QgZm9yIFNWRy4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBnIGVsZW1lbnQgd2l0aCBjbGFzcyBvZiBcInZpZXdwb3J0XCIgb3IgY3JlYXRlcyBpdCBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAqXG4gICAqIEBwYXJhbSAge1NWR1NWR0VsZW1lbnR9IHN2Z1xuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSAgICAgZyAoZ3JvdXApIGVsZW1lbnRcbiAgICovXG4sIGdldE9yQ3JlYXRlVmlld3BvcnQ6IGZ1bmN0aW9uKHN2Zywgc2VsZWN0b3IpIHtcbiAgICB2YXIgdmlld3BvcnQgPSBudWxsXG5cbiAgICBpZiAoVXRpbHMuaXNFbGVtZW50KHNlbGVjdG9yKSkge1xuICAgICAgdmlld3BvcnQgPSBzZWxlY3RvclxuICAgIH0gZWxzZSB7XG4gICAgICB2aWV3cG9ydCA9IHN2Zy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGp1c3Qgb25lIG1haW4gZ3JvdXAgaW4gU1ZHXG4gICAgaWYgKCF2aWV3cG9ydCkge1xuICAgICAgdmFyIGNoaWxkTm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChzdmcuY2hpbGROb2RlcyB8fCBzdmcuY2hpbGRyZW4pLmZpbHRlcihmdW5jdGlvbihlbCl7XG4gICAgICAgIHJldHVybiBlbC5ub2RlTmFtZSAhPT0gJ2RlZnMnICYmIGVsLm5vZGVOYW1lICE9PSAnI3RleHQnXG4gICAgICB9KVxuXG4gICAgICAvLyBOb2RlIG5hbWUgc2hvdWxkIGJlIFNWR0dFbGVtZW50IGFuZCBzaG91bGQgaGF2ZSBubyB0cmFuc2Zvcm0gYXR0cmlidXRlXG4gICAgICAvLyBHcm91cHMgd2l0aCB0cmFuc2Zvcm0gYXJlIG5vdCB1c2VkIGFzIHZpZXdwb3J0IGJlY2F1c2UgaXQgaW52b2x2ZXMgcGFyc2luZyBvZiBhbGwgdHJhbnNmb3JtIHBvc3NpYmlsaXRpZXNcbiAgICAgIGlmIChjaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiBjaGlsZE5vZGVzWzBdLm5vZGVOYW1lID09PSAnZycgJiYgY2hpbGROb2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScpID09PSBudWxsKSB7XG4gICAgICAgIHZpZXdwb3J0ID0gY2hpbGROb2Rlc1swXVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG5vIGZhdm9yYWJsZSBncm91cCBlbGVtZW50IGV4aXN0cyB0aGVuIGNyZWF0ZSBvbmVcbiAgICBpZiAoIXZpZXdwb3J0KSB7XG4gICAgICB2YXIgdmlld3BvcnRJZCA9ICd2aWV3cG9ydC0nICsgbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgICB2aWV3cG9ydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLnN2Z05TLCAnZycpO1xuICAgICAgdmlld3BvcnQuc2V0QXR0cmlidXRlKCdpZCcsIHZpZXdwb3J0SWQpO1xuXG4gICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciAoYWxsIHZlcnNpb25zPykgY2FuJ3QgdXNlIGNoaWxkTm9kZXMsIGJ1dCBvdGhlciBicm93c2VycyBwcmVmZXIgKHJlcXVpcmU/KSB1c2luZyBjaGlsZE5vZGVzXG4gICAgICB2YXIgc3ZnQ2hpbGRyZW4gPSBzdmcuY2hpbGROb2RlcyB8fCBzdmcuY2hpbGRyZW47XG4gICAgICBpZiAoISFzdmdDaGlsZHJlbiAmJiBzdmdDaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBzdmdDaGlsZHJlbi5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAvLyBNb3ZlIGV2ZXJ5dGhpbmcgaW50byB2aWV3cG9ydCBleGNlcHQgZGVmc1xuICAgICAgICAgIGlmIChzdmdDaGlsZHJlbltzdmdDaGlsZHJlbi5sZW5ndGggLSBpXS5ub2RlTmFtZSAhPT0gJ2RlZnMnKSB7XG4gICAgICAgICAgICB2aWV3cG9ydC5hcHBlbmRDaGlsZChzdmdDaGlsZHJlbltzdmdDaGlsZHJlbi5sZW5ndGggLSBpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdmcuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xuICAgIH1cblxuICAgIC8vIFBhcnNlIGNsYXNzIG5hbWVzXG4gICAgdmFyIGNsYXNzTmFtZXMgPSBbXTtcbiAgICBpZiAodmlld3BvcnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpKSB7XG4gICAgICBjbGFzc05hbWVzID0gdmlld3BvcnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpLnNwbGl0KCcgJylcbiAgICB9XG5cbiAgICAvLyBTZXQgY2xhc3MgKGlmIG5vdCBzZXQgYWxyZWFkeSlcbiAgICBpZiAoIX5jbGFzc05hbWVzLmluZGV4T2YoJ3N2Zy1wYW4tem9vbV92aWV3cG9ydCcpKSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2goJ3N2Zy1wYW4tem9vbV92aWV3cG9ydCcpXG4gICAgICB2aWV3cG9ydC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NOYW1lcy5qb2luKCcgJykpXG4gICAgfVxuXG4gICAgcmV0dXJuIHZpZXdwb3J0XG4gIH1cblxuICAvKipcbiAgICogU2V0IFNWRyBhdHRyaWJ1dGVzXG4gICAqXG4gICAqIEBwYXJhbSAge1NWR1NWR0VsZW1lbnR9IHN2Z1xuICAgKi9cbiAgLCBzZXR1cFN2Z0F0dHJpYnV0ZXM6IGZ1bmN0aW9uKHN2Zykge1xuICAgIC8vIFNldHRpbmcgZGVmYXVsdCBhdHRyaWJ1dGVzXG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnMnLCB0aGlzLnN2Z05TKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlModGhpcy54bWxuc05TLCAneG1sbnM6eGxpbmsnLCB0aGlzLnhsaW5rTlMpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyh0aGlzLnhtbG5zTlMsICd4bWxuczpldicsIHRoaXMuZXZOUyk7XG5cbiAgICAvLyBOZWVkZWQgZm9yIEludGVybmV0IEV4cGxvcmVyLCBvdGhlcndpc2UgdGhlIHZpZXdwb3J0IG92ZXJmbG93c1xuICAgIGlmIChzdmcucGFyZW50Tm9kZSAhPT0gbnVsbCkge1xuICAgICAgdmFyIHN0eWxlID0gc3ZnLmdldEF0dHJpYnV0ZSgnc3R5bGUnKSB8fCAnJztcbiAgICAgIGlmIChzdHlsZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ292ZXJmbG93JykgPT09IC0xKSB7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ292ZXJmbG93OiBoaWRkZW47ICcgKyBzdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbi8qKlxuICogSG93IGxvbmcgSW50ZXJuZXQgRXhwbG9yZXIgdGFrZXMgdG8gZmluaXNoIHVwZGF0aW5nIGl0cyBkaXNwbGF5IChtcykuXG4gKi9cbiwgaW50ZXJuZXRFeHBsb3JlclJlZGlzcGxheUludGVydmFsOiAzMDBcblxuLyoqXG4gKiBGb3JjZXMgdGhlIGJyb3dzZXIgdG8gcmVkaXNwbGF5IGFsbCBTVkcgZWxlbWVudHMgdGhhdCByZWx5IG9uIGFuXG4gKiBlbGVtZW50IGRlZmluZWQgaW4gYSAnZGVmcycgc2VjdGlvbi4gSXQgd29ya3MgZ2xvYmFsbHksIGZvciBldmVyeVxuICogYXZhaWxhYmxlIGRlZnMgZWxlbWVudCBvbiB0aGUgcGFnZS5cbiAqIFRoZSB0aHJvdHRsaW5nIGlzIGludGVudGlvbmFsbHkgZ2xvYmFsLlxuICpcbiAqIFRoaXMgaXMgb25seSBuZWVkZWQgZm9yIElFLiBJdCBpcyBhcyBhIGhhY2sgdG8gbWFrZSBtYXJrZXJzIChhbmQgJ3VzZScgZWxlbWVudHM/KVxuICogdmlzaWJsZSBhZnRlciBwYW4vem9vbSB3aGVuIHRoZXJlIGFyZSBtdWx0aXBsZSBTVkdzIG9uIHRoZSBwYWdlLlxuICogU2VlIGJ1ZyByZXBvcnQ6IGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvNzgxOTY0L1xuICogYWxzbyBzZWUgc3ZnLXBhbi16b29tIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYXJpdXR0YS9zdmctcGFuLXpvb20vaXNzdWVzLzYyXG4gKi9cbiwgcmVmcmVzaERlZnNHbG9iYWw6IFV0aWxzLnRocm90dGxlKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbGxEZWZzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZGVmcycpO1xuICAgIHZhciBhbGxEZWZzQ291bnQgPSBhbGxEZWZzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbERlZnNDb3VudDsgaSsrKSB7XG4gICAgICB2YXIgdGhpc0RlZnMgPSBhbGxEZWZzW2ldO1xuICAgICAgdGhpc0RlZnMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpc0RlZnMsIHRoaXNEZWZzKTtcbiAgICB9XG4gIH0sIHRoaXMgPyB0aGlzLmludGVybmV0RXhwbG9yZXJSZWRpc3BsYXlJbnRlcnZhbCA6IG51bGwpXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGN1cnJlbnQgdHJhbnNmb3JtIG1hdHJpeCBvZiBhbiBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSB7U1ZHRWxlbWVudH0gZWxlbWVudFxuICAgKiBAcGFyYW0ge1NWR01hdHJpeH0gbWF0cml4ICBDVE1cbiAgICogQHBhcmFtIHtTVkdFbGVtZW50fSBkZWZzXG4gICAqL1xuLCBzZXRDVE06IGZ1bmN0aW9uKGVsZW1lbnQsIG1hdHJpeCwgZGVmcykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgLCBzID0gJ21hdHJpeCgnICsgbWF0cml4LmEgKyAnLCcgKyBtYXRyaXguYiArICcsJyArIG1hdHJpeC5jICsgJywnICsgbWF0cml4LmQgKyAnLCcgKyBtYXRyaXguZSArICcsJyArIG1hdHJpeC5mICsgJyknO1xuXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgcyk7XG4gICAgaWYgKCd0cmFuc2Zvcm0nIGluIGVsZW1lbnQuc3R5bGUpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gcztcbiAgICB9IGVsc2UgaWYgKCctbXMtdHJhbnNmb3JtJyBpbiBlbGVtZW50LnN0eWxlKSB7XG4gICAgICBlbGVtZW50LnN0eWxlWyctbXMtdHJhbnNmb3JtJ10gPSBzO1xuICAgIH0gZWxzZSBpZiAoJy13ZWJraXQtdHJhbnNmb3JtJyBpbiBlbGVtZW50LnN0eWxlKSB7XG4gICAgICBlbGVtZW50LnN0eWxlWyctd2Via2l0LXRyYW5zZm9ybSddID0gcztcbiAgICB9XG5cbiAgICAvLyBJRSBoYXMgYSBidWcgdGhhdCBtYWtlcyBtYXJrZXJzIGRpc2FwcGVhciBvbiB6b29tICh3aGVuIHRoZSBtYXRyaXggXCJhXCIgYW5kL29yIFwiZFwiIGVsZW1lbnRzIGNoYW5nZSlcbiAgICAvLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzY1NDU3OC9zdmctbWFya2VyLWRvZXMtbm90LXdvcmstaW4taWU5LTEwXG4gICAgLy8gYW5kIGh0dHA6Ly9zcm5kb2xoYS53b3JkcHJlc3MuY29tLzIwMTMvMTEvMjUvc3ZnLWxpbmUtbWFya2Vycy1tYXktZGlzYXBwZWFyLWluLWludGVybmV0LWV4cGxvcmVyLTExL1xuICAgIGlmIChfYnJvd3NlciA9PT0gJ2llJyAmJiAhIWRlZnMpIHtcbiAgICAgIC8vIHRoaXMgcmVmcmVzaCBpcyBpbnRlbmRlZCBmb3IgcmVkaXNwbGF5aW5nIHRoZSBTVkcgZHVyaW5nIHpvb21pbmdcbiAgICAgIGRlZnMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZGVmcywgZGVmcyk7XG4gICAgICAvLyB0aGlzIHJlZnJlc2ggaXMgaW50ZW5kZWQgZm9yIHJlZGlzcGxheWluZyB0aGUgb3RoZXIgU1ZHcyBvbiBhIHBhZ2Ugd2hlbiBwYW5uaW5nIGEgZ2l2ZW4gU1ZHXG4gICAgICAvLyBpdCBpcyBhbHNvIG5lZWRlZCBmb3IgdGhlIGdpdmVuIFNWRyBpdHNlbGYsIG9uIHpvb21FbmQsIGlmIHRoZSBTVkcgY29udGFpbnMgYW55IG1hcmtlcnMgdGhhdFxuICAgICAgLy8gYXJlIGxvY2F0ZWQgdW5kZXIgYW55IG90aGVyIGVsZW1lbnQocykuXG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhhdC5yZWZyZXNoRGVmc0dsb2JhbCgpO1xuICAgICAgfSwgdGhhdC5pbnRlcm5ldEV4cGxvcmVyUmVkaXNwbGF5SW50ZXJ2YWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSBhbiBTVkdQb2ludCBvYmplY3Qgd2l0aCBnaXZlbiBldmVudCBjb29yZGluYXRlc1xuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcbiAgICogQHBhcmFtICB7U1ZHU1ZHRWxlbWVudH0gc3ZnXG4gICAqIEByZXR1cm4ge1NWR1BvaW50fSAgICAgcG9pbnRcbiAgICovXG4sIGdldEV2ZW50UG9pbnQ6IGZ1bmN0aW9uKGV2dCwgc3ZnKSB7XG4gICAgdmFyIHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KClcblxuICAgIFV0aWxzLm1vdXNlQW5kVG91Y2hOb3JtYWxpemUoZXZ0LCBzdmcpXG5cbiAgICBwb2ludC54ID0gZXZ0LmNsaWVudFhcbiAgICBwb2ludC55ID0gZXZ0LmNsaWVudFlcblxuICAgIHJldHVybiBwb2ludFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBTVkcgY2VudGVyIHBvaW50XG4gICAqXG4gICAqIEBwYXJhbSAge1NWR1NWR0VsZW1lbnR9IHN2Z1xuICAgKiBAcmV0dXJuIHtTVkdQb2ludH1cbiAgICovXG4sIGdldFN2Z0NlbnRlclBvaW50OiBmdW5jdGlvbihzdmcsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVTVkdQb2ludChzdmcsIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMilcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkdQb2ludCB3aXRoIGdpdmVuIHggYW5kIHlcbiAgICpcbiAgICogQHBhcmFtICB7U1ZHU1ZHRWxlbWVudH0gc3ZnXG4gICAqIEBwYXJhbSAge051bWJlcn0geFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHlcbiAgICogQHJldHVybiB7U1ZHUG9pbnR9XG4gICAqL1xuLCBjcmVhdGVTVkdQb2ludDogZnVuY3Rpb24oc3ZnLCB4LCB5KSB7XG4gICAgdmFyIHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KClcbiAgICBwb2ludC54ID0geFxuICAgIHBvaW50LnkgPSB5XG5cbiAgICByZXR1cm4gcG9pbnRcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3ZnLXBhbi16b29tL3NyYy9zdmctdXRpbGl0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogRXh0ZW5kcyBhbiBvYmplY3RcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSB0YXJnZXQgb2JqZWN0IHRvIGV4dGVuZFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHNvdXJjZSBvYmplY3QgdG8gdGFrZSBwcm9wZXJ0aWVzIGZyb21cbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgZXh0ZW5kZWQgb2JqZWN0XG4gICAqL1xuICBleHRlbmQ6IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlKSB7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHt9O1xuICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAvLyBHbyByZWN1cnNpdmVseVxuICAgICAgaWYgKHRoaXMuaXNPYmplY3Qoc291cmNlW3Byb3BdKSkge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSB0aGlzLmV4dGVuZCh0YXJnZXRbcHJvcF0sIHNvdXJjZVtwcm9wXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbiBvYmplY3QgaXMgYSBET00gZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBvIEhUTUwgZWxlbWVudCBvciBTdHJpbmdcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gICByZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGEgRE9NIGVsZW1lbnRcbiAgICovXG4sIGlzRWxlbWVudDogZnVuY3Rpb24obyl7XG4gICAgcmV0dXJuIChcbiAgICAgIG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fCBvIGluc3RhbmNlb2YgU1ZHRWxlbWVudCB8fCBvIGluc3RhbmNlb2YgU1ZHU1ZHRWxlbWVudCB8fCAvL0RPTTJcbiAgICAgIChvICYmIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBvICE9PSBudWxsICYmIG8ubm9kZVR5cGUgPT09IDEgJiYgdHlwZW9mIG8ubm9kZU5hbWUgPT09ICdzdHJpbmcnKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGFuIG9iamVjdCBpcyBhbiBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgbyBPYmplY3RcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gICByZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGFuIE9iamVjdFxuICAgKi9cbiwgaXNPYmplY3Q6IGZ1bmN0aW9uKG8pe1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB2YXJpYWJsZSBpcyBOdW1iZXJcbiAgICpcbiAgICogQHBhcmFtICB7SW50ZWdlcnxGbG9hdH0gIG5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gICByZXR1cm5zIHRydWUgaWYgdmFyaWFibGUgaXMgTnVtYmVyXG4gICAqL1xuLCBpc051bWJlcjogZnVuY3Rpb24obikge1xuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoIGZvciBhbiBTVkcgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R8U3RyaW5nfSBlbGVtZW50T3JTZWxlY3RvciBET00gRWxlbWVudCBvciBzZWxlY3RvciBTdHJpbmdcbiAgICogQHJldHVybiB7T2JqZWN0fE51bGx9ICAgICAgICAgICAgICAgICAgIFNWRyBvciBudWxsXG4gICAqL1xuLCBnZXRTdmc6IGZ1bmN0aW9uKGVsZW1lbnRPclNlbGVjdG9yKSB7XG4gICAgdmFyIGVsZW1lbnRcbiAgICAgICwgc3ZnO1xuXG4gICAgaWYgKCF0aGlzLmlzRWxlbWVudChlbGVtZW50T3JTZWxlY3RvcikpIHtcbiAgICAgIC8vIElmIHNlbGVjdG9yIHByb3ZpZGVkXG4gICAgICBpZiAodHlwZW9mIGVsZW1lbnRPclNlbGVjdG9yID09PSAnc3RyaW5nJyB8fCBlbGVtZW50T3JTZWxlY3RvciBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICAvLyBUcnkgdG8gZmluZCB0aGUgZWxlbWVudFxuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50T3JTZWxlY3RvcilcblxuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3ZpZGVkIHNlbGVjdG9yIGRpZCBub3QgZmluZCBhbnkgZWxlbWVudHMuIFNlbGVjdG9yOiAnICsgZWxlbWVudE9yU2VsZWN0b3IpXG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm92aWRlZCBzZWxlY3RvciBpcyBub3QgYW4gSFRNTCBvYmplY3Qgbm9yIFN0cmluZycpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50T3JTZWxlY3RvclxuICAgIH1cblxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2ZycpIHtcbiAgICAgIHN2ZyA9IGVsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgc3ZnID0gZWxlbWVudC5jb250ZW50RG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZW1iZWQnKSB7XG4gICAgICAgICAgc3ZnID0gZWxlbWVudC5nZXRTVkdEb2N1bWVudCgpLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbWcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzY3JpcHQgYW4gU1ZHIGluIGFuIFwiaW1nXCIgZWxlbWVudC4gUGxlYXNlIHVzZSBhbiBcIm9iamVjdFwiIGVsZW1lbnQgb3IgYW4gaW4tbGluZSBTVkcuJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGdldCBTVkcuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnXG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIGEgZ2l2ZW4gY29udGV4dCB0byBhIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgICAgIEZ1bmN0aW9uXG4gICAqIEBwYXJhbSAge09iamVjdH0gICBjb250ZXh0IENvbnRleHRcbiAgICogQHJldHVybiB7RnVuY3Rpb259ICAgICAgICAgICBGdW5jdGlvbiB3aXRoIGNlcnRhaW4gY29udGV4dFxuICAgKi9cbiwgcHJveHk6IGZ1bmN0aW9uKGZuLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBvYmplY3QgdHlwZVxuICAgKiBVc2VzIHRvU3RyaW5nIHRoYXQgcmV0dXJucyBbb2JqZWN0IFNWR1BvaW50XVxuICAgKiBBbmQgdGhhbiBwYXJzZXMgb2JqZWN0IHR5cGUgZnJvbSBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBvIEFueSBvYmplY3RcbiAgICogQHJldHVybiB7U3RyaW5nfSAgIE9iamVjdCB0eXBlXG4gICAqL1xuLCBnZXRUeXBlOiBmdW5jdGlvbihvKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkobykucmVwbGFjZSgvXlxcW29iamVjdFxccy8sICcnKS5yZXBsYWNlKC9cXF0kLywgJycpXG4gIH1cblxuICAvKipcbiAgICogSWYgaXQgaXMgYSB0b3VjaCBldmVudCB0aGFuIGFkZCBjbGllbnRYIGFuZCBjbGllbnRZIHRvIGV2ZW50IG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0gIHtFdmVudH0gZXZ0XG4gICAqIEBwYXJhbSAge1NWR1NWR0VsZW1lbnR9IHN2Z1xuICAgKi9cbiwgbW91c2VBbmRUb3VjaE5vcm1hbGl6ZTogZnVuY3Rpb24oZXZ0LCBzdmcpIHtcbiAgICAvLyBJZiBubyBjbGllbnRYIHRoZW4gZmFsbGJhY2tcbiAgICBpZiAoZXZ0LmNsaWVudFggPT09IHZvaWQgMCB8fCBldnQuY2xpZW50WCA9PT0gbnVsbCkge1xuICAgICAgLy8gRmFsbGJhY2tcbiAgICAgIGV2dC5jbGllbnRYID0gMFxuICAgICAgZXZ0LmNsaWVudFkgPSAwXG5cbiAgICAgIC8vIElmIGl0IGlzIGEgdG91Y2ggZXZlbnRcbiAgICAgIGlmIChldnQudG91Y2hlcyAhPT0gdm9pZCAwICYmIGV2dC50b3VjaGVzLmxlbmd0aCkge1xuICAgICAgICBpZiAoZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgZXZ0LmNsaWVudFggPSBldnQudG91Y2hlc1swXS5jbGllbnRYXG4gICAgICAgICAgZXZ0LmNsaWVudFkgPSBldnQudG91Y2hlc1swXS5jbGllbnRZXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LnRvdWNoZXNbMF0ucGFnZVggIT09IHZvaWQgMCkge1xuICAgICAgICAgIHZhciByZWN0ID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgZXZ0LmNsaWVudFggPSBldnQudG91Y2hlc1swXS5wYWdlWCAtIHJlY3QubGVmdFxuICAgICAgICAgIGV2dC5jbGllbnRZID0gZXZ0LnRvdWNoZXNbMF0ucGFnZVkgLSByZWN0LnRvcFxuICAgICAgICB9XG4gICAgICAvLyBJZiBpdCBpcyBhIGN1c3RvbSBldmVudFxuICAgICAgfSBlbHNlIGlmIChldnQub3JpZ2luYWxFdmVudCAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGlmIChldnQub3JpZ2luYWxFdmVudC5jbGllbnRYICE9PSB2b2lkIDApIHtcbiAgICAgICAgICBldnQuY2xpZW50WCA9IGV2dC5vcmlnaW5hbEV2ZW50LmNsaWVudFhcbiAgICAgICAgICBldnQuY2xpZW50WSA9IGV2dC5vcmlnaW5hbEV2ZW50LmNsaWVudFlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhbiBldmVudCBpcyBhIGRvdWJsZSBjbGljay90YXBcbiAgICogVE9ETzogRm9yIHRvdWNoIGdlc3R1cmVzIHVzZSBhIGxpYnJhcnkgKGhhbW1lci5qcykgdGhhdCB0YWtlcyBpbiBhY2NvdW50IG90aGVyIGV2ZW50c1xuICAgKiAodG91Y2htb3ZlIGFuZCB0b3VjaGVuZCkuIEl0IHNob3VsZCB0YWtlIGluIGFjY291bnQgdGFwIGR1cmF0aW9uIGFuZCB0cmF2ZWxlZCBkaXN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0gIHtFdmVudH0gIGV2dFxuICAgKiBAcGFyYW0gIHtFdmVudH0gIHByZXZFdnQgUHJldmlvdXMgRXZlbnRcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4sIGlzRGJsQ2xpY2s6IGZ1bmN0aW9uKGV2dCwgcHJldkV2dCkge1xuICAgIC8vIERvdWJsZSBjbGljayBkZXRlY3RlZCBieSBicm93c2VyXG4gICAgaWYgKGV2dC5kZXRhaWwgPT09IDIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBUcnkgdG8gY29tcGFyZSBldmVudHNcbiAgICBlbHNlIGlmIChwcmV2RXZ0ICE9PSB2b2lkIDAgJiYgcHJldkV2dCAhPT0gbnVsbCkge1xuICAgICAgdmFyIHRpbWVTdGFtcERpZmYgPSBldnQudGltZVN0YW1wIC0gcHJldkV2dC50aW1lU3RhbXAgLy8gc2hvdWxkIGJlIGxvd2VyIHRoYW4gMjUwIG1zXG4gICAgICAgICwgdG91Y2hlc0Rpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KGV2dC5jbGllbnRYIC0gcHJldkV2dC5jbGllbnRYLCAyKSArIE1hdGgucG93KGV2dC5jbGllbnRZIC0gcHJldkV2dC5jbGllbnRZLCAyKSlcblxuICAgICAgcmV0dXJuIHRpbWVTdGFtcERpZmYgPCAyNTAgJiYgdG91Y2hlc0Rpc3RhbmNlIDwgMTBcbiAgICB9XG5cbiAgICAvLyBOb3RoaW5nIGZvdW5kXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlclxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuLCBub3c6IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG4gIC8vIEZyb20gdW5kZXJzY29yZS5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuLy8ganNjczpkaXNhYmxlXG4vLyBqc2hpbnQgaWdub3JlOnN0YXJ0XG4sIHRocm90dGxlOiBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogdGhhdC5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IHRoYXQubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfVxuLy8ganNoaW50IGlnbm9yZTplbmRcbi8vIGpzY3M6ZW5hYmxlXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHJlcXVlc3RBbmltYXRpb25GcmFtZSBzaW11bGF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSAge051bWJlcnxTdHJpbmd9IHJlZnJlc2hSYXRlXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiwgY3JlYXRlUmVxdWVzdEFuaW1hdGlvbkZyYW1lOiBmdW5jdGlvbihyZWZyZXNoUmF0ZSkge1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbFxuXG4gICAgLy8gQ29udmVydCByZWZyZXNoUmF0ZSB0byB0aW1lb3V0XG4gICAgaWYgKHJlZnJlc2hSYXRlICE9PSAnYXV0bycgJiYgcmVmcmVzaFJhdGUgPCA2MCAmJiByZWZyZXNoUmF0ZSA+IDEpIHtcbiAgICAgIHRpbWVvdXQgPSBNYXRoLmZsb29yKDEwMDAgLyByZWZyZXNoUmF0ZSlcbiAgICB9XG5cbiAgICBpZiAodGltZW91dCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgcmVxdWVzdFRpbWVvdXQoMzMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXF1ZXN0VGltZW91dCh0aW1lb3V0KVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGNhbGxiYWNrIHRoYXQgd2lsbCBleGVjdXRlIGFmdGVyIGEgZ2l2ZW4gdGltZW91dFxuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSB0aW1lb3V0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gcmVxdWVzdFRpbWVvdXQodGltZW91dCkge1xuICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgdGltZW91dClcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3ZnLXBhbi16b29tL3NyYy91dGlsaXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIFN2Z1Bhblpvb20gPSByZXF1aXJlKCcuL3N2Zy1wYW4tem9vbS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN2Z1Bhblpvb207XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL2Jyb3dzZXJpZnkuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xuICAgIGQzLnNlbGVjdEFsbChcIi5jb2xsYXBzaWJsZVwiKVxuICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGQzLnNlbGVjdEFsbCgnLmNvbnRlbnRbY29udGVudC1uYW1lPVwiJyArIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwiY29udGVudC1uYW1lXCIpICsgJ1wiXScpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImRpc3BsYXlcIikgPT09IFwiYmxvY2tcIiA/IFwibm9uZVwiIDogXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHN5bWJvbFNwYW4gPSBkMy5zZWxlY3QodGhpcykuc2VsZWN0KFwic3BhblwiKTtcbiAgICAgICAgICAgIHN5bWJvbFNwYW4uaHRtbChzeW1ib2xTcGFuLmh0bWwoKSA9PT0gXCIrXCIgPyBcIi1cIiA6IFwiK1wiKTtcbiAgICAgICAgfSk7XG4gICAgZDMuc2VsZWN0QWxsKFwiLmV4cGFuZC1jb2xsYXBzZS1idXR0b25cIilcbiAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbW9kZSA9IGQzLnNlbGVjdCh0aGlzKS5odG1sKCk7XG4gICAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSBkMy5zZWxlY3QodGhpcykuYXR0cihcImNvbnRlbnQtdHlwZVwiKTtcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5odG1sKG1vZGUgPT09IFwiZXhwYW5kIGFsbFwiID8gXCJjb2xsYXBzZSBhbGxcIiA6IFwiZXhwYW5kIGFsbFwiKTtcbiAgICAgICAgICAgIGQzLnNlbGVjdEFsbCgnLmNvbnRlbnRbY29udGVudC10eXBlPVwiJyArIGNvbnRlbnRUeXBlICsgJ1wiXScpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vZGUgPT09IFwiZXhwYW5kIGFsbFwiID8gXCJibG9ja1wiIDogXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkMy5zZWxlY3RBbGwoJy5jb2xsYXBzaWJsZVtjb250ZW50LXR5cGU9XCInICsgY29udGVudFR5cGUgKyAnXCJdJykuc2VsZWN0KFwic3BhblwiKVxuICAgICAgICAgICAgICAgIC5odG1sKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9kZSA9PT0gXCJleHBhbmQgYWxsXCIgPyBcIi1cIiA6IFwiK1wiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbn0pKCk7XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI2ZpbG0tbGF5ZXItZGlhZ3JhbSA+IHN2Z1wiKTtcbiAgICB2YXIgZmVhdHVyZXMgPSBbMC45LCAtMC41LCAtMC44XTtcbiAgICB2YXIgZmVhdHVyZU1hcHMgPSBbXG4gICAgICAgIFtbLTAuNiwgLTAuNiwgIDAuOF0sIFsgMC42LCAgMC43LCAgMC40XSwgWy0wLjgsICAwLjgsICAwLjldXSxcbiAgICAgICAgW1sgMC45LCAtMC4xLCAgMC41XSwgWy0wLjgsIC0wLjcsICAwLjVdLCBbLTAuMywgLTAuOSwgLTAuMl1dLFxuICAgICAgICBbWy0wLjUsIC0wLjksICAwLjZdLCBbLTAuMiwgLTAuNCwgIDAuMl0sIFstMC42LCAgMC4xLCAtMC4zXV1cbiAgICBdO1xuICAgIHZhciBnYW1tYXMgPSBbLTEuNiwgMC44LCAxLjhdO1xuICAgIHZhciBiZXRhcyA9IFsxLjAsIDAuNSwgLTAuNV07XG4gICAgdmFyIGRhdGEgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBkYXRhLnB1c2goe2ZlYXR1cmU6IGZlYXR1cmVzW2ldLCBmZWF0dXJlTWFwOiBbXSwgZ2FtbWE6IGdhbW1hc1tpXSwgYmV0YTogYmV0YXNbaV19KTtcbiAgICB9XG4gICAgdmFyIGNvbnZEYXRhID0gW107XG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCAzOyBrKyspIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgMzsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSB7ZmVhdHVyZTogZmVhdHVyZU1hcHNbaV1bal1ba10sIGdhbW1hOiBnYW1tYXNba10sIGJldGE6IGJldGFzW2tdfTtcbiAgICAgICAgICAgICAgICBjb252RGF0YS5wdXNoKGQpO1xuICAgICAgICAgICAgICAgIGRhdGFbMiAtIGtdLmZlYXR1cmVNYXAucHVzaChkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgYW1wbGl0dWRlU2NhbGUgPSBkMy5zY2FsZVNxcnQoKS5kb21haW4oWzAuMCwgMi4wXSkucmFuZ2UoWzAuMCwgMC44XSkuY2xhbXAodHJ1ZSk7XG4gICAgdmFyIG1vdXNlU2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpLmRvbWFpbihbMC4wLCA0MC4wXSkucmFuZ2UoWzIuMCwgLTIuMF0pLmNsYW1wKHRydWUpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI21scC1maWd1cmUgZyNpbnB1dC1sYXllclwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShkYXRhKTtcbiAgICBzdmcuc2VsZWN0KFwiZyNtbHAtZmlndXJlIGcjZ2FtbWFcIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoZGF0YSk7XG4gICAgc3ZnLnNlbGVjdChcImcjbWxwLWZpZ3VyZSBnI2JldGFcIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoZGF0YSk7XG4gICAgc3ZnLnNlbGVjdChcImcjbWxwLWZpZ3VyZSBnI3NjYWxlZC1sYXllclwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShkYXRhKTtcbiAgICBzdmcuc2VsZWN0KFwiZyNtbHAtZmlndXJlIGcjc2hpZnRlZC1sYXllclwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShkYXRhKTtcbiAgICBzdmcuc2VsZWN0KFwiZyNjbm4tZmlndXJlIGcjaW5wdXQtbGF5ZXJcIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoY29udkRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUgZyNzY2FsZWQtbGF5ZXJcIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoY29udkRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUgZyNzaGlmdGVkLWxheWVyXCIpLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5kYXRhKGNvbnZEYXRhKTtcblxuXG4gICAgZnVuY3Rpb24gdXBkYXRlU2luZ2xlKHNlbGVjdGlvbiwgYWNjZXNzb3IpIHtcbiAgICAgICAgc2VsZWN0aW9uLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5lYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICB2YXIgciA9IGFjY2Vzc29yKGQpO1xuICAgICAgICAgICAgdmFyIHMgPSBNYXRoLnNpZ24ocikgKiBhbXBsaXR1ZGVTY2FsZShNYXRoLmFicyhyKSk7XG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgLnNlbGVjdChcIi52ZWN0b3ItcGF0Y2hcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcIm9wYWNpdHlcIiwgTWF0aC5hYnMocykpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJocmVmXCIsIHIgPCAwID8gXCIjdmVjdG9yLXBhdGNoLW5lZ2F0aXZlXCIgOiBcIiN2ZWN0b3ItcGF0Y2gtcG9zaXRpdmVcIik7XG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgLnNlbGVjdChcIi5maWd1cmUtbGluZVwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwibWF0cml4KFwiICsgW3MsIDAsIDAsIHMsIDIwLCAyMF0gKyBcIilcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVTaW5nbGVDb252KHNlbGVjdGlvbiwgYWNjZXNzb3IpIHtcbiAgICAgICAgc2VsZWN0aW9uLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5lYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICB2YXIgciA9IGFjY2Vzc29yKGQpO1xuICAgICAgICAgICAgdmFyIHMgPSBNYXRoLnNpZ24ocikgKiBhbXBsaXR1ZGVTY2FsZShNYXRoLmFicyhyKSk7XG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgLnNlbGVjdChcIi5jb252b2x1dGlvbmFsLXBhdGNoXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJvcGFjaXR5XCIsIE1hdGguYWJzKHMpKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaHJlZlwiLCByIDwgMCA/ICBcIiNjb252b2x1dGlvbmFsLXBhdGNoLW5lZ2F0aXZlXCIgOiBcIiNjb252b2x1dGlvbmFsLXBhdGNoLXBvc2l0aXZlXCIpO1xuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAgIC5zZWxlY3QoXCIudmVjdG9yLXBhdGNoXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJvcGFjaXR5XCIsIE1hdGguYWJzKHMpKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaHJlZlwiLCByIDwgMCA/ICBcIiN2ZWN0b3ItcGF0Y2gtbmVnYXRpdmVcIiA6IFwiI3ZlY3Rvci1wYXRjaC1wb3NpdGl2ZVwiKTtcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAuc2VsZWN0KFwiLmZpZ3VyZS1saW5lXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJtYXRyaXgoXCIgKyBbcywgMCwgMCwgcywgMTUsIDE1XSArIFwiKVwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgdXBkYXRlU2luZ2xlKHN2Zy5zZWxlY3QoXCJnI21scC1maWd1cmUgZyNpbnB1dC1sYXllclwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5mZWF0dXJlOyB9KTtcbiAgICAgICAgdXBkYXRlU2luZ2xlKHN2Zy5zZWxlY3QoXCJnI21scC1maWd1cmUgZyNnYW1tYVwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nYW1tYTsgfSk7XG4gICAgICAgIHVwZGF0ZVNpbmdsZShzdmcuc2VsZWN0KFwiZyNtbHAtZmlndXJlIGcjYmV0YVwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5iZXRhOyB9KTtcbiAgICAgICAgdXBkYXRlU2luZ2xlKHN2Zy5zZWxlY3QoXCJnI21scC1maWd1cmUgZyNzY2FsZWQtbGF5ZXJcIiksIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2FtbWEgKiBkLmZlYXR1cmU7IH0pO1xuICAgICAgICB1cGRhdGVTaW5nbGUoc3ZnLnNlbGVjdChcImcjbWxwLWZpZ3VyZSBnI3NoaWZ0ZWQtbGF5ZXJcIiksIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2FtbWEgKiBkLmZlYXR1cmUgKyBkLmJldGE7IH0pO1xuICAgICAgICB1cGRhdGVTaW5nbGVDb252KHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUgZyNpbnB1dC1sYXllclwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5mZWF0dXJlOyB9KTtcbiAgICAgICAgdXBkYXRlU2luZ2xlQ29udihzdmcuc2VsZWN0KFwiZyNjbm4tZmlndXJlIGcjc2NhbGVkLWxheWVyXCIpLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdhbW1hICogZC5mZWF0dXJlOyB9KTtcbiAgICAgICAgdXBkYXRlU2luZ2xlQ29udihzdmcuc2VsZWN0KFwiZyNjbm4tZmlndXJlIGcjc2hpZnRlZC1sYXllclwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nYW1tYSAqIGQuZmVhdHVyZSArIGQuYmV0YTsgfSk7XG4gICAgfVxuICAgIHVwZGF0ZSgpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI21scC1maWd1cmUgZyNnYW1tYVwiKVxuICAgICAgLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKVxuICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgIC5vbihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gbW91c2VTY2FsZShkMy5tb3VzZSh0aGlzKVsxXSk7XG4gICAgICAgICAgICBkLmdhbW1hID0gbmV3VmFsdWU7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDk7IGkrKykge1xuICAgICAgICAgICAgICAgIGQuZmVhdHVyZU1hcFtpXS5nYW1tYSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgIHN2Zy5zZWxlY3QoXCJnI21scC1maWd1cmUgZyNiZXRhXCIpXG4gICAgICAuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpXG4gICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBtb3VzZVNjYWxlKGQzLm1vdXNlKHRoaXMpWzFdKTtcbiAgICAgICAgICAgIGQuYmV0YSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA5OyBpKyspIHtcbiAgICAgICAgICAgICAgICBkLmZlYXR1cmVNYXBbaV0uYmV0YSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIH0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjZmlsbS12cy1hdHRlbnRpb24tZGlhZ3JhbSA+IHN2Z1wiKTtcbiAgICB2YXIgZmVhdHVyZU1hcHMgPSBbXG4gICAgICAgIFtbLTAuNiwgLTAuNiwgIDAuOF0sIFsgMC42LCAgMC43LCAgMC40XSwgWy0wLjgsICAwLjgsICAwLjldXSxcbiAgICAgICAgW1sgMC45LCAtMC4xLCAgMC41XSwgWy0wLjgsIC0wLjcsICAwLjVdLCBbLTAuMywgLTAuOSwgLTAuMl1dLFxuICAgICAgICBbWzAuOCwgLTAuOSwgIDAuNl0sIFstMC4yLCAtMC40LCAgMC4yXSwgWy0wLjYsICAwLjEsIC0wLjNdXVxuICAgIF07XG5cbiAgICB2YXIgZ2FtbWFzID0gWy0xLjYsIDAuOCwgMS44XTtcbiAgICB2YXIgYmV0YXMgPSBbMS4wLCAwLjUsIC0wLjVdO1xuXG4gICAgLy8gTm90ZSBBbHBoYSBtdXN0IGJlIHBvc2l0aWZcbiAgICB2YXIgYWxwaGEgPSBbWzAuNiwgMS43LCAxXSwgWzAuNSwgNCwgMTBdLCBbMC44LCAzLCA3XV07XG4gICAgdmFyIGFscGhhX25vcm0gPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgMzsgaisrKSB7XG4gICAgICAgICAgICBhbHBoYV9ub3JtID0gYWxwaGFfbm9ybSArIGFscGhhW2ldW2pdXG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgICAgICAgIGFscGhhW2ldW2pdID0gMiogYWxwaGFbaV1bal0gLyBhbHBoYV9ub3JtXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IFtdO1xuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgMzsgaysrKSB7XG4gICAgICAgIGRhdGEucHVzaCh7ZmVhdHVyZU1hcDogZmVhdHVyZU1hcHNba10sIGdhbW1hOiBnYW1tYXNba10sIGJldGE6IGJldGFzW2tdLCBhbHBoYTogYWxwaGF9KTtcbiAgICB9XG5cbiAgICB2YXIgY29udkRhdGEgPSBbXTtcbiAgICBmb3IgKHZhciBrID0gMDsgayA8IDM7IGsrKykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHtmZWF0dXJlOiBmZWF0dXJlTWFwc1trXVtpXVtqXSwgZ2FtbWE6IGdhbW1hc1trXSwgYmV0YTogYmV0YXNba10sIGFscGhhOiBhbHBoYVtpXVtqXX07XG4gICAgICAgICAgICAgICAgY29udkRhdGEucHVzaChkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhbXBsaXR1ZGVTY2FsZSA9IGQzLnNjYWxlU3FydCgpLmRvbWFpbihbMC4wLCAyLjBdKS5yYW5nZShbMC4wLCAwLjhdKS5jbGFtcCh0cnVlKTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVBhdGNoKHNlbGVjdGlvbiwgYWNjZXNzb3IpIHtcbiAgICAgICAgc2VsZWN0aW9uLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5lYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICB2YXIgciA9IGFjY2Vzc29yKGQpO1xuICAgICAgICAgICAgdmFyIHMgPSBNYXRoLnNpZ24ocikgKiBhbXBsaXR1ZGVTY2FsZShNYXRoLmFicyhyKSk7XG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAuc2VsZWN0KFwiLmNvbnZvbHV0aW9uYWwtcGF0Y2hcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcIm9wYWNpdHlcIiwgTWF0aC5hYnMocykpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJocmVmXCIsIHIgPCAwID8gIFwiI2NvbnZvbHV0aW9uYWwtcGF0Y2gtbmVnYXRpdmVcIiA6IFwiI2NvbnZvbHV0aW9uYWwtcGF0Y2gtcG9zaXRpdmVcIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEF0dGVudGlvbiBwaXBlbGluZVxuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtYXR0ZW50aW9uIGcjaW5wdXQtY29udi1hdHRcIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoY29udkRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtYXR0ZW50aW9uIGcjYWxwaGEtY29udi1hdHRcIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoY29udkRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtYXR0ZW50aW9uIGcjb3V0LWNvbnYtYXR0XCIpLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5kYXRhKGNvbnZEYXRhKTtcbiAgICBzdmcuc2VsZWN0KFwiZyNjbm4tZmlndXJlLWF0dGVudGlvbiBnI291dC1mZWF0LWF0dFwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShkYXRhKTtcblxuICAgIC8vIEZpTE0gcGlwZWxpbmVcbiAgICBzdmcuc2VsZWN0KFwiZyNjbm4tZmlndXJlLWZpbG0gZyNpbnB1dC1jb252LWZpbG1cIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoY29udkRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtZmlsbSBnI2dhbW1hLWNvbnYtZmlsbVwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShkYXRhKTtcbiAgICBzdmcuc2VsZWN0KFwiZyNjbm4tZmlndXJlLWZpbG0gZyNvdXQtY29udi1maWxtXCIpLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5kYXRhKGNvbnZEYXRhKTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgLy8gQXR0ZW50aW9uIHBpcGVsaW5lXG4gICAgICAgIHVwZGF0ZVBhdGNoKHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtYXR0ZW50aW9uIGcjaW5wdXQtY29udi1hdHRcIiksIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZmVhdHVyZTsgfSk7XG4gICAgICAgIHVwZGF0ZVBhdGNoKHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtYXR0ZW50aW9uIGcjYWxwaGEtY29udi1hdHRcIiksIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuYWxwaGE7IH0pO1xuICAgICAgICB1cGRhdGVQYXRjaChzdmcuc2VsZWN0KFwiZyNjbm4tZmlndXJlLWF0dGVudGlvbiBnI291dC1jb252LWF0dFwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5hbHBoYSAqIGQuZmVhdHVyZTsgfSk7XG4gICAgICAgIHVwZGF0ZVBhdGNoKHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtYXR0ZW50aW9uIGcjb3V0LWZlYXQtYXR0XCIpLCBmdW5jdGlvbihkKSAgIHtcbiAgICAgICAgICAgIHZhciBhdHRlbnRpb25fcG9vbCA9IDA7XG4gICAgICAgICAgICB2YXIgbiA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgMzsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dGVudGlvbl9wb29sID0gYXR0ZW50aW9uX3Bvb2wgKyBkLmFscGhhW2ldW2pdICogZC5mZWF0dXJlTWFwW2ldW2pdXG4gICAgICAgICAgICAgICAgICAgIG4gPSBuICsgMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhdHRlbnRpb25fcG9vbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRmlMTSBwaXBlbGluZVxuICAgICAgICB1cGRhdGVQYXRjaChzdmcuc2VsZWN0KFwiZyNjbm4tZmlndXJlLWZpbG0gZyNpbnB1dC1jb252LWZpbG1cIiksIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZmVhdHVyZTsgfSk7XG4gICAgICAgIHVwZGF0ZVBhdGNoKHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtZmlsbSBnI2dhbW1hLWNvbnYtZmlsbVwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nYW1tYTsgfSk7XG4gICAgICAgIHVwZGF0ZVBhdGNoKHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtZmlsbSBnI291dC1jb252LWZpbG1cIiksIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2FtbWEgKiBkLmZlYXR1cmU7IH0pO1xuICAgIH1cbiAgICB1cGRhdGUoKVxufSkoKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXRVcCA9IGZ1bmN0aW9uKGZpbGVuYW1lLCBrZXl3b3JkKSB7XG4gICAgICAgIC8vIEdldCByZWZlcmVuY2VzIHRvIGltcG9ydGFudCB0YWdzXG4gICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjZ2FtbWEtYmV0YS1kaWFncmFtID4gc3ZnXCIpO1xuICAgICAgICB2YXIgc2NhdHRlclBsb3QgPSBzdmcuc2VsZWN0KFwiI1wiICsga2V5d29yZCArIFwiLXBsb3RcIik7XG4gICAgICAgIHZhciBib3VuZGluZ0JveCA9IHNjYXR0ZXJQbG90LnNlbGVjdChcInJlY3RcIik7XG4gICAgICAgIHZhciBsZWdlbmQgPSBzdmcuc2VsZWN0KFwiI1wiICsga2V5d29yZCArIFwiLWxlZ2VuZFwiKTtcblxuICAgICAgICAvLyBSZXRyaWV2ZSBzY2F0dGVyIHBsb3QgYm91bmRpbmcgYm94IGNvb3JkaW5hdGVzXG4gICAgICAgIHZhciB4TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInhcIikpO1xuICAgICAgICB2YXIgeE1heCA9IHhNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwid2lkdGhcIikpO1xuICAgICAgICB2YXIgeU1pbiA9IHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ5XCIpKTtcbiAgICAgICAgdmFyIHlNYXggPSB5TWluICsgcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcImhlaWdodFwiKSk7XG5cbiAgICAgICAgdmFyIGNvbG9ycyA9IFtcbiAgICAgICAgICAgIFwiI0Y0NDMzNlwiLCBcIiNFOTFFNjNcIiwgXCIjOUMyN0IwXCIsIFwiIzY3M0FCN1wiLCBcIiMzRjUxQjVcIixcbiAgICAgICAgICAgIFwiIzIxOTZGM1wiLCBcIiMwM0E5RjRcIiwgXCIjMDBCQ0Q0XCIsIFwiIzAwOTY4OFwiLCBcIiM0Q0FGNTBcIixcbiAgICAgICAgICAgIFwiIzhCQzM0QVwiLCBcIiNDRERDMzlcIiwgXCIjRkZFQjNCXCIsIFwiI0ZGOTgwMFwiLCBcIiM3OTU1NDhcIixcbiAgICAgICAgICAgIFwiIzlFOUU5RVwiLFxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBkYXRhc2V0O1xuICAgICAgICB2YXIgeFNjYWxlO1xuICAgICAgICB2YXIgeVNjYWxlO1xuXG4gICAgICAgIGQzLmpzb24oZmlsZW5hbWUsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGFzZXQgPSBkYXRhO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgc2NhbGVzIG1hcHBpbmcgZ2FtbWEgYW5kIGJldGEgdmFsdWVzIHRvIGJvdW5kaW5nIGJveFxuICAgICAgICAgICAgLy8gY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIHhTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgICAgICAuZG9tYWluKFsxLjE1ICogZDMubWluKGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmdhbW1hOyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAxLjE1ICogZDMubWF4KGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmdhbW1hOyB9KV0pXG4gICAgICAgICAgICAgICAgLnJhbmdlUm91bmQoW3hNaW4sIHhNYXhdKTtcbiAgICAgICAgICAgIHlTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgICAgICAuZG9tYWluKFsxLjE1ICogZDMubWluKGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmJldGE7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgIDEuMTUgKiBkMy5tYXgoZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuYmV0YTsgfSldKVxuICAgICAgICAgICAgICAgIC5yYW5nZVJvdW5kKFt5TWF4LCB5TWluXSlcblxuICAgICAgICAgICAgLy8gU2V0IHVwIGF4ZXNcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdChcIiN4LWF4aXNcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgXCJNXCIgKyAgeE1pbiArIFwiIFwiICsgIHlTY2FsZSgwKSArIFwiIEwgXCIgKyB4TWF4ICsgXCIgXCIgKyB5U2NhbGUoMCkpO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3gtYXhpcy1sYWJlbFwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XCJ4XCI6IHhNYXggLSAxMCwgXCJ5XCI6IHlTY2FsZSgwLjApICsgMTB9KTtcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdChcIiN5LWF4aXNcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgXCJNXCIgKyAgeFNjYWxlKDApICsgXCIgXCIgKyAgeU1heCArIFwiIEwgXCIgKyB4U2NhbGUoMCkgKyBcIiBcIiArIHlNaW4pO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3ktYXhpcy1sYWJlbFwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XCJ4XCI6IHhTY2FsZSgwLjApICsgMTAsIFwieVwiOiB5TWlufSk7XG5cbiAgICAgICAgICAgIC8vIERpc3BhdGNoIGRhdGEgcG9pbnRzIGludG8gZ3JvdXBzIGJ5IGZlYXR1cmUgbWFwXG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAgICAgLmRhdGEoY29sb3JzKVxuICAgICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxLjApXG4gICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oYywgaSkge1xuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZGF0YShkYXRhc2V0LmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkLmZlYXR1cmVfbWFwID09IGk7IH0pKVxuICAgICAgICAgICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHJzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmdhbW1hKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLmJldGEpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiAzLjAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvcnNbaV07IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBsZWdlbmRcbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuZGF0YShjb2xvcnMpXG4gICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgICAgIFwiY3hcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMTggKiBpOyB9LFxuICAgICAgICAgICAgICAgICAgICBcImN5XCI6IDAsXG4gICAgICAgICAgICAgICAgICAgIFwiclwiOiA2LFxuICAgICAgICAgICAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiAwLFxuICAgICAgICAgICAgICAgICAgICBcInN0cm9rZVwiOiBcInJlZFwiLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBjb2xvcnNbaV07IH0pXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KTtcblxuICAgICAgICAgICAgLy8gRm9jdXNlcyBvbiBhbGwgcG9pbnRzIGJ5IHJlc2V0dGluZyB0aGUgb3BhY2l0aWVzXG4gICAgICAgICAgICB2YXIgZm9jdXNBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KTtcbiAgICAgICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMS4wKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEZvY3VzZXMgb24gYSBzaW5nbGUgZmVhdHVyZSBtYXAgYnkgbG93ZXJpbmcgb3RoZXIgZmVhdHVyZSBtYXBcbiAgICAgICAgICAgIC8vIG9wYWNpdGllc1xuICAgICAgICAgICAgdmFyIGZvY3VzID0gZnVuY3Rpb24oaikge1xuICAgICAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMC42IDogMC4xOyB9KTtcbiAgICAgICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaSA9PSBqID8gIDEuMCA6IDAuMTsgfSlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEFkZCBob3ZlcmluZyBiZWhhdmlvciB0byBsZWdlbmRcbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9jdXMoaSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmb2N1c0FsbCk7XG5cbiAgICAgICAgICAgIGZvY3VzQWxsKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgc2V0VXAoJ2RhdGEvY2xldnJfZ2FtbWFfYmV0YV9zdWJzYW1wbGVkLmpzb24nLCAnY2xldnInKTtcbiAgICBzZXRVcCgnZGF0YS9zdHlsZV9nYW1tYV9iZXRhX3N1YnNhbXBsZWQuanNvbicsICdzdHlsZS10cmFuc2ZlcicpO1xufSkoKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBwcm9jZXNzRXhhbXBsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI3N0eWxlLWludGVycG9sYXRpb24tZGlhZ3JhbSA+IHN2Z1wiKTtcbiAgICAgICAgdmFyIHN0eWxlU2VsZWN0MSA9IHN2Zy5zZWxlY3RBbGwoXCIjc3R5bGUtMS1zZWxlY3QgaW1hZ2VcIikuYXR0cignY3Vyc29yJywgJ3BvaW50ZXInKVxuICAgICAgICB2YXIgc3R5bGVTZWxlY3QyID0gc3ZnLnNlbGVjdEFsbChcIiNzdHlsZS0yLXNlbGVjdCBpbWFnZVwiKS5hdHRyKCdjdXJzb3InLCAncG9pbnRlcicpO1xuICAgICAgICB2YXIgY29udGVudFNlbGVjdCA9IHN2Zy5zZWxlY3RBbGwoXCIjY29udGVudC1zZWxlY3QgaW1hZ2VcIikuYXR0cignY3Vyc29yJywgJ3BvaW50ZXInKTtcbiAgICAgICAgdmFyIGludGVycG9sYXRpb25JbWFnZXMgPSBzdmcuc2VsZWN0QWxsKFwiI2ludGVycG9sYXRpb24gaW1hZ2VcIik7XG4gICAgICAgIHZhciBzZWxlY3RlZEltYWdlcyA9IHtcbiAgICAgICAgICAgICdjb250ZW50JzogMCwgXG4gICAgICAgICAgICAnc3R5bGUxJzogMCwgXG4gICAgICAgICAgICAnc3R5bGUyJzogMFxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB1cGRhdGVJbWFnZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbnRlcnBvbGF0aW9uSW1hZ2VzLmF0dHIoXCJ4bGluazpocmVmXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjb250ZW50LCBzdHlsZTEsIHN0eWxlMiB9ID0gc2VsZWN0ZWRJbWFnZXNcbiAgICAgICAgICAgICAgICBjb25zdCBocmVmID0gYGltYWdlcy9zdHlsaXplZC0ke2NvbnRlbnQgKyAxfS0ke3N0eWxlMSArIDF9LSR7c3R5bGUyICsgMX0tJHtpICsgMX0uanBnYDtcbiAgICAgICAgICAgICAgICByZXR1cm4gaHJlZjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdHlsZVNlbGVjdDEuc3R5bGUoJ29wYWNpdHknLCAoZCwgaSkgPT4gaSA9PSBzZWxlY3RlZEltYWdlc1snc3R5bGUxJ10gPyAxOiAwLjEpO1xuICAgICAgICAgICAgc3R5bGVTZWxlY3QyLnN0eWxlKCdvcGFjaXR5JywgKGQsIGkpID0+IGkgPT0gc2VsZWN0ZWRJbWFnZXNbJ3N0eWxlMiddID8gMTogMC4xKTtcbiAgICAgICAgICAgIGNvbnRlbnRTZWxlY3Quc3R5bGUoJ29wYWNpdHknLCAoZCwgaSkgPT4gaSA9PSBzZWxlY3RlZEltYWdlc1snY29udGVudCddID8gMTogMC4xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1cGRhdGVTdHlsZSA9IGtleSA9PiAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgc2VsZWN0ZWRJbWFnZXNba2V5XSA9IGk7XG4gICAgICAgICAgICB1cGRhdGVJbWFnZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0eWxlU2VsZWN0MS5vbihcImNsaWNrXCIsIHVwZGF0ZVN0eWxlKCdzdHlsZTEnKSk7XG4gICAgICAgIHN0eWxlU2VsZWN0Mi5vbihcImNsaWNrXCIsIHVwZGF0ZVN0eWxlKCdzdHlsZTInKSk7XG4gICAgICAgIGNvbnRlbnRTZWxlY3Qub24oXCJjbGlja1wiLCB1cGRhdGVTdHlsZSgnY29udGVudCcpKTtcblxuICAgICAgICB1cGRhdGVJbWFnZXMoKTtcblxuICAgIH07XG4gICAgcHJvY2Vzc0V4YW1wbGUoKTtcbn0pKCk7XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgcHJvY2Vzc0V4YW1wbGUgPSBmdW5jdGlvbihleGFtcGxlKSB7XG4gICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjcXVlc3Rpb24taW50ZXJwb2xhdGlvbi1kaWFncmFtID4gc3ZnXCIpO1xuICAgICAgICB2YXIgaW1hZ2VTZWxlY3RvciA9IHN2Zy5zZWxlY3QoXCIjZXhhbXBsZS1cIiArIGV4YW1wbGUgKyBcIiA+IC5pbWFnZS1zZWxlY3RvclwiKTtcblxuICAgICAgICB2YXIgeE1pbiA9ICtpbWFnZVNlbGVjdG9yLnNlbGVjdChcImxpbmVcIikuYXR0cihcIngxXCIpO1xuICAgICAgICB2YXIgeE1heCA9ICtpbWFnZVNlbGVjdG9yLnNlbGVjdChcImxpbmVcIikuYXR0cihcIngyXCIpO1xuICAgICAgICB2YXIgblRpY2tzID0gMTE7XG4gICAgICAgIHZhciBsZW5ndGggPSAoeE1heCAtIHhNaW4pIC8gKG5UaWNrcyAtIDEuMCk7XG4gICAgICAgIHZhciB0aWNrcyA9IFtdO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgblRpY2tzOyBpKyspIHtcbiAgICAgICAgICB0aWNrcy5wdXNoKHhNaW4gKyBpICogbGVuZ3RoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyIGNpcmNsZSA9IGltYWdlU2VsZWN0b3IuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuYXR0cnMoe1wiY3hcIjogdGlja3NbMF0sIFwiY3lcIjogMCwgXCJyXCI6IDZ9KVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLmNsYXNzZWQoXCJmaWd1cmUtcGF0aFwiLCB0cnVlKTtcblxuICAgICAgICB2YXIgZHJhZyA9IGQzLmRyYWcoKVxuICAgICAgICAgIC5vbihcImRyYWdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciBuZXdYID0gTWF0aC5taW4odGlja3NbblRpY2tzIC0gMV0sIE1hdGgubWF4KHRpY2tzWzBdLCBkMy5ldmVudC54KSk7XG4gICAgICAgICAgICAgIHZhciBuZXdUaWNrID0gTWF0aC5yb3VuZCgobmV3WCAtIHRpY2tzWzBdKSAvIGxlbmd0aCk7XG4gICAgICAgICAgICAgIG5ld1ggPSB0aWNrc1swXSArIGxlbmd0aCAqIG5ld1RpY2s7XG4gICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwiY3hcIiwgbmV3WCk7XG4gICAgICAgICAgICAgIHN2Zy5zZWxlY3QoXCJtYXNrI20tXCIgKyBleGFtcGxlICsgXCIgPiBpbWFnZVwiKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIFwiaW1hZ2VzL3F1ZXN0aW9uLWludGVycG9sYXRpb24tXCIgKyBleGFtcGxlICsgXCItbWFzay1cIiArICgrbmV3VGljayArIDEpICsgXCIucG5nXCIpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWcoY2lyY2xlKTtcbiAgICB9O1xuICAgIHByb2Nlc3NFeGFtcGxlKFwiMVwiKTtcbiAgICBwcm9jZXNzRXhhbXBsZShcIjJcIik7XG59KSgpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldFVwID0gZnVuY3Rpb24oZmlsZW5hbWUsIGtleXdvcmQsIGNvbG9yKSB7XG4gICAgICAgIC8vIEdldCByZWZlcmVuY2VzIHRvIGltcG9ydGFudCB0YWdzXG4gICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjY2xldnItc3ViY2x1c3Rlci1kaWFncmFtID4gc3ZnXCIpO1xuICAgICAgICB2YXIgc2NhdHRlclBsb3QgPSBzdmcuc2VsZWN0KFwiI1wiICsga2V5d29yZCArIFwiLXBsb3RcIik7XG4gICAgICAgIHZhciBib3VuZGluZ0JveCA9IHNjYXR0ZXJQbG90LnNlbGVjdChcInJlY3RcIik7XG4gICAgICAgIHZhciBsZWdlbmQgPSBzdmcuc2VsZWN0KFwiI1wiICsga2V5d29yZCArIFwiLWxlZ2VuZFwiKTtcblxuICAgICAgICAvLyBSZXRyaWV2ZSBzY2F0dGVyIHBsb3QgYm91bmRpbmcgYm94IGNvb3JkaW5hdGVzXG4gICAgICAgIHZhciB4TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInhcIikpO1xuICAgICAgICB2YXIgeE1heCA9IHhNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwid2lkdGhcIikpO1xuICAgICAgICB2YXIgeU1pbiA9IHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ5XCIpKTtcbiAgICAgICAgdmFyIHlNYXggPSB5TWluICsgcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcImhlaWdodFwiKSk7XG5cbiAgICAgICAgdmFyIGNvbG9ycyA9IFtcbiAgICAgICAgICAgIFwiI0Y0NDMzNlwiLCBcIiNFOTFFNjNcIiwgXCIjOUMyN0IwXCIsIFwiIzY3M0FCN1wiLCBcIiMzRjUxQjVcIixcbiAgICAgICAgICAgIFwiIzIxOTZGM1wiLCBcIiMwM0E5RjRcIiwgXCIjMDBCQ0Q0XCIsIFwiIzAwOTY4OFwiLCBcIiM0Q0FGNTBcIixcbiAgICAgICAgICAgIFwiIzhCQzM0QVwiLCBcIiNDRERDMzlcIiwgXCIjRkZFQjNCXCIsIFwiI0ZGOTgwMFwiLCBcIiM3OTU1NDhcIixcbiAgICAgICAgICAgIFwiIzlFOUU5RVwiLFxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBkYXRhc2V0O1xuICAgICAgICB2YXIgeFNjYWxlO1xuICAgICAgICB2YXIgeVNjYWxlO1xuXG4gICAgICAgIGQzLmpzb24oZmlsZW5hbWUsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGFzZXQgPSBkYXRhO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgc2NhbGVzIG1hcHBpbmcgZ2FtbWEgYW5kIGJldGEgdmFsdWVzIHRvIGJvdW5kaW5nIGJveFxuICAgICAgICAgICAgLy8gY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIHhTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgICAgICAuZG9tYWluKFsxLjE1ICogZDMubWluKGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmdhbW1hOyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAxLjE1ICogZDMubWF4KGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmdhbW1hOyB9KV0pXG4gICAgICAgICAgICAgICAgLnJhbmdlUm91bmQoW3hNaW4sIHhNYXhdKTtcbiAgICAgICAgICAgIHlTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgICAgICAuZG9tYWluKFsxLjE1ICogZDMubWluKGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmJldGE7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgIDEuMTUgKiBkMy5tYXgoZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuYmV0YTsgfSldKVxuICAgICAgICAgICAgICAgIC5yYW5nZVJvdW5kKFt5TWF4LCB5TWluXSlcblxuICAgICAgICAgICAgLy8gU2V0IHVwIGF4ZXNcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdChcIiN4LWF4aXNcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgXCJNXCIgKyAgeE1pbiArIFwiIFwiICsgIHlTY2FsZSgwKSArIFwiIEwgXCIgKyB4TWF4ICsgXCIgXCIgKyB5U2NhbGUoMCkpO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3gtYXhpcy1sYWJlbFwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XCJ4XCI6IHhNYXggLSAxMCwgXCJ5XCI6IHlTY2FsZSgwLjApICsgMTB9KTtcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdChcIiN5LWF4aXNcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgXCJNXCIgKyAgeFNjYWxlKDApICsgXCIgXCIgKyAgeU1heCArIFwiIEwgXCIgKyB4U2NhbGUoMCkgKyBcIiBcIiArIHlNaW4pO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3ktYXhpcy1sYWJlbFwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XCJ4XCI6IHhTY2FsZSgwLjApICsgMTAsIFwieVwiOiB5TWlufSk7XG5cbiAgICAgICAgICAgIHZhciB0b29sdGlwID0gZDMuc2VsZWN0KFwiYm9keVwiKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImlkXCIsIFwidG9vbHRpcC1jbGV2clwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b29sdGlwIGZpZ3VyZS10ZXh0XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiYmFja2dyb3VuZFwiLCBcIiNkZGRcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJib3JkZXItcmFkaXVzXCIsIFwiNnB4XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwicGFkZGluZ1wiLCBcIjEwcHhcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuXG4gICAgICAgICAgICAvLyBEaXNwbGF5IGRhdGEgcG9pbnRzXG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuZGF0YShkYXRhc2V0KVxuICAgICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmdhbW1hKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5iZXRhKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJyXCI6IDMuMCxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgY29sb3JzW2NvbG9yXSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC5odG1sKGQucXVlc3Rpb24uam9pbihcIiBcIikgKyBcIj9cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHNldFVwKCdkYXRhL2NsZXZyX2dhbW1hX2JldGFfd29yZHNfc3ViY2x1c3Rlcl9mbV8yNi5qc29uJywgJ2ZpcnN0JywgMCk7XG4gICAgc2V0VXAoJ2RhdGEvY2xldnJfZ2FtbWFfYmV0YV93b3Jkc19zdWJjbHVzdGVyX2ZtXzc2Lmpzb24nLCAnc2Vjb25kJywgNik7XG59KSgpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbG9ycyA9IFtcbiAgICAgICAgXCIjRjQ0MzM2XCIsIFwiI0U5MUU2M1wiLCBcIiM5QzI3QjBcIiwgXCIjNjczQUI3XCIsIFwiIzNGNTFCNVwiLFxuICAgICAgICBcIiMyMTk2RjNcIiwgXCIjMDNBOUY0XCIsIFwiIzAwQkNENFwiLCBcIiMwMDk2ODhcIiwgXCIjNENBRjUwXCIsXG4gICAgICAgIFwiIzhCQzM0QVwiLCBcIiNDRERDMzlcIiwgXCIjRkZFQjNCXCIsXG4gICAgXTtcblxuICAgIHZhciBxdWVzdGlvbl93b3JkcyA9IFtcbiAgICAgICAgXCJmcm9udFwiLCBcImJlaGluZFwiLCBcImxlZnRcIiwgXCJyaWdodFwiLFxuICAgICAgICBcIm1hdGVyaWFsXCIsIFwicnViYmVyXCIsIFwibWF0dGVcIiwgXCJtZXRhbFwiLCBcIm1ldGFsbGljXCIsIFwic2hpbnlcIixcbiAgICBdO1xuXG4gICAgdmFyIHNldFVwID0gZnVuY3Rpb24oZmlsZW5hbWUsIGtleXdvcmQsIGNvbG9yKSB7XG4gICAgICAgIC8vIEdldCByZWZlcmVuY2VzIHRvIGltcG9ydGFudCB0YWdzXG4gICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjY2xldnItc3ViY2x1c3Rlci1jb2xvci13b3Jkcy1kaWFncmFtID4gc3ZnXCIpO1xuICAgICAgICB2YXIgc2NhdHRlclBsb3QgPSBzdmcuc2VsZWN0KFwiI1wiICsga2V5d29yZCArIFwiLXBsb3RcIik7XG4gICAgICAgIHZhciBib3VuZGluZ0JveCA9IHNjYXR0ZXJQbG90LnNlbGVjdChcInJlY3RcIik7XG5cbiAgICAgICAgLy8gUmV0cmlldmUgc2NhdHRlciBwbG90IGJvdW5kaW5nIGJveCBjb29yZGluYXRlc1xuICAgICAgICB2YXIgeE1pbiA9IHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ4XCIpKTtcbiAgICAgICAgdmFyIHhNYXggPSB4TWluICsgcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcIndpZHRoXCIpKTtcbiAgICAgICAgdmFyIHlNaW4gPSBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwieVwiKSk7XG4gICAgICAgIHZhciB5TWF4ID0geU1pbiArIHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJoZWlnaHRcIikpO1xuXG4gICAgICAgIHZhciBkYXRhc2V0O1xuICAgICAgICB2YXIgeFNjYWxlO1xuICAgICAgICB2YXIgeVNjYWxlO1xuXG4gICAgICAgIGQzLmpzb24oZmlsZW5hbWUsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGFzZXQgPSBkYXRhO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgc2NhbGVzIG1hcHBpbmcgZ2FtbWEgYW5kIGJldGEgdmFsdWVzIHRvIGJvdW5kaW5nIGJveFxuICAgICAgICAgICAgLy8gY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIHhTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgICAgICAuZG9tYWluKFsxLjE1ICogZDMubWluKGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmdhbW1hOyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAxLjE1ICogZDMubWF4KGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmdhbW1hOyB9KV0pXG4gICAgICAgICAgICAgICAgLnJhbmdlUm91bmQoW3hNaW4sIHhNYXhdKTtcbiAgICAgICAgICAgIHlTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgICAgICAuZG9tYWluKFsxLjE1ICogZDMubWluKGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmJldGE7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgIDEuMTUgKiBkMy5tYXgoZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuYmV0YTsgfSldKVxuICAgICAgICAgICAgICAgIC5yYW5nZVJvdW5kKFt5TWF4LCB5TWluXSlcblxuICAgICAgICAgICAgLy8gU2V0IHVwIGF4ZXNcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdChcIiN4LWF4aXNcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgXCJNXCIgKyAgeE1pbiArIFwiIFwiICsgIHlTY2FsZSgwKSArIFwiIEwgXCIgKyB4TWF4ICsgXCIgXCIgKyB5U2NhbGUoMCkpO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3gtYXhpcy1sYWJlbFwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XCJ4XCI6IHhNYXggLSAxMCwgXCJ5XCI6IHlTY2FsZSgwLjApICsgMTB9KTtcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdChcIiN5LWF4aXNcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgXCJNXCIgKyAgeFNjYWxlKDApICsgXCIgXCIgKyAgeU1heCArIFwiIEwgXCIgKyB4U2NhbGUoMCkgKyBcIiBcIiArIHlNaW4pO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3ktYXhpcy1sYWJlbFwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XCJ4XCI6IHhTY2FsZSgwLjApICsgMTAsIFwieVwiOiB5TWlufSk7XG5cbiAgICAgICAgICAgIHZhciB0b29sdGlwID0gZDMuc2VsZWN0KFwiYm9keVwiKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImlkXCIsIFwidG9vbHRpcC1jbGV2ci13b3Jkcy1jbGV2ZXJcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG9vbHRpcCBmaWd1cmUtdGV4dFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImJhY2tncm91bmRcIiwgXCIjZGRkXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiYm9yZGVyLXJhZGl1c1wiLCBcIjZweFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcInBhZGRpbmdcIiwgXCIxMHB4XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgLy8gRGlzcGF0Y2ggZGF0YSBwb2ludHMgaW50byBncm91cHMgYnkgcXVlc3Rpb24gdHlwZVxuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLmRhdGEoZGF0YXNldClcbiAgICAgICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmdhbW1hKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5iZXRhKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJyXCI6IDMuMCxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgY29sb3JzW2NvbG9yXSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC5odG1sKGQucXVlc3Rpb24uam9pbihcIiBcIikgKyBcIj9cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAgICAgLmRhdGEocXVlc3Rpb25fd29yZHMpXG4gICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgICAgICAgICBcInhcIjogMjAsXG4gICAgICAgICAgICAgICAgICAgIFwieVwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiAyMCAqIGk7IH0sXG4gICAgICAgICAgICAgICAgICAgIFwiZHlcIjogXCIwLjRlbVwiLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNsYXNzZWQoXCJmaWd1cmUtdGV4dFwiLCB0cnVlKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNilcbiAgICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBzZXRVcCgnZGF0YS9jbGV2cl9nYW1tYV9iZXRhX3dvcmRzX3N1YmNsdXN0ZXJfZm1fMjYuanNvbicsICdmaXJzdCcsIDApO1xuICAgIHNldFVwKCdkYXRhL2NsZXZyX2dhbW1hX2JldGFfd29yZHNfc3ViY2x1c3Rlcl9mbV85Mi5qc29uJywgJ3NlY29uZCcsIDgpO1xuXG4gICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNjbGV2ci1zdWJjbHVzdGVyLWNvbG9yLXdvcmRzLWRpYWdyYW0gPiBzdmdcIik7XG4gICAgdmFyIGxlZ2VuZCA9IHN2Zy5zZWxlY3QoXCIjbGVnZW5kXCIpO1xuICAgIHZhciBmaXJzdFBsb3QgPSBzdmcuc2VsZWN0KFwiI2ZpcnN0LXBsb3RcIik7XG4gICAgdmFyIHNlY29uZFBsb3QgPSBzdmcuc2VsZWN0KFwiI3NlY29uZC1wbG90XCIpO1xuXG4gICAgLy8gQ3JlYXRlIGxlZ2VuZFxuICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgLmRhdGEocXVlc3Rpb25fd29yZHMpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgLmF0dHJzKHtcbiAgICAgICAgICAgIFwiY3hcIjogMCxcbiAgICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjAgKiBpOyB9LFxuICAgICAgICAgICAgXCJyXCI6IDYsXG4gICAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxMCxcbiAgICAgICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogMCxcbiAgICAgICAgICAgIFwic3Ryb2tlXCI6IFwicmVkXCIsXG4gICAgICAgIH0pXG4gICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcImJsYWNrXCIpXG4gICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgIC5kYXRhKHF1ZXN0aW9uX3dvcmRzKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgXCJ4XCI6IDIwLFxuICAgICAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDIwICogaTsgfSxcbiAgICAgICAgICAgIFwiZHlcIjogXCIwLjRlbVwiLFxuICAgICAgICB9KVxuICAgICAgICAuY2xhc3NlZChcImZpZ3VyZS10ZXh0XCIsIHRydWUpXG4gICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSk7XG5cbiAgICAvLyBGb2N1c2VzIG9uIGFsbCBwb2ludHMgYnkgcmVzZXR0aW5nIHRoZSBvcGFjaXRpZXNcbiAgICB2YXIgZm9jdXNBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgICAgICBmaXJzdFBsb3Quc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEuMCk7XG4gICAgICAgIHNlY29uZFBsb3Quc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEuMCk7XG4gICAgfTtcblxuICAgIC8vIEZvY3VzZXMgb24gYSBzaW5nbGUgcXVlc3Rpb24gdHlwZSBieSBsb3dlcmluZyBvdGhlclxuICAgIC8vIHF1ZXN0aW9uIHR5cGUgb3BhY2l0aWVzXG4gICAgdmFyIGZvY3VzID0gZnVuY3Rpb24od29yZCkge1xuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGQgPT0gd29yZCA/ICAwLjYgOiAwLjE7IH0pO1xuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBkID09IHdvcmQgPyAgMC42IDogMC4xOyB9KTtcbiAgICAgICAgZmlyc3RQbG90LnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBkLnF1ZXN0aW9uLmluZGV4T2Yod29yZCkgPj0gMCA/ICAxLjAgOiAwLjE7IH0pXG4gICAgICAgIHNlY29uZFBsb3Quc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGQucXVlc3Rpb24uaW5kZXhPZih3b3JkKSA+PSAwID8gIDEuMCA6IDAuMTsgfSlcbiAgICB9O1xuXG4gICAgLy8gQWRkIGhvdmVyaW5nIGJlaGF2aW9yIHRvIGxlZ2VuZFxuICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgZm9jdXMoZCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZvY3VzQWxsKTtcblxuICAgIGZvY3VzQWxsKCk7XG59KSgpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbG9ycyA9IFtcbiAgICAgICAgXCIjRjQ0MzM2XCIsIFwiI0U5MUU2M1wiLCBcIiM5QzI3QjBcIiwgXCIjNjczQUI3XCIsIFwiIzNGNTFCNVwiLFxuICAgICAgICBcIiMyMTk2RjNcIiwgXCIjMDNBOUY0XCIsIFwiIzAwQkNENFwiLCBcIiMwMDk2ODhcIiwgXCIjNENBRjUwXCIsXG4gICAgICAgIFwiIzhCQzM0QVwiLCBcIiNDRERDMzlcIiwgXCIjRkZFQjNCXCIsXG4gICAgXTtcblxuICAgIHZhciBxdWVzdGlvbl90eXBlcyA9IFtcbiAgICAgICAgXCJFeGlzdHNcIiwgXCJMZXNzIHRoYW5cIiwgXCJHcmVhdGVyIHRoYW5cIiwgXCJDb3VudFwiLCBcIlF1ZXJ5IG1hdGVyaWFsXCIsXG4gICAgICAgIFwiUXVlcnkgc2l6ZVwiLCBcIlF1ZXJ5IGNvbG9yXCIsIFwiUXVlcnkgc2hhcGVcIiwgXCJFcXVhbCBjb2xvclwiLFxuICAgICAgICBcIkVxdWFsIGludGVnZXJcIiwgXCJFcXVhbCBzaGFwZVwiLCBcIkVxdWFsIHNpemVcIiwgXCJFcXVhbCBtYXRlcmlhbFwiXG4gICAgXTtcblxuICAgIC8vIFVnbHkgd29ya2Fyb3VuZCBmb3IgcGVybXV0ZWQgcXVlc3Rpb24gdHlwZXMgaW4gSlNPTiBmaWxlLlxuICAgIHZhciBxdWVzdGlvbl90eXBlX21hcHBpbmcgPSBbMCwgMiwgNSwgOCwgMSwgNCwgOSwgMTAsIDMsIDYsIDEyLCA3LCAxMV07XG5cbiAgICB2YXIgc2V0VXAgPSBmdW5jdGlvbihmaWxlbmFtZSwga2V5d29yZCwgY29sb3IpIHtcbiAgICAgICAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gaW1wb3J0YW50IHRhZ3NcbiAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNjbGV2ci1zdWJjbHVzdGVyLWNvbG9yLWRpYWdyYW0gPiBzdmdcIik7XG4gICAgICAgIHZhciBzY2F0dGVyUGxvdCA9IHN2Zy5zZWxlY3QoXCIjXCIgKyBrZXl3b3JkICsgXCItcGxvdFwiKTtcbiAgICAgICAgdmFyIGJvdW5kaW5nQm94ID0gc2NhdHRlclBsb3Quc2VsZWN0KFwicmVjdFwiKTtcblxuICAgICAgICAvLyBSZXRyaWV2ZSBzY2F0dGVyIHBsb3QgYm91bmRpbmcgYm94IGNvb3JkaW5hdGVzXG4gICAgICAgIHZhciB4TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInhcIikpO1xuICAgICAgICB2YXIgeE1heCA9IHhNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwid2lkdGhcIikpO1xuICAgICAgICB2YXIgeU1pbiA9IHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ5XCIpKTtcbiAgICAgICAgdmFyIHlNYXggPSB5TWluICsgcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcImhlaWdodFwiKSk7XG5cbiAgICAgICAgdmFyIGRhdGFzZXQ7XG4gICAgICAgIHZhciB4U2NhbGU7XG4gICAgICAgIHZhciB5U2NhbGU7XG5cbiAgICAgICAgZDMuanNvbihmaWxlbmFtZSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgZGF0YXNldCA9IGRhdGE7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBzY2FsZXMgbWFwcGluZyBnYW1tYSBhbmQgYmV0YSB2YWx1ZXMgdG8gYm91bmRpbmcgYm94XG4gICAgICAgICAgICAvLyBjb29yZGluYXRlc1xuICAgICAgICAgICAgeFNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgICAgIC5kb21haW4oWzEuMTUgKiBkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZ2FtbWE7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgIDEuMTUgKiBkMy5tYXgoZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZ2FtbWE7IH0pXSlcbiAgICAgICAgICAgICAgICAucmFuZ2VSb3VuZChbeE1pbiwgeE1heF0pO1xuICAgICAgICAgICAgeVNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgICAgIC5kb21haW4oWzEuMTUgKiBkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuYmV0YTsgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgMS4xNSAqIGQzLm1heChkYXRhc2V0LCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5iZXRhOyB9KV0pXG4gICAgICAgICAgICAgICAgLnJhbmdlUm91bmQoW3lNYXgsIHlNaW5dKVxuXG4gICAgICAgICAgICAvLyBTZXQgdXAgYXhlc1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3gtYXhpc1wiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBcIk1cIiArICB4TWluICsgXCIgXCIgKyAgeVNjYWxlKDApICsgXCIgTCBcIiArIHhNYXggKyBcIiBcIiArIHlTY2FsZSgwKSk7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeC1heGlzLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgLmF0dHJzKHtcInhcIjogeE1heCAtIDEwLCBcInlcIjogeVNjYWxlKDAuMCkgKyAxMH0pO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3ktYXhpc1wiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBcIk1cIiArICB4U2NhbGUoMCkgKyBcIiBcIiArICB5TWF4ICsgXCIgTCBcIiArIHhTY2FsZSgwKSArIFwiIFwiICsgeU1pbik7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeS1heGlzLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgLmF0dHJzKHtcInhcIjogeFNjYWxlKDAuMCkgKyAxMCwgXCJ5XCI6IHlNaW59KTtcblxuICAgICAgICAgICAgdmFyIHRvb2x0aXAgPSBkMy5zZWxlY3QoXCJib2R5XCIpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ0b29sdGlwLWNsZXZyLXF1ZXN0aW9uLXR5cGUtY2xldmVyXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRvb2x0aXAgZmlndXJlLXRleHRcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJiYWNrZ3JvdW5kXCIsIFwiI2RkZFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImJvcmRlci1yYWRpdXNcIiwgXCI2cHhcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJwYWRkaW5nXCIsIFwiMTBweFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgICAgIC8vIERpc3BhdGNoIGRhdGEgcG9pbnRzIGludG8gZ3JvdXBzIGJ5IHF1ZXN0aW9uIHR5cGVcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdEFsbChcImdcIilcbiAgICAgICAgICAgICAgICAuZGF0YShjb2xvcnMpXG4gICAgICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMS4wKVxuICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGMsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoZGF0YXNldC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gcXVlc3Rpb25fdHlwZV9tYXBwaW5nW2QudHlwZV0gPT0gaTsgfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjeFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5nYW1tYSk7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5iZXRhKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogMy4wLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gY29sb3JzW2ldOyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzKHF1ZXN0aW9uX3R5cGVfbWFwcGluZ1tkLnR5cGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwLmh0bWwoZC5xdWVzdGlvbi5qb2luKFwiIFwiKSArIFwiP1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNBbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgc2V0VXAoJ2RhdGEvY2xldnJfZ2FtbWFfYmV0YV93b3Jkc19zdWJjbHVzdGVyX2ZtXzI2Lmpzb24nLCAnZmlyc3QnLCAwKTtcbiAgICBzZXRVcCgnZGF0YS9jbGV2cl9nYW1tYV9iZXRhX3dvcmRzX3N1YmNsdXN0ZXJfZm1fNzYuanNvbicsICdzZWNvbmQnLCA2KTtcblxuICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjY2xldnItc3ViY2x1c3Rlci1jb2xvci1kaWFncmFtID4gc3ZnXCIpO1xuICAgIHZhciBsZWdlbmQgPSBzdmcuc2VsZWN0KFwiI2xlZ2VuZFwiKTtcbiAgICB2YXIgZmlyc3RQbG90ID0gc3ZnLnNlbGVjdChcIiNmaXJzdC1wbG90XCIpO1xuICAgIHZhciBzZWNvbmRQbG90ID0gc3ZnLnNlbGVjdChcIiNzZWNvbmQtcGxvdFwiKTtcblxuICAgIC8vIENyZWF0ZSBsZWdlbmRcbiAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKGNvbG9ycylcbiAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgXCJjeFwiOiAwLFxuICAgICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiAyMCAqIGk7IH0sXG4gICAgICAgICAgICBcInJcIjogNixcbiAgICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDIwLFxuICAgICAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiAwLFxuICAgICAgICAgICAgXCJzdHJva2VcIjogXCJyZWRcIixcbiAgICAgICAgfSlcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBjb2xvcnNbaV07IH0pXG4gICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgIC5kYXRhKHF1ZXN0aW9uX3R5cGVzKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgXCJ4XCI6IDIwLFxuICAgICAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDIwICogaTsgfSxcbiAgICAgICAgICAgIFwiZHlcIjogXCIwLjRlbVwiLFxuICAgICAgICB9KVxuICAgICAgICAuY2xhc3NlZChcImZpZ3VyZS10ZXh0XCIsIHRydWUpXG4gICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSk7XG5cbiAgICAvLyBGb2N1c2VzIG9uIGFsbCBwb2ludHMgYnkgcmVzZXR0aW5nIHRoZSBvcGFjaXRpZXNcbiAgICB2YXIgZm9jdXNBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgICAgICBmaXJzdFBsb3Quc2VsZWN0QWxsKFwiZ1wiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxLjApO1xuICAgICAgICBzZWNvbmRQbG90LnNlbGVjdEFsbChcImdcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMS4wKTtcbiAgICB9O1xuXG4gICAgLy8gRm9jdXNlcyBvbiBhIHNpbmdsZSBxdWVzdGlvbiB0eXBlIGJ5IGxvd2VyaW5nIG90aGVyXG4gICAgLy8gcXVlc3Rpb24gdHlwZSBvcGFjaXRpZXNcbiAgICB2YXIgZm9jdXMgPSBmdW5jdGlvbihqKSB7XG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaSA9PSBqID8gIDAuNiA6IDAuMTsgfSk7XG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgPT0gaiA/ICAwLjYgOiAwLjE7IH0pO1xuICAgICAgICBmaXJzdFBsb3Quc2VsZWN0QWxsKFwiZ1wiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMS4wIDogMC4xOyB9KVxuICAgICAgICBzZWNvbmRQbG90LnNlbGVjdEFsbChcImdcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaSA9PSBqID8gIDEuMCA6IDAuMTsgfSlcbiAgICB9O1xuXG4gICAgLy8gQWRkIGhvdmVyaW5nIGJlaGF2aW9yIHRvIGxlZ2VuZFxuICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICBmb2N1cyhpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZm9jdXNBbGwpO1xuICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgZm9jdXMoaSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZvY3VzQWxsKTtcblxuICAgIGZvY3VzQWxsKCk7XG59KSgpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gaW1wb3J0YW50IHRhZ3NcbiAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI2NsZXZyLXBsb3Qtc3ZnXCIpO1xuICAgIHZhciBzY2F0dGVyUGxvdCA9IHN2Zy5zZWxlY3QoXCIjY2xldnItcGxvdFwiKTtcbiAgICB2YXIgYm91bmRpbmdCb3ggPSBzY2F0dGVyUGxvdC5zZWxlY3QoXCJyZWN0XCIpO1xuICAgIHZhciBsZWdlbmQgPSBzdmcuc2VsZWN0KFwiI2NsZXZyLWxlZ2VuZFwiKTtcblxuICAgIC8vIFJldHJpZXZlIHNjYXR0ZXIgcGxvdCBib3VuZGluZyBib3ggY29vcmRpbmF0ZXNcbiAgICB2YXIgeE1pbiA9IHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ4XCIpKTtcbiAgICB2YXIgeE1heCA9IHhNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwid2lkdGhcIikpO1xuICAgIHZhciB5TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInlcIikpO1xuICAgIHZhciB5TWF4ID0geU1pbiArIHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJoZWlnaHRcIikpO1xuXG4gICAgdmFyIGNvbG9ycyA9IFtcbiAgICAgICAgXCIjRjQ0MzM2XCIsIFwiI0U5MUU2M1wiLCBcIiM5QzI3QjBcIiwgXCIjNjczQUI3XCIsIFwiIzNGNTFCNVwiLFxuICAgICAgICBcIiMyMTk2RjNcIiwgXCIjMDNBOUY0XCIsIFwiIzAwQkNENFwiLCBcIiMwMDk2ODhcIiwgXCIjNENBRjUwXCIsXG4gICAgICAgIFwiIzhCQzM0QVwiLCBcIiNDRERDMzlcIiwgXCIjRkZFQjNCXCIsIFwiI0ZGOTgwMFwiLCBcIiM3OTU1NDhcIixcbiAgICAgICAgXCIjOUU5RTlFXCIsXG4gICAgXTtcbiAgICB2YXIgcXVlc3Rpb25fdHlwZXMgPSBbXG4gICAgICAgIFwiRXhpc3RzXCIsIFwiTGVzcyB0aGFuXCIsIFwiR3JlYXRlciB0aGFuXCIsIFwiQ291bnRcIiwgXCJRdWVyeSBtYXRlcmlhbFwiLFxuICAgICAgICBcIlF1ZXJ5IHNpemVcIiwgXCJRdWVyeSBjb2xvclwiLCBcIlF1ZXJ5IHNoYXBlXCIsIFwiRXF1YWwgY29sb3JcIixcbiAgICAgICAgXCJFcXVhbCBpbnRlZ2VyXCIsIFwiRXF1YWwgc2hhcGVcIiwgXCJFcXVhbCBzaXplXCIsIFwiRXF1YWwgbWF0ZXJpYWxcIlxuICAgIF07XG4gICAgICAgIFxuICAgIC8vIFVnbHkgd29ya2Fyb3VuZCBmb3IgcGVybXV0ZWQgcXVlc3Rpb24gdHlwZXMgaW4gSlNPTiBmaWxlLlxuICAgIHZhciBxdWVzdGlvbl90eXBlX21hcHBpbmcgPSBbMSwgNSwgMTEsIDYsIDgsIDAsIDksIDcsIDEyLCAzLCAxMCwgMiwgNF07XG5cbiAgICB2YXIgZGF0YXNldDtcbiAgICB2YXIgeFNjYWxlO1xuICAgIHZhciB5U2NhbGU7XG4gICAgZDMuanNvbihcImRhdGEvY2xldnJfdHNuZS5qc29uXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgZGF0YXNldCA9IGRhdGEuc2xpY2UoMCwgMTAyNCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHNjYWxlc1xuICAgICAgICB4U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKFtkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQubGF5ZXJfYWxsLng7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgZDMubWF4KGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmxheWVyX2FsbC54OyB9KV0pXG4gICAgICAgICAgICAucmFuZ2VSb3VuZChbeE1pbiwgeE1heF0pO1xuICAgICAgICB5U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKFtkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQubGF5ZXJfYWxsLnk7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgZDMubWF4KGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmxheWVyX2FsbC55OyB9KV0pXG4gICAgICAgICAgICAucmFuZ2VSb3VuZChbeU1pbiwgeU1heF0pO1xuXG4gICAgICAgIHZhciB0b29sdGlwID0gZDMuc2VsZWN0KFwiYm9keVwiKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ0b29sdGlwLXRzbmUtY2xldmVyXCIpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG9vbHRpcCBmaWd1cmUtdGV4dFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiYmFja2dyb3VuZFwiLCBcIiNkZGRcIilcbiAgICAgICAgICAgIC5zdHlsZShcImJvcmRlci1yYWRpdXNcIiwgXCI2cHhcIilcbiAgICAgICAgICAgIC5zdHlsZShcInBhZGRpbmdcIiwgXCIxMHB4XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuXG4gICAgICAgIC8vIERpc3BhdGNoIGRhdGEgcG9pbnRzIGludG8gZ3JvdXBzIGJ5IHF1ZXN0aW9uIHR5cGVcbiAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0QWxsKFwiZ1wiKVxuICAgICAgICAgICAgLmRhdGEoY29sb3JzKVxuICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMS4wKVxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oYywgaSkge1xuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoZGF0YXNldC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gcXVlc3Rpb25fdHlwZV9tYXBwaW5nW2QucXVlc3Rpb25fdHlwZV0gPT0gaTsgfSkpXG4gICAgICAgICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHJzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY3hcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQubGF5ZXJfYWxsLngpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5sYXllcl9hbGwueSk7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogMy4wLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gY29sb3JzW2ldOyB9KVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNilcbiAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzVHlwZShxdWVzdGlvbl90eXBlX21hcHBpbmdbZC5xdWVzdGlvbl90eXBlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXAuaHRtbChkLnF1ZXN0aW9uICsgXCI/XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1c0FsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENyZWF0ZSBsZWdlbmRcbiAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmRhdGEocXVlc3Rpb25fdHlwZXMpXG4gICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgICAgIFwiY3hcIjogMCxcbiAgICAgICAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDIwICogaTsgfSxcbiAgICAgICAgICAgICAgICBcInJcIjogNixcbiAgICAgICAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxMCxcbiAgICAgICAgICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDAsXG4gICAgICAgICAgICAgICAgXCJzdHJva2VcIjogXCJyZWRcIixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGNvbG9yc1tpXTsgfSlcbiAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KVxuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgLmRhdGEocXVlc3Rpb25fdHlwZXMpXG4gICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAgICAgLmF0dHJzKHtcbiAgICAgICAgICAgICAgICBcInhcIjogMjAsXG4gICAgICAgICAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDIwICogaTsgfSxcbiAgICAgICAgICAgICAgICBcImR5XCI6IFwiMC40ZW1cIixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2xhc3NlZChcImZpZ3VyZS10ZXh0XCIsIHRydWUpXG4gICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcblxuICAgICAgICAvLyBGb2N1c2VzIG9uIGFsbCBwb2ludHMgYnkgcmVzZXR0aW5nIHRoZSBvcGFjaXRpZXNcbiAgICAgICAgdmFyIGZvY3VzQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxLjApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEZvY3VzZXMgb24gYSBzaW5nbGUgcXVlc3Rpb24gdHlwZSBieSBsb3dlcmluZyBvdGhlclxuICAgICAgICAvLyBxdWVzdGlvbiB0eXBlIG9wYWNpdGllc1xuICAgICAgICB2YXIgZm9jdXMgPSBmdW5jdGlvbihqKSB7XG4gICAgICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMC42IDogMC4xOyB9KTtcbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMC42IDogMC4xOyB9KTtcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdEFsbChcImdcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgPT0gaiA/ICAxLjAgOiAwLjE7IH0pXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGZvY3VzVHlwZSA9IGZ1bmN0aW9uKGopIHtcbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgPT0gaiA/ICAwLjYgOiAwLjE7IH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFkZCBob3ZlcmluZyBiZWhhdmlvciB0byBsZWdlbmRcbiAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICAgICAgZm9jdXMoaSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZm9jdXNBbGwpO1xuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICAgICAgZm9jdXMoaSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZm9jdXNBbGwpO1xuXG4gICAgICAgIGZvY3VzQWxsKCk7XG4gICAgfSk7XG4gICAgc3ZnUGFuWm9vbSA9IHJlcXVpcmUoJ3N2Zy1wYW4tem9vbScpO1xuICAgIHZhciBwYW5ab29tID0gc3ZnUGFuWm9vbSgnI2NsZXZyLXBsb3Qtc3ZnJywge1xuICAgICAgICAgIHZpZXdwb3J0U2VsZWN0b3I6ICcjdHNuZS1kaWFncmFtICNjbGV2ci1wbG90JyxcbiAgICAgICAgICB6b29tRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBmaXQ6IHRydWUsXG4gICAgICAgICAgY2VudGVyOiB0cnVlLFxuICAgICAgICAgIG1pblpvb206IDAuMSxcbiAgICAgICAgICBjb250cm9sSWNvbnNFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgfSkuem9vbUF0UG9pbnRCeSgwLjYsIHt4OiAtMTAsIHk6IDE4MH0pOyBcbiAgICAgICAgXG4gICAgc3ZnLnNlbGVjdChcIiNjbGV2ci16b29tXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZCl7XG5cdFx0cGFuWm9vbS5yZXNldFpvb20oKVxuXHRcdHBhblpvb20ucmVzZXRQYW4oKVxuXHRcdHBhblpvb20uem9vbUF0UG9pbnRCeSgwLjYsIHt4OiAtMTAsIHk6IDE4MH0pOyBcblx0fSk7XG4gICAgICAgXG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuICAgIC8vIEdldCByZWZlcmVuY2VzIHRvIGltcG9ydGFudCB0YWdzXG4gICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNzdHlsZS10cmFuc2Zlci1wbG90LXN2Z1wiKTtcbiAgICB2YXIgc2NhdHRlclBsb3QgPSBzdmcuc2VsZWN0KFwiI3N0eWxlLXRyYW5zZmVyLXBsb3RcIik7XG4gICAgdmFyIGJvdW5kaW5nQm94ID0gc2NhdHRlclBsb3Quc2VsZWN0KFwicmVjdFwiKTtcbiAgICB2YXIgbGVnZW5kID0gc3ZnLnNlbGVjdChcIiNzdHlsZS10cmFuc2Zlci1sZWdlbmRcIik7XG5cbiAgICAvLyBSZXRyaWV2ZSBzY2F0dGVyIHBsb3QgYm91bmRpbmcgYm94IGNvb3JkaW5hdGVzXG4gICAgdmFyIHhNaW4gPSBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwieFwiKSk7XG4gICAgdmFyIHhNYXggPSB4TWluICsgcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcIndpZHRoXCIpKTtcbiAgICB2YXIgeU1pbiA9IHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ5XCIpKTtcbiAgICB2YXIgeU1heCA9IHlNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwiaGVpZ2h0XCIpKTtcblxuICAgIHZhciBjb2xvcnMgPSBbXG4gICAgICAgIFwiI0Y0NDMzNlwiLCBcIiNFOTFFNjNcIiwgXCIjOUMyN0IwXCIsIFwiIzY3M0FCN1wiLCBcIiMzRjUxQjVcIixcbiAgICAgICAgXCIjMjE5NkYzXCIsIFwiIzAzQTlGNFwiLCBcIiMwMEJDRDRcIixcbiAgICBdO1xuXG4gICAgdmFyIGRhdGFzZXQ7XG4gICAgdmFyIHhTY2FsZTtcbiAgICB2YXIgeVNjYWxlO1xuICAgIGQzLmpzb24oXCJkYXRhL3N0eWxlX3RzbmUuanNvblwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGRhdGFzZXQgPSB7XCJhcnRpc3RzXCI6IGRhdGEuYXJ0aXN0cywgXCJwb2ludHNcIjogZGF0YS5wb2ludHMuc2xpY2UoMCwgNTEyKX07XG5cbiAgICAgICAgLy8gQ3JlYXRlIHNjYWxlc1xuICAgICAgICB4U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKFtkMy5taW4oZGF0YXNldC5wb2ludHMsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLng7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgZDMubWF4KGRhdGFzZXQucG9pbnRzLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC54OyB9KV0pXG4gICAgICAgICAgICAucmFuZ2VSb3VuZChbeE1pbiwgeE1heF0pO1xuICAgICAgICB5U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKFtkMy5taW4oZGF0YXNldC5wb2ludHMsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnk7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgZDMubWF4KGRhdGFzZXQucG9pbnRzLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC55OyB9KV0pXG4gICAgICAgICAgICAucmFuZ2VSb3VuZChbeU1pbiwgeU1heF0pO1xuXG4gICAgICAgIHZhciB0b29sdGlwID0gZDMuc2VsZWN0KFwiYm9keVwiKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ0b29sdGlwLXRzbmUtc3R5bGUtdHJhbnNmZXJcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b29sdGlwXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuXG4gICAgICAgIC8vIERpc3BhdGNoIGRhdGEgcG9pbnRzIGludG8gZ3JvdXBzIGJ5IHF1ZXN0aW9uIHR5cGVcbiAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0QWxsKFwiZ1wiKVxuICAgICAgICAgICAgLmRhdGEoY29sb3JzKVxuICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMS4wKVxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oYywgaSkge1xuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoZGF0YXNldC5wb2ludHMuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuYXJ0aXN0X2luZGV4ID09IGk7IH0pKVxuICAgICAgICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55KTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiAzLjAsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvcnNbaV07IH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KVxuICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNUeXBlKGQuYXJ0aXN0X2luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gXCJpbWFnZXMvc3R5bGVfaW1hZ2VzL1wiICsgZC5maWxlbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC5odG1sKFwiPGltZyBzcmM9XCIgKyB1cmwgKyBcIiBjbGFzcz0nbG9hZGluZycvPlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNBbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBDcmVhdGUgbGVnZW5kXG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5kYXRhKE9iamVjdC5rZXlzKGRhdGFzZXQuYXJ0aXN0cykpXG4gICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgICAgIFwiY3hcIjogMCxcbiAgICAgICAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDIwICogaTsgfSxcbiAgICAgICAgICAgICAgICBcInJcIjogNixcbiAgICAgICAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxMCxcbiAgICAgICAgICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDAsXG4gICAgICAgICAgICAgICAgXCJzdHJva2VcIjogXCJyZWRcIixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGNvbG9yc1tkXTsgfSlcbiAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KVxuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgLmRhdGEoT2JqZWN0LmtleXMoZGF0YXNldC5hcnRpc3RzKSlcbiAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgICAgIFwieFwiOiAyMCxcbiAgICAgICAgICAgICAgICBcInlcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjAgKiBpOyB9LFxuICAgICAgICAgICAgICAgIFwiZHlcIjogXCIwLjRlbVwiLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jbGFzc2VkKFwiZmlndXJlLXRleHRcIiwgdHJ1ZSlcbiAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGFzZXQuYXJ0aXN0c1tkXTsgfSk7XG5cbiAgICAgICAgLy8gRm9jdXNlcyBvbiBhbGwgcG9pbnRzIGJ5IHJlc2V0dGluZyB0aGUgb3BhY2l0aWVzXG4gICAgICAgIHZhciBmb2N1c0FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KTtcbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0QWxsKFwiZ1wiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMS4wKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBGb2N1c2VzIG9uIGEgc2luZ2xlIHF1ZXN0aW9uIHR5cGUgYnkgbG93ZXJpbmcgb3RoZXJcbiAgICAgICAgLy8gcXVlc3Rpb24gdHlwZSBvcGFjaXRpZXNcbiAgICAgICAgdmFyIGZvY3VzID0gZnVuY3Rpb24oaikge1xuICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaSA9PSBqID8gIDAuNiA6IDAuMTsgfSk7XG4gICAgICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaSA9PSBqID8gIDAuNiA6IDAuMTsgfSk7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMS4wIDogMC4xOyB9KVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBmb2N1c1R5cGUgPSBmdW5jdGlvbihqKSB7XG4gICAgICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMC42IDogMC4xOyB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBZGQgaG92ZXJpbmcgYmVoYXZpb3IgdG8gbGVnZW5kXG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgICAgIGZvY3VzKGkpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZvY3VzQWxsKTtcbiAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgICAgIGZvY3VzKGkpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZvY3VzQWxsKTtcblxuICAgICAgICBmb2N1c0FsbCgpO1xuICAgIH0pO1xuICAgIFxuICAgc3ZnUGFuWm9vbSA9IHJlcXVpcmUoJ3N2Zy1wYW4tem9vbScpO1xuICAgdmFyIHBhblpvb20gPSBzdmdQYW5ab29tKCcjc3R5bGUtdHJhbnNmZXItcGxvdC1zdmcnLCB7XG5cdCAgdmlld3BvcnRTZWxlY3RvcjogJyN0c25lLWRpYWdyYW0gI3N0eWxlLXRyYW5zZmVyLXBsb3QnLFxuXHQgIHpvb21FbmFibGVkOiB0cnVlLFxuXHQgIGZpdDogdHJ1ZSxcblx0ICBjZW50ZXI6IHRydWUsXG5cdCAgbWluWm9vbTogMC4xLCBcblx0ICBjb250cm9sSWNvbnNFbmFibGVkOiBmYWxzZSxcblx0fSk7XG5cdHBhblpvb20uem9vbUF0UG9pbnRCeSgwLjYsIHt4OiAtMTAsIHk6IDE4MH0pOyBcblx0XG5cdGQzLnNlbGVjdChcIiNzdHlsZS16b29tXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZCl7XG5cdFx0cGFuWm9vbS5yZXNldFpvb20oKVxuXHRcdHBhblpvb20ucmVzZXRQYW4oKVxuXHRcdHBhblpvb20uem9vbUF0UG9pbnRCeSgwLjYsIHt4OiAtMTAsIHk6IDE4MH0pOyBcblx0fSk7XG59KSgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwidmFyIFdoZWVsID0gcmVxdWlyZSgnLi91bml3aGVlbCcpXG4sIENvbnRyb2xJY29ucyA9IHJlcXVpcmUoJy4vY29udHJvbC1pY29ucycpXG4sIFV0aWxzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKVxuLCBTdmdVdGlscyA9IHJlcXVpcmUoJy4vc3ZnLXV0aWxpdGllcycpXG4sIFNoYWRvd1ZpZXdwb3J0ID0gcmVxdWlyZSgnLi9zaGFkb3ctdmlld3BvcnQnKVxuXG52YXIgU3ZnUGFuWm9vbSA9IGZ1bmN0aW9uKHN2Zywgb3B0aW9ucykge1xuICB0aGlzLmluaXQoc3ZnLCBvcHRpb25zKVxufVxuXG52YXIgb3B0aW9uc0RlZmF1bHRzID0ge1xuICB2aWV3cG9ydFNlbGVjdG9yOiAnLnN2Zy1wYW4tem9vbV92aWV3cG9ydCcgLy8gVmlld3BvcnQgc2VsZWN0b3IuIENhbiBiZSBxdWVyeVNlbGVjdG9yIHN0cmluZyBvciBTVkdFbGVtZW50XG4sIHBhbkVuYWJsZWQ6IHRydWUgLy8gZW5hYmxlIG9yIGRpc2FibGUgcGFubmluZyAoZGVmYXVsdCBlbmFibGVkKVxuLCBjb250cm9sSWNvbnNFbmFibGVkOiBmYWxzZSAvLyBpbnNlcnQgaWNvbnMgdG8gZ2l2ZSB1c2VyIGFuIG9wdGlvbiBpbiBhZGRpdGlvbiB0byBtb3VzZSBldmVudHMgdG8gY29udHJvbCBwYW4vem9vbSAoZGVmYXVsdCBkaXNhYmxlZClcbiwgem9vbUVuYWJsZWQ6IHRydWUgLy8gZW5hYmxlIG9yIGRpc2FibGUgem9vbWluZyAoZGVmYXVsdCBlbmFibGVkKVxuLCBkYmxDbGlja1pvb21FbmFibGVkOiB0cnVlIC8vIGVuYWJsZSBvciBkaXNhYmxlIHpvb21pbmcgYnkgZG91YmxlIGNsaWNraW5nIChkZWZhdWx0IGVuYWJsZWQpXG4sIG1vdXNlV2hlZWxab29tRW5hYmxlZDogdHJ1ZSAvLyBlbmFibGUgb3IgZGlzYWJsZSB6b29taW5nIGJ5IG1vdXNlIHdoZWVsIChkZWZhdWx0IGVuYWJsZWQpXG4sIHByZXZlbnRNb3VzZUV2ZW50c0RlZmF1bHQ6IHRydWUgLy8gZW5hYmxlIG9yIGRpc2FibGUgcHJldmVudERlZmF1bHQgZm9yIG1vdXNlIGV2ZW50c1xuLCB6b29tU2NhbGVTZW5zaXRpdml0eTogMC4xIC8vIFpvb20gc2Vuc2l0aXZpdHlcbiwgbWluWm9vbTogMC41IC8vIE1pbmltdW0gWm9vbSBsZXZlbFxuLCBtYXhab29tOiAxMCAvLyBNYXhpbXVtIFpvb20gbGV2ZWxcbiwgZml0OiB0cnVlIC8vIGVuYWJsZSBvciBkaXNhYmxlIHZpZXdwb3J0IGZpdCBpbiBTVkcgKGRlZmF1bHQgdHJ1ZSlcbiwgY29udGFpbjogZmFsc2UgLy8gZW5hYmxlIG9yIGRpc2FibGUgdmlld3BvcnQgY29udGFpbiB0aGUgc3ZnIChkZWZhdWx0IGZhbHNlKVxuLCBjZW50ZXI6IHRydWUgLy8gZW5hYmxlIG9yIGRpc2FibGUgdmlld3BvcnQgY2VudGVyaW5nIGluIFNWRyAoZGVmYXVsdCB0cnVlKVxuLCByZWZyZXNoUmF0ZTogJ2F1dG8nIC8vIE1heGltdW0gbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kIChhbHRlcmluZyBTVkcncyB2aWV3cG9ydClcbiwgYmVmb3JlWm9vbTogbnVsbFxuLCBvblpvb206IG51bGxcbiwgYmVmb3JlUGFuOiBudWxsXG4sIG9uUGFuOiBudWxsXG4sIGN1c3RvbUV2ZW50c0hhbmRsZXI6IG51bGxcbiwgZXZlbnRzTGlzdGVuZXJFbGVtZW50OiBudWxsXG4sIG9uVXBkYXRlZENUTTogbnVsbFxufVxuXG5TdmdQYW5ab29tLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oc3ZnLCBvcHRpb25zKSB7XG4gIHZhciB0aGF0ID0gdGhpc1xuXG4gIHRoaXMuc3ZnID0gc3ZnXG4gIHRoaXMuZGVmcyA9IHN2Zy5xdWVyeVNlbGVjdG9yKCdkZWZzJylcblxuICAvLyBBZGQgZGVmYXVsdCBhdHRyaWJ1dGVzIHRvIFNWR1xuICBTdmdVdGlscy5zZXR1cFN2Z0F0dHJpYnV0ZXModGhpcy5zdmcpXG5cbiAgLy8gU2V0IG9wdGlvbnNcbiAgdGhpcy5vcHRpb25zID0gVXRpbHMuZXh0ZW5kKFV0aWxzLmV4dGVuZCh7fSwgb3B0aW9uc0RlZmF1bHRzKSwgb3B0aW9ucylcblxuICAvLyBTZXQgZGVmYXVsdCBzdGF0ZVxuICB0aGlzLnN0YXRlID0gJ25vbmUnXG5cbiAgLy8gR2V0IGRpbWVuc2lvbnNcbiAgdmFyIGJvdW5kaW5nQ2xpZW50UmVjdE5vcm1hbGl6ZWQgPSBTdmdVdGlscy5nZXRCb3VuZGluZ0NsaWVudFJlY3ROb3JtYWxpemVkKHN2ZylcbiAgdGhpcy53aWR0aCA9IGJvdW5kaW5nQ2xpZW50UmVjdE5vcm1hbGl6ZWQud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBib3VuZGluZ0NsaWVudFJlY3ROb3JtYWxpemVkLmhlaWdodFxuXG4gIC8vIEluaXQgc2hhZG93IHZpZXdwb3J0XG4gIHRoaXMudmlld3BvcnQgPSBTaGFkb3dWaWV3cG9ydChTdmdVdGlscy5nZXRPckNyZWF0ZVZpZXdwb3J0KHRoaXMuc3ZnLCB0aGlzLm9wdGlvbnMudmlld3BvcnRTZWxlY3RvciksIHtcbiAgICBzdmc6IHRoaXMuc3ZnXG4gICwgd2lkdGg6IHRoaXMud2lkdGhcbiAgLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0XG4gICwgZml0OiB0aGlzLm9wdGlvbnMuZml0XG4gICwgY29udGFpbjogdGhpcy5vcHRpb25zLmNvbnRhaW5cbiAgLCBjZW50ZXI6IHRoaXMub3B0aW9ucy5jZW50ZXJcbiAgLCByZWZyZXNoUmF0ZTogdGhpcy5vcHRpb25zLnJlZnJlc2hSYXRlXG4gIC8vIFB1dCBjYWxsYmFja3MgaW50byBmdW5jdGlvbnMgYXMgdGhleSBjYW4gY2hhbmdlIHRocm91Z2ggdGltZVxuICAsIGJlZm9yZVpvb206IGZ1bmN0aW9uKG9sZFNjYWxlLCBuZXdTY2FsZSkge1xuICAgICAgaWYgKHRoYXQudmlld3BvcnQgJiYgdGhhdC5vcHRpb25zLmJlZm9yZVpvb20pIHtyZXR1cm4gdGhhdC5vcHRpb25zLmJlZm9yZVpvb20ob2xkU2NhbGUsIG5ld1NjYWxlKX1cbiAgICB9XG4gICwgb25ab29tOiBmdW5jdGlvbihzY2FsZSkge1xuICAgICAgaWYgKHRoYXQudmlld3BvcnQgJiYgdGhhdC5vcHRpb25zLm9uWm9vbSkge3JldHVybiB0aGF0Lm9wdGlvbnMub25ab29tKHNjYWxlKX1cbiAgICB9XG4gICwgYmVmb3JlUGFuOiBmdW5jdGlvbihvbGRQb2ludCwgbmV3UG9pbnQpIHtcbiAgICAgIGlmICh0aGF0LnZpZXdwb3J0ICYmIHRoYXQub3B0aW9ucy5iZWZvcmVQYW4pIHtyZXR1cm4gdGhhdC5vcHRpb25zLmJlZm9yZVBhbihvbGRQb2ludCwgbmV3UG9pbnQpfVxuICAgIH1cbiAgLCBvblBhbjogZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgIGlmICh0aGF0LnZpZXdwb3J0ICYmIHRoYXQub3B0aW9ucy5vblBhbikge3JldHVybiB0aGF0Lm9wdGlvbnMub25QYW4ocG9pbnQpfVxuICAgIH1cbiAgLCBvblVwZGF0ZWRDVE06IGZ1bmN0aW9uKGN0bSkge1xuICAgICAgaWYgKHRoYXQudmlld3BvcnQgJiYgdGhhdC5vcHRpb25zLm9uVXBkYXRlZENUTSkge3JldHVybiB0aGF0Lm9wdGlvbnMub25VcGRhdGVkQ1RNKGN0bSl9XG4gICAgfVxuICB9KVxuXG4gIC8vIFdyYXAgY2FsbGJhY2tzIGludG8gcHVibGljIEFQSSBjb250ZXh0XG4gIHZhciBwdWJsaWNJbnN0YW5jZSA9IHRoaXMuZ2V0UHVibGljSW5zdGFuY2UoKVxuICBwdWJsaWNJbnN0YW5jZS5zZXRCZWZvcmVab29tKHRoaXMub3B0aW9ucy5iZWZvcmVab29tKVxuICBwdWJsaWNJbnN0YW5jZS5zZXRPblpvb20odGhpcy5vcHRpb25zLm9uWm9vbSlcbiAgcHVibGljSW5zdGFuY2Uuc2V0QmVmb3JlUGFuKHRoaXMub3B0aW9ucy5iZWZvcmVQYW4pXG4gIHB1YmxpY0luc3RhbmNlLnNldE9uUGFuKHRoaXMub3B0aW9ucy5vblBhbilcbiAgcHVibGljSW5zdGFuY2Uuc2V0T25VcGRhdGVkQ1RNKHRoaXMub3B0aW9ucy5vblVwZGF0ZWRDVE0pXG5cbiAgaWYgKHRoaXMub3B0aW9ucy5jb250cm9sSWNvbnNFbmFibGVkKSB7XG4gICAgQ29udHJvbEljb25zLmVuYWJsZSh0aGlzKVxuICB9XG5cbiAgLy8gSW5pdCBldmVudHMgaGFuZGxlcnNcbiAgdGhpcy5sYXN0TW91c2VXaGVlbEV2ZW50VGltZSA9IERhdGUubm93KClcbiAgdGhpcy5zZXR1cEhhbmRsZXJzKClcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBldmVudCBoYW5kbGVyc1xuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5zZXR1cEhhbmRsZXJzID0gZnVuY3Rpb24oKSB7XG4gIHZhciB0aGF0ID0gdGhpc1xuICAgICwgcHJldkV2dCA9IG51bGwgLy8gdXNlIGZvciB0b3VjaHN0YXJ0IGV2ZW50IHRvIGRldGVjdCBkb3VibGUgdGFwXG4gICAgO1xuXG4gIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSB7XG4gICAgLy8gTW91c2UgZG93biBncm91cFxuICAgIG1vdXNlZG93bjogZnVuY3Rpb24oZXZ0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdGhhdC5oYW5kbGVNb3VzZURvd24oZXZ0LCBwcmV2RXZ0KTtcbiAgICAgIHByZXZFdnQgPSBldnRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAsIHRvdWNoc3RhcnQ6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRoYXQuaGFuZGxlTW91c2VEb3duKGV2dCwgcHJldkV2dCk7XG4gICAgICBwcmV2RXZ0ID0gZXZ0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIE1vdXNlIHVwIGdyb3VwXG4gICwgbW91c2V1cDogZnVuY3Rpb24oZXZ0KSB7XG4gICAgICByZXR1cm4gdGhhdC5oYW5kbGVNb3VzZVVwKGV2dCk7XG4gICAgfVxuICAsIHRvdWNoZW5kOiBmdW5jdGlvbihldnQpIHtcbiAgICAgIHJldHVybiB0aGF0LmhhbmRsZU1vdXNlVXAoZXZ0KTtcbiAgICB9XG5cbiAgICAvLyBNb3VzZSBtb3ZlIGdyb3VwXG4gICwgbW91c2Vtb3ZlOiBmdW5jdGlvbihldnQpIHtcbiAgICAgIHJldHVybiB0aGF0LmhhbmRsZU1vdXNlTW92ZShldnQpO1xuICAgIH1cbiAgLCB0b3VjaG1vdmU6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgcmV0dXJuIHRoYXQuaGFuZGxlTW91c2VNb3ZlKGV2dCk7XG4gICAgfVxuXG4gICAgLy8gTW91c2UgbGVhdmUgZ3JvdXBcbiAgLCBtb3VzZWxlYXZlOiBmdW5jdGlvbihldnQpIHtcbiAgICAgIHJldHVybiB0aGF0LmhhbmRsZU1vdXNlVXAoZXZ0KTtcbiAgICB9XG4gICwgdG91Y2hsZWF2ZTogZnVuY3Rpb24oZXZ0KSB7XG4gICAgICByZXR1cm4gdGhhdC5oYW5kbGVNb3VzZVVwKGV2dCk7XG4gICAgfVxuICAsIHRvdWNoY2FuY2VsOiBmdW5jdGlvbihldnQpIHtcbiAgICAgIHJldHVybiB0aGF0LmhhbmRsZU1vdXNlVXAoZXZ0KTtcbiAgICB9XG4gIH1cblxuICAvLyBJbml0IGN1c3RvbSBldmVudHMgaGFuZGxlciBpZiBhdmFpbGFibGVcbiAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21FdmVudHNIYW5kbGVyICE9IG51bGwpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgdGhpcy5vcHRpb25zLmN1c3RvbUV2ZW50c0hhbmRsZXIuaW5pdCh7XG4gICAgICBzdmdFbGVtZW50OiB0aGlzLnN2Z1xuICAgICwgZXZlbnRzTGlzdGVuZXJFbGVtZW50OiB0aGlzLm9wdGlvbnMuZXZlbnRzTGlzdGVuZXJFbGVtZW50XG4gICAgLCBpbnN0YW5jZTogdGhpcy5nZXRQdWJsaWNJbnN0YW5jZSgpXG4gICAgfSlcblxuICAgIC8vIEN1c3RvbSBldmVudCBoYW5kbGVyIG1heSBoYWx0IGJ1aWx0aW4gbGlzdGVuZXJzXG4gICAgdmFyIGhhbHRFdmVudExpc3RlbmVycyA9IHRoaXMub3B0aW9ucy5jdXN0b21FdmVudHNIYW5kbGVyLmhhbHRFdmVudExpc3RlbmVyc1xuICAgIGlmIChoYWx0RXZlbnRMaXN0ZW5lcnMgJiYgaGFsdEV2ZW50TGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IGhhbHRFdmVudExpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAodGhpcy5ldmVudExpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShoYWx0RXZlbnRMaXN0ZW5lcnNbaV0pKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lcnNbaGFsdEV2ZW50TGlzdGVuZXJzW2ldXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQmluZCBldmVudExpc3RlbmVyc1xuICBmb3IgKHZhciBldmVudCBpbiB0aGlzLmV2ZW50TGlzdGVuZXJzKSB7XG4gICAgLy8gQXR0YWNoIGV2ZW50IHRvIGV2ZW50c0xpc3RlbmVyRWxlbWVudCBvciBTVkcgaWYgbm90IGF2YWlsYWJsZVxuICAgICh0aGlzLm9wdGlvbnMuZXZlbnRzTGlzdGVuZXJFbGVtZW50IHx8IHRoaXMuc3ZnKVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuZXZlbnRMaXN0ZW5lcnNbZXZlbnRdLCBmYWxzZSlcbiAgfVxuXG4gIC8vIFpvb20gdXNpbmcgbW91c2Ugd2hlZWxcbiAgaWYgKHRoaXMub3B0aW9ucy5tb3VzZVdoZWVsWm9vbUVuYWJsZWQpIHtcbiAgICB0aGlzLm9wdGlvbnMubW91c2VXaGVlbFpvb21FbmFibGVkID0gZmFsc2UgLy8gc2V0IHRvIGZhbHNlIGFzIGVuYWJsZSB3aWxsIHNldCBpdCBiYWNrIHRvIHRydWVcbiAgICB0aGlzLmVuYWJsZU1vdXNlV2hlZWxab29tKClcbiAgfVxufVxuXG4vKipcbiAqIEVuYWJsZSBhYmlsaXR5IHRvIHpvb20gdXNpbmcgbW91c2Ugd2hlZWxcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuZW5hYmxlTW91c2VXaGVlbFpvb20gPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLm9wdGlvbnMubW91c2VXaGVlbFpvb21FbmFibGVkKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgICAvLyBNb3VzZSB3aGVlbCBsaXN0ZW5lclxuICAgIHRoaXMud2hlZWxMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgcmV0dXJuIHRoYXQuaGFuZGxlTW91c2VXaGVlbChldnQpO1xuICAgIH1cblxuICAgIC8vIEJpbmQgd2hlZWxMaXN0ZW5lclxuICAgIFdoZWVsLm9uKHRoaXMub3B0aW9ucy5ldmVudHNMaXN0ZW5lckVsZW1lbnQgfHwgdGhpcy5zdmcsIHRoaXMud2hlZWxMaXN0ZW5lciwgZmFsc2UpXG5cbiAgICB0aGlzLm9wdGlvbnMubW91c2VXaGVlbFpvb21FbmFibGVkID0gdHJ1ZVxuICB9XG59XG5cbi8qKlxuICogRGlzYWJsZSBhYmlsaXR5IHRvIHpvb20gdXNpbmcgbW91c2Ugd2hlZWxcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuZGlzYWJsZU1vdXNlV2hlZWxab29tID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLm9wdGlvbnMubW91c2VXaGVlbFpvb21FbmFibGVkKSB7XG4gICAgV2hlZWwub2ZmKHRoaXMub3B0aW9ucy5ldmVudHNMaXN0ZW5lckVsZW1lbnQgfHwgdGhpcy5zdmcsIHRoaXMud2hlZWxMaXN0ZW5lciwgZmFsc2UpXG4gICAgdGhpcy5vcHRpb25zLm1vdXNlV2hlZWxab29tRW5hYmxlZCA9IGZhbHNlXG4gIH1cbn1cblxuLyoqXG4gKiBIYW5kbGUgbW91c2Ugd2hlZWwgZXZlbnRcbiAqXG4gKiBAcGFyYW0gIHtFdmVudH0gZXZ0XG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmhhbmRsZU1vdXNlV2hlZWwgPSBmdW5jdGlvbihldnQpIHtcbiAgaWYgKCF0aGlzLm9wdGlvbnMuem9vbUVuYWJsZWQgfHwgdGhpcy5zdGF0ZSAhPT0gJ25vbmUnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHRoaXMub3B0aW9ucy5wcmV2ZW50TW91c2VFdmVudHNEZWZhdWx0KXtcbiAgICBpZiAoZXZ0LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZ0LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gRGVmYXVsdCBkZWx0YSBpbiBjYXNlIHRoYXQgZGVsdGFZIGlzIG5vdCBhdmFpbGFibGVcbiAgdmFyIGRlbHRhID0gZXZ0LmRlbHRhWSB8fCAxXG4gICAgLCB0aW1lRGVsdGEgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0TW91c2VXaGVlbEV2ZW50VGltZVxuICAgICwgZGl2aWRlciA9IDMgKyBNYXRoLm1heCgwLCAzMCAtIHRpbWVEZWx0YSlcblxuICAvLyBVcGRhdGUgY2FjaGVcbiAgdGhpcy5sYXN0TW91c2VXaGVlbEV2ZW50VGltZSA9IERhdGUubm93KClcblxuICAvLyBNYWtlIGVtcGlyaWNhbCBhZGp1c3RtZW50cyBmb3IgYnJvd3NlcnMgdGhhdCBnaXZlIGRlbHRhWSBpbiBwaXhlbHMgKGRlbHRhTW9kZT0wKVxuICBpZiAoJ2RlbHRhTW9kZScgaW4gZXZ0ICYmIGV2dC5kZWx0YU1vZGUgPT09IDAgJiYgZXZ0LndoZWVsRGVsdGEpIHtcbiAgICBkZWx0YSA9IGV2dC5kZWx0YVkgPT09IDAgPyAwIDogIE1hdGguYWJzKGV2dC53aGVlbERlbHRhKSAvIGV2dC5kZWx0YVlcbiAgfVxuXG4gIGRlbHRhID0gLTAuMyA8IGRlbHRhICYmIGRlbHRhIDwgMC4zID8gZGVsdGEgOiAoZGVsdGEgPiAwID8gMSA6IC0xKSAqIE1hdGgubG9nKE1hdGguYWJzKGRlbHRhKSArIDEwKSAvIGRpdmlkZXJcblxuICB2YXIgaW52ZXJzZWRTY3JlZW5DVE0gPSB0aGlzLnN2Zy5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKClcbiAgICAsIHJlbGF0aXZlTW91c2VQb2ludCA9IFN2Z1V0aWxzLmdldEV2ZW50UG9pbnQoZXZ0LCB0aGlzLnN2ZykubWF0cml4VHJhbnNmb3JtKGludmVyc2VkU2NyZWVuQ1RNKVxuICAgICwgem9vbSA9IE1hdGgucG93KDEgKyB0aGlzLm9wdGlvbnMuem9vbVNjYWxlU2Vuc2l0aXZpdHksICgtMSkgKiBkZWx0YSk7IC8vIG11bHRpcGx5aW5nIGJ5IG5lZy4gMSBzbyBhcyB0byBtYWtlIHpvb20gaW4vb3V0IGJlaGF2aW9yIG1hdGNoIEdvb2dsZSBtYXBzIGJlaGF2aW9yXG5cbiAgdGhpcy56b29tQXRQb2ludCh6b29tLCByZWxhdGl2ZU1vdXNlUG9pbnQpXG59XG5cbi8qKlxuICogWm9vbSBpbiBhdCBhIFNWRyBwb2ludFxuICpcbiAqIEBwYXJhbSAge1NWR1BvaW50fSBwb2ludFxuICogQHBhcmFtICB7RmxvYXR9IHpvb21TY2FsZSAgICBOdW1iZXIgcmVwcmVzZW50aW5nIGhvdyBtdWNoIHRvIHpvb21cbiAqIEBwYXJhbSAge0Jvb2xlYW59IHpvb21BYnNvbHV0ZSBEZWZhdWx0IGZhbHNlLiBJZiB0cnVlLCB6b29tU2NhbGUgaXMgdHJlYXRlZCBhcyBhbiBhYnNvbHV0ZSB2YWx1ZS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdGhlcndpc2UsIHpvb21TY2FsZSBpcyB0cmVhdGVkIGFzIGEgbXVsdGlwbGllZCAoZS5nLiAxLjEwIHdvdWxkIHpvb20gaW4gMTAlKVxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS56b29tQXRQb2ludCA9IGZ1bmN0aW9uKHpvb21TY2FsZSwgcG9pbnQsIHpvb21BYnNvbHV0ZSkge1xuICB2YXIgb3JpZ2luYWxTdGF0ZSA9IHRoaXMudmlld3BvcnQuZ2V0T3JpZ2luYWxTdGF0ZSgpXG5cbiAgaWYgKCF6b29tQWJzb2x1dGUpIHtcbiAgICAvLyBGaXQgem9vbVNjYWxlIGluIHNldCBib3VuZHNcbiAgICBpZiAodGhpcy5nZXRab29tKCkgKiB6b29tU2NhbGUgPCB0aGlzLm9wdGlvbnMubWluWm9vbSAqIG9yaWdpbmFsU3RhdGUuem9vbSkge1xuICAgICAgem9vbVNjYWxlID0gKHRoaXMub3B0aW9ucy5taW5ab29tICogb3JpZ2luYWxTdGF0ZS56b29tKSAvIHRoaXMuZ2V0Wm9vbSgpXG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFpvb20oKSAqIHpvb21TY2FsZSA+IHRoaXMub3B0aW9ucy5tYXhab29tICogb3JpZ2luYWxTdGF0ZS56b29tKSB7XG4gICAgICB6b29tU2NhbGUgPSAodGhpcy5vcHRpb25zLm1heFpvb20gKiBvcmlnaW5hbFN0YXRlLnpvb20pIC8gdGhpcy5nZXRab29tKClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gRml0IHpvb21TY2FsZSBpbiBzZXQgYm91bmRzXG4gICAgem9vbVNjYWxlID0gTWF0aC5tYXgodGhpcy5vcHRpb25zLm1pblpvb20gKiBvcmlnaW5hbFN0YXRlLnpvb20sIE1hdGgubWluKHRoaXMub3B0aW9ucy5tYXhab29tICogb3JpZ2luYWxTdGF0ZS56b29tLCB6b29tU2NhbGUpKVxuICAgIC8vIEZpbmQgcmVsYXRpdmUgc2NhbGUgdG8gYWNoaWV2ZSBkZXNpcmVkIHNjYWxlXG4gICAgem9vbVNjYWxlID0gem9vbVNjYWxlL3RoaXMuZ2V0Wm9vbSgpXG4gIH1cblxuICB2YXIgb2xkQ1RNID0gdGhpcy52aWV3cG9ydC5nZXRDVE0oKVxuICAgICwgcmVsYXRpdmVQb2ludCA9IHBvaW50Lm1hdHJpeFRyYW5zZm9ybShvbGRDVE0uaW52ZXJzZSgpKVxuICAgICwgbW9kaWZpZXIgPSB0aGlzLnN2Zy5jcmVhdGVTVkdNYXRyaXgoKS50cmFuc2xhdGUocmVsYXRpdmVQb2ludC54LCByZWxhdGl2ZVBvaW50LnkpLnNjYWxlKHpvb21TY2FsZSkudHJhbnNsYXRlKC1yZWxhdGl2ZVBvaW50LngsIC1yZWxhdGl2ZVBvaW50LnkpXG4gICAgLCBuZXdDVE0gPSBvbGRDVE0ubXVsdGlwbHkobW9kaWZpZXIpXG5cbiAgaWYgKG5ld0NUTS5hICE9PSBvbGRDVE0uYSkge1xuICAgIHRoaXMudmlld3BvcnQuc2V0Q1RNKG5ld0NUTSlcbiAgfVxufVxuXG4vKipcbiAqIFpvb20gYXQgY2VudGVyIHBvaW50XG4gKlxuICogQHBhcmFtICB7RmxvYXR9IHNjYWxlXG4gKiBAcGFyYW0gIHtCb29sZWFufSBhYnNvbHV0ZSBNYXJrcyB6b29tIHNjYWxlIGFzIHJlbGF0aXZlIG9yIGFic29sdXRlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnpvb20gPSBmdW5jdGlvbihzY2FsZSwgYWJzb2x1dGUpIHtcbiAgdGhpcy56b29tQXRQb2ludChzY2FsZSwgU3ZnVXRpbHMuZ2V0U3ZnQ2VudGVyUG9pbnQodGhpcy5zdmcsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KSwgYWJzb2x1dGUpXG59XG5cbi8qKlxuICogWm9vbSB1c2VkIGJ5IHB1YmxpYyBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSAge0Zsb2F0fSBzY2FsZVxuICogQHBhcmFtICB7Qm9vbGVhbn0gYWJzb2x1dGUgTWFya3Mgem9vbSBzY2FsZSBhcyByZWxhdGl2ZSBvciBhYnNvbHV0ZVxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5wdWJsaWNab29tID0gZnVuY3Rpb24oc2NhbGUsIGFic29sdXRlKSB7XG4gIGlmIChhYnNvbHV0ZSkge1xuICAgIHNjYWxlID0gdGhpcy5jb21wdXRlRnJvbVJlbGF0aXZlWm9vbShzY2FsZSlcbiAgfVxuXG4gIHRoaXMuem9vbShzY2FsZSwgYWJzb2x1dGUpXG59XG5cbi8qKlxuICogWm9vbSBhdCBwb2ludCB1c2VkIGJ5IHB1YmxpYyBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSAge0Zsb2F0fSBzY2FsZVxuICogQHBhcmFtICB7U1ZHUG9pbnR8T2JqZWN0fSBwb2ludCAgICBBbiBvYmplY3QgdGhhdCBoYXMgeCBhbmQgeSBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gIHtCb29sZWFufSBhYnNvbHV0ZSBNYXJrcyB6b29tIHNjYWxlIGFzIHJlbGF0aXZlIG9yIGFic29sdXRlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnB1YmxpY1pvb21BdFBvaW50ID0gZnVuY3Rpb24oc2NhbGUsIHBvaW50LCBhYnNvbHV0ZSkge1xuICBpZiAoYWJzb2x1dGUpIHtcbiAgICAvLyBUcmFuc2Zvcm0gem9vbSBpbnRvIGEgcmVsYXRpdmUgdmFsdWVcbiAgICBzY2FsZSA9IHRoaXMuY29tcHV0ZUZyb21SZWxhdGl2ZVpvb20oc2NhbGUpXG4gIH1cblxuICAvLyBJZiBub3QgYSBTVkdQb2ludCBidXQgaGFzIHggYW5kIHkgdGhlbiBjcmVhdGUgYSBTVkdQb2ludFxuICBpZiAoVXRpbHMuZ2V0VHlwZShwb2ludCkgIT09ICdTVkdQb2ludCcpIHtcbiAgICBpZigneCcgaW4gcG9pbnQgJiYgJ3knIGluIHBvaW50KSB7XG4gICAgICBwb2ludCA9IFN2Z1V0aWxzLmNyZWF0ZVNWR1BvaW50KHRoaXMuc3ZnLCBwb2ludC54LCBwb2ludC55KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdmVuIHBvaW50IGlzIGludmFsaWQnKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuem9vbUF0UG9pbnQoc2NhbGUsIHBvaW50LCBhYnNvbHV0ZSlcbn1cblxuLyoqXG4gKiBHZXQgem9vbSBzY2FsZVxuICpcbiAqIEByZXR1cm4ge0Zsb2F0fSB6b29tIHNjYWxlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmdldFpvb20gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudmlld3BvcnQuZ2V0Wm9vbSgpXG59XG5cbi8qKlxuICogR2V0IHpvb20gc2NhbGUgZm9yIHB1YmxpYyB1c2FnZVxuICpcbiAqIEByZXR1cm4ge0Zsb2F0fSB6b29tIHNjYWxlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmdldFJlbGF0aXZlWm9vbSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy52aWV3cG9ydC5nZXRSZWxhdGl2ZVpvb20oKVxufVxuXG4vKipcbiAqIENvbXB1dGUgYWN0dWFsIHpvb20gZnJvbSBwdWJsaWMgem9vbVxuICpcbiAqIEBwYXJhbSAge0Zsb2F0fSB6b29tXG4gKiBAcmV0dXJuIHtGbG9hdH0gem9vbSBzY2FsZVxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5jb21wdXRlRnJvbVJlbGF0aXZlWm9vbSA9IGZ1bmN0aW9uKHpvb20pIHtcbiAgcmV0dXJuIHpvb20gKiB0aGlzLnZpZXdwb3J0LmdldE9yaWdpbmFsU3RhdGUoKS56b29tXG59XG5cbi8qKlxuICogU2V0IHpvb20gdG8gaW5pdGlhbCBzdGF0ZVxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5yZXNldFpvb20gPSBmdW5jdGlvbigpIHtcbiAgdmFyIG9yaWdpbmFsU3RhdGUgPSB0aGlzLnZpZXdwb3J0LmdldE9yaWdpbmFsU3RhdGUoKVxuXG4gIHRoaXMuem9vbShvcmlnaW5hbFN0YXRlLnpvb20sIHRydWUpO1xufVxuXG4vKipcbiAqIFNldCBwYW4gdG8gaW5pdGlhbCBzdGF0ZVxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5yZXNldFBhbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBhbih0aGlzLnZpZXdwb3J0LmdldE9yaWdpbmFsU3RhdGUoKSk7XG59XG5cbi8qKlxuICogU2V0IHBhbiBhbmQgem9vbSB0byBpbml0aWFsIHN0YXRlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucmVzZXRab29tKClcbiAgdGhpcy5yZXNldFBhbigpXG59XG5cbi8qKlxuICogSGFuZGxlIGRvdWJsZSBjbGljayBldmVudFxuICogU2VlIGhhbmRsZU1vdXNlRG93bigpIGZvciBhbHRlcm5hdGUgZGV0ZWN0aW9uIG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2dFxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5oYW5kbGVEYmxDbGljayA9IGZ1bmN0aW9uKGV2dCkge1xuICBpZiAodGhpcy5vcHRpb25zLnByZXZlbnRNb3VzZUV2ZW50c0RlZmF1bHQpIHtcbiAgICBpZiAoZXZ0LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBldnQucmV0dXJuVmFsdWUgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrIGlmIHRhcmdldCB3YXMgYSBjb250cm9sIGJ1dHRvblxuICBpZiAodGhpcy5vcHRpb25zLmNvbnRyb2xJY29uc0VuYWJsZWQpIHtcbiAgICB2YXIgdGFyZ2V0Q2xhc3MgPSBldnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJ1xuICAgIGlmICh0YXJnZXRDbGFzcy5pbmRleE9mKCdzdmctcGFuLXpvb20tY29udHJvbCcpID4gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHZhciB6b29tRmFjdG9yXG5cbiAgaWYgKGV2dC5zaGlmdEtleSkge1xuICAgIHpvb21GYWN0b3IgPSAxLygoMSArIHRoaXMub3B0aW9ucy56b29tU2NhbGVTZW5zaXRpdml0eSkgKiAyKSAvLyB6b29tIG91dCB3aGVuIHNoaWZ0IGtleSBwcmVzc2VkXG4gIH0gZWxzZSB7XG4gICAgem9vbUZhY3RvciA9ICgxICsgdGhpcy5vcHRpb25zLnpvb21TY2FsZVNlbnNpdGl2aXR5KSAqIDJcbiAgfVxuXG4gIHZhciBwb2ludCA9IFN2Z1V0aWxzLmdldEV2ZW50UG9pbnQoZXZ0LCB0aGlzLnN2ZykubWF0cml4VHJhbnNmb3JtKHRoaXMuc3ZnLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKSlcbiAgdGhpcy56b29tQXRQb2ludCh6b29tRmFjdG9yLCBwb2ludClcbn1cblxuLyoqXG4gKiBIYW5kbGUgY2xpY2sgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldnRcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuaGFuZGxlTW91c2VEb3duID0gZnVuY3Rpb24oZXZ0LCBwcmV2RXZ0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMucHJldmVudE1vdXNlRXZlbnRzRGVmYXVsdCkge1xuICAgIGlmIChldnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGV2dC5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgVXRpbHMubW91c2VBbmRUb3VjaE5vcm1hbGl6ZShldnQsIHRoaXMuc3ZnKVxuXG4gIC8vIERvdWJsZSBjbGljayBkZXRlY3Rpb247IG1vcmUgY29uc2lzdGVudCB0aGFuIG9uZGJsY2xpY2tcbiAgaWYgKHRoaXMub3B0aW9ucy5kYmxDbGlja1pvb21FbmFibGVkICYmIFV0aWxzLmlzRGJsQ2xpY2soZXZ0LCBwcmV2RXZ0KSl7XG4gICAgdGhpcy5oYW5kbGVEYmxDbGljayhldnQpXG4gIH0gZWxzZSB7XG4gICAgLy8gUGFuIG1vZGVcbiAgICB0aGlzLnN0YXRlID0gJ3BhbidcbiAgICB0aGlzLmZpcnN0RXZlbnRDVE0gPSB0aGlzLnZpZXdwb3J0LmdldENUTSgpXG4gICAgdGhpcy5zdGF0ZU9yaWdpbiA9IFN2Z1V0aWxzLmdldEV2ZW50UG9pbnQoZXZ0LCB0aGlzLnN2ZykubWF0cml4VHJhbnNmb3JtKHRoaXMuZmlyc3RFdmVudENUTS5pbnZlcnNlKCkpXG4gIH1cbn1cblxuLyoqXG4gKiBIYW5kbGUgbW91c2UgbW92ZSBldmVudFxuICpcbiAqIEBwYXJhbSAge0V2ZW50fSBldnRcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuaGFuZGxlTW91c2VNb3ZlID0gZnVuY3Rpb24oZXZ0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMucHJldmVudE1vdXNlRXZlbnRzRGVmYXVsdCkge1xuICAgIGlmIChldnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGV2dC5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuc3RhdGUgPT09ICdwYW4nICYmIHRoaXMub3B0aW9ucy5wYW5FbmFibGVkKSB7XG4gICAgLy8gUGFuIG1vZGVcbiAgICB2YXIgcG9pbnQgPSBTdmdVdGlscy5nZXRFdmVudFBvaW50KGV2dCwgdGhpcy5zdmcpLm1hdHJpeFRyYW5zZm9ybSh0aGlzLmZpcnN0RXZlbnRDVE0uaW52ZXJzZSgpKVxuICAgICAgLCB2aWV3cG9ydENUTSA9IHRoaXMuZmlyc3RFdmVudENUTS50cmFuc2xhdGUocG9pbnQueCAtIHRoaXMuc3RhdGVPcmlnaW4ueCwgcG9pbnQueSAtIHRoaXMuc3RhdGVPcmlnaW4ueSlcblxuICAgIHRoaXMudmlld3BvcnQuc2V0Q1RNKHZpZXdwb3J0Q1RNKVxuICB9XG59XG5cbi8qKlxuICogSGFuZGxlIG1vdXNlIGJ1dHRvbiByZWxlYXNlIGV2ZW50XG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmhhbmRsZU1vdXNlVXAgPSBmdW5jdGlvbihldnQpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5wcmV2ZW50TW91c2VFdmVudHNEZWZhdWx0KSB7XG4gICAgaWYgKGV2dC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICB9IGVsc2Uge1xuICAgICAgZXZ0LnJldHVyblZhbHVlID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5zdGF0ZSA9PT0gJ3BhbicpIHtcbiAgICAvLyBRdWl0IHBhbiBtb2RlXG4gICAgdGhpcy5zdGF0ZSA9ICdub25lJ1xuICB9XG59XG5cbi8qKlxuICogQWRqdXN0IHZpZXdwb3J0IHNpemUgKG9ubHkpIHNvIGl0IHdpbGwgZml0IGluIFNWR1xuICogRG9lcyBub3QgY2VudGVyIGltYWdlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmZpdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdmlld0JveCA9IHRoaXMudmlld3BvcnQuZ2V0Vmlld0JveCgpXG4gICAgLCBuZXdTY2FsZSA9IE1hdGgubWluKHRoaXMud2lkdGgvdmlld0JveC53aWR0aCwgdGhpcy5oZWlnaHQvdmlld0JveC5oZWlnaHQpXG5cbiAgdGhpcy56b29tKG5ld1NjYWxlLCB0cnVlKVxufVxuXG4vKipcbiAqIEFkanVzdCB2aWV3cG9ydCBzaXplIChvbmx5KSBzbyBpdCB3aWxsIGNvbnRhaW4gdGhlIFNWR1xuICogRG9lcyBub3QgY2VudGVyIGltYWdlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmNvbnRhaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHZpZXdCb3ggPSB0aGlzLnZpZXdwb3J0LmdldFZpZXdCb3goKVxuICAgICwgbmV3U2NhbGUgPSBNYXRoLm1heCh0aGlzLndpZHRoL3ZpZXdCb3gud2lkdGgsIHRoaXMuaGVpZ2h0L3ZpZXdCb3guaGVpZ2h0KVxuXG4gIHRoaXMuem9vbShuZXdTY2FsZSwgdHJ1ZSlcbn1cblxuLyoqXG4gKiBBZGp1c3Qgdmlld3BvcnQgcGFuIChvbmx5KSBzbyBpdCB3aWxsIGJlIGNlbnRlcmVkIGluIFNWR1xuICogRG9lcyBub3Qgem9vbS9maXQvY29udGFpbiBpbWFnZVxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5jZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHZpZXdCb3ggPSB0aGlzLnZpZXdwb3J0LmdldFZpZXdCb3goKVxuICAgICwgb2Zmc2V0WCA9ICh0aGlzLndpZHRoIC0gKHZpZXdCb3gud2lkdGggKyB2aWV3Qm94LnggKiAyKSAqIHRoaXMuZ2V0Wm9vbSgpKSAqIDAuNVxuICAgICwgb2Zmc2V0WSA9ICh0aGlzLmhlaWdodCAtICh2aWV3Qm94LmhlaWdodCArIHZpZXdCb3gueSAqIDIpICogdGhpcy5nZXRab29tKCkpICogMC41XG5cbiAgdGhpcy5nZXRQdWJsaWNJbnN0YW5jZSgpLnBhbih7eDogb2Zmc2V0WCwgeTogb2Zmc2V0WX0pXG59XG5cbi8qKlxuICogVXBkYXRlIGNvbnRlbnQgY2FjaGVkIEJvcmRlckJveFxuICogVXNlIHdoZW4gdmlld3BvcnQgY29udGVudHMgY2hhbmdlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnVwZGF0ZUJCb3ggPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWV3cG9ydC5zaW1wbGVWaWV3Qm94Q2FjaGUoKVxufVxuXG4vKipcbiAqIFBhbiB0byBhIHJlbmRlcmVkIHBvc2l0aW9uXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBwb2ludCB7eDogMCwgeTogMH1cbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUucGFuID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgdmFyIHZpZXdwb3J0Q1RNID0gdGhpcy52aWV3cG9ydC5nZXRDVE0oKVxuICB2aWV3cG9ydENUTS5lID0gcG9pbnQueFxuICB2aWV3cG9ydENUTS5mID0gcG9pbnQueVxuICB0aGlzLnZpZXdwb3J0LnNldENUTSh2aWV3cG9ydENUTSlcbn1cblxuLyoqXG4gKiBSZWxhdGl2ZWx5IHBhbiB0aGUgZ3JhcGggYnkgYSBzcGVjaWZpZWQgcmVuZGVyZWQgcG9zaXRpb24gdmVjdG9yXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBwb2ludCB7eDogMCwgeTogMH1cbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUucGFuQnkgPSBmdW5jdGlvbihwb2ludCkge1xuICB2YXIgdmlld3BvcnRDVE0gPSB0aGlzLnZpZXdwb3J0LmdldENUTSgpXG4gIHZpZXdwb3J0Q1RNLmUgKz0gcG9pbnQueFxuICB2aWV3cG9ydENUTS5mICs9IHBvaW50LnlcbiAgdGhpcy52aWV3cG9ydC5zZXRDVE0odmlld3BvcnRDVE0pXG59XG5cbi8qKlxuICogR2V0IHBhbiB2ZWN0b3JcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHt4OiAwLCB5OiAwfVxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5nZXRQYW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy52aWV3cG9ydC5nZXRTdGF0ZSgpXG5cbiAgcmV0dXJuIHt4OiBzdGF0ZS54LCB5OiBzdGF0ZS55fVxufVxuXG4vKipcbiAqIFJlY2FsY3VsYXRlcyBjYWNoZWQgc3ZnIGRpbWVuc2lvbnMgYW5kIGNvbnRyb2xzIHBvc2l0aW9uXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBHZXQgZGltZW5zaW9uc1xuICB2YXIgYm91bmRpbmdDbGllbnRSZWN0Tm9ybWFsaXplZCA9IFN2Z1V0aWxzLmdldEJvdW5kaW5nQ2xpZW50UmVjdE5vcm1hbGl6ZWQodGhpcy5zdmcpXG4gIHRoaXMud2lkdGggPSBib3VuZGluZ0NsaWVudFJlY3ROb3JtYWxpemVkLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gYm91bmRpbmdDbGllbnRSZWN0Tm9ybWFsaXplZC5oZWlnaHRcblxuICAvLyBSZWNhbGN1bGF0ZSBvcmlnaW5hbCBzdGF0ZVxuICB2YXIgdmlld3BvcnQgPSB0aGlzLnZpZXdwb3J0XG4gIHZpZXdwb3J0Lm9wdGlvbnMud2lkdGggPSB0aGlzLndpZHRoXG4gIHZpZXdwb3J0Lm9wdGlvbnMuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcbiAgdmlld3BvcnQucHJvY2Vzc0NUTSgpXG5cbiAgLy8gUmVwb3NpdGlvbiBjb250cm9sIGljb25zIGJ5IHJlLWVuYWJsaW5nIHRoZW1cbiAgaWYgKHRoaXMub3B0aW9ucy5jb250cm9sSWNvbnNFbmFibGVkKSB7XG4gICAgdGhpcy5nZXRQdWJsaWNJbnN0YW5jZSgpLmRpc2FibGVDb250cm9sSWNvbnMoKVxuICAgIHRoaXMuZ2V0UHVibGljSW5zdGFuY2UoKS5lbmFibGVDb250cm9sSWNvbnMoKVxuICB9XG59XG5cbi8qKlxuICogVW5iaW5kIG1vdXNlIGV2ZW50cywgZnJlZSBjYWxsYmFja3MgYW5kIGRlc3Ryb3kgcHVibGljIGluc3RhbmNlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgLy8gRnJlZSBjYWxsYmFja3NcbiAgdGhpcy5iZWZvcmVab29tID0gbnVsbFxuICB0aGlzLm9uWm9vbSA9IG51bGxcbiAgdGhpcy5iZWZvcmVQYW4gPSBudWxsXG4gIHRoaXMub25QYW4gPSBudWxsXG4gIHRoaXMub25VcGRhdGVkQ1RNID0gbnVsbFxuXG4gIC8vIERlc3Ryb3kgY3VzdG9tIGV2ZW50IGhhbmRsZXJzXG4gIGlmICh0aGlzLm9wdGlvbnMuY3VzdG9tRXZlbnRzSGFuZGxlciAhPSBudWxsKSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgIHRoaXMub3B0aW9ucy5jdXN0b21FdmVudHNIYW5kbGVyLmRlc3Ryb3koe1xuICAgICAgc3ZnRWxlbWVudDogdGhpcy5zdmdcbiAgICAsIGV2ZW50c0xpc3RlbmVyRWxlbWVudDogdGhpcy5vcHRpb25zLmV2ZW50c0xpc3RlbmVyRWxlbWVudFxuICAgICwgaW5zdGFuY2U6IHRoaXMuZ2V0UHVibGljSW5zdGFuY2UoKVxuICAgIH0pXG4gIH1cblxuICAvLyBVbmJpbmQgZXZlbnRMaXN0ZW5lcnNcbiAgZm9yICh2YXIgZXZlbnQgaW4gdGhpcy5ldmVudExpc3RlbmVycykge1xuICAgICh0aGlzLm9wdGlvbnMuZXZlbnRzTGlzdGVuZXJFbGVtZW50IHx8IHRoaXMuc3ZnKVxuICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuZXZlbnRMaXN0ZW5lcnNbZXZlbnRdLCBmYWxzZSlcbiAgfVxuXG4gIC8vIFVuYmluZCB3aGVlbExpc3RlbmVyXG4gIHRoaXMuZGlzYWJsZU1vdXNlV2hlZWxab29tKClcblxuICAvLyBSZW1vdmUgY29udHJvbCBpY29uc1xuICB0aGlzLmdldFB1YmxpY0luc3RhbmNlKCkuZGlzYWJsZUNvbnRyb2xJY29ucygpXG5cbiAgLy8gUmVzZXQgem9vbSBhbmQgcGFuXG4gIHRoaXMucmVzZXQoKVxuXG4gIC8vIFJlbW92ZSBpbnN0YW5jZSBmcm9tIGluc3RhbmNlc1N0b3JlXG4gIGluc3RhbmNlc1N0b3JlID0gaW5zdGFuY2VzU3RvcmUuZmlsdGVyKGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICByZXR1cm4gaW5zdGFuY2Uuc3ZnICE9PSB0aGF0LnN2Z1xuICB9KVxuXG4gIC8vIERlbGV0ZSBvcHRpb25zIGFuZCBpdHMgY29udGVudHNcbiAgZGVsZXRlIHRoaXMub3B0aW9uc1xuXG4gIC8vIERlbGV0ZSB2aWV3cG9ydCB0byBtYWtlIHB1YmxpYyBzaGFkb3cgdmlld3BvcnQgZnVuY3Rpb25zIHVuY2FsbGFibGVcbiAgZGVsZXRlIHRoaXMudmlld3BvcnRcblxuICAvLyBEZXN0cm95IHB1YmxpYyBpbnN0YW5jZSBhbmQgcmV3cml0ZSBnZXRQdWJsaWNJbnN0YW5jZVxuICBkZWxldGUgdGhpcy5wdWJsaWNJbnN0YW5jZVxuICBkZWxldGUgdGhpcy5waVxuICB0aGlzLmdldFB1YmxpY0luc3RhbmNlID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHB1YmxpYyBpbnN0YW5jZSBvYmplY3RcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IFB1YmxpYyBpbnN0YW5jZSBvYmplY3RcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuZ2V0UHVibGljSW5zdGFuY2UgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgLy8gQ3JlYXRlIGNhY2hlXG4gIGlmICghdGhpcy5wdWJsaWNJbnN0YW5jZSkge1xuICAgIHRoaXMucHVibGljSW5zdGFuY2UgPSB0aGlzLnBpID0ge1xuICAgICAgLy8gUGFuXG4gICAgICBlbmFibGVQYW46IGZ1bmN0aW9uKCkge3RoYXQub3B0aW9ucy5wYW5FbmFibGVkID0gdHJ1ZTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCBkaXNhYmxlUGFuOiBmdW5jdGlvbigpIHt0aGF0Lm9wdGlvbnMucGFuRW5hYmxlZCA9IGZhbHNlOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGlzUGFuRW5hYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICEhdGhhdC5vcHRpb25zLnBhbkVuYWJsZWR9XG4gICAgLCBwYW46IGZ1bmN0aW9uKHBvaW50KSB7dGhhdC5wYW4ocG9pbnQpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHBhbkJ5OiBmdW5jdGlvbihwb2ludCkge3RoYXQucGFuQnkocG9pbnQpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGdldFBhbjogZnVuY3Rpb24oKSB7cmV0dXJuIHRoYXQuZ2V0UGFuKCl9XG4gICAgICAvLyBQYW4gZXZlbnRcbiAgICAsIHNldEJlZm9yZVBhbjogZnVuY3Rpb24oZm4pIHt0aGF0Lm9wdGlvbnMuYmVmb3JlUGFuID0gZm4gPT09IG51bGwgPyBudWxsIDogVXRpbHMucHJveHkoZm4sIHRoYXQucHVibGljSW5zdGFuY2UpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHNldE9uUGFuOiBmdW5jdGlvbihmbikge3RoYXQub3B0aW9ucy5vblBhbiA9IGZuID09PSBudWxsID8gbnVsbCA6IFV0aWxzLnByb3h5KGZuLCB0aGF0LnB1YmxpY0luc3RhbmNlKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgICAvLyBab29tIGFuZCBDb250cm9sIEljb25zXG4gICAgLCBlbmFibGVab29tOiBmdW5jdGlvbigpIHt0aGF0Lm9wdGlvbnMuem9vbUVuYWJsZWQgPSB0cnVlOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGRpc2FibGVab29tOiBmdW5jdGlvbigpIHt0aGF0Lm9wdGlvbnMuem9vbUVuYWJsZWQgPSBmYWxzZTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCBpc1pvb21FbmFibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gISF0aGF0Lm9wdGlvbnMuem9vbUVuYWJsZWR9XG4gICAgLCBlbmFibGVDb250cm9sSWNvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXRoYXQub3B0aW9ucy5jb250cm9sSWNvbnNFbmFibGVkKSB7XG4gICAgICAgICAgdGhhdC5vcHRpb25zLmNvbnRyb2xJY29uc0VuYWJsZWQgPSB0cnVlXG4gICAgICAgICAgQ29udHJvbEljb25zLmVuYWJsZSh0aGF0KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGF0LnBpXG4gICAgICB9XG4gICAgLCBkaXNhYmxlQ29udHJvbEljb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5jb250cm9sSWNvbnNFbmFibGVkKSB7XG4gICAgICAgICAgdGhhdC5vcHRpb25zLmNvbnRyb2xJY29uc0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICBDb250cm9sSWNvbnMuZGlzYWJsZSh0aGF0KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGF0LnBpXG4gICAgICB9XG4gICAgLCBpc0NvbnRyb2xJY29uc0VuYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAhIXRoYXQub3B0aW9ucy5jb250cm9sSWNvbnNFbmFibGVkfVxuICAgICAgLy8gRG91YmxlIGNsaWNrIHpvb21cbiAgICAsIGVuYWJsZURibENsaWNrWm9vbTogZnVuY3Rpb24oKSB7dGhhdC5vcHRpb25zLmRibENsaWNrWm9vbUVuYWJsZWQgPSB0cnVlOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGRpc2FibGVEYmxDbGlja1pvb206IGZ1bmN0aW9uKCkge3RoYXQub3B0aW9ucy5kYmxDbGlja1pvb21FbmFibGVkID0gZmFsc2U7IHJldHVybiB0aGF0LnBpfVxuICAgICwgaXNEYmxDbGlja1pvb21FbmFibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gISF0aGF0Lm9wdGlvbnMuZGJsQ2xpY2tab29tRW5hYmxlZH1cbiAgICAgIC8vIE1vdXNlIHdoZWVsIHpvb21cbiAgICAsIGVuYWJsZU1vdXNlV2hlZWxab29tOiBmdW5jdGlvbigpIHt0aGF0LmVuYWJsZU1vdXNlV2hlZWxab29tKCk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgZGlzYWJsZU1vdXNlV2hlZWxab29tOiBmdW5jdGlvbigpIHt0aGF0LmRpc2FibGVNb3VzZVdoZWVsWm9vbSgpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGlzTW91c2VXaGVlbFpvb21FbmFibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gISF0aGF0Lm9wdGlvbnMubW91c2VXaGVlbFpvb21FbmFibGVkfVxuICAgICAgLy8gWm9vbSBzY2FsZSBhbmQgYm91bmRzXG4gICAgLCBzZXRab29tU2NhbGVTZW5zaXRpdml0eTogZnVuY3Rpb24oc2NhbGUpIHt0aGF0Lm9wdGlvbnMuem9vbVNjYWxlU2Vuc2l0aXZpdHkgPSBzY2FsZTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCBzZXRNaW5ab29tOiBmdW5jdGlvbih6b29tKSB7dGhhdC5vcHRpb25zLm1pblpvb20gPSB6b29tOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHNldE1heFpvb206IGZ1bmN0aW9uKHpvb20pIHt0aGF0Lm9wdGlvbnMubWF4Wm9vbSA9IHpvb207IHJldHVybiB0aGF0LnBpfVxuICAgICAgLy8gWm9vbSBldmVudFxuICAgICwgc2V0QmVmb3JlWm9vbTogZnVuY3Rpb24oZm4pIHt0aGF0Lm9wdGlvbnMuYmVmb3JlWm9vbSA9IGZuID09PSBudWxsID8gbnVsbCA6IFV0aWxzLnByb3h5KGZuLCB0aGF0LnB1YmxpY0luc3RhbmNlKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCBzZXRPblpvb206IGZ1bmN0aW9uKGZuKSB7dGhhdC5vcHRpb25zLm9uWm9vbSA9IGZuID09PSBudWxsID8gbnVsbCA6IFV0aWxzLnByb3h5KGZuLCB0aGF0LnB1YmxpY0luc3RhbmNlKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgICAvLyBab29taW5nXG4gICAgLCB6b29tOiBmdW5jdGlvbihzY2FsZSkge3RoYXQucHVibGljWm9vbShzY2FsZSwgdHJ1ZSk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgem9vbUJ5OiBmdW5jdGlvbihzY2FsZSkge3RoYXQucHVibGljWm9vbShzY2FsZSwgZmFsc2UpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHpvb21BdFBvaW50OiBmdW5jdGlvbihzY2FsZSwgcG9pbnQpIHt0aGF0LnB1YmxpY1pvb21BdFBvaW50KHNjYWxlLCBwb2ludCwgdHJ1ZSk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgem9vbUF0UG9pbnRCeTogZnVuY3Rpb24oc2NhbGUsIHBvaW50KSB7dGhhdC5wdWJsaWNab29tQXRQb2ludChzY2FsZSwgcG9pbnQsIGZhbHNlKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCB6b29tSW46IGZ1bmN0aW9uKCkge3RoaXMuem9vbUJ5KDEgKyB0aGF0Lm9wdGlvbnMuem9vbVNjYWxlU2Vuc2l0aXZpdHkpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHpvb21PdXQ6IGZ1bmN0aW9uKCkge3RoaXMuem9vbUJ5KDEgLyAoMSArIHRoYXQub3B0aW9ucy56b29tU2NhbGVTZW5zaXRpdml0eSkpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGdldFpvb206IGZ1bmN0aW9uKCkge3JldHVybiB0aGF0LmdldFJlbGF0aXZlWm9vbSgpfVxuICAgICAgLy8gQ1RNIHVwZGF0ZVxuICAgICwgc2V0T25VcGRhdGVkQ1RNOiBmdW5jdGlvbihmbikge3RoYXQub3B0aW9ucy5vblVwZGF0ZWRDVE0gPSBmbiA9PT0gbnVsbCA/IG51bGwgOiBVdGlscy5wcm94eShmbiwgdGhhdC5wdWJsaWNJbnN0YW5jZSk7IHJldHVybiB0aGF0LnBpfVxuICAgICAgLy8gUmVzZXRcbiAgICAsIHJlc2V0Wm9vbTogZnVuY3Rpb24oKSB7dGhhdC5yZXNldFpvb20oKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCByZXNldFBhbjogZnVuY3Rpb24oKSB7dGhhdC5yZXNldFBhbigpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHJlc2V0OiBmdW5jdGlvbigpIHt0aGF0LnJlc2V0KCk7IHJldHVybiB0aGF0LnBpfVxuICAgICAgLy8gRml0LCBDb250YWluIGFuZCBDZW50ZXJcbiAgICAsIGZpdDogZnVuY3Rpb24oKSB7dGhhdC5maXQoKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCBjb250YWluOiBmdW5jdGlvbigpIHt0aGF0LmNvbnRhaW4oKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCBjZW50ZXI6IGZ1bmN0aW9uKCkge3RoYXQuY2VudGVyKCk7IHJldHVybiB0aGF0LnBpfVxuICAgICAgLy8gU2l6ZSBhbmQgUmVzaXplXG4gICAgLCB1cGRhdGVCQm94OiBmdW5jdGlvbigpIHt0aGF0LnVwZGF0ZUJCb3goKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCByZXNpemU6IGZ1bmN0aW9uKCkge3RoYXQucmVzaXplKCk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgZ2V0U2l6ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHdpZHRoOiB0aGF0LndpZHRoXG4gICAgICAgICwgaGVpZ2h0OiB0aGF0LmhlaWdodFxuICAgICAgICAsIHJlYWxab29tOiB0aGF0LmdldFpvb20oKVxuICAgICAgICAsIHZpZXdCb3g6IHRoYXQudmlld3BvcnQuZ2V0Vmlld0JveCgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIERlc3Ryb3lcbiAgICAsIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge3RoYXQuZGVzdHJveSgpOyByZXR1cm4gdGhhdC5waX1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcy5wdWJsaWNJbnN0YW5jZVxufVxuXG4vKipcbiAqIFN0b3JlcyBwYWlycyBvZiBpbnN0YW5jZXMgb2YgU3ZnUGFuWm9vbSBhbmQgU1ZHXG4gKiBFYWNoIHBhaXIgaXMgcmVwcmVzZW50ZWQgYnkgYW4gb2JqZWN0IHtzdmc6IFNWR1NWR0VsZW1lbnQsIGluc3RhbmNlOiBTdmdQYW5ab29tfVxuICpcbiAqIEB0eXBlIHtBcnJheX1cbiAqL1xudmFyIGluc3RhbmNlc1N0b3JlID0gW11cblxudmFyIHN2Z1Bhblpvb20gPSBmdW5jdGlvbihlbGVtZW50T3JTZWxlY3Rvciwgb3B0aW9ucyl7XG4gIHZhciBzdmcgPSBVdGlscy5nZXRTdmcoZWxlbWVudE9yU2VsZWN0b3IpXG5cbiAgaWYgKHN2ZyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsXG4gIH0gZWxzZSB7XG4gICAgLy8gTG9vayBmb3IgZXhpc3RlbnQgaW5zdGFuY2VcbiAgICBmb3IodmFyIGkgPSBpbnN0YW5jZXNTdG9yZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKGluc3RhbmNlc1N0b3JlW2ldLnN2ZyA9PT0gc3ZnKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZXNTdG9yZVtpXS5pbnN0YW5jZS5nZXRQdWJsaWNJbnN0YW5jZSgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgaW5zdGFuY2Ugbm90IGZvdW5kIC0gY3JlYXRlIG9uZVxuICAgIGluc3RhbmNlc1N0b3JlLnB1c2goe1xuICAgICAgc3ZnOiBzdmdcbiAgICAsIGluc3RhbmNlOiBuZXcgU3ZnUGFuWm9vbShzdmcsIG9wdGlvbnMpXG4gICAgfSlcblxuICAgIC8vIFJldHVybiBqdXN0IHB1c2hlZCBpbnN0YW5jZVxuICAgIHJldHVybiBpbnN0YW5jZXNTdG9yZVtpbnN0YW5jZXNTdG9yZS5sZW5ndGggLSAxXS5pbnN0YW5jZS5nZXRQdWJsaWNJbnN0YW5jZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdmdQYW5ab29tO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3ZnLXBhbi16b29tL3NyYy9zdmctcGFuLXpvb20uanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gdW5pd2hlZWwgMC4xLjIgKGN1c3RvbWl6ZWQpXG4vLyBBIHVuaWZpZWQgY3Jvc3MgYnJvd3NlciBtb3VzZSB3aGVlbCBldmVudCBoYW5kbGVyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGVlbXVhbGFwL3VuaXdoZWVsXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCl7XG5cbiAgLy9GdWxsIGRldGFpbHM6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL1JlZmVyZW5jZS9FdmVudHMvd2hlZWxcblxuICB2YXIgcHJlZml4ID0gXCJcIiwgX2FkZEV2ZW50TGlzdGVuZXIsIF9yZW1vdmVFdmVudExpc3RlbmVyLCBvbndoZWVsLCBzdXBwb3J0LCBmbnMgPSBbXTtcblxuICAvLyBkZXRlY3QgZXZlbnQgbW9kZWxcbiAgaWYgKCB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcbiAgICBfYWRkRXZlbnRMaXN0ZW5lciA9IFwiYWRkRXZlbnRMaXN0ZW5lclwiO1xuICAgIF9yZW1vdmVFdmVudExpc3RlbmVyID0gXCJyZW1vdmVFdmVudExpc3RlbmVyXCI7XG4gIH0gZWxzZSB7XG4gICAgX2FkZEV2ZW50TGlzdGVuZXIgPSBcImF0dGFjaEV2ZW50XCI7XG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXIgPSBcImRldGFjaEV2ZW50XCI7XG4gICAgcHJlZml4ID0gXCJvblwiO1xuICB9XG5cbiAgLy8gZGV0ZWN0IGF2YWlsYWJsZSB3aGVlbCBldmVudFxuICBzdXBwb3J0ID0gXCJvbndoZWVsXCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSA/IFwid2hlZWxcIiA6IC8vIE1vZGVybiBicm93c2VycyBzdXBwb3J0IFwid2hlZWxcIlxuICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZXdoZWVsICE9PSB1bmRlZmluZWQgPyBcIm1vdXNld2hlZWxcIiA6IC8vIFdlYmtpdCBhbmQgSUUgc3VwcG9ydCBhdCBsZWFzdCBcIm1vdXNld2hlZWxcIlxuICAgICAgICAgICAgXCJET01Nb3VzZVNjcm9sbFwiOyAvLyBsZXQncyBhc3N1bWUgdGhhdCByZW1haW5pbmcgYnJvd3NlcnMgYXJlIG9sZGVyIEZpcmVmb3hcblxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNhbGxiYWNrKGVsZW1lbnQsY2FsbGJhY2ssY2FwdHVyZSkge1xuXG4gICAgdmFyIGZuID0gZnVuY3Rpb24ob3JpZ2luYWxFdmVudCkge1xuXG4gICAgICAhb3JpZ2luYWxFdmVudCAmJiAoIG9yaWdpbmFsRXZlbnQgPSB3aW5kb3cuZXZlbnQgKTtcblxuICAgICAgLy8gY3JlYXRlIGEgbm9ybWFsaXplZCBldmVudCBvYmplY3RcbiAgICAgIHZhciBldmVudCA9IHtcbiAgICAgICAgLy8ga2VlcCBhIHJlZiB0byB0aGUgb3JpZ2luYWwgZXZlbnQgb2JqZWN0XG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IG9yaWdpbmFsRXZlbnQsXG4gICAgICAgIHRhcmdldDogb3JpZ2luYWxFdmVudC50YXJnZXQgfHwgb3JpZ2luYWxFdmVudC5zcmNFbGVtZW50LFxuICAgICAgICB0eXBlOiBcIndoZWVsXCIsXG4gICAgICAgIGRlbHRhTW9kZTogb3JpZ2luYWxFdmVudC50eXBlID09IFwiTW96TW91c2VQaXhlbFNjcm9sbFwiID8gMCA6IDEsXG4gICAgICAgIGRlbHRhWDogMCxcbiAgICAgICAgZGVsYXRaOiAwLFxuICAgICAgICBwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgb3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCA/XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCkgOlxuICAgICAgICAgICAgb3JpZ2luYWxFdmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBjYWxjdWxhdGUgZGVsdGFZIChhbmQgZGVsdGFYKSBhY2NvcmRpbmcgdG8gdGhlIGV2ZW50XG4gICAgICBpZiAoIHN1cHBvcnQgPT0gXCJtb3VzZXdoZWVsXCIgKSB7XG4gICAgICAgIGV2ZW50LmRlbHRhWSA9IC0gMS80MCAqIG9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YTtcbiAgICAgICAgLy8gV2Via2l0IGFsc28gc3VwcG9ydCB3aGVlbERlbHRhWFxuICAgICAgICBvcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFYICYmICggZXZlbnQuZGVsdGFYID0gLSAxLzQwICogb3JpZ2luYWxFdmVudC53aGVlbERlbHRhWCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXZlbnQuZGVsdGFZID0gb3JpZ2luYWxFdmVudC5kZXRhaWw7XG4gICAgICB9XG5cbiAgICAgIC8vIGl0J3MgdGltZSB0byBmaXJlIHRoZSBjYWxsYmFja1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKCBldmVudCApO1xuXG4gICAgfTtcblxuICAgIGZucy5wdXNoKHtcbiAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICBmbjogZm4sXG4gICAgICBjYXB0dXJlOiBjYXB0dXJlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZm47XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDYWxsYmFjayhlbGVtZW50LGNhcHR1cmUpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGZuc1tpXS5lbGVtZW50ID09PSBlbGVtZW50ICYmIGZuc1tpXS5jYXB0dXJlID09PSBjYXB0dXJlKSB7XG4gICAgICAgIHJldHVybiBmbnNbaV0uZm47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpe307XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVDYWxsYmFjayhlbGVtZW50LGNhcHR1cmUpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGZuc1tpXS5lbGVtZW50ID09PSBlbGVtZW50ICYmIGZuc1tpXS5jYXB0dXJlID09PSBjYXB0dXJlKSB7XG4gICAgICAgIHJldHVybiBmbnMuc3BsaWNlKGksMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2FkZFdoZWVsTGlzdGVuZXIoIGVsZW0sIGV2ZW50TmFtZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUgKSB7XG5cbiAgICB2YXIgY2I7XG5cbiAgICBpZiAoc3VwcG9ydCA9PT0gXCJ3aGVlbFwiKSB7XG4gICAgICBjYiA9IGNhbGxiYWNrO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYiA9IGNyZWF0ZUNhbGxiYWNrKGVsZW0sY2FsbGJhY2ssdXNlQ2FwdHVyZSk7XG4gICAgfVxuXG4gICAgZWxlbVsgX2FkZEV2ZW50TGlzdGVuZXIgXSggcHJlZml4ICsgZXZlbnROYW1lLCBjYiwgdXNlQ2FwdHVyZSB8fCBmYWxzZSApO1xuXG4gIH1cblxuICBmdW5jdGlvbiBfcmVtb3ZlV2hlZWxMaXN0ZW5lciggZWxlbSwgZXZlbnROYW1lLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSApIHtcblxuICAgIHZhciBjYjtcblxuICAgIGlmIChzdXBwb3J0ID09PSBcIndoZWVsXCIpIHtcbiAgICAgIGNiID0gY2FsbGJhY2s7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNiID0gZ2V0Q2FsbGJhY2soZWxlbSx1c2VDYXB0dXJlKTtcbiAgICB9XG5cbiAgICBlbGVtWyBfcmVtb3ZlRXZlbnRMaXN0ZW5lciBdKCBwcmVmaXggKyBldmVudE5hbWUsIGNiLCB1c2VDYXB0dXJlIHx8IGZhbHNlICk7XG5cbiAgICByZW1vdmVDYWxsYmFjayhlbGVtLHVzZUNhcHR1cmUpO1xuXG4gIH1cblxuICBmdW5jdGlvbiBhZGRXaGVlbExpc3RlbmVyKCBlbGVtLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSApIHtcbiAgICBfYWRkV2hlZWxMaXN0ZW5lciggZWxlbSwgc3VwcG9ydCwgY2FsbGJhY2ssIHVzZUNhcHR1cmUgKTtcblxuICAgIC8vIGhhbmRsZSBNb3pNb3VzZVBpeGVsU2Nyb2xsIGluIG9sZGVyIEZpcmVmb3hcbiAgICBpZiggc3VwcG9ydCA9PSBcIkRPTU1vdXNlU2Nyb2xsXCIgKSB7XG4gICAgICAgIF9hZGRXaGVlbExpc3RlbmVyKCBlbGVtLCBcIk1vek1vdXNlUGl4ZWxTY3JvbGxcIiwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVdoZWVsTGlzdGVuZXIoZWxlbSxjYWxsYmFjayx1c2VDYXB0dXJlKXtcbiAgICBfcmVtb3ZlV2hlZWxMaXN0ZW5lcihlbGVtLHN1cHBvcnQsY2FsbGJhY2ssdXNlQ2FwdHVyZSk7XG5cbiAgICAvLyBoYW5kbGUgTW96TW91c2VQaXhlbFNjcm9sbCBpbiBvbGRlciBGaXJlZm94XG4gICAgaWYoIHN1cHBvcnQgPT0gXCJET01Nb3VzZVNjcm9sbFwiICkge1xuICAgICAgICBfcmVtb3ZlV2hlZWxMaXN0ZW5lcihlbGVtLCBcIk1vek1vdXNlUGl4ZWxTY3JvbGxcIiwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb246IGFkZFdoZWVsTGlzdGVuZXIsXG4gICAgb2ZmOiByZW1vdmVXaGVlbExpc3RlbmVyXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL3VuaXdoZWVsLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBTdmdVdGlscyA9IHJlcXVpcmUoJy4vc3ZnLXV0aWxpdGllcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZW5hYmxlOiBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgIC8vIFNlbGVjdCAoYW5kIGNyZWF0ZSBpZiBuZWNlc3NhcnkpIGRlZnNcbiAgICB2YXIgZGVmcyA9IGluc3RhbmNlLnN2Zy5xdWVyeVNlbGVjdG9yKCdkZWZzJylcbiAgICBpZiAoIWRlZnMpIHtcbiAgICAgIGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdkZWZzJylcbiAgICAgIGluc3RhbmNlLnN2Zy5hcHBlbmRDaGlsZChkZWZzKVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBzdHlsZSBlbGVtZW50LCBhbmQgY3JlYXRlIGl0IGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICB2YXIgc3R5bGVFbCA9IGRlZnMucXVlcnlTZWxlY3Rvcignc3R5bGUjc3ZnLXBhbi16b29tLWNvbnRyb2xzLXN0eWxlcycpO1xuICAgIGlmICghc3R5bGVFbCkge1xuICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z1V0aWxzLnN2Z05TLCAnc3R5bGUnKVxuICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdpZCcsICdzdmctcGFuLXpvb20tY29udHJvbHMtc3R5bGVzJylcbiAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpXG4gICAgICBzdHlsZS50ZXh0Q29udGVudCA9ICcuc3ZnLXBhbi16b29tLWNvbnRyb2wgeyBjdXJzb3I6IHBvaW50ZXI7IGZpbGw6IGJsYWNrOyBmaWxsLW9wYWNpdHk6IDAuMzMzOyB9IC5zdmctcGFuLXpvb20tY29udHJvbDpob3ZlciB7IGZpbGwtb3BhY2l0eTogMC44OyB9IC5zdmctcGFuLXpvb20tY29udHJvbC1iYWNrZ3JvdW5kIHsgZmlsbDogd2hpdGU7IGZpbGwtb3BhY2l0eTogMC41OyB9IC5zdmctcGFuLXpvb20tY29udHJvbC1iYWNrZ3JvdW5kIHsgZmlsbC1vcGFjaXR5OiAwLjg7IH0nXG4gICAgICBkZWZzLmFwcGVuZENoaWxkKHN0eWxlKVxuICAgIH1cblxuICAgIC8vIFpvb20gR3JvdXBcbiAgICB2YXIgem9vbUdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z1V0aWxzLnN2Z05TLCAnZycpO1xuICAgIHpvb21Hcm91cC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3N2Zy1wYW4tem9vbS1jb250cm9scycpO1xuICAgIHpvb21Hcm91cC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICggaW5zdGFuY2Uud2lkdGggLSA3MCApICsgJyAnICsgKCBpbnN0YW5jZS5oZWlnaHQgLSA3NiApICsgJykgc2NhbGUoMC43NSknKTtcbiAgICB6b29tR3JvdXAuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzdmctcGFuLXpvb20tY29udHJvbCcpO1xuXG4gICAgLy8gQ29udHJvbCBlbGVtZW50c1xuICAgIHpvb21Hcm91cC5hcHBlbmRDaGlsZCh0aGlzLl9jcmVhdGVab29tSW4oaW5zdGFuY2UpKVxuICAgIHpvb21Hcm91cC5hcHBlbmRDaGlsZCh0aGlzLl9jcmVhdGVab29tUmVzZXQoaW5zdGFuY2UpKVxuICAgIHpvb21Hcm91cC5hcHBlbmRDaGlsZCh0aGlzLl9jcmVhdGVab29tT3V0KGluc3RhbmNlKSlcblxuICAgIC8vIEZpbmFsbHkgYXBwZW5kIGNyZWF0ZWQgZWxlbWVudFxuICAgIGluc3RhbmNlLnN2Zy5hcHBlbmRDaGlsZCh6b29tR3JvdXApXG5cbiAgICAvLyBDYWNoZSBjb250cm9sIGluc3RhbmNlXG4gICAgaW5zdGFuY2UuY29udHJvbEljb25zID0gem9vbUdyb3VwXG4gIH1cblxuLCBfY3JlYXRlWm9vbUluOiBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgIHZhciB6b29tSW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdnJyk7XG4gICAgem9vbUluLnNldEF0dHJpYnV0ZSgnaWQnLCAnc3ZnLXBhbi16b29tLXpvb20taW4nKTtcbiAgICB6b29tSW4uc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDMwLjUgNSkgc2NhbGUoMC4wMTUpJyk7XG4gICAgem9vbUluLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLXBhbi16b29tLWNvbnRyb2wnKTtcbiAgICB6b29tSW4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtpbnN0YW5jZS5nZXRQdWJsaWNJbnN0YW5jZSgpLnpvb21JbigpfSwgZmFsc2UpXG4gICAgem9vbUluLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbigpIHtpbnN0YW5jZS5nZXRQdWJsaWNJbnN0YW5jZSgpLnpvb21JbigpfSwgZmFsc2UpXG5cbiAgICB2YXIgem9vbUluQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdVdGlscy5zdmdOUywgJ3JlY3QnKTsgLy8gVE9ETyBjaGFuZ2UgdGhlc2UgYmFja2dyb3VuZCBzcGFjZSBmaWxsZXJzIHRvIHJvdW5kZWQgcmVjdGFuZ2xlcyBzbyB0aGV5IGxvb2sgcHJldHRpZXJcbiAgICB6b29tSW5CYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gICAgem9vbUluQmFja2dyb3VuZC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHpvb21JbkJhY2tncm91bmQuc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxNTAwJyk7IC8vIGxhcmdlciB0aGFuIGV4cGVjdGVkIGJlY2F1c2UgdGhlIHdob2xlIGdyb3VwIGlzIHRyYW5zZm9ybWVkIHRvIHNjYWxlIGRvd25cbiAgICB6b29tSW5CYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzE0MDAnKTtcbiAgICB6b29tSW5CYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLXBhbi16b29tLWNvbnRyb2wtYmFja2dyb3VuZCcpO1xuICAgIHpvb21Jbi5hcHBlbmRDaGlsZCh6b29tSW5CYWNrZ3JvdW5kKTtcblxuICAgIHZhciB6b29tSW5TaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdVdGlscy5zdmdOUywgJ3BhdGgnKTtcbiAgICB6b29tSW5TaGFwZS5zZXRBdHRyaWJ1dGUoJ2QnLCAnTTEyODAgNTc2djEyOHEwIDI2IC0xOSA0NXQtNDUgMTloLTMyMHYzMjBxMCAyNiAtMTkgNDV0LTQ1IDE5aC0xMjhxLTI2IDAgLTQ1IC0xOXQtMTkgLTQ1di0zMjBoLTMyMHEtMjYgMCAtNDUgLTE5dC0xOSAtNDV2LTEyOHEwIC0yNiAxOSAtNDV0NDUgLTE5aDMyMHYtMzIwcTAgLTI2IDE5IC00NXQ0NSAtMTloMTI4cTI2IDAgNDUgMTl0MTkgNDV2MzIwaDMyMHEyNiAwIDQ1IDE5dDE5IDQ1ek0xNTM2IDExMjB2LTk2MCBxMCAtMTE5IC04NC41IC0yMDMuNXQtMjAzLjUgLTg0LjVoLTk2MHEtMTE5IDAgLTIwMy41IDg0LjV0LTg0LjUgMjAzLjV2OTYwcTAgMTE5IDg0LjUgMjAzLjV0MjAzLjUgODQuNWg5NjBxMTE5IDAgMjAzLjUgLTg0LjV0ODQuNSAtMjAzLjV6Jyk7XG4gICAgem9vbUluU2hhcGUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzdmctcGFuLXpvb20tY29udHJvbC1lbGVtZW50Jyk7XG4gICAgem9vbUluLmFwcGVuZENoaWxkKHpvb21JblNoYXBlKTtcblxuICAgIHJldHVybiB6b29tSW5cbiAgfVxuXG4sIF9jcmVhdGVab29tUmVzZXQ6IGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICAvLyByZXNldFxuICAgIHZhciByZXNldFBhblpvb21Db250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z1V0aWxzLnN2Z05TLCAnZycpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2wuc2V0QXR0cmlidXRlKCdpZCcsICdzdmctcGFuLXpvb20tcmVzZXQtcGFuLXpvb20nKTtcbiAgICByZXNldFBhblpvb21Db250cm9sLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSg1IDM1KSBzY2FsZSgwLjQpJyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1wYW4tem9vbS1jb250cm9sJyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge2luc3RhbmNlLmdldFB1YmxpY0luc3RhbmNlKCkucmVzZXQoKX0sIGZhbHNlKTtcbiAgICByZXNldFBhblpvb21Db250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbigpIHtpbnN0YW5jZS5nZXRQdWJsaWNJbnN0YW5jZSgpLnJlc2V0KCl9LCBmYWxzZSk7XG5cbiAgICB2YXIgcmVzZXRQYW5ab29tQ29udHJvbEJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdyZWN0Jyk7IC8vIFRPRE8gY2hhbmdlIHRoZXNlIGJhY2tncm91bmQgc3BhY2UgZmlsbGVycyB0byByb3VuZGVkIHJlY3RhbmdsZXMgc28gdGhleSBsb29rIHByZXR0aWVyXG4gICAgcmVzZXRQYW5ab29tQ29udHJvbEJhY2tncm91bmQuc2V0QXR0cmlidXRlKCd4JywgJzInKTtcbiAgICByZXNldFBhblpvb21Db250cm9sQmFja2dyb3VuZC5zZXRBdHRyaWJ1dGUoJ3knLCAnMicpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2xCYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMTgyJyk7IC8vIGxhcmdlciB0aGFuIGV4cGVjdGVkIGJlY2F1c2UgdGhlIHdob2xlIGdyb3VwIGlzIHRyYW5zZm9ybWVkIHRvIHNjYWxlIGRvd25cbiAgICByZXNldFBhblpvb21Db250cm9sQmFja2dyb3VuZC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICc1OCcpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2xCYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLXBhbi16b29tLWNvbnRyb2wtYmFja2dyb3VuZCcpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2wuYXBwZW5kQ2hpbGQocmVzZXRQYW5ab29tQ29udHJvbEJhY2tncm91bmQpO1xuXG4gICAgdmFyIHJlc2V0UGFuWm9vbUNvbnRyb2xTaGFwZTEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdwYXRoJyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbFNoYXBlMS5zZXRBdHRyaWJ1dGUoJ2QnLCAnTTMzLjA1MSwyMC42MzJjLTAuNzQyLTAuNDA2LTEuODU0LTAuNjA5LTMuMzM4LTAuNjA5aC03Ljk2OXY5LjI4MWg3Ljc2OWMxLjU0MywwLDIuNzAxLTAuMTg4LDMuNDczLTAuNTYyYzEuMzY1LTAuNjU2LDIuMDQ4LTEuOTUzLDIuMDQ4LTMuODkxQzM1LjAzMiwyMi43NTcsMzQuMzcyLDIxLjM1MSwzMy4wNTEsMjAuNjMyeicpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2xTaGFwZTEuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzdmctcGFuLXpvb20tY29udHJvbC1lbGVtZW50Jyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbC5hcHBlbmRDaGlsZChyZXNldFBhblpvb21Db250cm9sU2hhcGUxKTtcblxuICAgIHZhciByZXNldFBhblpvb21Db250cm9sU2hhcGUyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z1V0aWxzLnN2Z05TLCAncGF0aCcpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2xTaGFwZTIuc2V0QXR0cmlidXRlKCdkJywgJ00xNzAuMjMxLDAuNUgxNS44NDdDNy4xMDIsMC41LDAuNSw1LjcwOCwwLjUsMTEuODR2MzguODYxQzAuNSw1Ni44MzMsNy4xMDIsNjEuNSwxNS44NDcsNjEuNWgxNTQuMzg0YzguNzQ1LDAsMTUuMjY5LTQuNjY3LDE1LjI2OS0xMC43OThWMTEuODRDMTg1LjUsNS43MDgsMTc4Ljk3NiwwLjUsMTcwLjIzMSwwLjV6IE00Mi44MzcsNDguNTY5aC03Ljk2OWMtMC4yMTktMC43NjYtMC4zNzUtMS4zODMtMC40NjktMS44NTJjLTAuMTg4LTAuOTY5LTAuMjg5LTEuOTYxLTAuMzA1LTIuOTc3bC0wLjA0Ny0zLjIxMWMtMC4wMy0yLjIwMy0wLjQxLTMuNjcyLTEuMTQyLTQuNDA2Yy0wLjczMi0wLjczNC0yLjEwMy0xLjEwMi00LjExMy0xLjEwMmgtNy4wNXYxMy41NDdoLTcuMDU1VjE0LjAyMmgxNi41MjRjMi4zNjEsMC4wNDcsNC4xNzgsMC4zNDQsNS40NSwwLjg5MWMxLjI3MiwwLjU0NywyLjM1MSwxLjM1MiwzLjIzNCwyLjQxNGMwLjczMSwwLjg3NSwxLjMxLDEuODQ0LDEuNzM3LDIuOTA2czAuNjQsMi4yNzMsMC42NCwzLjYzM2MwLDEuNjQxLTAuNDE0LDMuMjU0LTEuMjQyLDQuODRzLTIuMTk1LDIuNzA3LTQuMTAyLDMuMzYzYzEuNTk0LDAuNjQxLDIuNzIzLDEuNTUxLDMuMzg3LDIuNzNzMC45OTYsMi45OCwwLjk5Niw1LjQwMnYyLjMyYzAsMS41NzgsMC4wNjMsMi42NDgsMC4xOSwzLjIxMWMwLjE5LDAuODkxLDAuNjM1LDEuNTQ3LDEuMzMzLDEuOTY5VjQ4LjU2OXogTTc1LjU3OSw0OC41NjloLTI2LjE4VjE0LjAyMmgyNS4zMzZ2Ni4xMTdINTYuNDU0djcuMzM2aDE2Ljc4MXY2SDU2LjQ1NHY4Ljg4M2gxOS4xMjVWNDguNTY5eiBNMTA0LjQ5Nyw0Ni4zMzFjLTIuNDQsMi4wODYtNS44ODcsMy4xMjktMTAuMzQsMy4xMjljLTQuNTQ4LDAtOC4xMjUtMS4wMjctMTAuNzMxLTMuMDgycy0zLjkwOS00Ljg3OS0zLjkwOS04LjQ3M2g2Ljg5MWMwLjIyNCwxLjU3OCwwLjY2MiwyLjc1OCwxLjMxNiwzLjUzOWMxLjE5NiwxLjQyMiwzLjI0NiwyLjEzMyw2LjE1LDIuMTMzYzEuNzM5LDAsMy4xNTEtMC4xODgsNC4yMzYtMC41NjJjMi4wNTgtMC43MTksMy4wODctMi4wNTUsMy4wODctNC4wMDhjMC0xLjE0MS0wLjUwNC0yLjAyMy0xLjUxMi0yLjY0OGMtMS4wMDgtMC42MDktMi42MDctMS4xNDgtNC43OTYtMS42MTdsLTMuNzQtMC44MmMtMy42NzYtMC44MTItNi4yMDEtMS42OTUtNy41NzYtMi42NDhjLTIuMzI4LTEuNTk0LTMuNDkyLTQuMDg2LTMuNDkyLTcuNDc3YzAtMy4wOTQsMS4xMzktNS42NjQsMy40MTctNy43MTFzNS42MjMtMy4wNywxMC4wMzYtMy4wN2MzLjY4NSwwLDYuODI5LDAuOTY1LDkuNDMxLDIuODk1YzIuNjAyLDEuOTMsMy45NjYsNC43Myw0LjA5Myw4LjQwMmgtNi45MzhjLTAuMTI4LTIuMDc4LTEuMDU3LTMuNTU1LTIuNzg3LTQuNDNjLTEuMTU0LTAuNTc4LTIuNTg3LTAuODY3LTQuMzAxLTAuODY3Yy0xLjkwNywwLTMuNDI4LDAuMzc1LTQuNTY1LDEuMTI1Yy0xLjEzOCwwLjc1LTEuNzA2LDEuNzk3LTEuNzA2LDMuMTQxYzAsMS4yMzQsMC41NjEsMi4xNTYsMS42ODIsMi43NjZjMC43MjEsMC40MDYsMi4yNSwwLjg4Myw0LjU4OSwxLjQzbDYuMDYzLDEuNDNjMi42NTcsMC42MjUsNC42NDgsMS40NjEsNS45NzUsMi41MDhjMi4wNTksMS42MjUsMy4wODksMy45NzcsMy4wODksNy4wNTVDMTA4LjE1Nyw0MS42MjQsMTA2LjkzNyw0NC4yNDUsMTA0LjQ5Nyw0Ni4zMzF6IE0xMzkuNjEsNDguNTY5aC0yNi4xOFYxNC4wMjJoMjUuMzM2djYuMTE3aC0xOC4yODF2Ny4zMzZoMTYuNzgxdjZoLTE2Ljc4MXY4Ljg4M2gxOS4xMjVWNDguNTY5eiBNMTcwLjMzNywyMC4xNGgtMTAuMzM2djI4LjQzaC03LjI2NlYyMC4xNGgtMTAuMzgzdi02LjExN2gyNy45ODRWMjAuMTR6Jyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbFNoYXBlMi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1wYW4tem9vbS1jb250cm9sLWVsZW1lbnQnKTtcbiAgICByZXNldFBhblpvb21Db250cm9sLmFwcGVuZENoaWxkKHJlc2V0UGFuWm9vbUNvbnRyb2xTaGFwZTIpO1xuXG4gICAgcmV0dXJuIHJlc2V0UGFuWm9vbUNvbnRyb2xcbiAgfVxuXG4sIF9jcmVhdGVab29tT3V0OiBmdW5jdGlvbihpbnN0YW5jZSl7XG4gICAgLy8gem9vbSBvdXRcbiAgICB2YXIgem9vbU91dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdVdGlscy5zdmdOUywgJ2cnKTtcbiAgICB6b29tT3V0LnNldEF0dHJpYnV0ZSgnaWQnLCAnc3ZnLXBhbi16b29tLXpvb20tb3V0Jyk7XG4gICAgem9vbU91dC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMzAuNSA3MCkgc2NhbGUoMC4wMTUpJyk7XG4gICAgem9vbU91dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1wYW4tem9vbS1jb250cm9sJyk7XG4gICAgem9vbU91dC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge2luc3RhbmNlLmdldFB1YmxpY0luc3RhbmNlKCkuem9vbU91dCgpfSwgZmFsc2UpO1xuICAgIHpvb21PdXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKCkge2luc3RhbmNlLmdldFB1YmxpY0luc3RhbmNlKCkuem9vbU91dCgpfSwgZmFsc2UpO1xuXG4gICAgdmFyIHpvb21PdXRCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z1V0aWxzLnN2Z05TLCAncmVjdCcpOyAvLyBUT0RPIGNoYW5nZSB0aGVzZSBiYWNrZ3JvdW5kIHNwYWNlIGZpbGxlcnMgdG8gcm91bmRlZCByZWN0YW5nbGVzIHNvIHRoZXkgbG9vayBwcmV0dGllclxuICAgIHpvb21PdXRCYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gICAgem9vbU91dEJhY2tncm91bmQuc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICB6b29tT3V0QmFja2dyb3VuZC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzE1MDAnKTsgLy8gbGFyZ2VyIHRoYW4gZXhwZWN0ZWQgYmVjYXVzZSB0aGUgd2hvbGUgZ3JvdXAgaXMgdHJhbnNmb3JtZWQgdG8gc2NhbGUgZG93blxuICAgIHpvb21PdXRCYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzE0MDAnKTtcbiAgICB6b29tT3V0QmFja2dyb3VuZC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1wYW4tem9vbS1jb250cm9sLWJhY2tncm91bmQnKTtcbiAgICB6b29tT3V0LmFwcGVuZENoaWxkKHpvb21PdXRCYWNrZ3JvdW5kKTtcblxuICAgIHZhciB6b29tT3V0U2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdwYXRoJyk7XG4gICAgem9vbU91dFNoYXBlLnNldEF0dHJpYnV0ZSgnZCcsICdNMTI4MCA1NzZ2MTI4cTAgMjYgLTE5IDQ1dC00NSAxOWgtODk2cS0yNiAwIC00NSAtMTl0LTE5IC00NXYtMTI4cTAgLTI2IDE5IC00NXQ0NSAtMTloODk2cTI2IDAgNDUgMTl0MTkgNDV6TTE1MzYgMTEyMHYtOTYwcTAgLTExOSAtODQuNSAtMjAzLjV0LTIwMy41IC04NC41aC05NjBxLTExOSAwIC0yMDMuNSA4NC41dC04NC41IDIwMy41djk2MHEwIDExOSA4NC41IDIwMy41dDIwMy41IDg0LjVoOTYwcTExOSAwIDIwMy41IC04NC41IHQ4NC41IC0yMDMuNXonKTtcbiAgICB6b29tT3V0U2hhcGUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzdmctcGFuLXpvb20tY29udHJvbC1lbGVtZW50Jyk7XG4gICAgem9vbU91dC5hcHBlbmRDaGlsZCh6b29tT3V0U2hhcGUpO1xuXG4gICAgcmV0dXJuIHpvb21PdXRcbiAgfVxuXG4sIGRpc2FibGU6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgaWYgKGluc3RhbmNlLmNvbnRyb2xJY29ucykge1xuICAgICAgaW5zdGFuY2UuY29udHJvbEljb25zLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaW5zdGFuY2UuY29udHJvbEljb25zKVxuICAgICAgaW5zdGFuY2UuY29udHJvbEljb25zID0gbnVsbFxuICAgIH1cbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3ZnLXBhbi16b29tL3NyYy9jb250cm9sLWljb25zLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBTdmdVdGlscyA9IHJlcXVpcmUoJy4vc3ZnLXV0aWxpdGllcycpXG4gICwgVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxpdGllcycpXG4gIDtcblxudmFyIFNoYWRvd1ZpZXdwb3J0ID0gZnVuY3Rpb24odmlld3BvcnQsIG9wdGlvbnMpe1xuICB0aGlzLmluaXQodmlld3BvcnQsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogSW5pdGlhbGl6YXRpb25cbiAqXG4gKiBAcGFyYW0gIHtTVkdFbGVtZW50fSB2aWV3cG9ydFxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odmlld3BvcnQsIG9wdGlvbnMpIHtcbiAgLy8gRE9NIEVsZW1lbnRzXG4gIHRoaXMudmlld3BvcnQgPSB2aWV3cG9ydFxuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgLy8gU3RhdGUgY2FjaGVcbiAgdGhpcy5vcmlnaW5hbFN0YXRlID0ge3pvb206IDEsIHg6IDAsIHk6IDB9XG4gIHRoaXMuYWN0aXZlU3RhdGUgPSB7em9vbTogMSwgeDogMCwgeTogMH1cblxuICB0aGlzLnVwZGF0ZUNUTUNhY2hlZCA9IFV0aWxzLnByb3h5KHRoaXMudXBkYXRlQ1RNLCB0aGlzKVxuXG4gIC8vIENyZWF0ZSBhIGN1c3RvbSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgdGFraW5nIGluIGFjY291bnQgcmVmcmVzaFJhdGVcbiAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBVdGlscy5jcmVhdGVSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5vcHRpb25zLnJlZnJlc2hSYXRlKVxuXG4gIC8vIFZpZXdCb3hcbiAgdGhpcy52aWV3Qm94ID0ge3g6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDB9XG4gIHRoaXMuY2FjaGVWaWV3Qm94KClcblxuICAvLyBQcm9jZXNzIENUTVxuICB2YXIgbmV3Q1RNID0gdGhpcy5wcm9jZXNzQ1RNKClcblxuICAvLyBVcGRhdGUgdmlld3BvcnQgQ1RNIGFuZCBjYWNoZSB6b29tIGFuZCBwYW5cbiAgdGhpcy5zZXRDVE0obmV3Q1RNKVxuXG4gIC8vIFVwZGF0ZSBDVE0gaW4gdGhpcyBmcmFtZVxuICB0aGlzLnVwZGF0ZUNUTSgpXG59XG5cbi8qKlxuICogQ2FjaGUgaW5pdGlhbCB2aWV3Qm94IHZhbHVlXG4gKiBJZiBubyB2aWV3Qm94IGlzIGRlZmluZWQsIHRoZW4gdXNlIHZpZXdwb3J0IHNpemUvcG9zaXRpb24gaW5zdGVhZCBmb3Igdmlld0JveCB2YWx1ZXNcbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLmNhY2hlVmlld0JveCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3ZnVmlld0JveCA9IHRoaXMub3B0aW9ucy5zdmcuZ2V0QXR0cmlidXRlKCd2aWV3Qm94JylcblxuICBpZiAoc3ZnVmlld0JveCkge1xuICAgIHZhciB2aWV3Qm94VmFsdWVzID0gc3ZnVmlld0JveC5zcGxpdCgvW1xcc1xcLF0vKS5maWx0ZXIoZnVuY3Rpb24odil7cmV0dXJuIHZ9KS5tYXAocGFyc2VGbG9hdClcblxuICAgIC8vIENhY2hlIHZpZXdib3ggeCBhbmQgeSBvZmZzZXRcbiAgICB0aGlzLnZpZXdCb3gueCA9IHZpZXdCb3hWYWx1ZXNbMF1cbiAgICB0aGlzLnZpZXdCb3gueSA9IHZpZXdCb3hWYWx1ZXNbMV1cbiAgICB0aGlzLnZpZXdCb3gud2lkdGggPSB2aWV3Qm94VmFsdWVzWzJdXG4gICAgdGhpcy52aWV3Qm94LmhlaWdodCA9IHZpZXdCb3hWYWx1ZXNbM11cblxuICAgIHZhciB6b29tID0gTWF0aC5taW4odGhpcy5vcHRpb25zLndpZHRoIC8gdGhpcy52aWV3Qm94LndpZHRoLCB0aGlzLm9wdGlvbnMuaGVpZ2h0IC8gdGhpcy52aWV3Qm94LmhlaWdodClcblxuICAgIC8vIFVwZGF0ZSBhY3RpdmUgc3RhdGVcbiAgICB0aGlzLmFjdGl2ZVN0YXRlLnpvb20gPSB6b29tXG4gICAgdGhpcy5hY3RpdmVTdGF0ZS54ID0gKHRoaXMub3B0aW9ucy53aWR0aCAtIHRoaXMudmlld0JveC53aWR0aCAqIHpvb20pIC8gMlxuICAgIHRoaXMuYWN0aXZlU3RhdGUueSA9ICh0aGlzLm9wdGlvbnMuaGVpZ2h0IC0gdGhpcy52aWV3Qm94LmhlaWdodCAqIHpvb20pIC8gMlxuXG4gICAgLy8gRm9yY2UgdXBkYXRpbmcgQ1RNXG4gICAgdGhpcy51cGRhdGVDVE1Pbk5leHRGcmFtZSgpXG5cbiAgICB0aGlzLm9wdGlvbnMuc3ZnLnJlbW92ZUF0dHJpYnV0ZSgndmlld0JveCcpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zaW1wbGVWaWV3Qm94Q2FjaGUoKVxuICB9XG59XG5cbi8qKlxuICogUmVjYWxjdWxhdGUgdmlld3BvcnQgc2l6ZXMgYW5kIHVwZGF0ZSB2aWV3Qm94IGNhY2hlXG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5zaW1wbGVWaWV3Qm94Q2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGJCb3ggPSB0aGlzLnZpZXdwb3J0LmdldEJCb3goKVxuXG4gIHRoaXMudmlld0JveC54ID0gYkJveC54XG4gIHRoaXMudmlld0JveC55ID0gYkJveC55XG4gIHRoaXMudmlld0JveC53aWR0aCA9IGJCb3gud2lkdGhcbiAgdGhpcy52aWV3Qm94LmhlaWdodCA9IGJCb3guaGVpZ2h0XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHZpZXdib3ggb2JqZWN0LiBTYWZlIHRvIGFsdGVyXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB2aWV3Ym94IG9iamVjdFxuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuZ2V0Vmlld0JveCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gVXRpbHMuZXh0ZW5kKHt9LCB0aGlzLnZpZXdCb3gpXG59XG5cbi8qKlxuICogR2V0IGluaXRpYWwgem9vbSBhbmQgcGFuIHZhbHVlcy4gU2F2ZSB0aGVtIGludG8gb3JpZ2luYWxTdGF0ZVxuICogUGFyc2VzIHZpZXdCb3ggYXR0cmlidXRlIHRvIGFsdGVyIGluaXRpYWwgc2l6ZXNcbiAqXG4gKiBAcmV0dXJuIHtDVE19IENUTSBvYmplY3QgYmFzZWQgb24gb3B0aW9uc1xuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUucHJvY2Vzc0NUTSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmV3Q1RNID0gdGhpcy5nZXRDVE0oKVxuXG4gIGlmICh0aGlzLm9wdGlvbnMuZml0IHx8IHRoaXMub3B0aW9ucy5jb250YWluKSB7XG4gICAgdmFyIG5ld1NjYWxlO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZml0KSB7XG4gICAgICBuZXdTY2FsZSA9IE1hdGgubWluKHRoaXMub3B0aW9ucy53aWR0aC90aGlzLnZpZXdCb3gud2lkdGgsIHRoaXMub3B0aW9ucy5oZWlnaHQvdGhpcy52aWV3Qm94LmhlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1NjYWxlID0gTWF0aC5tYXgodGhpcy5vcHRpb25zLndpZHRoL3RoaXMudmlld0JveC53aWR0aCwgdGhpcy5vcHRpb25zLmhlaWdodC90aGlzLnZpZXdCb3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBuZXdDVE0uYSA9IG5ld1NjYWxlOyAvL3gtc2NhbGVcbiAgICBuZXdDVE0uZCA9IG5ld1NjYWxlOyAvL3ktc2NhbGVcbiAgICBuZXdDVE0uZSA9IC10aGlzLnZpZXdCb3gueCAqIG5ld1NjYWxlOyAvL3gtdHJhbnNmb3JtXG4gICAgbmV3Q1RNLmYgPSAtdGhpcy52aWV3Qm94LnkgKiBuZXdTY2FsZTsgLy95LXRyYW5zZm9ybVxuICB9XG5cbiAgaWYgKHRoaXMub3B0aW9ucy5jZW50ZXIpIHtcbiAgICB2YXIgb2Zmc2V0WCA9ICh0aGlzLm9wdGlvbnMud2lkdGggLSAodGhpcy52aWV3Qm94LndpZHRoICsgdGhpcy52aWV3Qm94LnggKiAyKSAqIG5ld0NUTS5hKSAqIDAuNVxuICAgICAgLCBvZmZzZXRZID0gKHRoaXMub3B0aW9ucy5oZWlnaHQgLSAodGhpcy52aWV3Qm94LmhlaWdodCArIHRoaXMudmlld0JveC55ICogMikgKiBuZXdDVE0uYSkgKiAwLjVcblxuICAgIG5ld0NUTS5lID0gb2Zmc2V0WFxuICAgIG5ld0NUTS5mID0gb2Zmc2V0WVxuICB9XG5cbiAgLy8gQ2FjaGUgaW5pdGlhbCB2YWx1ZXMuIEJhc2VkIG9uIGFjdGl2ZVN0YXRlIGFuZCBmaXgrY2VudGVyIG9waXRvbnNcbiAgdGhpcy5vcmlnaW5hbFN0YXRlLnpvb20gPSBuZXdDVE0uYVxuICB0aGlzLm9yaWdpbmFsU3RhdGUueCA9IG5ld0NUTS5lXG4gIHRoaXMub3JpZ2luYWxTdGF0ZS55ID0gbmV3Q1RNLmZcblxuICByZXR1cm4gbmV3Q1RNXG59XG5cbi8qKlxuICogUmV0dXJuIG9yaWdpbmFsU3RhdGUgb2JqZWN0LiBTYWZlIHRvIGFsdGVyXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuZ2V0T3JpZ2luYWxTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gVXRpbHMuZXh0ZW5kKHt9LCB0aGlzLm9yaWdpbmFsU3RhdGUpXG59XG5cbi8qKlxuICogUmV0dXJuIGFjdHVhbFN0YXRlIG9iamVjdC4gU2FmZSB0byBhbHRlclxuICpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBVdGlscy5leHRlbmQoe30sIHRoaXMuYWN0aXZlU3RhdGUpXG59XG5cbi8qKlxuICogR2V0IHpvb20gc2NhbGVcbiAqXG4gKiBAcmV0dXJuIHtGbG9hdH0gem9vbSBzY2FsZVxuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuZ2V0Wm9vbSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5hY3RpdmVTdGF0ZS56b29tXG59XG5cbi8qKlxuICogR2V0IHpvb20gc2NhbGUgZm9yIHB1YmlsYyB1c2FnZVxuICpcbiAqIEByZXR1cm4ge0Zsb2F0fSB6b29tIHNjYWxlXG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5nZXRSZWxhdGl2ZVpvb20gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuYWN0aXZlU3RhdGUuem9vbSAvIHRoaXMub3JpZ2luYWxTdGF0ZS56b29tXG59XG5cbi8qKlxuICogQ29tcHV0ZSB6b29tIHNjYWxlIGZvciBwdWJpbGMgdXNhZ2VcbiAqXG4gKiBAcmV0dXJuIHtGbG9hdH0gem9vbSBzY2FsZVxuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuY29tcHV0ZVJlbGF0aXZlWm9vbSA9IGZ1bmN0aW9uKHNjYWxlKSB7XG4gIHJldHVybiBzY2FsZSAvIHRoaXMub3JpZ2luYWxTdGF0ZS56b29tXG59XG5cbi8qKlxuICogR2V0IHBhblxuICpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLmdldFBhbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge3g6IHRoaXMuYWN0aXZlU3RhdGUueCwgeTogdGhpcy5hY3RpdmVTdGF0ZS55fVxufVxuXG4vKipcbiAqIFJldHVybiBjYWNoZWQgdmlld3BvcnQgQ1RNIHZhbHVlIHRoYXQgY2FuIGJlIHNhZmVseSBtb2RpZmllZFxuICpcbiAqIEByZXR1cm4ge1NWR01hdHJpeH1cbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLmdldENUTSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2FmZUNUTSA9IHRoaXMub3B0aW9ucy5zdmcuY3JlYXRlU1ZHTWF0cml4KClcblxuICAvLyBDb3B5IHZhbHVlcyBtYW51YWxseSBhcyBpbiBGRiB0aGV5IGFyZSBub3QgaXR0ZXJhYmxlXG4gIHNhZmVDVE0uYSA9IHRoaXMuYWN0aXZlU3RhdGUuem9vbVxuICBzYWZlQ1RNLmIgPSAwXG4gIHNhZmVDVE0uYyA9IDBcbiAgc2FmZUNUTS5kID0gdGhpcy5hY3RpdmVTdGF0ZS56b29tXG4gIHNhZmVDVE0uZSA9IHRoaXMuYWN0aXZlU3RhdGUueFxuICBzYWZlQ1RNLmYgPSB0aGlzLmFjdGl2ZVN0YXRlLnlcblxuICByZXR1cm4gc2FmZUNUTVxufVxuXG4vKipcbiAqIFNldCBhIG5ldyBDVE1cbiAqXG4gKiBAcGFyYW0ge1NWR01hdHJpeH0gbmV3Q1RNXG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5zZXRDVE0gPSBmdW5jdGlvbihuZXdDVE0pIHtcbiAgdmFyIHdpbGxab29tID0gdGhpcy5pc1pvb21EaWZmZXJlbnQobmV3Q1RNKVxuICAgICwgd2lsbFBhbiA9IHRoaXMuaXNQYW5EaWZmZXJlbnQobmV3Q1RNKVxuXG4gIGlmICh3aWxsWm9vbSB8fCB3aWxsUGFuKSB7XG4gICAgLy8gQmVmb3JlIHpvb21cbiAgICBpZiAod2lsbFpvb20pIHtcbiAgICAgIC8vIElmIHJldHVybnMgZmFsc2UgdGhlbiBjYW5jZWwgem9vbWluZ1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5iZWZvcmVab29tKHRoaXMuZ2V0UmVsYXRpdmVab29tKCksIHRoaXMuY29tcHV0ZVJlbGF0aXZlWm9vbShuZXdDVE0uYSkpID09PSBmYWxzZSkge1xuICAgICAgICBuZXdDVE0uYSA9IG5ld0NUTS5kID0gdGhpcy5hY3RpdmVTdGF0ZS56b29tXG4gICAgICAgIHdpbGxab29tID0gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ2FjaGUobmV3Q1RNKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uWm9vbSh0aGlzLmdldFJlbGF0aXZlWm9vbSgpKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJlZm9yZSBwYW5cbiAgICBpZiAod2lsbFBhbikge1xuICAgICAgdmFyIHByZXZlbnRQYW4gPSB0aGlzLm9wdGlvbnMuYmVmb3JlUGFuKHRoaXMuZ2V0UGFuKCksIHt4OiBuZXdDVE0uZSwgeTogbmV3Q1RNLmZ9KVxuICAgICAgICAgIC8vIElmIHByZXZlbnQgcGFuIGlzIGFuIG9iamVjdFxuICAgICAgICAsIHByZXZlbnRQYW5YID0gZmFsc2VcbiAgICAgICAgLCBwcmV2ZW50UGFuWSA9IGZhbHNlXG5cbiAgICAgIC8vIElmIHByZXZlbnQgcGFuIGlzIEJvb2xlYW4gZmFsc2VcbiAgICAgIGlmIChwcmV2ZW50UGFuID09PSBmYWxzZSkge1xuICAgICAgICAvLyBTZXQgeCBhbmQgeSBzYW1lIGFzIGJlZm9yZVxuICAgICAgICBuZXdDVE0uZSA9IHRoaXMuZ2V0UGFuKCkueFxuICAgICAgICBuZXdDVE0uZiA9IHRoaXMuZ2V0UGFuKCkueVxuXG4gICAgICAgIHByZXZlbnRQYW5YID0gcHJldmVudFBhblkgPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzT2JqZWN0KHByZXZlbnRQYW4pKSB7XG4gICAgICAgIC8vIENoZWNrIGZvciBYIGF4ZXMgYXR0cmlidXRlXG4gICAgICAgIGlmIChwcmV2ZW50UGFuLnggPT09IGZhbHNlKSB7XG4gICAgICAgICAgLy8gUHJldmVudCBwYW5uaW5nIG9uIHggYXhlc1xuICAgICAgICAgIG5ld0NUTS5lID0gdGhpcy5nZXRQYW4oKS54XG4gICAgICAgICAgcHJldmVudFBhblggPSB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNOdW1iZXIocHJldmVudFBhbi54KSkge1xuICAgICAgICAgIC8vIFNldCBhIGN1c3RvbSBwYW4gdmFsdWVcbiAgICAgICAgICBuZXdDVE0uZSA9IHByZXZlbnRQYW4ueFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIFkgYXhlcyBhdHRyaWJ1dGVcbiAgICAgICAgaWYgKHByZXZlbnRQYW4ueSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyBQcmV2ZW50IHBhbm5pbmcgb24geCBheGVzXG4gICAgICAgICAgbmV3Q1RNLmYgPSB0aGlzLmdldFBhbigpLnlcbiAgICAgICAgICBwcmV2ZW50UGFuWSA9IHRydWVcbiAgICAgICAgfSBlbHNlIGlmIChVdGlscy5pc051bWJlcihwcmV2ZW50UGFuLnkpKSB7XG4gICAgICAgICAgLy8gU2V0IGEgY3VzdG9tIHBhbiB2YWx1ZVxuICAgICAgICAgIG5ld0NUTS5mID0gcHJldmVudFBhbi55XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVXBkYXRlIHdpbGxQYW4gZmxhZ1xuICAgICAgLy8gQ2hlY2sgaWYgbmV3Q1RNIGlzIHN0aWxsIGRpZmZlcmVudFxuICAgICAgaWYgKChwcmV2ZW50UGFuWCAmJiBwcmV2ZW50UGFuWSkgfHwgIXRoaXMuaXNQYW5EaWZmZXJlbnQobmV3Q1RNKSkge1xuICAgICAgICB3aWxsUGFuID0gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ2FjaGUobmV3Q1RNKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uUGFuKHRoaXMuZ2V0UGFuKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGFnYWluIGlmIHNob3VsZCB6b29tIG9yIHBhblxuICAgIGlmICh3aWxsWm9vbSB8fCB3aWxsUGFuKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNUTU9uTmV4dEZyYW1lKClcbiAgICB9XG4gIH1cbn1cblxuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLmlzWm9vbURpZmZlcmVudCA9IGZ1bmN0aW9uKG5ld0NUTSkge1xuICByZXR1cm4gdGhpcy5hY3RpdmVTdGF0ZS56b29tICE9PSBuZXdDVE0uYVxufVxuXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuaXNQYW5EaWZmZXJlbnQgPSBmdW5jdGlvbihuZXdDVE0pIHtcbiAgcmV0dXJuIHRoaXMuYWN0aXZlU3RhdGUueCAhPT0gbmV3Q1RNLmUgfHwgdGhpcy5hY3RpdmVTdGF0ZS55ICE9PSBuZXdDVE0uZlxufVxuXG5cbi8qKlxuICogVXBkYXRlIGNhY2hlZCBDVE0gYW5kIGFjdGl2ZSBzdGF0ZVxuICpcbiAqIEBwYXJhbSB7U1ZHTWF0cml4fSBuZXdDVE1cbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLnVwZGF0ZUNhY2hlID0gZnVuY3Rpb24obmV3Q1RNKSB7XG4gIHRoaXMuYWN0aXZlU3RhdGUuem9vbSA9IG5ld0NUTS5hXG4gIHRoaXMuYWN0aXZlU3RhdGUueCA9IG5ld0NUTS5lXG4gIHRoaXMuYWN0aXZlU3RhdGUueSA9IG5ld0NUTS5mXG59XG5cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5wZW5kaW5nVXBkYXRlID0gZmFsc2VcblxuLyoqXG4gKiBQbGFjZSBhIHJlcXVlc3QgdG8gdXBkYXRlIENUTSBvbiBuZXh0IEZyYW1lXG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS51cGRhdGVDVE1Pbk5leHRGcmFtZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMucGVuZGluZ1VwZGF0ZSkge1xuICAgIC8vIExvY2tcbiAgICB0aGlzLnBlbmRpbmdVcGRhdGUgPSB0cnVlXG5cbiAgICAvLyBUaHJvdHRsZSBuZXh0IHVwZGF0ZVxuICAgIHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lLmNhbGwod2luZG93LCB0aGlzLnVwZGF0ZUNUTUNhY2hlZClcbiAgfVxufVxuXG4vKipcbiAqIFVwZGF0ZSB2aWV3cG9ydCBDVE0gd2l0aCBjYWNoZWQgQ1RNXG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS51cGRhdGVDVE0gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN0bSA9IHRoaXMuZ2V0Q1RNKClcblxuICAvLyBVcGRhdGVzIFNWRyBlbGVtZW50XG4gIFN2Z1V0aWxzLnNldENUTSh0aGlzLnZpZXdwb3J0LCBjdG0sIHRoaXMuZGVmcylcblxuICAvLyBGcmVlIHRoZSBsb2NrXG4gIHRoaXMucGVuZGluZ1VwZGF0ZSA9IGZhbHNlXG5cbiAgLy8gTm90aWZ5IGFib3V0IHRoZSB1cGRhdGVcbiAgaWYodGhpcy5vcHRpb25zLm9uVXBkYXRlZENUTSkge1xuICAgIHRoaXMub3B0aW9ucy5vblVwZGF0ZWRDVE0oY3RtKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmlld3BvcnQsIG9wdGlvbnMpe1xuICByZXR1cm4gbmV3IFNoYWRvd1ZpZXdwb3J0KHZpZXdwb3J0LCBvcHRpb25zKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3ZnLXBhbi16b29tL3NyYy9zaGFkb3ctdmlld3BvcnQuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==