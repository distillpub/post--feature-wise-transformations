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
                "r": 6
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
        "r": 6
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
        "r": 6
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
            "r": 6
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
            "r": 6
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmE2N2UwMjEyMzZhNWM0YTUzOGQiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvc3ZnLXV0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3ZnLXBhbi16b29tL3NyYy91dGlsaXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvYnJvd3NlcmlmeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvc3ZnLXBhbi16b29tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL3VuaXdoZWVsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL2NvbnRyb2wtaWNvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvc2hhZG93LXZpZXdwb3J0LmpzIl0sIm5hbWVzIjpbImQzIiwic2VsZWN0QWxsIiwib24iLCJzZWxlY3QiLCJhdHRyIiwic3R5bGUiLCJzeW1ib2xTcGFuIiwiaHRtbCIsIm1vZGUiLCJjb250ZW50VHlwZSIsInN2ZyIsImZlYXR1cmVzIiwiZmVhdHVyZU1hcHMiLCJnYW1tYXMiLCJiZXRhcyIsImRhdGEiLCJpIiwicHVzaCIsImZlYXR1cmUiLCJmZWF0dXJlTWFwIiwiZ2FtbWEiLCJiZXRhIiwiY29udkRhdGEiLCJrIiwiaiIsImQiLCJhbXBsaXR1ZGVTY2FsZSIsInNjYWxlU3FydCIsImRvbWFpbiIsInJhbmdlIiwiY2xhbXAiLCJtb3VzZVNjYWxlIiwic2NhbGVMaW5lYXIiLCJ1cGRhdGVTaW5nbGUiLCJzZWxlY3Rpb24iLCJhY2Nlc3NvciIsImVhY2giLCJyIiwicyIsIk1hdGgiLCJzaWduIiwiYWJzIiwidXBkYXRlU2luZ2xlQ29udiIsInVwZGF0ZSIsIm5ld1ZhbHVlIiwibW91c2UiLCJhbHBoYSIsImFscGhhX25vcm0iLCJ1cGRhdGVQYXRjaCIsImF0dGVudGlvbl9wb29sIiwibiIsInNldFVwIiwiZmlsZW5hbWUiLCJrZXl3b3JkIiwic2NhdHRlclBsb3QiLCJib3VuZGluZ0JveCIsImxlZ2VuZCIsInhNaW4iLCJwYXJzZUludCIsInhNYXgiLCJ5TWluIiwieU1heCIsImNvbG9ycyIsImRhdGFzZXQiLCJ4U2NhbGUiLCJ5U2NhbGUiLCJqc29uIiwibWluIiwibWF4IiwicmFuZ2VSb3VuZCIsImF0dHJzIiwiZW50ZXIiLCJhcHBlbmQiLCJjIiwiZmlsdGVyIiwiZmVhdHVyZV9tYXAiLCJmb2N1c0FsbCIsImZvY3VzIiwicHJvY2Vzc0V4YW1wbGUiLCJzdHlsZVNlbGVjdDEiLCJzdHlsZVNlbGVjdDIiLCJjb250ZW50U2VsZWN0IiwiaW50ZXJwb2xhdGlvbkltYWdlcyIsInNlbGVjdGVkSW1hZ2VzIiwidXBkYXRlSW1hZ2VzIiwiY29udGVudCIsInN0eWxlMSIsInN0eWxlMiIsImhyZWYiLCJ1cGRhdGVTdHlsZSIsImtleSIsImV4YW1wbGUiLCJpbWFnZVNlbGVjdG9yIiwiblRpY2tzIiwibGVuZ3RoIiwidGlja3MiLCJjaXJjbGUiLCJjbGFzc2VkIiwiZHJhZyIsIm5ld1giLCJldmVudCIsIngiLCJuZXdUaWNrIiwicm91bmQiLCJjb2xvciIsInRvb2x0aXAiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJxdWVzdGlvbiIsImpvaW4iLCJwYWdlWCIsInBhZ2VZIiwicXVlc3Rpb25fd29yZHMiLCJ0ZXh0IiwiZmlyc3RQbG90Iiwic2Vjb25kUGxvdCIsIndvcmQiLCJpbmRleE9mIiwicXVlc3Rpb25fdHlwZXMiLCJxdWVzdGlvbl90eXBlX21hcHBpbmciLCJ0eXBlIiwic2xpY2UiLCJsYXllcl9hbGwiLCJ5IiwicXVlc3Rpb25fdHlwZSIsImZvY3VzVHlwZSIsInN2Z1Bhblpvb20iLCJyZXF1aXJlIiwicGFuWm9vbSIsInZpZXdwb3J0U2VsZWN0b3IiLCJ6b29tRW5hYmxlZCIsImZpdCIsImNlbnRlciIsIm1pblpvb20iLCJjb250cm9sSWNvbnNFbmFibGVkIiwiem9vbUF0UG9pbnRCeSIsInJlc2V0Wm9vbSIsInJlc2V0UGFuIiwiYXJ0aXN0cyIsInBvaW50cyIsImFydGlzdF9pbmRleCIsInVybCIsIk9iamVjdCIsImtleXMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxjQUFjO0FBQzVCLGNBQWMsT0FBTyxNQUFNO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsY0FBYztBQUM1QixjQUFjLFdBQVc7QUFDekI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxRQUFRO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSwyRUFBMkU7O0FBRTNFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLFlBQVksTUFBTTtBQUNsQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCLFlBQVksZ0JBQWdCO0FBQzVCLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE1BQU07QUFDbEIsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0NBQWdDLHVCQUF1QjtBQUN2RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU8sUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU8sUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU8sRUFBRTtBQUNyQjtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxp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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwiZmlsZSI6ImluZGV4LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGZhNjdlMDIxMjM2YTVjNGE1MzhkIiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMnKVxuICAsIF9icm93c2VyID0gJ3Vua25vd24nXG4gIDtcblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85ODQ3NTgwL2hvdy10by1kZXRlY3Qtc2FmYXJpLWNocm9tZS1pZS1maXJlZm94LWFuZC1vcGVyYS1icm93c2VyXG5pZiAoLypAY2Nfb24hQCovZmFsc2UgfHwgISFkb2N1bWVudC5kb2N1bWVudE1vZGUpIHsgLy8gaW50ZXJuZXQgZXhwbG9yZXJcbiAgX2Jyb3dzZXIgPSAnaWUnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3ZnTlM6ICAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnXG4sIHhtbE5TOiAgJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSdcbiwgeG1sbnNOUzogICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLydcbiwgeGxpbmtOUzogICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJ1xuLCBldk5TOiAgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEveG1sLWV2ZW50cydcblxuICAvKipcbiAgICogR2V0IHN2ZyBkaW1lbnNpb25zOiB3aWR0aCBhbmQgaGVpZ2h0XG4gICAqXG4gICAqIEBwYXJhbSAge1NWR1NWR0VsZW1lbnR9IHN2Z1xuICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICB7d2lkdGg6IDAsIGhlaWdodDogMH1cbiAgICovXG4sIGdldEJvdW5kaW5nQ2xpZW50UmVjdE5vcm1hbGl6ZWQ6IGZ1bmN0aW9uKHN2Zykge1xuICAgIGlmIChzdmcuY2xpZW50V2lkdGggJiYgc3ZnLmNsaWVudEhlaWdodCkge1xuICAgICAgcmV0dXJuIHt3aWR0aDogc3ZnLmNsaWVudFdpZHRoLCBoZWlnaHQ6IHN2Zy5jbGllbnRIZWlnaHR9XG4gICAgfSBlbHNlIGlmICghIXN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSkge1xuICAgICAgcmV0dXJuIHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZ2V0IEJvdW5kaW5nQ2xpZW50UmVjdCBmb3IgU1ZHLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGcgZWxlbWVudCB3aXRoIGNsYXNzIG9mIFwidmlld3BvcnRcIiBvciBjcmVhdGVzIGl0IGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICpcbiAgICogQHBhcmFtICB7U1ZHU1ZHRWxlbWVudH0gc3ZnXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9ICAgICBnIChncm91cCkgZWxlbWVudFxuICAgKi9cbiwgZ2V0T3JDcmVhdGVWaWV3cG9ydDogZnVuY3Rpb24oc3ZnLCBzZWxlY3Rvcikge1xuICAgIHZhciB2aWV3cG9ydCA9IG51bGxcblxuICAgIGlmIChVdGlscy5pc0VsZW1lbnQoc2VsZWN0b3IpKSB7XG4gICAgICB2aWV3cG9ydCA9IHNlbGVjdG9yXG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXdwb3J0ID0gc3ZnLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMganVzdCBvbmUgbWFpbiBncm91cCBpbiBTVkdcbiAgICBpZiAoIXZpZXdwb3J0KSB7XG4gICAgICB2YXIgY2hpbGROb2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHN2Zy5jaGlsZE5vZGVzIHx8IHN2Zy5jaGlsZHJlbikuZmlsdGVyKGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgcmV0dXJuIGVsLm5vZGVOYW1lICE9PSAnZGVmcycgJiYgZWwubm9kZU5hbWUgIT09ICcjdGV4dCdcbiAgICAgIH0pXG5cbiAgICAgIC8vIE5vZGUgbmFtZSBzaG91bGQgYmUgU1ZHR0VsZW1lbnQgYW5kIHNob3VsZCBoYXZlIG5vIHRyYW5zZm9ybSBhdHRyaWJ1dGVcbiAgICAgIC8vIEdyb3VwcyB3aXRoIHRyYW5zZm9ybSBhcmUgbm90IHVzZWQgYXMgdmlld3BvcnQgYmVjYXVzZSBpdCBpbnZvbHZlcyBwYXJzaW5nIG9mIGFsbCB0cmFuc2Zvcm0gcG9zc2liaWxpdGllc1xuICAgICAgaWYgKGNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIGNoaWxkTm9kZXNbMF0ubm9kZU5hbWUgPT09ICdnJyAmJiBjaGlsZE5vZGVzWzBdLmdldEF0dHJpYnV0ZSgndHJhbnNmb3JtJykgPT09IG51bGwpIHtcbiAgICAgICAgdmlld3BvcnQgPSBjaGlsZE5vZGVzWzBdXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gZmF2b3JhYmxlIGdyb3VwIGVsZW1lbnQgZXhpc3RzIHRoZW4gY3JlYXRlIG9uZVxuICAgIGlmICghdmlld3BvcnQpIHtcbiAgICAgIHZhciB2aWV3cG9ydElkID0gJ3ZpZXdwb3J0LScgKyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICAgIHZpZXdwb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuc3ZnTlMsICdnJyk7XG4gICAgICB2aWV3cG9ydC5zZXRBdHRyaWJ1dGUoJ2lkJywgdmlld3BvcnRJZCk7XG5cbiAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyIChhbGwgdmVyc2lvbnM/KSBjYW4ndCB1c2UgY2hpbGROb2RlcywgYnV0IG90aGVyIGJyb3dzZXJzIHByZWZlciAocmVxdWlyZT8pIHVzaW5nIGNoaWxkTm9kZXNcbiAgICAgIHZhciBzdmdDaGlsZHJlbiA9IHN2Zy5jaGlsZE5vZGVzIHx8IHN2Zy5jaGlsZHJlbjtcbiAgICAgIGlmICghIXN2Z0NoaWxkcmVuICYmIHN2Z0NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IHN2Z0NoaWxkcmVuLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIC8vIE1vdmUgZXZlcnl0aGluZyBpbnRvIHZpZXdwb3J0IGV4Y2VwdCBkZWZzXG4gICAgICAgICAgaWYgKHN2Z0NoaWxkcmVuW3N2Z0NoaWxkcmVuLmxlbmd0aCAtIGldLm5vZGVOYW1lICE9PSAnZGVmcycpIHtcbiAgICAgICAgICAgIHZpZXdwb3J0LmFwcGVuZENoaWxkKHN2Z0NoaWxkcmVuW3N2Z0NoaWxkcmVuLmxlbmd0aCAtIGldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN2Zy5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG4gICAgfVxuXG4gICAgLy8gUGFyc2UgY2xhc3MgbmFtZXNcbiAgICB2YXIgY2xhc3NOYW1lcyA9IFtdO1xuICAgIGlmICh2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykpIHtcbiAgICAgIGNsYXNzTmFtZXMgPSB2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykuc3BsaXQoJyAnKVxuICAgIH1cblxuICAgIC8vIFNldCBjbGFzcyAoaWYgbm90IHNldCBhbHJlYWR5KVxuICAgIGlmICghfmNsYXNzTmFtZXMuaW5kZXhPZignc3ZnLXBhbi16b29tX3ZpZXdwb3J0JykpIHtcbiAgICAgIGNsYXNzTmFtZXMucHVzaCgnc3ZnLXBhbi16b29tX3ZpZXdwb3J0JylcbiAgICAgIHZpZXdwb3J0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc05hbWVzLmpvaW4oJyAnKSlcbiAgICB9XG5cbiAgICByZXR1cm4gdmlld3BvcnRcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgU1ZHIGF0dHJpYnV0ZXNcbiAgICpcbiAgICogQHBhcmFtICB7U1ZHU1ZHRWxlbWVudH0gc3ZnXG4gICAqL1xuICAsIHNldHVwU3ZnQXR0cmlidXRlczogZnVuY3Rpb24oc3ZnKSB7XG4gICAgLy8gU2V0dGluZyBkZWZhdWx0IGF0dHJpYnV0ZXNcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxucycsIHRoaXMuc3ZnTlMpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyh0aGlzLnhtbG5zTlMsICd4bWxuczp4bGluaycsIHRoaXMueGxpbmtOUyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKHRoaXMueG1sbnNOUywgJ3htbG5zOmV2JywgdGhpcy5ldk5TKTtcblxuICAgIC8vIE5lZWRlZCBmb3IgSW50ZXJuZXQgRXhwbG9yZXIsIG90aGVyd2lzZSB0aGUgdmlld3BvcnQgb3ZlcmZsb3dzXG4gICAgaWYgKHN2Zy5wYXJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICB2YXIgc3R5bGUgPSBzdmcuZ2V0QXR0cmlidXRlKCdzdHlsZScpIHx8ICcnO1xuICAgICAgaWYgKHN0eWxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignb3ZlcmZsb3cnKSA9PT0gLTEpIHtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnb3ZlcmZsb3c6IGhpZGRlbjsgJyArIHN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuLyoqXG4gKiBIb3cgbG9uZyBJbnRlcm5ldCBFeHBsb3JlciB0YWtlcyB0byBmaW5pc2ggdXBkYXRpbmcgaXRzIGRpc3BsYXkgKG1zKS5cbiAqL1xuLCBpbnRlcm5ldEV4cGxvcmVyUmVkaXNwbGF5SW50ZXJ2YWw6IDMwMFxuXG4vKipcbiAqIEZvcmNlcyB0aGUgYnJvd3NlciB0byByZWRpc3BsYXkgYWxsIFNWRyBlbGVtZW50cyB0aGF0IHJlbHkgb24gYW5cbiAqIGVsZW1lbnQgZGVmaW5lZCBpbiBhICdkZWZzJyBzZWN0aW9uLiBJdCB3b3JrcyBnbG9iYWxseSwgZm9yIGV2ZXJ5XG4gKiBhdmFpbGFibGUgZGVmcyBlbGVtZW50IG9uIHRoZSBwYWdlLlxuICogVGhlIHRocm90dGxpbmcgaXMgaW50ZW50aW9uYWxseSBnbG9iYWwuXG4gKlxuICogVGhpcyBpcyBvbmx5IG5lZWRlZCBmb3IgSUUuIEl0IGlzIGFzIGEgaGFjayB0byBtYWtlIG1hcmtlcnMgKGFuZCAndXNlJyBlbGVtZW50cz8pXG4gKiB2aXNpYmxlIGFmdGVyIHBhbi96b29tIHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIFNWR3Mgb24gdGhlIHBhZ2UuXG4gKiBTZWUgYnVnIHJlcG9ydDogaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy83ODE5NjQvXG4gKiBhbHNvIHNlZSBzdmctcGFuLXpvb20gaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hcml1dHRhL3N2Zy1wYW4tem9vbS9pc3N1ZXMvNjJcbiAqL1xuLCByZWZyZXNoRGVmc0dsb2JhbDogVXRpbHMudGhyb3R0bGUoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFsbERlZnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdkZWZzJyk7XG4gICAgdmFyIGFsbERlZnNDb3VudCA9IGFsbERlZnMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsRGVmc0NvdW50OyBpKyspIHtcbiAgICAgIHZhciB0aGlzRGVmcyA9IGFsbERlZnNbaV07XG4gICAgICB0aGlzRGVmcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzRGVmcywgdGhpc0RlZnMpO1xuICAgIH1cbiAgfSwgdGhpcyA/IHRoaXMuaW50ZXJuZXRFeHBsb3JlclJlZGlzcGxheUludGVydmFsIDogbnVsbClcblxuICAvKipcbiAgICogU2V0cyB0aGUgY3VycmVudCB0cmFuc2Zvcm0gbWF0cml4IG9mIGFuIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtTVkdFbGVtZW50fSBlbGVtZW50XG4gICAqIEBwYXJhbSB7U1ZHTWF0cml4fSBtYXRyaXggIENUTVxuICAgKiBAcGFyYW0ge1NWR0VsZW1lbnR9IGRlZnNcbiAgICovXG4sIHNldENUTTogZnVuY3Rpb24oZWxlbWVudCwgbWF0cml4LCBkZWZzKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAsIHMgPSAnbWF0cml4KCcgKyBtYXRyaXguYSArICcsJyArIG1hdHJpeC5iICsgJywnICsgbWF0cml4LmMgKyAnLCcgKyBtYXRyaXguZCArICcsJyArIG1hdHJpeC5lICsgJywnICsgbWF0cml4LmYgKyAnKSc7XG5cbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBzKTtcbiAgICBpZiAoJ3RyYW5zZm9ybScgaW4gZWxlbWVudC5zdHlsZSkge1xuICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBzO1xuICAgIH0gZWxzZSBpZiAoJy1tcy10cmFuc2Zvcm0nIGluIGVsZW1lbnQuc3R5bGUpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGVbJy1tcy10cmFuc2Zvcm0nXSA9IHM7XG4gICAgfSBlbHNlIGlmICgnLXdlYmtpdC10cmFuc2Zvcm0nIGluIGVsZW1lbnQuc3R5bGUpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtJ10gPSBzO1xuICAgIH1cblxuICAgIC8vIElFIGhhcyBhIGJ1ZyB0aGF0IG1ha2VzIG1hcmtlcnMgZGlzYXBwZWFyIG9uIHpvb20gKHdoZW4gdGhlIG1hdHJpeCBcImFcIiBhbmQvb3IgXCJkXCIgZWxlbWVudHMgY2hhbmdlKVxuICAgIC8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NjU0NTc4L3N2Zy1tYXJrZXItZG9lcy1ub3Qtd29yay1pbi1pZTktMTBcbiAgICAvLyBhbmQgaHR0cDovL3NybmRvbGhhLndvcmRwcmVzcy5jb20vMjAxMy8xMS8yNS9zdmctbGluZS1tYXJrZXJzLW1heS1kaXNhcHBlYXItaW4taW50ZXJuZXQtZXhwbG9yZXItMTEvXG4gICAgaWYgKF9icm93c2VyID09PSAnaWUnICYmICEhZGVmcykge1xuICAgICAgLy8gdGhpcyByZWZyZXNoIGlzIGludGVuZGVkIGZvciByZWRpc3BsYXlpbmcgdGhlIFNWRyBkdXJpbmcgem9vbWluZ1xuICAgICAgZGVmcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkZWZzLCBkZWZzKTtcbiAgICAgIC8vIHRoaXMgcmVmcmVzaCBpcyBpbnRlbmRlZCBmb3IgcmVkaXNwbGF5aW5nIHRoZSBvdGhlciBTVkdzIG9uIGEgcGFnZSB3aGVuIHBhbm5pbmcgYSBnaXZlbiBTVkdcbiAgICAgIC8vIGl0IGlzIGFsc28gbmVlZGVkIGZvciB0aGUgZ2l2ZW4gU1ZHIGl0c2VsZiwgb24gem9vbUVuZCwgaWYgdGhlIFNWRyBjb250YWlucyBhbnkgbWFya2VycyB0aGF0XG4gICAgICAvLyBhcmUgbG9jYXRlZCB1bmRlciBhbnkgb3RoZXIgZWxlbWVudChzKS5cbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGF0LnJlZnJlc2hEZWZzR2xvYmFsKCk7XG4gICAgICB9LCB0aGF0LmludGVybmV0RXhwbG9yZXJSZWRpc3BsYXlJbnRlcnZhbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIGFuIFNWR1BvaW50IG9iamVjdCB3aXRoIGdpdmVuIGV2ZW50IGNvb3JkaW5hdGVzXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxuICAgKiBAcGFyYW0gIHtTVkdTVkdFbGVtZW50fSBzdmdcbiAgICogQHJldHVybiB7U1ZHUG9pbnR9ICAgICBwb2ludFxuICAgKi9cbiwgZ2V0RXZlbnRQb2ludDogZnVuY3Rpb24oZXZ0LCBzdmcpIHtcbiAgICB2YXIgcG9pbnQgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKVxuXG4gICAgVXRpbHMubW91c2VBbmRUb3VjaE5vcm1hbGl6ZShldnQsIHN2ZylcblxuICAgIHBvaW50LnggPSBldnQuY2xpZW50WFxuICAgIHBvaW50LnkgPSBldnQuY2xpZW50WVxuXG4gICAgcmV0dXJuIHBvaW50XG4gIH1cblxuICAvKipcbiAgICogR2V0IFNWRyBjZW50ZXIgcG9pbnRcbiAgICpcbiAgICogQHBhcmFtICB7U1ZHU1ZHRWxlbWVudH0gc3ZnXG4gICAqIEByZXR1cm4ge1NWR1BvaW50fVxuICAgKi9cbiwgZ2V0U3ZnQ2VudGVyUG9pbnQ6IGZ1bmN0aW9uKHN2Zywgd2lkdGgsIGhlaWdodCkge1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZVNWR1BvaW50KHN2Zywgd2lkdGggLyAyLCBoZWlnaHQgLyAyKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWR1BvaW50IHdpdGggZ2l2ZW4geCBhbmQgeVxuICAgKlxuICAgKiBAcGFyYW0gIHtTVkdTVkdFbGVtZW50fSBzdmdcbiAgICogQHBhcmFtICB7TnVtYmVyfSB4XG4gICAqIEBwYXJhbSAge051bWJlcn0geVxuICAgKiBAcmV0dXJuIHtTVkdQb2ludH1cbiAgICovXG4sIGNyZWF0ZVNWR1BvaW50OiBmdW5jdGlvbihzdmcsIHgsIHkpIHtcbiAgICB2YXIgcG9pbnQgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKVxuICAgIHBvaW50LnggPSB4XG4gICAgcG9pbnQueSA9IHlcblxuICAgIHJldHVybiBwb2ludFxuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL3N2Zy11dGlsaXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBFeHRlbmRzIGFuIG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldCBvYmplY3QgdG8gZXh0ZW5kXG4gICAqIEBwYXJhbSAge09iamVjdH0gc291cmNlIG9iamVjdCB0byB0YWtlIHByb3BlcnRpZXMgZnJvbVxuICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICBleHRlbmRlZCBvYmplY3RcbiAgICovXG4gIGV4dGVuZDogZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICB0YXJnZXQgPSB0YXJnZXQgfHwge307XG4gICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgIC8vIEdvIHJlY3Vyc2l2ZWx5XG4gICAgICBpZiAodGhpcy5pc09iamVjdChzb3VyY2VbcHJvcF0pKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHRoaXMuZXh0ZW5kKHRhcmdldFtwcm9wXSwgc291cmNlW3Byb3BdKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gc291cmNlW3Byb3BdXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGFuIG9iamVjdCBpcyBhIERPTSBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gIG8gSFRNTCBlbGVtZW50IG9yIFN0cmluZ1xuICAgKiBAcmV0dXJuIHtCb29sZWFufSAgIHJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgYSBET00gZWxlbWVudFxuICAgKi9cbiwgaXNFbGVtZW50OiBmdW5jdGlvbihvKXtcbiAgICByZXR1cm4gKFxuICAgICAgbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IG8gaW5zdGFuY2VvZiBTVkdFbGVtZW50IHx8IG8gaW5zdGFuY2VvZiBTVkdTVkdFbGVtZW50IHx8IC8vRE9NMlxuICAgICAgKG8gJiYgdHlwZW9mIG8gPT09ICdvYmplY3QnICYmIG8gIT09IG51bGwgJiYgby5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygby5ub2RlTmFtZSA9PT0gJ3N0cmluZycpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYW4gb2JqZWN0IGlzIGFuIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBvIE9iamVjdFxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAgIHJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgYW4gT2JqZWN0XG4gICAqL1xuLCBpc09iamVjdDogZnVuY3Rpb24obyl7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHZhcmlhYmxlIGlzIE51bWJlclxuICAgKlxuICAgKiBAcGFyYW0gIHtJbnRlZ2VyfEZsb2F0fSAgblxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAgIHJldHVybnMgdHJ1ZSBpZiB2YXJpYWJsZSBpcyBOdW1iZXJcbiAgICovXG4sIGlzTnVtYmVyOiBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2ggZm9yIGFuIFNWRyBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdHxTdHJpbmd9IGVsZW1lbnRPclNlbGVjdG9yIERPTSBFbGVtZW50IG9yIHNlbGVjdG9yIFN0cmluZ1xuICAgKiBAcmV0dXJuIHtPYmplY3R8TnVsbH0gICAgICAgICAgICAgICAgICAgU1ZHIG9yIG51bGxcbiAgICovXG4sIGdldFN2ZzogZnVuY3Rpb24oZWxlbWVudE9yU2VsZWN0b3IpIHtcbiAgICB2YXIgZWxlbWVudFxuICAgICAgLCBzdmc7XG5cbiAgICBpZiAoIXRoaXMuaXNFbGVtZW50KGVsZW1lbnRPclNlbGVjdG9yKSkge1xuICAgICAgLy8gSWYgc2VsZWN0b3IgcHJvdmlkZWRcbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudE9yU2VsZWN0b3IgPT09ICdzdHJpbmcnIHx8IGVsZW1lbnRPclNlbGVjdG9yIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIHRoZSBlbGVtZW50XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRPclNlbGVjdG9yKVxuXG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZWQgc2VsZWN0b3IgZGlkIG5vdCBmaW5kIGFueSBlbGVtZW50cy4gU2VsZWN0b3I6ICcgKyBlbGVtZW50T3JTZWxlY3RvcilcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3ZpZGVkIHNlbGVjdG9yIGlzIG5vdCBhbiBIVE1MIG9iamVjdCBub3IgU3RyaW5nJylcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnRPclNlbGVjdG9yXG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ZnJykge1xuICAgICAgc3ZnID0gZWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnb2JqZWN0Jykge1xuICAgICAgICBzdmcgPSBlbGVtZW50LmNvbnRlbnREb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdlbWJlZCcpIHtcbiAgICAgICAgICBzdmcgPSBlbGVtZW50LmdldFNWR0RvY3VtZW50KCkuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2ltZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNjcmlwdCBhbiBTVkcgaW4gYW4gXCJpbWdcIiBlbGVtZW50LiBQbGVhc2UgdXNlIGFuIFwib2JqZWN0XCIgZWxlbWVudCBvciBhbiBpbi1saW5lIFNWRy4nKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZ2V0IFNWRy4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdmdcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggYSBnaXZlbiBjb250ZXh0IHRvIGEgZnVuY3Rpb25cbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuICAgICAgRnVuY3Rpb25cbiAgICogQHBhcmFtICB7T2JqZWN0fSAgIGNvbnRleHQgQ29udGV4dFxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gICAgICAgICAgIEZ1bmN0aW9uIHdpdGggY2VydGFpbiBjb250ZXh0XG4gICAqL1xuLCBwcm94eTogZnVuY3Rpb24oZm4sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIG9iamVjdCB0eXBlXG4gICAqIFVzZXMgdG9TdHJpbmcgdGhhdCByZXR1cm5zIFtvYmplY3QgU1ZHUG9pbnRdXG4gICAqIEFuZCB0aGFuIHBhcnNlcyBvYmplY3QgdHlwZSBmcm9tIHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG8gQW55IG9iamVjdFxuICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgT2JqZWN0IHR5cGVcbiAgICovXG4sIGdldFR5cGU6IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShvKS5yZXBsYWNlKC9eXFxbb2JqZWN0XFxzLywgJycpLnJlcGxhY2UoL1xcXSQvLCAnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBpdCBpcyBhIHRvdWNoIGV2ZW50IHRoYW4gYWRkIGNsaWVudFggYW5kIGNsaWVudFkgdG8gZXZlbnQgb2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSAge0V2ZW50fSBldnRcbiAgICogQHBhcmFtICB7U1ZHU1ZHRWxlbWVudH0gc3ZnXG4gICAqL1xuLCBtb3VzZUFuZFRvdWNoTm9ybWFsaXplOiBmdW5jdGlvbihldnQsIHN2Zykge1xuICAgIC8vIElmIG5vIGNsaWVudFggdGhlbiBmYWxsYmFja1xuICAgIGlmIChldnQuY2xpZW50WCA9PT0gdm9pZCAwIHx8IGV2dC5jbGllbnRYID09PSBudWxsKSB7XG4gICAgICAvLyBGYWxsYmFja1xuICAgICAgZXZ0LmNsaWVudFggPSAwXG4gICAgICBldnQuY2xpZW50WSA9IDBcblxuICAgICAgLy8gSWYgaXQgaXMgYSB0b3VjaCBldmVudFxuICAgICAgaWYgKGV2dC50b3VjaGVzICE9PSB2b2lkIDAgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmIChldnQudG91Y2hlc1swXS5jbGllbnRYICE9PSB2b2lkIDApIHtcbiAgICAgICAgICBldnQuY2xpZW50WCA9IGV2dC50b3VjaGVzWzBdLmNsaWVudFhcbiAgICAgICAgICBldnQuY2xpZW50WSA9IGV2dC50b3VjaGVzWzBdLmNsaWVudFlcbiAgICAgICAgfSBlbHNlIGlmIChldnQudG91Y2hlc1swXS5wYWdlWCAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgdmFyIHJlY3QgPSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICBldnQuY2xpZW50WCA9IGV2dC50b3VjaGVzWzBdLnBhZ2VYIC0gcmVjdC5sZWZ0XG4gICAgICAgICAgZXZ0LmNsaWVudFkgPSBldnQudG91Y2hlc1swXS5wYWdlWSAtIHJlY3QudG9wXG4gICAgICAgIH1cbiAgICAgIC8vIElmIGl0IGlzIGEgY3VzdG9tIGV2ZW50XG4gICAgICB9IGVsc2UgaWYgKGV2dC5vcmlnaW5hbEV2ZW50ICE9PSB2b2lkIDApIHtcbiAgICAgICAgaWYgKGV2dC5vcmlnaW5hbEV2ZW50LmNsaWVudFggIT09IHZvaWQgMCkge1xuICAgICAgICAgIGV2dC5jbGllbnRYID0gZXZ0Lm9yaWdpbmFsRXZlbnQuY2xpZW50WFxuICAgICAgICAgIGV2dC5jbGllbnRZID0gZXZ0Lm9yaWdpbmFsRXZlbnQuY2xpZW50WVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGFuIGV2ZW50IGlzIGEgZG91YmxlIGNsaWNrL3RhcFxuICAgKiBUT0RPOiBGb3IgdG91Y2ggZ2VzdHVyZXMgdXNlIGEgbGlicmFyeSAoaGFtbWVyLmpzKSB0aGF0IHRha2VzIGluIGFjY291bnQgb3RoZXIgZXZlbnRzXG4gICAqICh0b3VjaG1vdmUgYW5kIHRvdWNoZW5kKS4gSXQgc2hvdWxkIHRha2UgaW4gYWNjb3VudCB0YXAgZHVyYXRpb24gYW5kIHRyYXZlbGVkIGRpc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSAge0V2ZW50fSAgZXZ0XG4gICAqIEBwYXJhbSAge0V2ZW50fSAgcHJldkV2dCBQcmV2aW91cyBFdmVudFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiwgaXNEYmxDbGljazogZnVuY3Rpb24oZXZ0LCBwcmV2RXZ0KSB7XG4gICAgLy8gRG91YmxlIGNsaWNrIGRldGVjdGVkIGJ5IGJyb3dzZXJcbiAgICBpZiAoZXZ0LmRldGFpbCA9PT0gMikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIFRyeSB0byBjb21wYXJlIGV2ZW50c1xuICAgIGVsc2UgaWYgKHByZXZFdnQgIT09IHZvaWQgMCAmJiBwcmV2RXZ0ICE9PSBudWxsKSB7XG4gICAgICB2YXIgdGltZVN0YW1wRGlmZiA9IGV2dC50aW1lU3RhbXAgLSBwcmV2RXZ0LnRpbWVTdGFtcCAvLyBzaG91bGQgYmUgbG93ZXIgdGhhbiAyNTAgbXNcbiAgICAgICAgLCB0b3VjaGVzRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coZXZ0LmNsaWVudFggLSBwcmV2RXZ0LmNsaWVudFgsIDIpICsgTWF0aC5wb3coZXZ0LmNsaWVudFkgLSBwcmV2RXZ0LmNsaWVudFksIDIpKVxuXG4gICAgICByZXR1cm4gdGltZVN0YW1wRGlmZiA8IDI1MCAmJiB0b3VjaGVzRGlzdGFuY2UgPCAxMFxuICAgIH1cblxuICAgIC8vIE5vdGhpbmcgZm91bmRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4sIG5vdzogRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbiAgLy8gRnJvbSB1bmRlcnNjb3JlLlxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4vLyBqc2NzOmRpc2FibGVcbi8vIGpzaGludCBpZ25vcmU6c3RhcnRcbiwgdGhyb3R0bGU6IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiB0aGF0Lm5vdygpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gdGhhdC5ub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9XG4vLyBqc2hpbnQgaWdub3JlOmVuZFxuLy8ganNjczplbmFibGVcblxuICAvKipcbiAgICogQ3JlYXRlIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHNpbXVsYXRpb25cbiAgICpcbiAgICogQHBhcmFtICB7TnVtYmVyfFN0cmluZ30gcmVmcmVzaFJhdGVcbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuLCBjcmVhdGVSZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IGZ1bmN0aW9uKHJlZnJlc2hSYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsXG5cbiAgICAvLyBDb252ZXJ0IHJlZnJlc2hSYXRlIHRvIHRpbWVvdXRcbiAgICBpZiAocmVmcmVzaFJhdGUgIT09ICdhdXRvJyAmJiByZWZyZXNoUmF0ZSA8IDYwICYmIHJlZnJlc2hSYXRlID4gMSkge1xuICAgICAgdGltZW91dCA9IE1hdGguZmxvb3IoMTAwMCAvIHJlZnJlc2hSYXRlKVxuICAgIH1cblxuICAgIGlmICh0aW1lb3V0ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCByZXF1ZXN0VGltZW91dCgzMylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlcXVlc3RUaW1lb3V0KHRpbWVvdXQpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgY2FsbGJhY2sgdGhhdCB3aWxsIGV4ZWN1dGUgYWZ0ZXIgYSBnaXZlbiB0aW1lb3V0XG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IHRpbWVvdXRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiByZXF1ZXN0VGltZW91dCh0aW1lb3V0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCB0aW1lb3V0KVxuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL3V0aWxpdGllcy5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgU3ZnUGFuWm9vbSA9IHJlcXVpcmUoJy4vc3ZnLXBhbi16b29tLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ZnUGFuWm9vbTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvYnJvd3NlcmlmeS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XG4gICAgZDMuc2VsZWN0QWxsKFwiLmNvbGxhcHNpYmxlXCIpXG4gICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZDMuc2VsZWN0QWxsKCcuY29udGVudFtjb250ZW50LW5hbWU9XCInICsgZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJjb250ZW50LW5hbWVcIikgKyAnXCJdJylcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZGlzcGxheVwiKSA9PT0gXCJibG9ja1wiID8gXCJub25lXCIgOiBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgc3ltYm9sU3BhbiA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3QoXCJzcGFuXCIpO1xuICAgICAgICAgICAgc3ltYm9sU3Bhbi5odG1sKHN5bWJvbFNwYW4uaHRtbCgpID09PSBcIitcIiA/IFwiLVwiIDogXCIrXCIpO1xuICAgICAgICB9KTtcbiAgICBkMy5zZWxlY3RBbGwoXCIuZXhwYW5kLWNvbGxhcHNlLWJ1dHRvblwiKVxuICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBtb2RlID0gZDMuc2VsZWN0KHRoaXMpLmh0bWwoKTtcbiAgICAgICAgICAgIHZhciBjb250ZW50VHlwZSA9IGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwiY29udGVudC10eXBlXCIpO1xuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmh0bWwobW9kZSA9PT0gXCJleHBhbmQgYWxsXCIgPyBcImNvbGxhcHNlIGFsbFwiIDogXCJleHBhbmQgYWxsXCIpO1xuICAgICAgICAgICAgZDMuc2VsZWN0QWxsKCcuY29udGVudFtjb250ZW50LXR5cGU9XCInICsgY29udGVudFR5cGUgKyAnXCJdJylcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9kZSA9PT0gXCJleHBhbmQgYWxsXCIgPyBcImJsb2NrXCIgOiBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQzLnNlbGVjdEFsbCgnLmNvbGxhcHNpYmxlW2NvbnRlbnQtdHlwZT1cIicgKyBjb250ZW50VHlwZSArICdcIl0nKS5zZWxlY3QoXCJzcGFuXCIpXG4gICAgICAgICAgICAgICAgLmh0bWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb2RlID09PSBcImV4cGFuZCBhbGxcIiA/IFwiLVwiIDogXCIrXCI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjZmlsbS1sYXllci1kaWFncmFtID4gc3ZnXCIpO1xuICAgIHZhciBmZWF0dXJlcyA9IFswLjksIC0wLjUsIC0wLjhdO1xuICAgIHZhciBmZWF0dXJlTWFwcyA9IFtcbiAgICAgICAgW1stMC42LCAtMC42LCAgMC44XSwgWyAwLjYsICAwLjcsICAwLjRdLCBbLTAuOCwgIDAuOCwgIDAuOV1dLFxuICAgICAgICBbWyAwLjksIC0wLjEsICAwLjVdLCBbLTAuOCwgLTAuNywgIDAuNV0sIFstMC4zLCAtMC45LCAtMC4yXV0sXG4gICAgICAgIFtbLTAuNSwgLTAuOSwgIDAuNl0sIFstMC4yLCAtMC40LCAgMC4yXSwgWy0wLjYsICAwLjEsIC0wLjNdXVxuICAgIF07XG4gICAgdmFyIGdhbW1hcyA9IFstMS42LCAwLjgsIDEuOF07XG4gICAgdmFyIGJldGFzID0gWzEuMCwgMC41LCAtMC41XTtcbiAgICB2YXIgZGF0YSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGRhdGEucHVzaCh7ZmVhdHVyZTogZmVhdHVyZXNbaV0sIGZlYXR1cmVNYXA6IFtdLCBnYW1tYTogZ2FtbWFzW2ldLCBiZXRhOiBiZXRhc1tpXX0pO1xuICAgIH1cbiAgICB2YXIgY29udkRhdGEgPSBbXTtcbiAgICBmb3IgKHZhciBrID0gMDsgayA8IDM7IGsrKykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHtmZWF0dXJlOiBmZWF0dXJlTWFwc1tpXVtqXVtrXSwgZ2FtbWE6IGdhbW1hc1trXSwgYmV0YTogYmV0YXNba119O1xuICAgICAgICAgICAgICAgIGNvbnZEYXRhLnB1c2goZCk7XG4gICAgICAgICAgICAgICAgZGF0YVsyIC0ga10uZmVhdHVyZU1hcC5wdXNoKGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBhbXBsaXR1ZGVTY2FsZSA9IGQzLnNjYWxlU3FydCgpLmRvbWFpbihbMC4wLCAyLjBdKS5yYW5nZShbMC4wLCAwLjhdKS5jbGFtcCh0cnVlKTtcbiAgICB2YXIgbW91c2VTY2FsZSA9IGQzLnNjYWxlTGluZWFyKCkuZG9tYWluKFswLjAsIDQwLjBdKS5yYW5nZShbMi4wLCAtMi4wXSkuY2xhbXAodHJ1ZSk7XG4gICAgc3ZnLnNlbGVjdChcImcjbWxwLWZpZ3VyZSBnI2lucHV0LWxheWVyXCIpLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5kYXRhKGRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI21scC1maWd1cmUgZyNnYW1tYVwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShkYXRhKTtcbiAgICBzdmcuc2VsZWN0KFwiZyNtbHAtZmlndXJlIGcjYmV0YVwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShkYXRhKTtcbiAgICBzdmcuc2VsZWN0KFwiZyNtbHAtZmlndXJlIGcjc2NhbGVkLWxheWVyXCIpLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5kYXRhKGRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI21scC1maWd1cmUgZyNzaGlmdGVkLWxheWVyXCIpLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5kYXRhKGRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUgZyNpbnB1dC1sYXllclwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShjb252RGF0YSk7XG4gICAgc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZSBnI3NjYWxlZC1sYXllclwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShjb252RGF0YSk7XG4gICAgc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZSBnI3NoaWZ0ZWQtbGF5ZXJcIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoY29udkRhdGEpO1xuXG5cbiAgICBmdW5jdGlvbiB1cGRhdGVTaW5nbGUoc2VsZWN0aW9uLCBhY2Nlc3Nvcikge1xuICAgICAgICBzZWxlY3Rpb24uc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmVhY2goZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgIHZhciByID0gYWNjZXNzb3IoZCk7XG4gICAgICAgICAgICB2YXIgcyA9IE1hdGguc2lnbihyKSAqIGFtcGxpdHVkZVNjYWxlKE1hdGguYWJzKHIpKTtcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAuc2VsZWN0KFwiLnZlY3Rvci1wYXRjaFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwib3BhY2l0eVwiLCBNYXRoLmFicyhzKSlcbiAgICAgICAgICAgICAgICAuYXR0cihcImhyZWZcIiwgciA8IDAgPyBcIiN2ZWN0b3ItcGF0Y2gtbmVnYXRpdmVcIiA6IFwiI3ZlY3Rvci1wYXRjaC1wb3NpdGl2ZVwiKTtcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAuc2VsZWN0KFwiLmZpZ3VyZS1saW5lXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJtYXRyaXgoXCIgKyBbcywgMCwgMCwgcywgMjAsIDIwXSArIFwiKVwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNpbmdsZUNvbnYoc2VsZWN0aW9uLCBhY2Nlc3Nvcikge1xuICAgICAgICBzZWxlY3Rpb24uc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmVhY2goZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgIHZhciByID0gYWNjZXNzb3IoZCk7XG4gICAgICAgICAgICB2YXIgcyA9IE1hdGguc2lnbihyKSAqIGFtcGxpdHVkZVNjYWxlKE1hdGguYWJzKHIpKTtcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAuc2VsZWN0KFwiLmNvbnZvbHV0aW9uYWwtcGF0Y2hcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcIm9wYWNpdHlcIiwgTWF0aC5hYnMocykpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJocmVmXCIsIHIgPCAwID8gIFwiI2NvbnZvbHV0aW9uYWwtcGF0Y2gtbmVnYXRpdmVcIiA6IFwiI2NvbnZvbHV0aW9uYWwtcGF0Y2gtcG9zaXRpdmVcIik7XG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgLnNlbGVjdChcIi52ZWN0b3ItcGF0Y2hcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcIm9wYWNpdHlcIiwgTWF0aC5hYnMocykpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJocmVmXCIsIHIgPCAwID8gIFwiI3ZlY3Rvci1wYXRjaC1uZWdhdGl2ZVwiIDogXCIjdmVjdG9yLXBhdGNoLXBvc2l0aXZlXCIpO1xuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAgIC5zZWxlY3QoXCIuZmlndXJlLWxpbmVcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcIm1hdHJpeChcIiArIFtzLCAwLCAwLCBzLCAxNSwgMTVdICsgXCIpXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICB1cGRhdGVTaW5nbGUoc3ZnLnNlbGVjdChcImcjbWxwLWZpZ3VyZSBnI2lucHV0LWxheWVyXCIpLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmZlYXR1cmU7IH0pO1xuICAgICAgICB1cGRhdGVTaW5nbGUoc3ZnLnNlbGVjdChcImcjbWxwLWZpZ3VyZSBnI2dhbW1hXCIpLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdhbW1hOyB9KTtcbiAgICAgICAgdXBkYXRlU2luZ2xlKHN2Zy5zZWxlY3QoXCJnI21scC1maWd1cmUgZyNiZXRhXCIpLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmJldGE7IH0pO1xuICAgICAgICB1cGRhdGVTaW5nbGUoc3ZnLnNlbGVjdChcImcjbWxwLWZpZ3VyZSBnI3NjYWxlZC1sYXllclwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nYW1tYSAqIGQuZmVhdHVyZTsgfSk7XG4gICAgICAgIHVwZGF0ZVNpbmdsZShzdmcuc2VsZWN0KFwiZyNtbHAtZmlndXJlIGcjc2hpZnRlZC1sYXllclwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nYW1tYSAqIGQuZmVhdHVyZSArIGQuYmV0YTsgfSk7XG4gICAgICAgIHVwZGF0ZVNpbmdsZUNvbnYoc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZSBnI2lucHV0LWxheWVyXCIpLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmZlYXR1cmU7IH0pO1xuICAgICAgICB1cGRhdGVTaW5nbGVDb252KHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUgZyNzY2FsZWQtbGF5ZXJcIiksIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2FtbWEgKiBkLmZlYXR1cmU7IH0pO1xuICAgICAgICB1cGRhdGVTaW5nbGVDb252KHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUgZyNzaGlmdGVkLWxheWVyXCIpLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdhbW1hICogZC5mZWF0dXJlICsgZC5iZXRhOyB9KTtcbiAgICB9XG4gICAgdXBkYXRlKCk7XG4gICAgc3ZnLnNlbGVjdChcImcjbWxwLWZpZ3VyZSBnI2dhbW1hXCIpXG4gICAgICAuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpXG4gICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBtb3VzZVNjYWxlKGQzLm1vdXNlKHRoaXMpWzFdKTtcbiAgICAgICAgICAgIGQuZ2FtbWEgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgOTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZC5mZWF0dXJlTWFwW2ldLmdhbW1hID0gbmV3VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgc3ZnLnNlbGVjdChcImcjbWxwLWZpZ3VyZSBnI2JldGFcIilcbiAgICAgIC5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIilcbiAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IG1vdXNlU2NhbGUoZDMubW91c2UodGhpcylbMV0pO1xuICAgICAgICAgICAgZC5iZXRhID0gbmV3VmFsdWU7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDk7IGkrKykge1xuICAgICAgICAgICAgICAgIGQuZmVhdHVyZU1hcFtpXS5iZXRhID0gbmV3VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgfSk7XG59KSgpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNmaWxtLXZzLWF0dGVudGlvbi1kaWFncmFtID4gc3ZnXCIpO1xuICAgIHZhciBmZWF0dXJlTWFwcyA9IFtcbiAgICAgICAgW1stMC42LCAtMC42LCAgMC44XSwgWyAwLjYsICAwLjcsICAwLjRdLCBbLTAuOCwgIDAuOCwgIDAuOV1dLFxuICAgICAgICBbWyAwLjksIC0wLjEsICAwLjVdLCBbLTAuOCwgLTAuNywgIDAuNV0sIFstMC4zLCAtMC45LCAtMC4yXV0sXG4gICAgICAgIFtbMC44LCAtMC45LCAgMC42XSwgWy0wLjIsIC0wLjQsICAwLjJdLCBbLTAuNiwgIDAuMSwgLTAuM11dXG4gICAgXTtcblxuICAgIHZhciBnYW1tYXMgPSBbLTEuNiwgMC44LCAxLjhdO1xuICAgIHZhciBiZXRhcyA9IFsxLjAsIDAuNSwgLTAuNV07XG5cbiAgICAvLyBOb3RlIEFscGhhIG11c3QgYmUgcG9zaXRpZlxuICAgIHZhciBhbHBoYSA9IFtbMC42LCAxLjcsIDFdLCBbMC41LCA0LCAxMF0sIFswLjgsIDMsIDddXTtcbiAgICB2YXIgYWxwaGFfbm9ybSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgICAgICAgIGFscGhhX25vcm0gPSBhbHBoYV9ub3JtICsgYWxwaGFbaV1bal1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDM7IGorKykge1xuICAgICAgICAgICAgYWxwaGFbaV1bal0gPSAyKiBhbHBoYVtpXVtqXSAvIGFscGhhX25vcm1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkYXRhID0gW107XG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCAzOyBrKyspIHtcbiAgICAgICAgZGF0YS5wdXNoKHtmZWF0dXJlTWFwOiBmZWF0dXJlTWFwc1trXSwgZ2FtbWE6IGdhbW1hc1trXSwgYmV0YTogYmV0YXNba10sIGFscGhhOiBhbHBoYX0pO1xuICAgIH1cblxuICAgIHZhciBjb252RGF0YSA9IFtdO1xuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgMzsgaysrKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDM7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBkID0ge2ZlYXR1cmU6IGZlYXR1cmVNYXBzW2tdW2ldW2pdLCBnYW1tYTogZ2FtbWFzW2tdLCBiZXRhOiBiZXRhc1trXSwgYWxwaGE6IGFscGhhW2ldW2pdfTtcbiAgICAgICAgICAgICAgICBjb252RGF0YS5wdXNoKGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGFtcGxpdHVkZVNjYWxlID0gZDMuc2NhbGVTcXJ0KCkuZG9tYWluKFswLjAsIDIuMF0pLnJhbmdlKFswLjAsIDAuOF0pLmNsYW1wKHRydWUpO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlUGF0Y2goc2VsZWN0aW9uLCBhY2Nlc3Nvcikge1xuICAgICAgICBzZWxlY3Rpb24uc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmVhY2goZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgIHZhciByID0gYWNjZXNzb3IoZCk7XG4gICAgICAgICAgICB2YXIgcyA9IE1hdGguc2lnbihyKSAqIGFtcGxpdHVkZVNjYWxlKE1hdGguYWJzKHIpKTtcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgIC5zZWxlY3QoXCIuY29udm9sdXRpb25hbC1wYXRjaFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwib3BhY2l0eVwiLCBNYXRoLmFicyhzKSlcbiAgICAgICAgICAgICAgICAuYXR0cihcImhyZWZcIiwgciA8IDAgPyAgXCIjY29udm9sdXRpb25hbC1wYXRjaC1uZWdhdGl2ZVwiIDogXCIjY29udm9sdXRpb25hbC1wYXRjaC1wb3NpdGl2ZVwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQXR0ZW50aW9uIHBpcGVsaW5lXG4gICAgc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZS1hdHRlbnRpb24gZyNpbnB1dC1jb252LWF0dFwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShjb252RGF0YSk7XG4gICAgc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZS1hdHRlbnRpb24gZyNhbHBoYS1jb252LWF0dFwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShjb252RGF0YSk7XG4gICAgc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZS1hdHRlbnRpb24gZyNvdXQtY29udi1hdHRcIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoY29udkRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtYXR0ZW50aW9uIGcjb3V0LWZlYXQtYXR0XCIpLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5kYXRhKGRhdGEpO1xuXG4gICAgLy8gRmlMTSBwaXBlbGluZVxuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtZmlsbSBnI2lucHV0LWNvbnYtZmlsbVwiKS5zZWxlY3RBbGwoXCJnLmZlYXR1cmVcIikuZGF0YShjb252RGF0YSk7XG4gICAgc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZS1maWxtIGcjZ2FtbWEtY29udi1maWxtXCIpLnNlbGVjdEFsbChcImcuZmVhdHVyZVwiKS5kYXRhKGRhdGEpO1xuICAgIHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtZmlsbSBnI291dC1jb252LWZpbG1cIikuc2VsZWN0QWxsKFwiZy5mZWF0dXJlXCIpLmRhdGEoY29udkRhdGEpO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAvLyBBdHRlbnRpb24gcGlwZWxpbmVcbiAgICAgICAgdXBkYXRlUGF0Y2goc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZS1hdHRlbnRpb24gZyNpbnB1dC1jb252LWF0dFwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5mZWF0dXJlOyB9KTtcbiAgICAgICAgdXBkYXRlUGF0Y2goc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZS1hdHRlbnRpb24gZyNhbHBoYS1jb252LWF0dFwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5hbHBoYTsgfSk7XG4gICAgICAgIHVwZGF0ZVBhdGNoKHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtYXR0ZW50aW9uIGcjb3V0LWNvbnYtYXR0XCIpLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmFscGhhICogZC5mZWF0dXJlOyB9KTtcbiAgICAgICAgdXBkYXRlUGF0Y2goc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZS1hdHRlbnRpb24gZyNvdXQtZmVhdC1hdHRcIiksIGZ1bmN0aW9uKGQpICAge1xuICAgICAgICAgICAgdmFyIGF0dGVudGlvbl9wb29sID0gMDtcbiAgICAgICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0ZW50aW9uX3Bvb2wgPSBhdHRlbnRpb25fcG9vbCArIGQuYWxwaGFbaV1bal0gKiBkLmZlYXR1cmVNYXBbaV1bal1cbiAgICAgICAgICAgICAgICAgICAgbiA9IG4gKyAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF0dGVudGlvbl9wb29sO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBGaUxNIHBpcGVsaW5lXG4gICAgICAgIHVwZGF0ZVBhdGNoKHN2Zy5zZWxlY3QoXCJnI2Nubi1maWd1cmUtZmlsbSBnI2lucHV0LWNvbnYtZmlsbVwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5mZWF0dXJlOyB9KTtcbiAgICAgICAgdXBkYXRlUGF0Y2goc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZS1maWxtIGcjZ2FtbWEtY29udi1maWxtXCIpLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdhbW1hOyB9KTtcbiAgICAgICAgdXBkYXRlUGF0Y2goc3ZnLnNlbGVjdChcImcjY25uLWZpZ3VyZS1maWxtIGcjb3V0LWNvbnYtZmlsbVwiKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nYW1tYSAqIGQuZmVhdHVyZTsgfSk7XG4gICAgfVxuICAgIHVwZGF0ZSgpXG59KSgpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldFVwID0gZnVuY3Rpb24oZmlsZW5hbWUsIGtleXdvcmQpIHtcbiAgICAgICAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gaW1wb3J0YW50IHRhZ3NcbiAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNnYW1tYS1iZXRhLWRpYWdyYW0gPiBzdmdcIik7XG4gICAgICAgIHZhciBzY2F0dGVyUGxvdCA9IHN2Zy5zZWxlY3QoXCIjXCIgKyBrZXl3b3JkICsgXCItcGxvdFwiKTtcbiAgICAgICAgdmFyIGJvdW5kaW5nQm94ID0gc2NhdHRlclBsb3Quc2VsZWN0KFwicmVjdFwiKTtcbiAgICAgICAgdmFyIGxlZ2VuZCA9IHN2Zy5zZWxlY3QoXCIjXCIgKyBrZXl3b3JkICsgXCItbGVnZW5kXCIpO1xuXG4gICAgICAgIC8vIFJldHJpZXZlIHNjYXR0ZXIgcGxvdCBib3VuZGluZyBib3ggY29vcmRpbmF0ZXNcbiAgICAgICAgdmFyIHhNaW4gPSBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwieFwiKSk7XG4gICAgICAgIHZhciB4TWF4ID0geE1pbiArIHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ3aWR0aFwiKSk7XG4gICAgICAgIHZhciB5TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInlcIikpO1xuICAgICAgICB2YXIgeU1heCA9IHlNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwiaGVpZ2h0XCIpKTtcblxuICAgICAgICB2YXIgY29sb3JzID0gW1xuICAgICAgICAgICAgXCIjRjQ0MzM2XCIsIFwiI0U5MUU2M1wiLCBcIiM5QzI3QjBcIiwgXCIjNjczQUI3XCIsIFwiIzNGNTFCNVwiLFxuICAgICAgICAgICAgXCIjMjE5NkYzXCIsIFwiIzAzQTlGNFwiLCBcIiMwMEJDRDRcIiwgXCIjMDA5Njg4XCIsIFwiIzRDQUY1MFwiLFxuICAgICAgICAgICAgXCIjOEJDMzRBXCIsIFwiI0NEREMzOVwiLCBcIiNGRkVCM0JcIiwgXCIjRkY5ODAwXCIsIFwiIzc5NTU0OFwiLFxuICAgICAgICAgICAgXCIjOUU5RTlFXCIsXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIGRhdGFzZXQ7XG4gICAgICAgIHZhciB4U2NhbGU7XG4gICAgICAgIHZhciB5U2NhbGU7XG5cbiAgICAgICAgZDMuanNvbihmaWxlbmFtZSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgZGF0YXNldCA9IGRhdGE7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBzY2FsZXMgbWFwcGluZyBnYW1tYSBhbmQgYmV0YSB2YWx1ZXMgdG8gYm91bmRpbmcgYm94XG4gICAgICAgICAgICAvLyBjb29yZGluYXRlc1xuICAgICAgICAgICAgeFNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgICAgIC5kb21haW4oWzEuMTUgKiBkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZ2FtbWE7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgIDEuMTUgKiBkMy5tYXgoZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZ2FtbWE7IH0pXSlcbiAgICAgICAgICAgICAgICAucmFuZ2VSb3VuZChbeE1pbiwgeE1heF0pO1xuICAgICAgICAgICAgeVNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgICAgIC5kb21haW4oWzEuMTUgKiBkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuYmV0YTsgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgMS4xNSAqIGQzLm1heChkYXRhc2V0LCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5iZXRhOyB9KV0pXG4gICAgICAgICAgICAgICAgLnJhbmdlUm91bmQoW3lNYXgsIHlNaW5dKVxuXG4gICAgICAgICAgICAvLyBTZXQgdXAgYXhlc1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3gtYXhpc1wiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBcIk1cIiArICB4TWluICsgXCIgXCIgKyAgeVNjYWxlKDApICsgXCIgTCBcIiArIHhNYXggKyBcIiBcIiArIHlTY2FsZSgwKSk7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeC1heGlzLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgLmF0dHJzKHtcInhcIjogeE1heCAtIDEwLCBcInlcIjogeVNjYWxlKDAuMCkgKyAxMH0pO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3ktYXhpc1wiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBcIk1cIiArICB4U2NhbGUoMCkgKyBcIiBcIiArICB5TWF4ICsgXCIgTCBcIiArIHhTY2FsZSgwKSArIFwiIFwiICsgeU1pbik7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeS1heGlzLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgLmF0dHJzKHtcInhcIjogeFNjYWxlKDAuMCkgKyAxMCwgXCJ5XCI6IHlNaW59KTtcblxuICAgICAgICAgICAgLy8gRGlzcGF0Y2ggZGF0YSBwb2ludHMgaW50byBncm91cHMgYnkgZmVhdHVyZSBtYXBcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdEFsbChcImdcIilcbiAgICAgICAgICAgICAgICAuZGF0YShjb2xvcnMpXG4gICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEuMClcbiAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbihjLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKGRhdGFzZXQuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZmVhdHVyZV9tYXAgPT0gaTsgfSkpXG4gICAgICAgICAgICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY3hcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQuZ2FtbWEpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuYmV0YSk7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyXCI6IDMuMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGNvbG9yc1tpXTsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGxlZ2VuZFxuICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5kYXRhKGNvbG9ycylcbiAgICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLmF0dHJzKHtcbiAgICAgICAgICAgICAgICAgICAgXCJjeFwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiAxOCAqIGk7IH0sXG4gICAgICAgICAgICAgICAgICAgIFwiY3lcIjogMCxcbiAgICAgICAgICAgICAgICAgICAgXCJyXCI6IDYsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGNvbG9yc1tpXTsgfSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuXG4gICAgICAgICAgICAvLyBGb2N1c2VzIG9uIGFsbCBwb2ludHMgYnkgcmVzZXR0aW5nIHRoZSBvcGFjaXRpZXNcbiAgICAgICAgICAgIHZhciBmb2N1c0FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgICAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdEFsbChcImdcIilcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxLjApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gRm9jdXNlcyBvbiBhIHNpbmdsZSBmZWF0dXJlIG1hcCBieSBsb3dlcmluZyBvdGhlciBmZWF0dXJlIG1hcFxuICAgICAgICAgICAgLy8gb3BhY2l0aWVzXG4gICAgICAgICAgICB2YXIgZm9jdXMgPSBmdW5jdGlvbihqKSB7XG4gICAgICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgPT0gaiA/ICAwLjYgOiAwLjE7IH0pO1xuICAgICAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdEFsbChcImdcIilcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMS4wIDogMC4xOyB9KVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gQWRkIGhvdmVyaW5nIGJlaGF2aW9yIHRvIGxlZ2VuZFxuICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgICAgICAgICBmb2N1cyhpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZvY3VzQWxsKTtcblxuICAgICAgICAgICAgZm9jdXNBbGwoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBzZXRVcCgnZGF0YS9jbGV2cl9nYW1tYV9iZXRhX3N1YnNhbXBsZWQuanNvbicsICdjbGV2cicpO1xuICAgIHNldFVwKCdkYXRhL3N0eWxlX2dhbW1hX2JldGFfc3Vic2FtcGxlZC5qc29uJywgJ3N0eWxlLXRyYW5zZmVyJyk7XG59KSgpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHByb2Nlc3NFeGFtcGxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjc3R5bGUtaW50ZXJwb2xhdGlvbi1kaWFncmFtID4gc3ZnXCIpO1xuICAgICAgICB2YXIgc3R5bGVTZWxlY3QxID0gc3ZnLnNlbGVjdEFsbChcIiNzdHlsZS0xLXNlbGVjdCBpbWFnZVwiKS5hdHRyKCdjdXJzb3InLCAncG9pbnRlcicpXG4gICAgICAgIHZhciBzdHlsZVNlbGVjdDIgPSBzdmcuc2VsZWN0QWxsKFwiI3N0eWxlLTItc2VsZWN0IGltYWdlXCIpLmF0dHIoJ2N1cnNvcicsICdwb2ludGVyJyk7XG4gICAgICAgIHZhciBjb250ZW50U2VsZWN0ID0gc3ZnLnNlbGVjdEFsbChcIiNjb250ZW50LXNlbGVjdCBpbWFnZVwiKS5hdHRyKCdjdXJzb3InLCAncG9pbnRlcicpO1xuICAgICAgICB2YXIgaW50ZXJwb2xhdGlvbkltYWdlcyA9IHN2Zy5zZWxlY3RBbGwoXCIjaW50ZXJwb2xhdGlvbiBpbWFnZVwiKTtcbiAgICAgICAgdmFyIHNlbGVjdGVkSW1hZ2VzID0ge1xuICAgICAgICAgICAgJ2NvbnRlbnQnOiAwLCBcbiAgICAgICAgICAgICdzdHlsZTEnOiAwLCBcbiAgICAgICAgICAgICdzdHlsZTInOiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHVwZGF0ZUltYWdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGludGVycG9sYXRpb25JbWFnZXMuYXR0cihcInhsaW5rOmhyZWZcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNvbnRlbnQsIHN0eWxlMSwgc3R5bGUyIH0gPSBzZWxlY3RlZEltYWdlc1xuICAgICAgICAgICAgICAgIGNvbnN0IGhyZWYgPSBgaW1hZ2VzL3N0eWxpemVkLSR7Y29udGVudCArIDF9LSR7c3R5bGUxICsgMX0tJHtzdHlsZTIgKyAxfS0ke2kgKyAxfS5qcGdgO1xuICAgICAgICAgICAgICAgIHJldHVybiBocmVmO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0eWxlU2VsZWN0MS5zdHlsZSgnb3BhY2l0eScsIChkLCBpKSA9PiBpID09IHNlbGVjdGVkSW1hZ2VzWydzdHlsZTEnXSA/IDE6IDAuMSk7XG4gICAgICAgICAgICBzdHlsZVNlbGVjdDIuc3R5bGUoJ29wYWNpdHknLCAoZCwgaSkgPT4gaSA9PSBzZWxlY3RlZEltYWdlc1snc3R5bGUyJ10gPyAxOiAwLjEpO1xuICAgICAgICAgICAgY29udGVudFNlbGVjdC5zdHlsZSgnb3BhY2l0eScsIChkLCBpKSA9PiBpID09IHNlbGVjdGVkSW1hZ2VzWydjb250ZW50J10gPyAxOiAwLjEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVwZGF0ZVN0eWxlID0ga2V5ID0+IChkLCBpKSA9PiB7XG4gICAgICAgICAgICBzZWxlY3RlZEltYWdlc1trZXldID0gaTtcbiAgICAgICAgICAgIHVwZGF0ZUltYWdlcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3R5bGVTZWxlY3QxLm9uKFwiY2xpY2tcIiwgdXBkYXRlU3R5bGUoJ3N0eWxlMScpKTtcbiAgICAgICAgc3R5bGVTZWxlY3QyLm9uKFwiY2xpY2tcIiwgdXBkYXRlU3R5bGUoJ3N0eWxlMicpKTtcbiAgICAgICAgY29udGVudFNlbGVjdC5vbihcImNsaWNrXCIsIHVwZGF0ZVN0eWxlKCdjb250ZW50JykpO1xuXG4gICAgICAgIHVwZGF0ZUltYWdlcygpO1xuXG4gICAgfTtcbiAgICBwcm9jZXNzRXhhbXBsZSgpO1xufSkoKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBwcm9jZXNzRXhhbXBsZSA9IGZ1bmN0aW9uKGV4YW1wbGUpIHtcbiAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNxdWVzdGlvbi1pbnRlcnBvbGF0aW9uLWRpYWdyYW0gPiBzdmdcIik7XG4gICAgICAgIHZhciBpbWFnZVNlbGVjdG9yID0gc3ZnLnNlbGVjdChcIiNleGFtcGxlLVwiICsgZXhhbXBsZSArIFwiID4gLmltYWdlLXNlbGVjdG9yXCIpO1xuXG4gICAgICAgIHZhciB4TWluID0gK2ltYWdlU2VsZWN0b3Iuc2VsZWN0KFwibGluZVwiKS5hdHRyKFwieDFcIik7XG4gICAgICAgIHZhciB4TWF4ID0gK2ltYWdlU2VsZWN0b3Iuc2VsZWN0KFwibGluZVwiKS5hdHRyKFwieDJcIik7XG4gICAgICAgIHZhciBuVGlja3MgPSAxMTtcbiAgICAgICAgdmFyIGxlbmd0aCA9ICh4TWF4IC0geE1pbikgLyAoblRpY2tzIC0gMS4wKTtcbiAgICAgICAgdmFyIHRpY2tzID0gW107XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBuVGlja3M7IGkrKykge1xuICAgICAgICAgIHRpY2tzLnB1c2goeE1pbiArIGkgKiBsZW5ndGgpO1xuICAgICAgICB9XG5cblxuICAgICAgICB2YXIgY2lyY2xlID0gaW1hZ2VTZWxlY3Rvci5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5hdHRycyh7XCJjeFwiOiB0aWNrc1swXSwgXCJjeVwiOiAwLCBcInJcIjogNn0pXG4gICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAuY2xhc3NlZChcImZpZ3VyZS1wYXRoXCIsIHRydWUpO1xuXG4gICAgICAgIHZhciBkcmFnID0gZDMuZHJhZygpXG4gICAgICAgICAgLm9uKFwiZHJhZ1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIG5ld1ggPSBNYXRoLm1pbih0aWNrc1tuVGlja3MgLSAxXSwgTWF0aC5tYXgodGlja3NbMF0sIGQzLmV2ZW50LngpKTtcbiAgICAgICAgICAgICAgdmFyIG5ld1RpY2sgPSBNYXRoLnJvdW5kKChuZXdYIC0gdGlja3NbMF0pIC8gbGVuZ3RoKTtcbiAgICAgICAgICAgICAgbmV3WCA9IHRpY2tzWzBdICsgbGVuZ3RoICogbmV3VGljaztcbiAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJjeFwiLCBuZXdYKTtcbiAgICAgICAgICAgICAgc3ZnLnNlbGVjdChcIm1hc2sjbS1cIiArIGV4YW1wbGUgKyBcIiA+IGltYWdlXCIpXG4gICAgICAgICAgICAgICAgICAuYXR0cihcInhsaW5rOmhyZWZcIiwgXCJpbWFnZXMvcXVlc3Rpb24taW50ZXJwb2xhdGlvbi1cIiArIGV4YW1wbGUgKyBcIi1tYXNrLVwiICsgKCtuZXdUaWNrICsgMSkgKyBcIi5wbmdcIik7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZyhjaXJjbGUpO1xuICAgIH07XG4gICAgcHJvY2Vzc0V4YW1wbGUoXCIxXCIpO1xuICAgIHByb2Nlc3NFeGFtcGxlKFwiMlwiKTtcbn0pKCk7XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgc2V0VXAgPSBmdW5jdGlvbihmaWxlbmFtZSwga2V5d29yZCwgY29sb3IpIHtcbiAgICAgICAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gaW1wb3J0YW50IHRhZ3NcbiAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNjbGV2ci1zdWJjbHVzdGVyLWRpYWdyYW0gPiBzdmdcIik7XG4gICAgICAgIHZhciBzY2F0dGVyUGxvdCA9IHN2Zy5zZWxlY3QoXCIjXCIgKyBrZXl3b3JkICsgXCItcGxvdFwiKTtcbiAgICAgICAgdmFyIGJvdW5kaW5nQm94ID0gc2NhdHRlclBsb3Quc2VsZWN0KFwicmVjdFwiKTtcbiAgICAgICAgdmFyIGxlZ2VuZCA9IHN2Zy5zZWxlY3QoXCIjXCIgKyBrZXl3b3JkICsgXCItbGVnZW5kXCIpO1xuXG4gICAgICAgIC8vIFJldHJpZXZlIHNjYXR0ZXIgcGxvdCBib3VuZGluZyBib3ggY29vcmRpbmF0ZXNcbiAgICAgICAgdmFyIHhNaW4gPSBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwieFwiKSk7XG4gICAgICAgIHZhciB4TWF4ID0geE1pbiArIHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ3aWR0aFwiKSk7XG4gICAgICAgIHZhciB5TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInlcIikpO1xuICAgICAgICB2YXIgeU1heCA9IHlNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwiaGVpZ2h0XCIpKTtcblxuICAgICAgICB2YXIgY29sb3JzID0gW1xuICAgICAgICAgICAgXCIjRjQ0MzM2XCIsIFwiI0U5MUU2M1wiLCBcIiM5QzI3QjBcIiwgXCIjNjczQUI3XCIsIFwiIzNGNTFCNVwiLFxuICAgICAgICAgICAgXCIjMjE5NkYzXCIsIFwiIzAzQTlGNFwiLCBcIiMwMEJDRDRcIiwgXCIjMDA5Njg4XCIsIFwiIzRDQUY1MFwiLFxuICAgICAgICAgICAgXCIjOEJDMzRBXCIsIFwiI0NEREMzOVwiLCBcIiNGRkVCM0JcIiwgXCIjRkY5ODAwXCIsIFwiIzc5NTU0OFwiLFxuICAgICAgICAgICAgXCIjOUU5RTlFXCIsXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIGRhdGFzZXQ7XG4gICAgICAgIHZhciB4U2NhbGU7XG4gICAgICAgIHZhciB5U2NhbGU7XG5cbiAgICAgICAgZDMuanNvbihmaWxlbmFtZSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgZGF0YXNldCA9IGRhdGE7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBzY2FsZXMgbWFwcGluZyBnYW1tYSBhbmQgYmV0YSB2YWx1ZXMgdG8gYm91bmRpbmcgYm94XG4gICAgICAgICAgICAvLyBjb29yZGluYXRlc1xuICAgICAgICAgICAgeFNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgICAgIC5kb21haW4oWzEuMTUgKiBkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZ2FtbWE7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgIDEuMTUgKiBkMy5tYXgoZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZ2FtbWE7IH0pXSlcbiAgICAgICAgICAgICAgICAucmFuZ2VSb3VuZChbeE1pbiwgeE1heF0pO1xuICAgICAgICAgICAgeVNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgICAgIC5kb21haW4oWzEuMTUgKiBkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuYmV0YTsgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgMS4xNSAqIGQzLm1heChkYXRhc2V0LCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5iZXRhOyB9KV0pXG4gICAgICAgICAgICAgICAgLnJhbmdlUm91bmQoW3lNYXgsIHlNaW5dKVxuXG4gICAgICAgICAgICAvLyBTZXQgdXAgYXhlc1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3gtYXhpc1wiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBcIk1cIiArICB4TWluICsgXCIgXCIgKyAgeVNjYWxlKDApICsgXCIgTCBcIiArIHhNYXggKyBcIiBcIiArIHlTY2FsZSgwKSk7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeC1heGlzLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgLmF0dHJzKHtcInhcIjogeE1heCAtIDEwLCBcInlcIjogeVNjYWxlKDAuMCkgKyAxMH0pO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3ktYXhpc1wiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBcIk1cIiArICB4U2NhbGUoMCkgKyBcIiBcIiArICB5TWF4ICsgXCIgTCBcIiArIHhTY2FsZSgwKSArIFwiIFwiICsgeU1pbik7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeS1heGlzLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgLmF0dHJzKHtcInhcIjogeFNjYWxlKDAuMCkgKyAxMCwgXCJ5XCI6IHlNaW59KTtcblxuICAgICAgICAgICAgdmFyIHRvb2x0aXAgPSBkMy5zZWxlY3QoXCJib2R5XCIpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ0b29sdGlwLWNsZXZyXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRvb2x0aXAgZmlndXJlLXRleHRcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJiYWNrZ3JvdW5kXCIsIFwiI2RkZFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImJvcmRlci1yYWRpdXNcIiwgXCI2cHhcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJwYWRkaW5nXCIsIFwiMTBweFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgZGF0YSBwb2ludHNcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5kYXRhKGRhdGFzZXQpXG4gICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgICAgIFwiY3hcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQuZ2FtbWEpOyB9LFxuICAgICAgICAgICAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLmJldGEpOyB9LFxuICAgICAgICAgICAgICAgICAgICBcInJcIjogMy4wLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBjb2xvcnNbY29sb3JdKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwLmh0bWwoZC5xdWVzdGlvbi5qb2luKFwiIFwiKSArIFwiP1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgc2V0VXAoJ2RhdGEvY2xldnJfZ2FtbWFfYmV0YV93b3Jkc19zdWJjbHVzdGVyX2ZtXzI2Lmpzb24nLCAnZmlyc3QnLCAwKTtcbiAgICBzZXRVcCgnZGF0YS9jbGV2cl9nYW1tYV9iZXRhX3dvcmRzX3N1YmNsdXN0ZXJfZm1fNzYuanNvbicsICdzZWNvbmQnLCA2KTtcbn0pKCk7XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sb3JzID0gW1xuICAgICAgICBcIiNGNDQzMzZcIiwgXCIjRTkxRTYzXCIsIFwiIzlDMjdCMFwiLCBcIiM2NzNBQjdcIiwgXCIjM0Y1MUI1XCIsXG4gICAgICAgIFwiIzIxOTZGM1wiLCBcIiMwM0E5RjRcIiwgXCIjMDBCQ0Q0XCIsIFwiIzAwOTY4OFwiLCBcIiM0Q0FGNTBcIixcbiAgICAgICAgXCIjOEJDMzRBXCIsIFwiI0NEREMzOVwiLCBcIiNGRkVCM0JcIixcbiAgICBdO1xuXG4gICAgdmFyIHF1ZXN0aW9uX3dvcmRzID0gW1xuICAgICAgICBcImZyb250XCIsIFwiYmVoaW5kXCIsIFwibGVmdFwiLCBcInJpZ2h0XCIsXG4gICAgICAgIFwibWF0ZXJpYWxcIiwgXCJydWJiZXJcIiwgXCJtYXR0ZVwiLCBcIm1ldGFsXCIsIFwibWV0YWxsaWNcIiwgXCJzaGlueVwiLFxuICAgIF07XG5cbiAgICB2YXIgc2V0VXAgPSBmdW5jdGlvbihmaWxlbmFtZSwga2V5d29yZCwgY29sb3IpIHtcbiAgICAgICAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gaW1wb3J0YW50IHRhZ3NcbiAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNjbGV2ci1zdWJjbHVzdGVyLWNvbG9yLXdvcmRzLWRpYWdyYW0gPiBzdmdcIik7XG4gICAgICAgIHZhciBzY2F0dGVyUGxvdCA9IHN2Zy5zZWxlY3QoXCIjXCIgKyBrZXl3b3JkICsgXCItcGxvdFwiKTtcbiAgICAgICAgdmFyIGJvdW5kaW5nQm94ID0gc2NhdHRlclBsb3Quc2VsZWN0KFwicmVjdFwiKTtcblxuICAgICAgICAvLyBSZXRyaWV2ZSBzY2F0dGVyIHBsb3QgYm91bmRpbmcgYm94IGNvb3JkaW5hdGVzXG4gICAgICAgIHZhciB4TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInhcIikpO1xuICAgICAgICB2YXIgeE1heCA9IHhNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwid2lkdGhcIikpO1xuICAgICAgICB2YXIgeU1pbiA9IHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ5XCIpKTtcbiAgICAgICAgdmFyIHlNYXggPSB5TWluICsgcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcImhlaWdodFwiKSk7XG5cbiAgICAgICAgdmFyIGRhdGFzZXQ7XG4gICAgICAgIHZhciB4U2NhbGU7XG4gICAgICAgIHZhciB5U2NhbGU7XG5cbiAgICAgICAgZDMuanNvbihmaWxlbmFtZSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgZGF0YXNldCA9IGRhdGE7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBzY2FsZXMgbWFwcGluZyBnYW1tYSBhbmQgYmV0YSB2YWx1ZXMgdG8gYm91bmRpbmcgYm94XG4gICAgICAgICAgICAvLyBjb29yZGluYXRlc1xuICAgICAgICAgICAgeFNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgICAgIC5kb21haW4oWzEuMTUgKiBkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZ2FtbWE7IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgIDEuMTUgKiBkMy5tYXgoZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZ2FtbWE7IH0pXSlcbiAgICAgICAgICAgICAgICAucmFuZ2VSb3VuZChbeE1pbiwgeE1heF0pO1xuICAgICAgICAgICAgeVNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgICAgIC5kb21haW4oWzEuMTUgKiBkMy5taW4oZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuYmV0YTsgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgMS4xNSAqIGQzLm1heChkYXRhc2V0LCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5iZXRhOyB9KV0pXG4gICAgICAgICAgICAgICAgLnJhbmdlUm91bmQoW3lNYXgsIHlNaW5dKVxuXG4gICAgICAgICAgICAvLyBTZXQgdXAgYXhlc1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3gtYXhpc1wiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBcIk1cIiArICB4TWluICsgXCIgXCIgKyAgeVNjYWxlKDApICsgXCIgTCBcIiArIHhNYXggKyBcIiBcIiArIHlTY2FsZSgwKSk7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeC1heGlzLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgLmF0dHJzKHtcInhcIjogeE1heCAtIDEwLCBcInlcIjogeVNjYWxlKDAuMCkgKyAxMH0pO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0KFwiI3ktYXhpc1wiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBcIk1cIiArICB4U2NhbGUoMCkgKyBcIiBcIiArICB5TWF4ICsgXCIgTCBcIiArIHhTY2FsZSgwKSArIFwiIFwiICsgeU1pbik7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeS1heGlzLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgLmF0dHJzKHtcInhcIjogeFNjYWxlKDAuMCkgKyAxMCwgXCJ5XCI6IHlNaW59KTtcblxuICAgICAgICAgICAgdmFyIHRvb2x0aXAgPSBkMy5zZWxlY3QoXCJib2R5XCIpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ0b29sdGlwLWNsZXZyLXdvcmRzLWNsZXZlclwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b29sdGlwIGZpZ3VyZS10ZXh0XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiYmFja2dyb3VuZFwiLCBcIiNkZGRcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJib3JkZXItcmFkaXVzXCIsIFwiNnB4XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwicGFkZGluZ1wiLCBcIjEwcHhcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuXG4gICAgICAgICAgICAvLyBEaXNwYXRjaCBkYXRhIHBvaW50cyBpbnRvIGdyb3VwcyBieSBxdWVzdGlvbiB0eXBlXG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuZGF0YShkYXRhc2V0KVxuICAgICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgICAgIFwiY3hcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQuZ2FtbWEpOyB9LFxuICAgICAgICAgICAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLmJldGEpOyB9LFxuICAgICAgICAgICAgICAgICAgICBcInJcIjogMy4wLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBjb2xvcnNbY29sb3JdKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwLmh0bWwoZC5xdWVzdGlvbi5qb2luKFwiIFwiKSArIFwiP1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgICAgICAgICAuZGF0YShxdWVzdGlvbl93b3JkcylcbiAgICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgICAgIFwieFwiOiAyMCxcbiAgICAgICAgICAgICAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDIwICogaTsgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJkeVwiOiBcIjAuNGVtXCIsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2xhc3NlZChcImZpZ3VyZS10ZXh0XCIsIHRydWUpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KVxuICAgICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHNldFVwKCdkYXRhL2NsZXZyX2dhbW1hX2JldGFfd29yZHNfc3ViY2x1c3Rlcl9mbV8yNi5qc29uJywgJ2ZpcnN0JywgMCk7XG4gICAgc2V0VXAoJ2RhdGEvY2xldnJfZ2FtbWFfYmV0YV93b3Jkc19zdWJjbHVzdGVyX2ZtXzkyLmpzb24nLCAnc2Vjb25kJywgOCk7XG5cbiAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI2NsZXZyLXN1YmNsdXN0ZXItY29sb3Itd29yZHMtZGlhZ3JhbSA+IHN2Z1wiKTtcbiAgICB2YXIgbGVnZW5kID0gc3ZnLnNlbGVjdChcIiNsZWdlbmRcIik7XG4gICAgdmFyIGZpcnN0UGxvdCA9IHN2Zy5zZWxlY3QoXCIjZmlyc3QtcGxvdFwiKTtcbiAgICB2YXIgc2Vjb25kUGxvdCA9IHN2Zy5zZWxlY3QoXCIjc2Vjb25kLXBsb3RcIik7XG5cbiAgICAvLyBDcmVhdGUgbGVnZW5kXG4gICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAuZGF0YShxdWVzdGlvbl93b3JkcylcbiAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgXCJjeFwiOiAwLFxuICAgICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiAyMCAqIGk7IH0sXG4gICAgICAgICAgICBcInJcIjogNixcbiAgICAgICAgfSlcbiAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIm5vbmVcIilcbiAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgLmRhdGEocXVlc3Rpb25fd29yZHMpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICBcInhcIjogMjAsXG4gICAgICAgICAgICBcInlcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjAgKiBpOyB9LFxuICAgICAgICAgICAgXCJkeVwiOiBcIjAuNGVtXCIsXG4gICAgICAgIH0pXG4gICAgICAgIC5jbGFzc2VkKFwiZmlndXJlLXRleHRcIiwgdHJ1ZSlcbiAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcblxuICAgIC8vIEZvY3VzZXMgb24gYWxsIHBvaW50cyBieSByZXNldHRpbmcgdGhlIG9wYWNpdGllc1xuICAgIHZhciBmb2N1c0FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgICAgIGZpcnN0UGxvdC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMS4wKTtcbiAgICAgICAgc2Vjb25kUGxvdC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMS4wKTtcbiAgICB9O1xuXG4gICAgLy8gRm9jdXNlcyBvbiBhIHNpbmdsZSBxdWVzdGlvbiB0eXBlIGJ5IGxvd2VyaW5nIG90aGVyXG4gICAgLy8gcXVlc3Rpb24gdHlwZSBvcGFjaXRpZXNcbiAgICB2YXIgZm9jdXMgPSBmdW5jdGlvbih3b3JkKSB7XG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gZCA9PSB3b3JkID8gIDAuNiA6IDAuMTsgfSk7XG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGQgPT0gd29yZCA/ICAwLjYgOiAwLjE7IH0pO1xuICAgICAgICBmaXJzdFBsb3Quc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGQucXVlc3Rpb24uaW5kZXhPZih3b3JkKSA+PSAwID8gIDEuMCA6IDAuMTsgfSlcbiAgICAgICAgc2Vjb25kUGxvdC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gZC5xdWVzdGlvbi5pbmRleE9mKHdvcmQpID49IDAgPyAgMS4wIDogMC4xOyB9KVxuICAgIH07XG5cbiAgICAvLyBBZGQgaG92ZXJpbmcgYmVoYXZpb3IgdG8gbGVnZW5kXG4gICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICBmb2N1cyhkKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZm9jdXNBbGwpO1xuXG4gICAgZm9jdXNBbGwoKTtcbn0pKCk7XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sb3JzID0gW1xuICAgICAgICBcIiNGNDQzMzZcIiwgXCIjRTkxRTYzXCIsIFwiIzlDMjdCMFwiLCBcIiM2NzNBQjdcIiwgXCIjM0Y1MUI1XCIsXG4gICAgICAgIFwiIzIxOTZGM1wiLCBcIiMwM0E5RjRcIiwgXCIjMDBCQ0Q0XCIsIFwiIzAwOTY4OFwiLCBcIiM0Q0FGNTBcIixcbiAgICAgICAgXCIjOEJDMzRBXCIsIFwiI0NEREMzOVwiLCBcIiNGRkVCM0JcIixcbiAgICBdO1xuXG4gICAgdmFyIHF1ZXN0aW9uX3R5cGVzID0gW1xuICAgICAgICBcIkV4aXN0c1wiLCBcIkxlc3MgdGhhblwiLCBcIkdyZWF0ZXIgdGhhblwiLCBcIkNvdW50XCIsIFwiUXVlcnkgbWF0ZXJpYWxcIixcbiAgICAgICAgXCJRdWVyeSBzaXplXCIsIFwiUXVlcnkgY29sb3JcIiwgXCJRdWVyeSBzaGFwZVwiLCBcIkVxdWFsIGNvbG9yXCIsXG4gICAgICAgIFwiRXF1YWwgaW50ZWdlclwiLCBcIkVxdWFsIHNoYXBlXCIsIFwiRXF1YWwgc2l6ZVwiLCBcIkVxdWFsIG1hdGVyaWFsXCJcbiAgICBdO1xuXG4gICAgLy8gVWdseSB3b3JrYXJvdW5kIGZvciBwZXJtdXRlZCBxdWVzdGlvbiB0eXBlcyBpbiBKU09OIGZpbGUuXG4gICAgdmFyIHF1ZXN0aW9uX3R5cGVfbWFwcGluZyA9IFswLCAyLCA1LCA4LCAxLCA0LCA5LCAxMCwgMywgNiwgMTIsIDcsIDExXTtcblxuICAgIHZhciBzZXRVcCA9IGZ1bmN0aW9uKGZpbGVuYW1lLCBrZXl3b3JkLCBjb2xvcikge1xuICAgICAgICAvLyBHZXQgcmVmZXJlbmNlcyB0byBpbXBvcnRhbnQgdGFnc1xuICAgICAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI2NsZXZyLXN1YmNsdXN0ZXItY29sb3ItZGlhZ3JhbSA+IHN2Z1wiKTtcbiAgICAgICAgdmFyIHNjYXR0ZXJQbG90ID0gc3ZnLnNlbGVjdChcIiNcIiArIGtleXdvcmQgKyBcIi1wbG90XCIpO1xuICAgICAgICB2YXIgYm91bmRpbmdCb3ggPSBzY2F0dGVyUGxvdC5zZWxlY3QoXCJyZWN0XCIpO1xuXG4gICAgICAgIC8vIFJldHJpZXZlIHNjYXR0ZXIgcGxvdCBib3VuZGluZyBib3ggY29vcmRpbmF0ZXNcbiAgICAgICAgdmFyIHhNaW4gPSBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwieFwiKSk7XG4gICAgICAgIHZhciB4TWF4ID0geE1pbiArIHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ3aWR0aFwiKSk7XG4gICAgICAgIHZhciB5TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInlcIikpO1xuICAgICAgICB2YXIgeU1heCA9IHlNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwiaGVpZ2h0XCIpKTtcblxuICAgICAgICB2YXIgZGF0YXNldDtcbiAgICAgICAgdmFyIHhTY2FsZTtcbiAgICAgICAgdmFyIHlTY2FsZTtcblxuICAgICAgICBkMy5qc29uKGZpbGVuYW1lLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBkYXRhc2V0ID0gZGF0YTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHNjYWxlcyBtYXBwaW5nIGdhbW1hIGFuZCBiZXRhIHZhbHVlcyB0byBib3VuZGluZyBib3hcbiAgICAgICAgICAgIC8vIGNvb3JkaW5hdGVzXG4gICAgICAgICAgICB4U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAgICAgLmRvbWFpbihbMS4xNSAqIGQzLm1pbihkYXRhc2V0LCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5nYW1tYTsgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgMS4xNSAqIGQzLm1heChkYXRhc2V0LCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5nYW1tYTsgfSldKVxuICAgICAgICAgICAgICAgIC5yYW5nZVJvdW5kKFt4TWluLCB4TWF4XSk7XG4gICAgICAgICAgICB5U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAgICAgLmRvbWFpbihbMS4xNSAqIGQzLm1pbihkYXRhc2V0LCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5iZXRhOyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAxLjE1ICogZDMubWF4KGRhdGFzZXQsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmJldGE7IH0pXSlcbiAgICAgICAgICAgICAgICAucmFuZ2VSb3VuZChbeU1heCwgeU1pbl0pXG5cbiAgICAgICAgICAgIC8vIFNldCB1cCBheGVzXG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeC1heGlzXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIFwiTVwiICsgIHhNaW4gKyBcIiBcIiArICB5U2NhbGUoMCkgKyBcIiBMIFwiICsgeE1heCArIFwiIFwiICsgeVNjYWxlKDApKTtcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdChcIiN4LWF4aXMtbGFiZWxcIilcbiAgICAgICAgICAgICAgICAuYXR0cnMoe1wieFwiOiB4TWF4IC0gMTAsIFwieVwiOiB5U2NhbGUoMC4wKSArIDEwfSk7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3QoXCIjeS1heGlzXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIFwiTVwiICsgIHhTY2FsZSgwKSArIFwiIFwiICsgIHlNYXggKyBcIiBMIFwiICsgeFNjYWxlKDApICsgXCIgXCIgKyB5TWluKTtcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdChcIiN5LWF4aXMtbGFiZWxcIilcbiAgICAgICAgICAgICAgICAuYXR0cnMoe1wieFwiOiB4U2NhbGUoMC4wKSArIDEwLCBcInlcIjogeU1pbn0pO1xuXG4gICAgICAgICAgICB2YXIgdG9vbHRpcCA9IGQzLnNlbGVjdChcImJvZHlcIikuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInRvb2x0aXAtY2xldnItcXVlc3Rpb24tdHlwZS1jbGV2ZXJcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG9vbHRpcCBmaWd1cmUtdGV4dFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImJhY2tncm91bmRcIiwgXCIjZGRkXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiYm9yZGVyLXJhZGl1c1wiLCBcIjZweFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcInBhZGRpbmdcIiwgXCIxMHB4XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcblxuICAgICAgICAgICAgLy8gRGlzcGF0Y2ggZGF0YSBwb2ludHMgaW50byBncm91cHMgYnkgcXVlc3Rpb24gdHlwZVxuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0QWxsKFwiZ1wiKVxuICAgICAgICAgICAgICAgIC5kYXRhKGNvbG9ycylcbiAgICAgICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxLjApXG4gICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oYywgaSkge1xuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZGF0YShkYXRhc2V0LmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBxdWVzdGlvbl90eXBlX21hcHBpbmdbZC50eXBlXSA9PSBpOyB9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHJzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmdhbW1hKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLmJldGEpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiAzLjAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvcnNbaV07IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXMocXVlc3Rpb25fdHlwZV9tYXBwaW5nW2QudHlwZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXAuaHRtbChkLnF1ZXN0aW9uLmpvaW4oXCIgXCIpICsgXCI/XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1c0FsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBzZXRVcCgnZGF0YS9jbGV2cl9nYW1tYV9iZXRhX3dvcmRzX3N1YmNsdXN0ZXJfZm1fMjYuanNvbicsICdmaXJzdCcsIDApO1xuICAgIHNldFVwKCdkYXRhL2NsZXZyX2dhbW1hX2JldGFfd29yZHNfc3ViY2x1c3Rlcl9mbV83Ni5qc29uJywgJ3NlY29uZCcsIDYpO1xuXG4gICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNjbGV2ci1zdWJjbHVzdGVyLWNvbG9yLWRpYWdyYW0gPiBzdmdcIik7XG4gICAgdmFyIGxlZ2VuZCA9IHN2Zy5zZWxlY3QoXCIjbGVnZW5kXCIpO1xuICAgIHZhciBmaXJzdFBsb3QgPSBzdmcuc2VsZWN0KFwiI2ZpcnN0LXBsb3RcIik7XG4gICAgdmFyIHNlY29uZFBsb3QgPSBzdmcuc2VsZWN0KFwiI3NlY29uZC1wbG90XCIpO1xuXG4gICAgLy8gQ3JlYXRlIGxlZ2VuZFxuICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgLmRhdGEoY29sb3JzKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICBcImN4XCI6IDAsXG4gICAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDIwICogaTsgfSxcbiAgICAgICAgICAgIFwiclwiOiA2LFxuICAgICAgICB9KVxuICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGNvbG9yc1tpXTsgfSlcbiAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgLmRhdGEocXVlc3Rpb25fdHlwZXMpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICBcInhcIjogMjAsXG4gICAgICAgICAgICBcInlcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjAgKiBpOyB9LFxuICAgICAgICAgICAgXCJkeVwiOiBcIjAuNGVtXCIsXG4gICAgICAgIH0pXG4gICAgICAgIC5jbGFzc2VkKFwiZmlndXJlLXRleHRcIiwgdHJ1ZSlcbiAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcblxuICAgIC8vIEZvY3VzZXMgb24gYWxsIHBvaW50cyBieSByZXNldHRpbmcgdGhlIG9wYWNpdGllc1xuICAgIHZhciBmb2N1c0FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgICAgIGZpcnN0UGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEuMCk7XG4gICAgICAgIHNlY29uZFBsb3Quc2VsZWN0QWxsKFwiZ1wiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxLjApO1xuICAgIH07XG5cbiAgICAvLyBGb2N1c2VzIG9uIGEgc2luZ2xlIHF1ZXN0aW9uIHR5cGUgYnkgbG93ZXJpbmcgb3RoZXJcbiAgICAvLyBxdWVzdGlvbiB0eXBlIG9wYWNpdGllc1xuICAgIHZhciBmb2N1cyA9IGZ1bmN0aW9uKGopIHtcbiAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMC42IDogMC4xOyB9KTtcbiAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaSA9PSBqID8gIDAuNiA6IDAuMTsgfSk7XG4gICAgICAgIGZpcnN0UGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgPT0gaiA/ICAxLjAgOiAwLjE7IH0pXG4gICAgICAgIHNlY29uZFBsb3Quc2VsZWN0QWxsKFwiZ1wiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMS4wIDogMC4xOyB9KVxuICAgIH07XG5cbiAgICAvLyBBZGQgaG92ZXJpbmcgYmVoYXZpb3IgdG8gbGVnZW5kXG4gICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgIGZvY3VzKGkpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmb2N1c0FsbCk7XG4gICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICBmb2N1cyhpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZm9jdXNBbGwpO1xuXG4gICAgZm9jdXNBbGwoKTtcbn0pKCk7XG5cbihmdW5jdGlvbigpIHtcbiAgICAvLyBHZXQgcmVmZXJlbmNlcyB0byBpbXBvcnRhbnQgdGFnc1xuICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjY2xldnItcGxvdC1zdmdcIik7XG4gICAgdmFyIHNjYXR0ZXJQbG90ID0gc3ZnLnNlbGVjdChcIiNjbGV2ci1wbG90XCIpO1xuICAgIHZhciBib3VuZGluZ0JveCA9IHNjYXR0ZXJQbG90LnNlbGVjdChcInJlY3RcIik7XG4gICAgdmFyIGxlZ2VuZCA9IHN2Zy5zZWxlY3QoXCIjY2xldnItbGVnZW5kXCIpO1xuXG4gICAgLy8gUmV0cmlldmUgc2NhdHRlciBwbG90IGJvdW5kaW5nIGJveCBjb29yZGluYXRlc1xuICAgIHZhciB4TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInhcIikpO1xuICAgIHZhciB4TWF4ID0geE1pbiArIHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ3aWR0aFwiKSk7XG4gICAgdmFyIHlNaW4gPSBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwieVwiKSk7XG4gICAgdmFyIHlNYXggPSB5TWluICsgcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcImhlaWdodFwiKSk7XG5cbiAgICB2YXIgY29sb3JzID0gW1xuICAgICAgICBcIiNGNDQzMzZcIiwgXCIjRTkxRTYzXCIsIFwiIzlDMjdCMFwiLCBcIiM2NzNBQjdcIiwgXCIjM0Y1MUI1XCIsXG4gICAgICAgIFwiIzIxOTZGM1wiLCBcIiMwM0E5RjRcIiwgXCIjMDBCQ0Q0XCIsIFwiIzAwOTY4OFwiLCBcIiM0Q0FGNTBcIixcbiAgICAgICAgXCIjOEJDMzRBXCIsIFwiI0NEREMzOVwiLCBcIiNGRkVCM0JcIiwgXCIjRkY5ODAwXCIsIFwiIzc5NTU0OFwiLFxuICAgICAgICBcIiM5RTlFOUVcIixcbiAgICBdO1xuICAgIHZhciBxdWVzdGlvbl90eXBlcyA9IFtcbiAgICAgICAgXCJFeGlzdHNcIiwgXCJMZXNzIHRoYW5cIiwgXCJHcmVhdGVyIHRoYW5cIiwgXCJDb3VudFwiLCBcIlF1ZXJ5IG1hdGVyaWFsXCIsXG4gICAgICAgIFwiUXVlcnkgc2l6ZVwiLCBcIlF1ZXJ5IGNvbG9yXCIsIFwiUXVlcnkgc2hhcGVcIiwgXCJFcXVhbCBjb2xvclwiLFxuICAgICAgICBcIkVxdWFsIGludGVnZXJcIiwgXCJFcXVhbCBzaGFwZVwiLCBcIkVxdWFsIHNpemVcIiwgXCJFcXVhbCBtYXRlcmlhbFwiXG4gICAgXTtcbiAgICAgICAgXG4gICAgLy8gVWdseSB3b3JrYXJvdW5kIGZvciBwZXJtdXRlZCBxdWVzdGlvbiB0eXBlcyBpbiBKU09OIGZpbGUuXG4gICAgdmFyIHF1ZXN0aW9uX3R5cGVfbWFwcGluZyA9IFsxLCA1LCAxMSwgNiwgOCwgMCwgOSwgNywgMTIsIDMsIDEwLCAyLCA0XTtcblxuICAgIHZhciBkYXRhc2V0O1xuICAgIHZhciB4U2NhbGU7XG4gICAgdmFyIHlTY2FsZTtcbiAgICBkMy5qc29uKFwiZGF0YS9jbGV2cl90c25lLmpzb25cIiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBkYXRhc2V0ID0gZGF0YS5zbGljZSgwLCAxMDI0KTtcblxuICAgICAgICAvLyBDcmVhdGUgc2NhbGVzXG4gICAgICAgIHhTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgIC5kb21haW4oW2QzLm1pbihkYXRhc2V0LCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5sYXllcl9hbGwueDsgfSksXG4gICAgICAgICAgICAgICAgICAgICBkMy5tYXgoZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQubGF5ZXJfYWxsLng7IH0pXSlcbiAgICAgICAgICAgIC5yYW5nZVJvdW5kKFt4TWluLCB4TWF4XSk7XG4gICAgICAgIHlTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgIC5kb21haW4oW2QzLm1pbihkYXRhc2V0LCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5sYXllcl9hbGwueTsgfSksXG4gICAgICAgICAgICAgICAgICAgICBkMy5tYXgoZGF0YXNldCwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQubGF5ZXJfYWxsLnk7IH0pXSlcbiAgICAgICAgICAgIC5yYW5nZVJvdW5kKFt5TWluLCB5TWF4XSk7XG5cbiAgICAgICAgdmFyIHRvb2x0aXAgPSBkMy5zZWxlY3QoXCJib2R5XCIpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInRvb2x0aXAtdHNuZS1jbGV2ZXJcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b29sdGlwIGZpZ3VyZS10ZXh0XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJiYWNrZ3JvdW5kXCIsIFwiI2RkZFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiYm9yZGVyLXJhZGl1c1wiLCBcIjZweFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwicGFkZGluZ1wiLCBcIjEwcHhcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggZGF0YSBwb2ludHMgaW50byBncm91cHMgYnkgcXVlc3Rpb24gdHlwZVxuICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAuZGF0YShjb2xvcnMpXG4gICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxLjApXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihjLCBpKSB7XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgICAgICAuZGF0YShkYXRhc2V0LmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBxdWVzdGlvbl90eXBlX21hcHBpbmdbZC5xdWVzdGlvbl90eXBlXSA9PSBpOyB9KSlcbiAgICAgICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjeFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5sYXllcl9hbGwueCk7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLmxheWVyX2FsbC55KTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiAzLjAsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvcnNbaV07IH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KVxuICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNUeXBlKHF1ZXN0aW9uX3R5cGVfbWFwcGluZ1tkLnF1ZXN0aW9uX3R5cGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC5odG1sKGQucXVlc3Rpb24gKyBcIj9cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzQWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGxlZ2VuZFxuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuZGF0YShxdWVzdGlvbl90eXBlcylcbiAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgXCJjeFwiOiAwLFxuICAgICAgICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjAgKiBpOyB9LFxuICAgICAgICAgICAgICAgIFwiclwiOiA2LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gY29sb3JzW2ldOyB9KVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpXG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuZGF0YShxdWVzdGlvbl90eXBlcylcbiAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuYXR0cnMoe1xuICAgICAgICAgICAgICAgIFwieFwiOiAyMCxcbiAgICAgICAgICAgICAgICBcInlcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjAgKiBpOyB9LFxuICAgICAgICAgICAgICAgIFwiZHlcIjogXCIwLjRlbVwiLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jbGFzc2VkKFwiZmlndXJlLXRleHRcIiwgdHJ1ZSlcbiAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pO1xuXG4gICAgICAgIC8vIEZvY3VzZXMgb24gYWxsIHBvaW50cyBieSByZXNldHRpbmcgdGhlIG9wYWNpdGllc1xuICAgICAgICB2YXIgZm9jdXNBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC42KTtcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdEFsbChcImdcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEuMCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gRm9jdXNlcyBvbiBhIHNpbmdsZSBxdWVzdGlvbiB0eXBlIGJ5IGxvd2VyaW5nIG90aGVyXG4gICAgICAgIC8vIHF1ZXN0aW9uIHR5cGUgb3BhY2l0aWVzXG4gICAgICAgIHZhciBmb2N1cyA9IGZ1bmN0aW9uKGopIHtcbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgPT0gaiA/ICAwLjYgOiAwLjE7IH0pO1xuICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgPT0gaiA/ICAwLjYgOiAwLjE7IH0pO1xuICAgICAgICAgICAgc2NhdHRlclBsb3Quc2VsZWN0QWxsKFwiZ1wiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaSA9PSBqID8gIDEuMCA6IDAuMTsgfSlcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZm9jdXNUeXBlID0gZnVuY3Rpb24oaikge1xuICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaSA9PSBqID8gIDAuNiA6IDAuMTsgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQWRkIGhvdmVyaW5nIGJlaGF2aW9yIHRvIGxlZ2VuZFxuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgICAgICBmb2N1cyhpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmb2N1c0FsbCk7XG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgICAgICBmb2N1cyhpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmb2N1c0FsbCk7XG5cbiAgICAgICAgZm9jdXNBbGwoKTtcbiAgICB9KTtcbiAgICBzdmdQYW5ab29tID0gcmVxdWlyZSgnc3ZnLXBhbi16b29tJyk7XG4gICAgdmFyIHBhblpvb20gPSBzdmdQYW5ab29tKCcjY2xldnItcGxvdC1zdmcnLCB7XG4gICAgICAgICAgdmlld3BvcnRTZWxlY3RvcjogJyN0c25lLWRpYWdyYW0gI2NsZXZyLXBsb3QnLFxuICAgICAgICAgIHpvb21FbmFibGVkOiB0cnVlLFxuICAgICAgICAgIGZpdDogdHJ1ZSxcbiAgICAgICAgICBjZW50ZXI6IHRydWUsXG4gICAgICAgICAgbWluWm9vbTogMC4xLFxuICAgICAgICAgIGNvbnRyb2xJY29uc0VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB9KS56b29tQXRQb2ludEJ5KDAuNiwge3g6IC0xMCwgeTogMTgwfSk7IFxuICAgICAgICBcbiAgICBzdmcuc2VsZWN0KFwiI2NsZXZyLXpvb21cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihkKXtcblx0XHRwYW5ab29tLnJlc2V0Wm9vbSgpXG5cdFx0cGFuWm9vbS5yZXNldFBhbigpXG5cdFx0cGFuWm9vbS56b29tQXRQb2ludEJ5KDAuNiwge3g6IC0xMCwgeTogMTgwfSk7IFxuXHR9KTtcbiAgICAgICBcbn0pKCk7XG4oZnVuY3Rpb24oKSB7XG4gICAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gaW1wb3J0YW50IHRhZ3NcbiAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI3N0eWxlLXRyYW5zZmVyLXBsb3Qtc3ZnXCIpO1xuICAgIHZhciBzY2F0dGVyUGxvdCA9IHN2Zy5zZWxlY3QoXCIjc3R5bGUtdHJhbnNmZXItcGxvdFwiKTtcbiAgICB2YXIgYm91bmRpbmdCb3ggPSBzY2F0dGVyUGxvdC5zZWxlY3QoXCJyZWN0XCIpO1xuICAgIHZhciBsZWdlbmQgPSBzdmcuc2VsZWN0KFwiI3N0eWxlLXRyYW5zZmVyLWxlZ2VuZFwiKTtcblxuICAgIC8vIFJldHJpZXZlIHNjYXR0ZXIgcGxvdCBib3VuZGluZyBib3ggY29vcmRpbmF0ZXNcbiAgICB2YXIgeE1pbiA9IHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJ4XCIpKTtcbiAgICB2YXIgeE1heCA9IHhNaW4gKyBwYXJzZUludChib3VuZGluZ0JveC5hdHRyKFwid2lkdGhcIikpO1xuICAgIHZhciB5TWluID0gcGFyc2VJbnQoYm91bmRpbmdCb3guYXR0cihcInlcIikpO1xuICAgIHZhciB5TWF4ID0geU1pbiArIHBhcnNlSW50KGJvdW5kaW5nQm94LmF0dHIoXCJoZWlnaHRcIikpO1xuXG4gICAgdmFyIGNvbG9ycyA9IFtcbiAgICAgICAgXCIjRjQ0MzM2XCIsIFwiI0U5MUU2M1wiLCBcIiM5QzI3QjBcIiwgXCIjNjczQUI3XCIsIFwiIzNGNTFCNVwiLFxuICAgICAgICBcIiMyMTk2RjNcIiwgXCIjMDNBOUY0XCIsIFwiIzAwQkNENFwiLFxuICAgIF07XG5cbiAgICB2YXIgZGF0YXNldDtcbiAgICB2YXIgeFNjYWxlO1xuICAgIHZhciB5U2NhbGU7XG4gICAgZDMuanNvbihcImRhdGEvc3R5bGVfdHNuZS5qc29uXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgZGF0YXNldCA9IHtcImFydGlzdHNcIjogZGF0YS5hcnRpc3RzLCBcInBvaW50c1wiOiBkYXRhLnBvaW50cy5zbGljZSgwLCA1MTIpfTtcblxuICAgICAgICAvLyBDcmVhdGUgc2NhbGVzXG4gICAgICAgIHhTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgIC5kb21haW4oW2QzLm1pbihkYXRhc2V0LnBvaW50cywgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueDsgfSksXG4gICAgICAgICAgICAgICAgICAgICBkMy5tYXgoZGF0YXNldC5wb2ludHMsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLng7IH0pXSlcbiAgICAgICAgICAgIC5yYW5nZVJvdW5kKFt4TWluLCB4TWF4XSk7XG4gICAgICAgIHlTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgIC5kb21haW4oW2QzLm1pbihkYXRhc2V0LnBvaW50cywgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueTsgfSksXG4gICAgICAgICAgICAgICAgICAgICBkMy5tYXgoZGF0YXNldC5wb2ludHMsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnk7IH0pXSlcbiAgICAgICAgICAgIC5yYW5nZVJvdW5kKFt5TWluLCB5TWF4XSk7XG5cbiAgICAgICAgdmFyIHRvb2x0aXAgPSBkMy5zZWxlY3QoXCJib2R5XCIpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInRvb2x0aXAtdHNuZS1zdHlsZS10cmFuc2ZlclwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRvb2x0aXBcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggZGF0YSBwb2ludHMgaW50byBncm91cHMgYnkgcXVlc3Rpb24gdHlwZVxuICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAuZGF0YShjb2xvcnMpXG4gICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxLjApXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihjLCBpKSB7XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgICAgICAuZGF0YShkYXRhc2V0LnBvaW50cy5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5hcnRpc3RfaW5kZXggPT0gaTsgfSkpXG4gICAgICAgICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHJzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY3hcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyXCI6IDMuMCxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGNvbG9yc1tpXTsgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpXG4gICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1c1R5cGUoZC5hcnRpc3RfaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBcImltYWdlcy9zdHlsZV9pbWFnZXMvXCIgKyBkLmZpbGVuYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwLmh0bWwoXCI8aW1nIHNyYz1cIiArIHVybCArIFwiIGNsYXNzPSdsb2FkaW5nJy8+XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1c0FsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENyZWF0ZSBsZWdlbmRcbiAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmRhdGEoT2JqZWN0LmtleXMoZGF0YXNldC5hcnRpc3RzKSlcbiAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgXCJjeFwiOiAwLFxuICAgICAgICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjAgKiBpOyB9LFxuICAgICAgICAgICAgICAgIFwiclwiOiA2LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gY29sb3JzW2RdOyB9KVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpXG4gICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuZGF0YShPYmplY3Qua2V5cyhkYXRhc2V0LmFydGlzdHMpKVxuICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAgIC5hdHRycyh7XG4gICAgICAgICAgICAgICAgXCJ4XCI6IDIwLFxuICAgICAgICAgICAgICAgIFwieVwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiAyMCAqIGk7IH0sXG4gICAgICAgICAgICAgICAgXCJkeVwiOiBcIjAuNGVtXCIsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNsYXNzZWQoXCJmaWd1cmUtdGV4dFwiLCB0cnVlKVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0YXNldC5hcnRpc3RzW2RdOyB9KTtcblxuICAgICAgICAvLyBGb2N1c2VzIG9uIGFsbCBwb2ludHMgYnkgcmVzZXR0aW5nIHRoZSBvcGFjaXRpZXNcbiAgICAgICAgdmFyIGZvY3VzQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjYpO1xuICAgICAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuNik7XG4gICAgICAgICAgICBzY2F0dGVyUGxvdC5zZWxlY3RBbGwoXCJnXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxLjApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEZvY3VzZXMgb24gYSBzaW5nbGUgcXVlc3Rpb24gdHlwZSBieSBsb3dlcmluZyBvdGhlclxuICAgICAgICAvLyBxdWVzdGlvbiB0eXBlIG9wYWNpdGllc1xuICAgICAgICB2YXIgZm9jdXMgPSBmdW5jdGlvbihqKSB7XG4gICAgICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMC42IDogMC4xOyB9KTtcbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBpID09IGogPyAgMC42IDogMC4xOyB9KTtcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90LnNlbGVjdEFsbChcImdcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgPT0gaiA/ICAxLjAgOiAwLjE7IH0pXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGZvY3VzVHlwZSA9IGZ1bmN0aW9uKGopIHtcbiAgICAgICAgICAgIGxlZ2VuZC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgPT0gaiA/ICAwLjYgOiAwLjE7IH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFkZCBob3ZlcmluZyBiZWhhdmlvciB0byBsZWdlbmRcbiAgICAgICAgbGVnZW5kLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICAgICAgZm9jdXMoaSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZm9jdXNBbGwpO1xuICAgICAgICBsZWdlbmQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICAgICAgZm9jdXMoaSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZm9jdXNBbGwpO1xuXG4gICAgICAgIGZvY3VzQWxsKCk7XG4gICAgfSk7XG4gICAgXG4gICBzdmdQYW5ab29tID0gcmVxdWlyZSgnc3ZnLXBhbi16b29tJyk7XG4gICB2YXIgcGFuWm9vbSA9IHN2Z1Bhblpvb20oJyNzdHlsZS10cmFuc2Zlci1wbG90LXN2ZycsIHtcblx0ICB2aWV3cG9ydFNlbGVjdG9yOiAnI3RzbmUtZGlhZ3JhbSAjc3R5bGUtdHJhbnNmZXItcGxvdCcsXG5cdCAgem9vbUVuYWJsZWQ6IHRydWUsXG5cdCAgZml0OiB0cnVlLFxuXHQgIGNlbnRlcjogdHJ1ZSxcblx0ICBtaW5ab29tOiAwLjEsIFxuXHQgIGNvbnRyb2xJY29uc0VuYWJsZWQ6IGZhbHNlLFxuXHR9KTtcblx0cGFuWm9vbS56b29tQXRQb2ludEJ5KDAuNiwge3g6IC0xMCwgeTogMTgwfSk7IFxuXHRcblx0ZDMuc2VsZWN0KFwiI3N0eWxlLXpvb21cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihkKXtcblx0XHRwYW5ab29tLnJlc2V0Wm9vbSgpXG5cdFx0cGFuWm9vbS5yZXNldFBhbigpXG5cdFx0cGFuWm9vbS56b29tQXRQb2ludEJ5KDAuNiwge3g6IC0xMCwgeTogMTgwfSk7IFxuXHR9KTtcbn0pKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJ2YXIgV2hlZWwgPSByZXF1aXJlKCcuL3VuaXdoZWVsJylcbiwgQ29udHJvbEljb25zID0gcmVxdWlyZSgnLi9jb250cm9sLWljb25zJylcbiwgVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxpdGllcycpXG4sIFN2Z1V0aWxzID0gcmVxdWlyZSgnLi9zdmctdXRpbGl0aWVzJylcbiwgU2hhZG93Vmlld3BvcnQgPSByZXF1aXJlKCcuL3NoYWRvdy12aWV3cG9ydCcpXG5cbnZhciBTdmdQYW5ab29tID0gZnVuY3Rpb24oc3ZnLCBvcHRpb25zKSB7XG4gIHRoaXMuaW5pdChzdmcsIG9wdGlvbnMpXG59XG5cbnZhciBvcHRpb25zRGVmYXVsdHMgPSB7XG4gIHZpZXdwb3J0U2VsZWN0b3I6ICcuc3ZnLXBhbi16b29tX3ZpZXdwb3J0JyAvLyBWaWV3cG9ydCBzZWxlY3Rvci4gQ2FuIGJlIHF1ZXJ5U2VsZWN0b3Igc3RyaW5nIG9yIFNWR0VsZW1lbnRcbiwgcGFuRW5hYmxlZDogdHJ1ZSAvLyBlbmFibGUgb3IgZGlzYWJsZSBwYW5uaW5nIChkZWZhdWx0IGVuYWJsZWQpXG4sIGNvbnRyb2xJY29uc0VuYWJsZWQ6IGZhbHNlIC8vIGluc2VydCBpY29ucyB0byBnaXZlIHVzZXIgYW4gb3B0aW9uIGluIGFkZGl0aW9uIHRvIG1vdXNlIGV2ZW50cyB0byBjb250cm9sIHBhbi96b29tIChkZWZhdWx0IGRpc2FibGVkKVxuLCB6b29tRW5hYmxlZDogdHJ1ZSAvLyBlbmFibGUgb3IgZGlzYWJsZSB6b29taW5nIChkZWZhdWx0IGVuYWJsZWQpXG4sIGRibENsaWNrWm9vbUVuYWJsZWQ6IHRydWUgLy8gZW5hYmxlIG9yIGRpc2FibGUgem9vbWluZyBieSBkb3VibGUgY2xpY2tpbmcgKGRlZmF1bHQgZW5hYmxlZClcbiwgbW91c2VXaGVlbFpvb21FbmFibGVkOiB0cnVlIC8vIGVuYWJsZSBvciBkaXNhYmxlIHpvb21pbmcgYnkgbW91c2Ugd2hlZWwgKGRlZmF1bHQgZW5hYmxlZClcbiwgcHJldmVudE1vdXNlRXZlbnRzRGVmYXVsdDogdHJ1ZSAvLyBlbmFibGUgb3IgZGlzYWJsZSBwcmV2ZW50RGVmYXVsdCBmb3IgbW91c2UgZXZlbnRzXG4sIHpvb21TY2FsZVNlbnNpdGl2aXR5OiAwLjEgLy8gWm9vbSBzZW5zaXRpdml0eVxuLCBtaW5ab29tOiAwLjUgLy8gTWluaW11bSBab29tIGxldmVsXG4sIG1heFpvb206IDEwIC8vIE1heGltdW0gWm9vbSBsZXZlbFxuLCBmaXQ6IHRydWUgLy8gZW5hYmxlIG9yIGRpc2FibGUgdmlld3BvcnQgZml0IGluIFNWRyAoZGVmYXVsdCB0cnVlKVxuLCBjb250YWluOiBmYWxzZSAvLyBlbmFibGUgb3IgZGlzYWJsZSB2aWV3cG9ydCBjb250YWluIHRoZSBzdmcgKGRlZmF1bHQgZmFsc2UpXG4sIGNlbnRlcjogdHJ1ZSAvLyBlbmFibGUgb3IgZGlzYWJsZSB2aWV3cG9ydCBjZW50ZXJpbmcgaW4gU1ZHIChkZWZhdWx0IHRydWUpXG4sIHJlZnJlc2hSYXRlOiAnYXV0bycgLy8gTWF4aW11bSBudW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmQgKGFsdGVyaW5nIFNWRydzIHZpZXdwb3J0KVxuLCBiZWZvcmVab29tOiBudWxsXG4sIG9uWm9vbTogbnVsbFxuLCBiZWZvcmVQYW46IG51bGxcbiwgb25QYW46IG51bGxcbiwgY3VzdG9tRXZlbnRzSGFuZGxlcjogbnVsbFxuLCBldmVudHNMaXN0ZW5lckVsZW1lbnQ6IG51bGxcbiwgb25VcGRhdGVkQ1RNOiBudWxsXG59XG5cblN2Z1Bhblpvb20ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihzdmcsIG9wdGlvbnMpIHtcbiAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgdGhpcy5zdmcgPSBzdmdcbiAgdGhpcy5kZWZzID0gc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2RlZnMnKVxuXG4gIC8vIEFkZCBkZWZhdWx0IGF0dHJpYnV0ZXMgdG8gU1ZHXG4gIFN2Z1V0aWxzLnNldHVwU3ZnQXR0cmlidXRlcyh0aGlzLnN2ZylcblxuICAvLyBTZXQgb3B0aW9uc1xuICB0aGlzLm9wdGlvbnMgPSBVdGlscy5leHRlbmQoVXRpbHMuZXh0ZW5kKHt9LCBvcHRpb25zRGVmYXVsdHMpLCBvcHRpb25zKVxuXG4gIC8vIFNldCBkZWZhdWx0IHN0YXRlXG4gIHRoaXMuc3RhdGUgPSAnbm9uZSdcblxuICAvLyBHZXQgZGltZW5zaW9uc1xuICB2YXIgYm91bmRpbmdDbGllbnRSZWN0Tm9ybWFsaXplZCA9IFN2Z1V0aWxzLmdldEJvdW5kaW5nQ2xpZW50UmVjdE5vcm1hbGl6ZWQoc3ZnKVxuICB0aGlzLndpZHRoID0gYm91bmRpbmdDbGllbnRSZWN0Tm9ybWFsaXplZC53aWR0aFxuICB0aGlzLmhlaWdodCA9IGJvdW5kaW5nQ2xpZW50UmVjdE5vcm1hbGl6ZWQuaGVpZ2h0XG5cbiAgLy8gSW5pdCBzaGFkb3cgdmlld3BvcnRcbiAgdGhpcy52aWV3cG9ydCA9IFNoYWRvd1ZpZXdwb3J0KFN2Z1V0aWxzLmdldE9yQ3JlYXRlVmlld3BvcnQodGhpcy5zdmcsIHRoaXMub3B0aW9ucy52aWV3cG9ydFNlbGVjdG9yKSwge1xuICAgIHN2ZzogdGhpcy5zdmdcbiAgLCB3aWR0aDogdGhpcy53aWR0aFxuICAsIGhlaWdodDogdGhpcy5oZWlnaHRcbiAgLCBmaXQ6IHRoaXMub3B0aW9ucy5maXRcbiAgLCBjb250YWluOiB0aGlzLm9wdGlvbnMuY29udGFpblxuICAsIGNlbnRlcjogdGhpcy5vcHRpb25zLmNlbnRlclxuICAsIHJlZnJlc2hSYXRlOiB0aGlzLm9wdGlvbnMucmVmcmVzaFJhdGVcbiAgLy8gUHV0IGNhbGxiYWNrcyBpbnRvIGZ1bmN0aW9ucyBhcyB0aGV5IGNhbiBjaGFuZ2UgdGhyb3VnaCB0aW1lXG4gICwgYmVmb3JlWm9vbTogZnVuY3Rpb24ob2xkU2NhbGUsIG5ld1NjYWxlKSB7XG4gICAgICBpZiAodGhhdC52aWV3cG9ydCAmJiB0aGF0Lm9wdGlvbnMuYmVmb3JlWm9vbSkge3JldHVybiB0aGF0Lm9wdGlvbnMuYmVmb3JlWm9vbShvbGRTY2FsZSwgbmV3U2NhbGUpfVxuICAgIH1cbiAgLCBvblpvb206IGZ1bmN0aW9uKHNjYWxlKSB7XG4gICAgICBpZiAodGhhdC52aWV3cG9ydCAmJiB0aGF0Lm9wdGlvbnMub25ab29tKSB7cmV0dXJuIHRoYXQub3B0aW9ucy5vblpvb20oc2NhbGUpfVxuICAgIH1cbiAgLCBiZWZvcmVQYW46IGZ1bmN0aW9uKG9sZFBvaW50LCBuZXdQb2ludCkge1xuICAgICAgaWYgKHRoYXQudmlld3BvcnQgJiYgdGhhdC5vcHRpb25zLmJlZm9yZVBhbikge3JldHVybiB0aGF0Lm9wdGlvbnMuYmVmb3JlUGFuKG9sZFBvaW50LCBuZXdQb2ludCl9XG4gICAgfVxuICAsIG9uUGFuOiBmdW5jdGlvbihwb2ludCkge1xuICAgICAgaWYgKHRoYXQudmlld3BvcnQgJiYgdGhhdC5vcHRpb25zLm9uUGFuKSB7cmV0dXJuIHRoYXQub3B0aW9ucy5vblBhbihwb2ludCl9XG4gICAgfVxuICAsIG9uVXBkYXRlZENUTTogZnVuY3Rpb24oY3RtKSB7XG4gICAgICBpZiAodGhhdC52aWV3cG9ydCAmJiB0aGF0Lm9wdGlvbnMub25VcGRhdGVkQ1RNKSB7cmV0dXJuIHRoYXQub3B0aW9ucy5vblVwZGF0ZWRDVE0oY3RtKX1cbiAgICB9XG4gIH0pXG5cbiAgLy8gV3JhcCBjYWxsYmFja3MgaW50byBwdWJsaWMgQVBJIGNvbnRleHRcbiAgdmFyIHB1YmxpY0luc3RhbmNlID0gdGhpcy5nZXRQdWJsaWNJbnN0YW5jZSgpXG4gIHB1YmxpY0luc3RhbmNlLnNldEJlZm9yZVpvb20odGhpcy5vcHRpb25zLmJlZm9yZVpvb20pXG4gIHB1YmxpY0luc3RhbmNlLnNldE9uWm9vbSh0aGlzLm9wdGlvbnMub25ab29tKVxuICBwdWJsaWNJbnN0YW5jZS5zZXRCZWZvcmVQYW4odGhpcy5vcHRpb25zLmJlZm9yZVBhbilcbiAgcHVibGljSW5zdGFuY2Uuc2V0T25QYW4odGhpcy5vcHRpb25zLm9uUGFuKVxuICBwdWJsaWNJbnN0YW5jZS5zZXRPblVwZGF0ZWRDVE0odGhpcy5vcHRpb25zLm9uVXBkYXRlZENUTSlcblxuICBpZiAodGhpcy5vcHRpb25zLmNvbnRyb2xJY29uc0VuYWJsZWQpIHtcbiAgICBDb250cm9sSWNvbnMuZW5hYmxlKHRoaXMpXG4gIH1cblxuICAvLyBJbml0IGV2ZW50cyBoYW5kbGVyc1xuICB0aGlzLmxhc3RNb3VzZVdoZWVsRXZlbnRUaW1lID0gRGF0ZS5ub3coKVxuICB0aGlzLnNldHVwSGFuZGxlcnMoKVxufVxuXG4vKipcbiAqIFJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnNldHVwSGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRoYXQgPSB0aGlzXG4gICAgLCBwcmV2RXZ0ID0gbnVsbCAvLyB1c2UgZm9yIHRvdWNoc3RhcnQgZXZlbnQgdG8gZGV0ZWN0IGRvdWJsZSB0YXBcbiAgICA7XG5cbiAgdGhpcy5ldmVudExpc3RlbmVycyA9IHtcbiAgICAvLyBNb3VzZSBkb3duIGdyb3VwXG4gICAgbW91c2Vkb3duOiBmdW5jdGlvbihldnQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB0aGF0LmhhbmRsZU1vdXNlRG93bihldnQsIHByZXZFdnQpO1xuICAgICAgcHJldkV2dCA9IGV2dFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICwgdG91Y2hzdGFydDogZnVuY3Rpb24oZXZ0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdGhhdC5oYW5kbGVNb3VzZURvd24oZXZ0LCBwcmV2RXZ0KTtcbiAgICAgIHByZXZFdnQgPSBldnRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gTW91c2UgdXAgZ3JvdXBcbiAgLCBtb3VzZXVwOiBmdW5jdGlvbihldnQpIHtcbiAgICAgIHJldHVybiB0aGF0LmhhbmRsZU1vdXNlVXAoZXZ0KTtcbiAgICB9XG4gICwgdG91Y2hlbmQ6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgcmV0dXJuIHRoYXQuaGFuZGxlTW91c2VVcChldnQpO1xuICAgIH1cblxuICAgIC8vIE1vdXNlIG1vdmUgZ3JvdXBcbiAgLCBtb3VzZW1vdmU6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgcmV0dXJuIHRoYXQuaGFuZGxlTW91c2VNb3ZlKGV2dCk7XG4gICAgfVxuICAsIHRvdWNobW92ZTogZnVuY3Rpb24oZXZ0KSB7XG4gICAgICByZXR1cm4gdGhhdC5oYW5kbGVNb3VzZU1vdmUoZXZ0KTtcbiAgICB9XG5cbiAgICAvLyBNb3VzZSBsZWF2ZSBncm91cFxuICAsIG1vdXNlbGVhdmU6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgcmV0dXJuIHRoYXQuaGFuZGxlTW91c2VVcChldnQpO1xuICAgIH1cbiAgLCB0b3VjaGxlYXZlOiBmdW5jdGlvbihldnQpIHtcbiAgICAgIHJldHVybiB0aGF0LmhhbmRsZU1vdXNlVXAoZXZ0KTtcbiAgICB9XG4gICwgdG91Y2hjYW5jZWw6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgcmV0dXJuIHRoYXQuaGFuZGxlTW91c2VVcChldnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEluaXQgY3VzdG9tIGV2ZW50cyBoYW5kbGVyIGlmIGF2YWlsYWJsZVxuICBpZiAodGhpcy5vcHRpb25zLmN1c3RvbUV2ZW50c0hhbmRsZXIgIT0gbnVsbCkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICB0aGlzLm9wdGlvbnMuY3VzdG9tRXZlbnRzSGFuZGxlci5pbml0KHtcbiAgICAgIHN2Z0VsZW1lbnQ6IHRoaXMuc3ZnXG4gICAgLCBldmVudHNMaXN0ZW5lckVsZW1lbnQ6IHRoaXMub3B0aW9ucy5ldmVudHNMaXN0ZW5lckVsZW1lbnRcbiAgICAsIGluc3RhbmNlOiB0aGlzLmdldFB1YmxpY0luc3RhbmNlKClcbiAgICB9KVxuXG4gICAgLy8gQ3VzdG9tIGV2ZW50IGhhbmRsZXIgbWF5IGhhbHQgYnVpbHRpbiBsaXN0ZW5lcnNcbiAgICB2YXIgaGFsdEV2ZW50TGlzdGVuZXJzID0gdGhpcy5vcHRpb25zLmN1c3RvbUV2ZW50c0hhbmRsZXIuaGFsdEV2ZW50TGlzdGVuZXJzXG4gICAgaWYgKGhhbHRFdmVudExpc3RlbmVycyAmJiBoYWx0RXZlbnRMaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gaGFsdEV2ZW50TGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50TGlzdGVuZXJzLmhhc093blByb3BlcnR5KGhhbHRFdmVudExpc3RlbmVyc1tpXSkpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVyc1toYWx0RXZlbnRMaXN0ZW5lcnNbaV1dXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBCaW5kIGV2ZW50TGlzdGVuZXJzXG4gIGZvciAodmFyIGV2ZW50IGluIHRoaXMuZXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAvLyBBdHRhY2ggZXZlbnQgdG8gZXZlbnRzTGlzdGVuZXJFbGVtZW50IG9yIFNWRyBpZiBub3QgYXZhaWxhYmxlXG4gICAgKHRoaXMub3B0aW9ucy5ldmVudHNMaXN0ZW5lckVsZW1lbnQgfHwgdGhpcy5zdmcpXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5ldmVudExpc3RlbmVyc1tldmVudF0sIGZhbHNlKVxuICB9XG5cbiAgLy8gWm9vbSB1c2luZyBtb3VzZSB3aGVlbFxuICBpZiAodGhpcy5vcHRpb25zLm1vdXNlV2hlZWxab29tRW5hYmxlZCkge1xuICAgIHRoaXMub3B0aW9ucy5tb3VzZVdoZWVsWm9vbUVuYWJsZWQgPSBmYWxzZSAvLyBzZXQgdG8gZmFsc2UgYXMgZW5hYmxlIHdpbGwgc2V0IGl0IGJhY2sgdG8gdHJ1ZVxuICAgIHRoaXMuZW5hYmxlTW91c2VXaGVlbFpvb20oKVxuICB9XG59XG5cbi8qKlxuICogRW5hYmxlIGFiaWxpdHkgdG8gem9vbSB1c2luZyBtb3VzZSB3aGVlbFxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5lbmFibGVNb3VzZVdoZWVsWm9vbSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMub3B0aW9ucy5tb3VzZVdoZWVsWm9vbUVuYWJsZWQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcblxuICAgIC8vIE1vdXNlIHdoZWVsIGxpc3RlbmVyXG4gICAgdGhpcy53aGVlbExpc3RlbmVyID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICByZXR1cm4gdGhhdC5oYW5kbGVNb3VzZVdoZWVsKGV2dCk7XG4gICAgfVxuXG4gICAgLy8gQmluZCB3aGVlbExpc3RlbmVyXG4gICAgV2hlZWwub24odGhpcy5vcHRpb25zLmV2ZW50c0xpc3RlbmVyRWxlbWVudCB8fCB0aGlzLnN2ZywgdGhpcy53aGVlbExpc3RlbmVyLCBmYWxzZSlcblxuICAgIHRoaXMub3B0aW9ucy5tb3VzZVdoZWVsWm9vbUVuYWJsZWQgPSB0cnVlXG4gIH1cbn1cblxuLyoqXG4gKiBEaXNhYmxlIGFiaWxpdHkgdG8gem9vbSB1c2luZyBtb3VzZSB3aGVlbFxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5kaXNhYmxlTW91c2VXaGVlbFpvb20gPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5tb3VzZVdoZWVsWm9vbUVuYWJsZWQpIHtcbiAgICBXaGVlbC5vZmYodGhpcy5vcHRpb25zLmV2ZW50c0xpc3RlbmVyRWxlbWVudCB8fCB0aGlzLnN2ZywgdGhpcy53aGVlbExpc3RlbmVyLCBmYWxzZSlcbiAgICB0aGlzLm9wdGlvbnMubW91c2VXaGVlbFpvb21FbmFibGVkID0gZmFsc2VcbiAgfVxufVxuXG4vKipcbiAqIEhhbmRsZSBtb3VzZSB3aGVlbCBldmVudFxuICpcbiAqIEBwYXJhbSAge0V2ZW50fSBldnRcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuaGFuZGxlTW91c2VXaGVlbCA9IGZ1bmN0aW9uKGV2dCkge1xuICBpZiAoIXRoaXMub3B0aW9ucy56b29tRW5hYmxlZCB8fCB0aGlzLnN0YXRlICE9PSAnbm9uZScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodGhpcy5vcHRpb25zLnByZXZlbnRNb3VzZUV2ZW50c0RlZmF1bHQpe1xuICAgIGlmIChldnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBEZWZhdWx0IGRlbHRhIGluIGNhc2UgdGhhdCBkZWx0YVkgaXMgbm90IGF2YWlsYWJsZVxuICB2YXIgZGVsdGEgPSBldnQuZGVsdGFZIHx8IDFcbiAgICAsIHRpbWVEZWx0YSA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RNb3VzZVdoZWVsRXZlbnRUaW1lXG4gICAgLCBkaXZpZGVyID0gMyArIE1hdGgubWF4KDAsIDMwIC0gdGltZURlbHRhKVxuXG4gIC8vIFVwZGF0ZSBjYWNoZVxuICB0aGlzLmxhc3RNb3VzZVdoZWVsRXZlbnRUaW1lID0gRGF0ZS5ub3coKVxuXG4gIC8vIE1ha2UgZW1waXJpY2FsIGFkanVzdG1lbnRzIGZvciBicm93c2VycyB0aGF0IGdpdmUgZGVsdGFZIGluIHBpeGVscyAoZGVsdGFNb2RlPTApXG4gIGlmICgnZGVsdGFNb2RlJyBpbiBldnQgJiYgZXZ0LmRlbHRhTW9kZSA9PT0gMCAmJiBldnQud2hlZWxEZWx0YSkge1xuICAgIGRlbHRhID0gZXZ0LmRlbHRhWSA9PT0gMCA/IDAgOiAgTWF0aC5hYnMoZXZ0LndoZWVsRGVsdGEpIC8gZXZ0LmRlbHRhWVxuICB9XG5cbiAgZGVsdGEgPSAtMC4zIDwgZGVsdGEgJiYgZGVsdGEgPCAwLjMgPyBkZWx0YSA6IChkZWx0YSA+IDAgPyAxIDogLTEpICogTWF0aC5sb2coTWF0aC5hYnMoZGVsdGEpICsgMTApIC8gZGl2aWRlclxuXG4gIHZhciBpbnZlcnNlZFNjcmVlbkNUTSA9IHRoaXMuc3ZnLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKVxuICAgICwgcmVsYXRpdmVNb3VzZVBvaW50ID0gU3ZnVXRpbHMuZ2V0RXZlbnRQb2ludChldnQsIHRoaXMuc3ZnKS5tYXRyaXhUcmFuc2Zvcm0oaW52ZXJzZWRTY3JlZW5DVE0pXG4gICAgLCB6b29tID0gTWF0aC5wb3coMSArIHRoaXMub3B0aW9ucy56b29tU2NhbGVTZW5zaXRpdml0eSwgKC0xKSAqIGRlbHRhKTsgLy8gbXVsdGlwbHlpbmcgYnkgbmVnLiAxIHNvIGFzIHRvIG1ha2Ugem9vbSBpbi9vdXQgYmVoYXZpb3IgbWF0Y2ggR29vZ2xlIG1hcHMgYmVoYXZpb3JcblxuICB0aGlzLnpvb21BdFBvaW50KHpvb20sIHJlbGF0aXZlTW91c2VQb2ludClcbn1cblxuLyoqXG4gKiBab29tIGluIGF0IGEgU1ZHIHBvaW50XG4gKlxuICogQHBhcmFtICB7U1ZHUG9pbnR9IHBvaW50XG4gKiBAcGFyYW0gIHtGbG9hdH0gem9vbVNjYWxlICAgIE51bWJlciByZXByZXNlbnRpbmcgaG93IG11Y2ggdG8gem9vbVxuICogQHBhcmFtICB7Qm9vbGVhbn0gem9vbUFic29sdXRlIERlZmF1bHQgZmFsc2UuIElmIHRydWUsIHpvb21TY2FsZSBpcyB0cmVhdGVkIGFzIGFuIGFic29sdXRlIHZhbHVlLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE90aGVyd2lzZSwgem9vbVNjYWxlIGlzIHRyZWF0ZWQgYXMgYSBtdWx0aXBsaWVkIChlLmcuIDEuMTAgd291bGQgem9vbSBpbiAxMCUpXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnpvb21BdFBvaW50ID0gZnVuY3Rpb24oem9vbVNjYWxlLCBwb2ludCwgem9vbUFic29sdXRlKSB7XG4gIHZhciBvcmlnaW5hbFN0YXRlID0gdGhpcy52aWV3cG9ydC5nZXRPcmlnaW5hbFN0YXRlKClcblxuICBpZiAoIXpvb21BYnNvbHV0ZSkge1xuICAgIC8vIEZpdCB6b29tU2NhbGUgaW4gc2V0IGJvdW5kc1xuICAgIGlmICh0aGlzLmdldFpvb20oKSAqIHpvb21TY2FsZSA8IHRoaXMub3B0aW9ucy5taW5ab29tICogb3JpZ2luYWxTdGF0ZS56b29tKSB7XG4gICAgICB6b29tU2NhbGUgPSAodGhpcy5vcHRpb25zLm1pblpvb20gKiBvcmlnaW5hbFN0YXRlLnpvb20pIC8gdGhpcy5nZXRab29tKClcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0Wm9vbSgpICogem9vbVNjYWxlID4gdGhpcy5vcHRpb25zLm1heFpvb20gKiBvcmlnaW5hbFN0YXRlLnpvb20pIHtcbiAgICAgIHpvb21TY2FsZSA9ICh0aGlzLm9wdGlvbnMubWF4Wm9vbSAqIG9yaWdpbmFsU3RhdGUuem9vbSkgLyB0aGlzLmdldFpvb20oKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBGaXQgem9vbVNjYWxlIGluIHNldCBib3VuZHNcbiAgICB6b29tU2NhbGUgPSBNYXRoLm1heCh0aGlzLm9wdGlvbnMubWluWm9vbSAqIG9yaWdpbmFsU3RhdGUuem9vbSwgTWF0aC5taW4odGhpcy5vcHRpb25zLm1heFpvb20gKiBvcmlnaW5hbFN0YXRlLnpvb20sIHpvb21TY2FsZSkpXG4gICAgLy8gRmluZCByZWxhdGl2ZSBzY2FsZSB0byBhY2hpZXZlIGRlc2lyZWQgc2NhbGVcbiAgICB6b29tU2NhbGUgPSB6b29tU2NhbGUvdGhpcy5nZXRab29tKClcbiAgfVxuXG4gIHZhciBvbGRDVE0gPSB0aGlzLnZpZXdwb3J0LmdldENUTSgpXG4gICAgLCByZWxhdGl2ZVBvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKG9sZENUTS5pbnZlcnNlKCkpXG4gICAgLCBtb2RpZmllciA9IHRoaXMuc3ZnLmNyZWF0ZVNWR01hdHJpeCgpLnRyYW5zbGF0ZShyZWxhdGl2ZVBvaW50LngsIHJlbGF0aXZlUG9pbnQueSkuc2NhbGUoem9vbVNjYWxlKS50cmFuc2xhdGUoLXJlbGF0aXZlUG9pbnQueCwgLXJlbGF0aXZlUG9pbnQueSlcbiAgICAsIG5ld0NUTSA9IG9sZENUTS5tdWx0aXBseShtb2RpZmllcilcblxuICBpZiAobmV3Q1RNLmEgIT09IG9sZENUTS5hKSB7XG4gICAgdGhpcy52aWV3cG9ydC5zZXRDVE0obmV3Q1RNKVxuICB9XG59XG5cbi8qKlxuICogWm9vbSBhdCBjZW50ZXIgcG9pbnRcbiAqXG4gKiBAcGFyYW0gIHtGbG9hdH0gc2NhbGVcbiAqIEBwYXJhbSAge0Jvb2xlYW59IGFic29sdXRlIE1hcmtzIHpvb20gc2NhbGUgYXMgcmVsYXRpdmUgb3IgYWJzb2x1dGVcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuem9vbSA9IGZ1bmN0aW9uKHNjYWxlLCBhYnNvbHV0ZSkge1xuICB0aGlzLnpvb21BdFBvaW50KHNjYWxlLCBTdmdVdGlscy5nZXRTdmdDZW50ZXJQb2ludCh0aGlzLnN2ZywgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpLCBhYnNvbHV0ZSlcbn1cblxuLyoqXG4gKiBab29tIHVzZWQgYnkgcHVibGljIGluc3RhbmNlXG4gKlxuICogQHBhcmFtICB7RmxvYXR9IHNjYWxlXG4gKiBAcGFyYW0gIHtCb29sZWFufSBhYnNvbHV0ZSBNYXJrcyB6b29tIHNjYWxlIGFzIHJlbGF0aXZlIG9yIGFic29sdXRlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnB1YmxpY1pvb20gPSBmdW5jdGlvbihzY2FsZSwgYWJzb2x1dGUpIHtcbiAgaWYgKGFic29sdXRlKSB7XG4gICAgc2NhbGUgPSB0aGlzLmNvbXB1dGVGcm9tUmVsYXRpdmVab29tKHNjYWxlKVxuICB9XG5cbiAgdGhpcy56b29tKHNjYWxlLCBhYnNvbHV0ZSlcbn1cblxuLyoqXG4gKiBab29tIGF0IHBvaW50IHVzZWQgYnkgcHVibGljIGluc3RhbmNlXG4gKlxuICogQHBhcmFtICB7RmxvYXR9IHNjYWxlXG4gKiBAcGFyYW0gIHtTVkdQb2ludHxPYmplY3R9IHBvaW50ICAgIEFuIG9iamVjdCB0aGF0IGhhcyB4IGFuZCB5IGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSAge0Jvb2xlYW59IGFic29sdXRlIE1hcmtzIHpvb20gc2NhbGUgYXMgcmVsYXRpdmUgb3IgYWJzb2x1dGVcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUucHVibGljWm9vbUF0UG9pbnQgPSBmdW5jdGlvbihzY2FsZSwgcG9pbnQsIGFic29sdXRlKSB7XG4gIGlmIChhYnNvbHV0ZSkge1xuICAgIC8vIFRyYW5zZm9ybSB6b29tIGludG8gYSByZWxhdGl2ZSB2YWx1ZVxuICAgIHNjYWxlID0gdGhpcy5jb21wdXRlRnJvbVJlbGF0aXZlWm9vbShzY2FsZSlcbiAgfVxuXG4gIC8vIElmIG5vdCBhIFNWR1BvaW50IGJ1dCBoYXMgeCBhbmQgeSB0aGVuIGNyZWF0ZSBhIFNWR1BvaW50XG4gIGlmIChVdGlscy5nZXRUeXBlKHBvaW50KSAhPT0gJ1NWR1BvaW50Jykge1xuICAgIGlmKCd4JyBpbiBwb2ludCAmJiAneScgaW4gcG9pbnQpIHtcbiAgICAgIHBvaW50ID0gU3ZnVXRpbHMuY3JlYXRlU1ZHUG9pbnQodGhpcy5zdmcsIHBvaW50LngsIHBvaW50LnkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignR2l2ZW4gcG9pbnQgaXMgaW52YWxpZCcpXG4gICAgfVxuICB9XG5cbiAgdGhpcy56b29tQXRQb2ludChzY2FsZSwgcG9pbnQsIGFic29sdXRlKVxufVxuXG4vKipcbiAqIEdldCB6b29tIHNjYWxlXG4gKlxuICogQHJldHVybiB7RmxvYXR9IHpvb20gc2NhbGVcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuZ2V0Wm9vbSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy52aWV3cG9ydC5nZXRab29tKClcbn1cblxuLyoqXG4gKiBHZXQgem9vbSBzY2FsZSBmb3IgcHVibGljIHVzYWdlXG4gKlxuICogQHJldHVybiB7RmxvYXR9IHpvb20gc2NhbGVcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuZ2V0UmVsYXRpdmVab29tID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnZpZXdwb3J0LmdldFJlbGF0aXZlWm9vbSgpXG59XG5cbi8qKlxuICogQ29tcHV0ZSBhY3R1YWwgem9vbSBmcm9tIHB1YmxpYyB6b29tXG4gKlxuICogQHBhcmFtICB7RmxvYXR9IHpvb21cbiAqIEByZXR1cm4ge0Zsb2F0fSB6b29tIHNjYWxlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmNvbXB1dGVGcm9tUmVsYXRpdmVab29tID0gZnVuY3Rpb24oem9vbSkge1xuICByZXR1cm4gem9vbSAqIHRoaXMudmlld3BvcnQuZ2V0T3JpZ2luYWxTdGF0ZSgpLnpvb21cbn1cblxuLyoqXG4gKiBTZXQgem9vbSB0byBpbml0aWFsIHN0YXRlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnJlc2V0Wm9vbSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb3JpZ2luYWxTdGF0ZSA9IHRoaXMudmlld3BvcnQuZ2V0T3JpZ2luYWxTdGF0ZSgpXG5cbiAgdGhpcy56b29tKG9yaWdpbmFsU3RhdGUuem9vbSwgdHJ1ZSk7XG59XG5cbi8qKlxuICogU2V0IHBhbiB0byBpbml0aWFsIHN0YXRlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLnJlc2V0UGFuID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGFuKHRoaXMudmlld3BvcnQuZ2V0T3JpZ2luYWxTdGF0ZSgpKTtcbn1cblxuLyoqXG4gKiBTZXQgcGFuIGFuZCB6b29tIHRvIGluaXRpYWwgc3RhdGVcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yZXNldFpvb20oKVxuICB0aGlzLnJlc2V0UGFuKClcbn1cblxuLyoqXG4gKiBIYW5kbGUgZG91YmxlIGNsaWNrIGV2ZW50XG4gKiBTZWUgaGFuZGxlTW91c2VEb3duKCkgZm9yIGFsdGVybmF0ZSBkZXRlY3Rpb24gbWV0aG9kXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmhhbmRsZURibENsaWNrID0gZnVuY3Rpb24oZXZ0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMucHJldmVudE1vdXNlRXZlbnRzRGVmYXVsdCkge1xuICAgIGlmIChldnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGV2dC5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgaWYgdGFyZ2V0IHdhcyBhIGNvbnRyb2wgYnV0dG9uXG4gIGlmICh0aGlzLm9wdGlvbnMuY29udHJvbEljb25zRW5hYmxlZCkge1xuICAgIHZhciB0YXJnZXRDbGFzcyA9IGV2dC50YXJnZXQuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnXG4gICAgaWYgKHRhcmdldENsYXNzLmluZGV4T2YoJ3N2Zy1wYW4tem9vbS1jb250cm9sJykgPiAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgdmFyIHpvb21GYWN0b3JcblxuICBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG4gICAgem9vbUZhY3RvciA9IDEvKCgxICsgdGhpcy5vcHRpb25zLnpvb21TY2FsZVNlbnNpdGl2aXR5KSAqIDIpIC8vIHpvb20gb3V0IHdoZW4gc2hpZnQga2V5IHByZXNzZWRcbiAgfSBlbHNlIHtcbiAgICB6b29tRmFjdG9yID0gKDEgKyB0aGlzLm9wdGlvbnMuem9vbVNjYWxlU2Vuc2l0aXZpdHkpICogMlxuICB9XG5cbiAgdmFyIHBvaW50ID0gU3ZnVXRpbHMuZ2V0RXZlbnRQb2ludChldnQsIHRoaXMuc3ZnKS5tYXRyaXhUcmFuc2Zvcm0odGhpcy5zdmcuZ2V0U2NyZWVuQ1RNKCkuaW52ZXJzZSgpKVxuICB0aGlzLnpvb21BdFBvaW50KHpvb21GYWN0b3IsIHBvaW50KVxufVxuXG4vKipcbiAqIEhhbmRsZSBjbGljayBldmVudFxuICpcbiAqIEBwYXJhbSB7RXZlbnR9IGV2dFxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5oYW5kbGVNb3VzZURvd24gPSBmdW5jdGlvbihldnQsIHByZXZFdnQpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5wcmV2ZW50TW91c2VFdmVudHNEZWZhdWx0KSB7XG4gICAgaWYgKGV2dC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICB9IGVsc2Uge1xuICAgICAgZXZ0LnJldHVyblZhbHVlID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBVdGlscy5tb3VzZUFuZFRvdWNoTm9ybWFsaXplKGV2dCwgdGhpcy5zdmcpXG5cbiAgLy8gRG91YmxlIGNsaWNrIGRldGVjdGlvbjsgbW9yZSBjb25zaXN0ZW50IHRoYW4gb25kYmxjbGlja1xuICBpZiAodGhpcy5vcHRpb25zLmRibENsaWNrWm9vbUVuYWJsZWQgJiYgVXRpbHMuaXNEYmxDbGljayhldnQsIHByZXZFdnQpKXtcbiAgICB0aGlzLmhhbmRsZURibENsaWNrKGV2dClcbiAgfSBlbHNlIHtcbiAgICAvLyBQYW4gbW9kZVxuICAgIHRoaXMuc3RhdGUgPSAncGFuJ1xuICAgIHRoaXMuZmlyc3RFdmVudENUTSA9IHRoaXMudmlld3BvcnQuZ2V0Q1RNKClcbiAgICB0aGlzLnN0YXRlT3JpZ2luID0gU3ZnVXRpbHMuZ2V0RXZlbnRQb2ludChldnQsIHRoaXMuc3ZnKS5tYXRyaXhUcmFuc2Zvcm0odGhpcy5maXJzdEV2ZW50Q1RNLmludmVyc2UoKSlcbiAgfVxufVxuXG4vKipcbiAqIEhhbmRsZSBtb3VzZSBtb3ZlIGV2ZW50XG4gKlxuICogQHBhcmFtICB7RXZlbnR9IGV2dFxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5oYW5kbGVNb3VzZU1vdmUgPSBmdW5jdGlvbihldnQpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5wcmV2ZW50TW91c2VFdmVudHNEZWZhdWx0KSB7XG4gICAgaWYgKGV2dC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICB9IGVsc2Uge1xuICAgICAgZXZ0LnJldHVyblZhbHVlID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5zdGF0ZSA9PT0gJ3BhbicgJiYgdGhpcy5vcHRpb25zLnBhbkVuYWJsZWQpIHtcbiAgICAvLyBQYW4gbW9kZVxuICAgIHZhciBwb2ludCA9IFN2Z1V0aWxzLmdldEV2ZW50UG9pbnQoZXZ0LCB0aGlzLnN2ZykubWF0cml4VHJhbnNmb3JtKHRoaXMuZmlyc3RFdmVudENUTS5pbnZlcnNlKCkpXG4gICAgICAsIHZpZXdwb3J0Q1RNID0gdGhpcy5maXJzdEV2ZW50Q1RNLnRyYW5zbGF0ZShwb2ludC54IC0gdGhpcy5zdGF0ZU9yaWdpbi54LCBwb2ludC55IC0gdGhpcy5zdGF0ZU9yaWdpbi55KVxuXG4gICAgdGhpcy52aWV3cG9ydC5zZXRDVE0odmlld3BvcnRDVE0pXG4gIH1cbn1cblxuLyoqXG4gKiBIYW5kbGUgbW91c2UgYnV0dG9uIHJlbGVhc2UgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge0V2ZW50fSBldnRcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuaGFuZGxlTW91c2VVcCA9IGZ1bmN0aW9uKGV2dCkge1xuICBpZiAodGhpcy5vcHRpb25zLnByZXZlbnRNb3VzZUV2ZW50c0RlZmF1bHQpIHtcbiAgICBpZiAoZXZ0LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBldnQucmV0dXJuVmFsdWUgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLnN0YXRlID09PSAncGFuJykge1xuICAgIC8vIFF1aXQgcGFuIG1vZGVcbiAgICB0aGlzLnN0YXRlID0gJ25vbmUnXG4gIH1cbn1cblxuLyoqXG4gKiBBZGp1c3Qgdmlld3BvcnQgc2l6ZSAob25seSkgc28gaXQgd2lsbCBmaXQgaW4gU1ZHXG4gKiBEb2VzIG5vdCBjZW50ZXIgaW1hZ2VcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuZml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciB2aWV3Qm94ID0gdGhpcy52aWV3cG9ydC5nZXRWaWV3Qm94KClcbiAgICAsIG5ld1NjYWxlID0gTWF0aC5taW4odGhpcy53aWR0aC92aWV3Qm94LndpZHRoLCB0aGlzLmhlaWdodC92aWV3Qm94LmhlaWdodClcblxuICB0aGlzLnpvb20obmV3U2NhbGUsIHRydWUpXG59XG5cbi8qKlxuICogQWRqdXN0IHZpZXdwb3J0IHNpemUgKG9ubHkpIHNvIGl0IHdpbGwgY29udGFpbiB0aGUgU1ZHXG4gKiBEb2VzIG5vdCBjZW50ZXIgaW1hZ2VcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuY29udGFpbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdmlld0JveCA9IHRoaXMudmlld3BvcnQuZ2V0Vmlld0JveCgpXG4gICAgLCBuZXdTY2FsZSA9IE1hdGgubWF4KHRoaXMud2lkdGgvdmlld0JveC53aWR0aCwgdGhpcy5oZWlnaHQvdmlld0JveC5oZWlnaHQpXG5cbiAgdGhpcy56b29tKG5ld1NjYWxlLCB0cnVlKVxufVxuXG4vKipcbiAqIEFkanVzdCB2aWV3cG9ydCBwYW4gKG9ubHkpIHNvIGl0IHdpbGwgYmUgY2VudGVyZWQgaW4gU1ZHXG4gKiBEb2VzIG5vdCB6b29tL2ZpdC9jb250YWluIGltYWdlXG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmNlbnRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdmlld0JveCA9IHRoaXMudmlld3BvcnQuZ2V0Vmlld0JveCgpXG4gICAgLCBvZmZzZXRYID0gKHRoaXMud2lkdGggLSAodmlld0JveC53aWR0aCArIHZpZXdCb3gueCAqIDIpICogdGhpcy5nZXRab29tKCkpICogMC41XG4gICAgLCBvZmZzZXRZID0gKHRoaXMuaGVpZ2h0IC0gKHZpZXdCb3guaGVpZ2h0ICsgdmlld0JveC55ICogMikgKiB0aGlzLmdldFpvb20oKSkgKiAwLjVcblxuICB0aGlzLmdldFB1YmxpY0luc3RhbmNlKCkucGFuKHt4OiBvZmZzZXRYLCB5OiBvZmZzZXRZfSlcbn1cblxuLyoqXG4gKiBVcGRhdGUgY29udGVudCBjYWNoZWQgQm9yZGVyQm94XG4gKiBVc2Ugd2hlbiB2aWV3cG9ydCBjb250ZW50cyBjaGFuZ2VcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUudXBkYXRlQkJveCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnZpZXdwb3J0LnNpbXBsZVZpZXdCb3hDYWNoZSgpXG59XG5cbi8qKlxuICogUGFuIHRvIGEgcmVuZGVyZWQgcG9zaXRpb25cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IHBvaW50IHt4OiAwLCB5OiAwfVxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5wYW4gPSBmdW5jdGlvbihwb2ludCkge1xuICB2YXIgdmlld3BvcnRDVE0gPSB0aGlzLnZpZXdwb3J0LmdldENUTSgpXG4gIHZpZXdwb3J0Q1RNLmUgPSBwb2ludC54XG4gIHZpZXdwb3J0Q1RNLmYgPSBwb2ludC55XG4gIHRoaXMudmlld3BvcnQuc2V0Q1RNKHZpZXdwb3J0Q1RNKVxufVxuXG4vKipcbiAqIFJlbGF0aXZlbHkgcGFuIHRoZSBncmFwaCBieSBhIHNwZWNpZmllZCByZW5kZXJlZCBwb3NpdGlvbiB2ZWN0b3JcbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IHBvaW50IHt4OiAwLCB5OiAwfVxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5wYW5CeSA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gIHZhciB2aWV3cG9ydENUTSA9IHRoaXMudmlld3BvcnQuZ2V0Q1RNKClcbiAgdmlld3BvcnRDVE0uZSArPSBwb2ludC54XG4gIHZpZXdwb3J0Q1RNLmYgKz0gcG9pbnQueVxuICB0aGlzLnZpZXdwb3J0LnNldENUTSh2aWV3cG9ydENUTSlcbn1cblxuLyoqXG4gKiBHZXQgcGFuIHZlY3RvclxuICpcbiAqIEByZXR1cm4ge09iamVjdH0ge3g6IDAsIHk6IDB9XG4gKi9cblN2Z1Bhblpvb20ucHJvdG90eXBlLmdldFBhbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLnZpZXdwb3J0LmdldFN0YXRlKClcblxuICByZXR1cm4ge3g6IHN0YXRlLngsIHk6IHN0YXRlLnl9XG59XG5cbi8qKlxuICogUmVjYWxjdWxhdGVzIGNhY2hlZCBzdmcgZGltZW5zaW9ucyBhbmQgY29udHJvbHMgcG9zaXRpb25cbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIC8vIEdldCBkaW1lbnNpb25zXG4gIHZhciBib3VuZGluZ0NsaWVudFJlY3ROb3JtYWxpemVkID0gU3ZnVXRpbHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0Tm9ybWFsaXplZCh0aGlzLnN2ZylcbiAgdGhpcy53aWR0aCA9IGJvdW5kaW5nQ2xpZW50UmVjdE5vcm1hbGl6ZWQud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBib3VuZGluZ0NsaWVudFJlY3ROb3JtYWxpemVkLmhlaWdodFxuXG4gIC8vIFJlY2FsY3VsYXRlIG9yaWdpbmFsIHN0YXRlXG4gIHZhciB2aWV3cG9ydCA9IHRoaXMudmlld3BvcnRcbiAgdmlld3BvcnQub3B0aW9ucy53aWR0aCA9IHRoaXMud2lkdGhcbiAgdmlld3BvcnQub3B0aW9ucy5oZWlnaHQgPSB0aGlzLmhlaWdodFxuICB2aWV3cG9ydC5wcm9jZXNzQ1RNKClcblxuICAvLyBSZXBvc2l0aW9uIGNvbnRyb2wgaWNvbnMgYnkgcmUtZW5hYmxpbmcgdGhlbVxuICBpZiAodGhpcy5vcHRpb25zLmNvbnRyb2xJY29uc0VuYWJsZWQpIHtcbiAgICB0aGlzLmdldFB1YmxpY0luc3RhbmNlKCkuZGlzYWJsZUNvbnRyb2xJY29ucygpXG4gICAgdGhpcy5nZXRQdWJsaWNJbnN0YW5jZSgpLmVuYWJsZUNvbnRyb2xJY29ucygpXG4gIH1cbn1cblxuLyoqXG4gKiBVbmJpbmQgbW91c2UgZXZlbnRzLCBmcmVlIGNhbGxiYWNrcyBhbmQgZGVzdHJveSBwdWJsaWMgaW5zdGFuY2VcbiAqL1xuU3ZnUGFuWm9vbS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGhhdCA9IHRoaXNcblxuICAvLyBGcmVlIGNhbGxiYWNrc1xuICB0aGlzLmJlZm9yZVpvb20gPSBudWxsXG4gIHRoaXMub25ab29tID0gbnVsbFxuICB0aGlzLmJlZm9yZVBhbiA9IG51bGxcbiAgdGhpcy5vblBhbiA9IG51bGxcbiAgdGhpcy5vblVwZGF0ZWRDVE0gPSBudWxsXG5cbiAgLy8gRGVzdHJveSBjdXN0b20gZXZlbnQgaGFuZGxlcnNcbiAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21FdmVudHNIYW5kbGVyICE9IG51bGwpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgdGhpcy5vcHRpb25zLmN1c3RvbUV2ZW50c0hhbmRsZXIuZGVzdHJveSh7XG4gICAgICBzdmdFbGVtZW50OiB0aGlzLnN2Z1xuICAgICwgZXZlbnRzTGlzdGVuZXJFbGVtZW50OiB0aGlzLm9wdGlvbnMuZXZlbnRzTGlzdGVuZXJFbGVtZW50XG4gICAgLCBpbnN0YW5jZTogdGhpcy5nZXRQdWJsaWNJbnN0YW5jZSgpXG4gICAgfSlcbiAgfVxuXG4gIC8vIFVuYmluZCBldmVudExpc3RlbmVyc1xuICBmb3IgKHZhciBldmVudCBpbiB0aGlzLmV2ZW50TGlzdGVuZXJzKSB7XG4gICAgKHRoaXMub3B0aW9ucy5ldmVudHNMaXN0ZW5lckVsZW1lbnQgfHwgdGhpcy5zdmcpXG4gICAgICAucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5ldmVudExpc3RlbmVyc1tldmVudF0sIGZhbHNlKVxuICB9XG5cbiAgLy8gVW5iaW5kIHdoZWVsTGlzdGVuZXJcbiAgdGhpcy5kaXNhYmxlTW91c2VXaGVlbFpvb20oKVxuXG4gIC8vIFJlbW92ZSBjb250cm9sIGljb25zXG4gIHRoaXMuZ2V0UHVibGljSW5zdGFuY2UoKS5kaXNhYmxlQ29udHJvbEljb25zKClcblxuICAvLyBSZXNldCB6b29tIGFuZCBwYW5cbiAgdGhpcy5yZXNldCgpXG5cbiAgLy8gUmVtb3ZlIGluc3RhbmNlIGZyb20gaW5zdGFuY2VzU3RvcmVcbiAgaW5zdGFuY2VzU3RvcmUgPSBpbnN0YW5jZXNTdG9yZS5maWx0ZXIoZnVuY3Rpb24oaW5zdGFuY2Upe1xuICAgIHJldHVybiBpbnN0YW5jZS5zdmcgIT09IHRoYXQuc3ZnXG4gIH0pXG5cbiAgLy8gRGVsZXRlIG9wdGlvbnMgYW5kIGl0cyBjb250ZW50c1xuICBkZWxldGUgdGhpcy5vcHRpb25zXG5cbiAgLy8gRGVsZXRlIHZpZXdwb3J0IHRvIG1ha2UgcHVibGljIHNoYWRvdyB2aWV3cG9ydCBmdW5jdGlvbnMgdW5jYWxsYWJsZVxuICBkZWxldGUgdGhpcy52aWV3cG9ydFxuXG4gIC8vIERlc3Ryb3kgcHVibGljIGluc3RhbmNlIGFuZCByZXdyaXRlIGdldFB1YmxpY0luc3RhbmNlXG4gIGRlbGV0ZSB0aGlzLnB1YmxpY0luc3RhbmNlXG4gIGRlbGV0ZSB0aGlzLnBpXG4gIHRoaXMuZ2V0UHVibGljSW5zdGFuY2UgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcHVibGljIGluc3RhbmNlIG9iamVjdFxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gUHVibGljIGluc3RhbmNlIG9iamVjdFxuICovXG5TdmdQYW5ab29tLnByb3RvdHlwZS5nZXRQdWJsaWNJbnN0YW5jZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGhhdCA9IHRoaXNcblxuICAvLyBDcmVhdGUgY2FjaGVcbiAgaWYgKCF0aGlzLnB1YmxpY0luc3RhbmNlKSB7XG4gICAgdGhpcy5wdWJsaWNJbnN0YW5jZSA9IHRoaXMucGkgPSB7XG4gICAgICAvLyBQYW5cbiAgICAgIGVuYWJsZVBhbjogZnVuY3Rpb24oKSB7dGhhdC5vcHRpb25zLnBhbkVuYWJsZWQgPSB0cnVlOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGRpc2FibGVQYW46IGZ1bmN0aW9uKCkge3RoYXQub3B0aW9ucy5wYW5FbmFibGVkID0gZmFsc2U7IHJldHVybiB0aGF0LnBpfVxuICAgICwgaXNQYW5FbmFibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gISF0aGF0Lm9wdGlvbnMucGFuRW5hYmxlZH1cbiAgICAsIHBhbjogZnVuY3Rpb24ocG9pbnQpIHt0aGF0LnBhbihwb2ludCk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgcGFuQnk6IGZ1bmN0aW9uKHBvaW50KSB7dGhhdC5wYW5CeShwb2ludCk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgZ2V0UGFuOiBmdW5jdGlvbigpIHtyZXR1cm4gdGhhdC5nZXRQYW4oKX1cbiAgICAgIC8vIFBhbiBldmVudFxuICAgICwgc2V0QmVmb3JlUGFuOiBmdW5jdGlvbihmbikge3RoYXQub3B0aW9ucy5iZWZvcmVQYW4gPSBmbiA9PT0gbnVsbCA/IG51bGwgOiBVdGlscy5wcm94eShmbiwgdGhhdC5wdWJsaWNJbnN0YW5jZSk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgc2V0T25QYW46IGZ1bmN0aW9uKGZuKSB7dGhhdC5vcHRpb25zLm9uUGFuID0gZm4gPT09IG51bGwgPyBudWxsIDogVXRpbHMucHJveHkoZm4sIHRoYXQucHVibGljSW5zdGFuY2UpOyByZXR1cm4gdGhhdC5waX1cbiAgICAgIC8vIFpvb20gYW5kIENvbnRyb2wgSWNvbnNcbiAgICAsIGVuYWJsZVpvb206IGZ1bmN0aW9uKCkge3RoYXQub3B0aW9ucy56b29tRW5hYmxlZCA9IHRydWU7IHJldHVybiB0aGF0LnBpfVxuICAgICwgZGlzYWJsZVpvb206IGZ1bmN0aW9uKCkge3RoYXQub3B0aW9ucy56b29tRW5hYmxlZCA9IGZhbHNlOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGlzWm9vbUVuYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAhIXRoYXQub3B0aW9ucy56b29tRW5hYmxlZH1cbiAgICAsIGVuYWJsZUNvbnRyb2xJY29uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhhdC5vcHRpb25zLmNvbnRyb2xJY29uc0VuYWJsZWQpIHtcbiAgICAgICAgICB0aGF0Lm9wdGlvbnMuY29udHJvbEljb25zRW5hYmxlZCA9IHRydWVcbiAgICAgICAgICBDb250cm9sSWNvbnMuZW5hYmxlKHRoYXQpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoYXQucGlcbiAgICAgIH1cbiAgICAsIGRpc2FibGVDb250cm9sSWNvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhhdC5vcHRpb25zLmNvbnRyb2xJY29uc0VuYWJsZWQpIHtcbiAgICAgICAgICB0aGF0Lm9wdGlvbnMuY29udHJvbEljb25zRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgIENvbnRyb2xJY29ucy5kaXNhYmxlKHRoYXQpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoYXQucGlcbiAgICAgIH1cbiAgICAsIGlzQ29udHJvbEljb25zRW5hYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICEhdGhhdC5vcHRpb25zLmNvbnRyb2xJY29uc0VuYWJsZWR9XG4gICAgICAvLyBEb3VibGUgY2xpY2sgem9vbVxuICAgICwgZW5hYmxlRGJsQ2xpY2tab29tOiBmdW5jdGlvbigpIHt0aGF0Lm9wdGlvbnMuZGJsQ2xpY2tab29tRW5hYmxlZCA9IHRydWU7IHJldHVybiB0aGF0LnBpfVxuICAgICwgZGlzYWJsZURibENsaWNrWm9vbTogZnVuY3Rpb24oKSB7dGhhdC5vcHRpb25zLmRibENsaWNrWm9vbUVuYWJsZWQgPSBmYWxzZTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCBpc0RibENsaWNrWm9vbUVuYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAhIXRoYXQub3B0aW9ucy5kYmxDbGlja1pvb21FbmFibGVkfVxuICAgICAgLy8gTW91c2Ugd2hlZWwgem9vbVxuICAgICwgZW5hYmxlTW91c2VXaGVlbFpvb206IGZ1bmN0aW9uKCkge3RoYXQuZW5hYmxlTW91c2VXaGVlbFpvb20oKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCBkaXNhYmxlTW91c2VXaGVlbFpvb206IGZ1bmN0aW9uKCkge3RoYXQuZGlzYWJsZU1vdXNlV2hlZWxab29tKCk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgaXNNb3VzZVdoZWVsWm9vbUVuYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAhIXRoYXQub3B0aW9ucy5tb3VzZVdoZWVsWm9vbUVuYWJsZWR9XG4gICAgICAvLyBab29tIHNjYWxlIGFuZCBib3VuZHNcbiAgICAsIHNldFpvb21TY2FsZVNlbnNpdGl2aXR5OiBmdW5jdGlvbihzY2FsZSkge3RoYXQub3B0aW9ucy56b29tU2NhbGVTZW5zaXRpdml0eSA9IHNjYWxlOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHNldE1pblpvb206IGZ1bmN0aW9uKHpvb20pIHt0aGF0Lm9wdGlvbnMubWluWm9vbSA9IHpvb207IHJldHVybiB0aGF0LnBpfVxuICAgICwgc2V0TWF4Wm9vbTogZnVuY3Rpb24oem9vbSkge3RoYXQub3B0aW9ucy5tYXhab29tID0gem9vbTsgcmV0dXJuIHRoYXQucGl9XG4gICAgICAvLyBab29tIGV2ZW50XG4gICAgLCBzZXRCZWZvcmVab29tOiBmdW5jdGlvbihmbikge3RoYXQub3B0aW9ucy5iZWZvcmVab29tID0gZm4gPT09IG51bGwgPyBudWxsIDogVXRpbHMucHJveHkoZm4sIHRoYXQucHVibGljSW5zdGFuY2UpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHNldE9uWm9vbTogZnVuY3Rpb24oZm4pIHt0aGF0Lm9wdGlvbnMub25ab29tID0gZm4gPT09IG51bGwgPyBudWxsIDogVXRpbHMucHJveHkoZm4sIHRoYXQucHVibGljSW5zdGFuY2UpOyByZXR1cm4gdGhhdC5waX1cbiAgICAgIC8vIFpvb21pbmdcbiAgICAsIHpvb206IGZ1bmN0aW9uKHNjYWxlKSB7dGhhdC5wdWJsaWNab29tKHNjYWxlLCB0cnVlKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCB6b29tQnk6IGZ1bmN0aW9uKHNjYWxlKSB7dGhhdC5wdWJsaWNab29tKHNjYWxlLCBmYWxzZSk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgem9vbUF0UG9pbnQ6IGZ1bmN0aW9uKHNjYWxlLCBwb2ludCkge3RoYXQucHVibGljWm9vbUF0UG9pbnQoc2NhbGUsIHBvaW50LCB0cnVlKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCB6b29tQXRQb2ludEJ5OiBmdW5jdGlvbihzY2FsZSwgcG9pbnQpIHt0aGF0LnB1YmxpY1pvb21BdFBvaW50KHNjYWxlLCBwb2ludCwgZmFsc2UpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHpvb21JbjogZnVuY3Rpb24oKSB7dGhpcy56b29tQnkoMSArIHRoYXQub3B0aW9ucy56b29tU2NhbGVTZW5zaXRpdml0eSk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgem9vbU91dDogZnVuY3Rpb24oKSB7dGhpcy56b29tQnkoMSAvICgxICsgdGhhdC5vcHRpb25zLnpvb21TY2FsZVNlbnNpdGl2aXR5KSk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgZ2V0Wm9vbTogZnVuY3Rpb24oKSB7cmV0dXJuIHRoYXQuZ2V0UmVsYXRpdmVab29tKCl9XG4gICAgICAvLyBDVE0gdXBkYXRlXG4gICAgLCBzZXRPblVwZGF0ZWRDVE06IGZ1bmN0aW9uKGZuKSB7dGhhdC5vcHRpb25zLm9uVXBkYXRlZENUTSA9IGZuID09PSBudWxsID8gbnVsbCA6IFV0aWxzLnByb3h5KGZuLCB0aGF0LnB1YmxpY0luc3RhbmNlKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgICAvLyBSZXNldFxuICAgICwgcmVzZXRab29tOiBmdW5jdGlvbigpIHt0aGF0LnJlc2V0Wm9vbSgpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHJlc2V0UGFuOiBmdW5jdGlvbigpIHt0aGF0LnJlc2V0UGFuKCk7IHJldHVybiB0aGF0LnBpfVxuICAgICwgcmVzZXQ6IGZ1bmN0aW9uKCkge3RoYXQucmVzZXQoKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgICAvLyBGaXQsIENvbnRhaW4gYW5kIENlbnRlclxuICAgICwgZml0OiBmdW5jdGlvbigpIHt0aGF0LmZpdCgpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGNvbnRhaW46IGZ1bmN0aW9uKCkge3RoYXQuY29udGFpbigpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIGNlbnRlcjogZnVuY3Rpb24oKSB7dGhhdC5jZW50ZXIoKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgICAvLyBTaXplIGFuZCBSZXNpemVcbiAgICAsIHVwZGF0ZUJCb3g6IGZ1bmN0aW9uKCkge3RoYXQudXBkYXRlQkJveCgpOyByZXR1cm4gdGhhdC5waX1cbiAgICAsIHJlc2l6ZTogZnVuY3Rpb24oKSB7dGhhdC5yZXNpemUoKTsgcmV0dXJuIHRoYXQucGl9XG4gICAgLCBnZXRTaXplczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgd2lkdGg6IHRoYXQud2lkdGhcbiAgICAgICAgLCBoZWlnaHQ6IHRoYXQuaGVpZ2h0XG4gICAgICAgICwgcmVhbFpvb206IHRoYXQuZ2V0Wm9vbSgpXG4gICAgICAgICwgdmlld0JveDogdGhhdC52aWV3cG9ydC5nZXRWaWV3Qm94KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRGVzdHJveVxuICAgICwgZGVzdHJveTogZnVuY3Rpb24oKSB7dGhhdC5kZXN0cm95KCk7IHJldHVybiB0aGF0LnBpfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLnB1YmxpY0luc3RhbmNlXG59XG5cbi8qKlxuICogU3RvcmVzIHBhaXJzIG9mIGluc3RhbmNlcyBvZiBTdmdQYW5ab29tIGFuZCBTVkdcbiAqIEVhY2ggcGFpciBpcyByZXByZXNlbnRlZCBieSBhbiBvYmplY3Qge3N2ZzogU1ZHU1ZHRWxlbWVudCwgaW5zdGFuY2U6IFN2Z1Bhblpvb219XG4gKlxuICogQHR5cGUge0FycmF5fVxuICovXG52YXIgaW5zdGFuY2VzU3RvcmUgPSBbXVxuXG52YXIgc3ZnUGFuWm9vbSA9IGZ1bmN0aW9uKGVsZW1lbnRPclNlbGVjdG9yLCBvcHRpb25zKXtcbiAgdmFyIHN2ZyA9IFV0aWxzLmdldFN2ZyhlbGVtZW50T3JTZWxlY3RvcilcblxuICBpZiAoc3ZnID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfSBlbHNlIHtcbiAgICAvLyBMb29rIGZvciBleGlzdGVudCBpbnN0YW5jZVxuICAgIGZvcih2YXIgaSA9IGluc3RhbmNlc1N0b3JlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoaW5zdGFuY2VzU3RvcmVbaV0uc3ZnID09PSBzdmcpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlc1N0b3JlW2ldLmluc3RhbmNlLmdldFB1YmxpY0luc3RhbmNlKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBpbnN0YW5jZSBub3QgZm91bmQgLSBjcmVhdGUgb25lXG4gICAgaW5zdGFuY2VzU3RvcmUucHVzaCh7XG4gICAgICBzdmc6IHN2Z1xuICAgICwgaW5zdGFuY2U6IG5ldyBTdmdQYW5ab29tKHN2Zywgb3B0aW9ucylcbiAgICB9KVxuXG4gICAgLy8gUmV0dXJuIGp1c3QgcHVzaGVkIGluc3RhbmNlXG4gICAgcmV0dXJuIGluc3RhbmNlc1N0b3JlW2luc3RhbmNlc1N0b3JlLmxlbmd0aCAtIDFdLmluc3RhbmNlLmdldFB1YmxpY0luc3RhbmNlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN2Z1Bhblpvb207XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL3N2Zy1wYW4tem9vbS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyB1bml3aGVlbCAwLjEuMiAoY3VzdG9taXplZClcbi8vIEEgdW5pZmllZCBjcm9zcyBicm93c2VyIG1vdXNlIHdoZWVsIGV2ZW50IGhhbmRsZXJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZWVtdWFsYXAvdW5pd2hlZWxcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKXtcblxuICAvL0Z1bGwgZGV0YWlsczogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvUmVmZXJlbmNlL0V2ZW50cy93aGVlbFxuXG4gIHZhciBwcmVmaXggPSBcIlwiLCBfYWRkRXZlbnRMaXN0ZW5lciwgX3JlbW92ZUV2ZW50TGlzdGVuZXIsIG9ud2hlZWwsIHN1cHBvcnQsIGZucyA9IFtdO1xuXG4gIC8vIGRldGVjdCBldmVudCBtb2RlbFxuICBpZiAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuICAgIF9hZGRFdmVudExpc3RlbmVyID0gXCJhZGRFdmVudExpc3RlbmVyXCI7XG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXIgPSBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIjtcbiAgfSBlbHNlIHtcbiAgICBfYWRkRXZlbnRMaXN0ZW5lciA9IFwiYXR0YWNoRXZlbnRcIjtcbiAgICBfcmVtb3ZlRXZlbnRMaXN0ZW5lciA9IFwiZGV0YWNoRXZlbnRcIjtcbiAgICBwcmVmaXggPSBcIm9uXCI7XG4gIH1cblxuICAvLyBkZXRlY3QgYXZhaWxhYmxlIHdoZWVsIGV2ZW50XG4gIHN1cHBvcnQgPSBcIm9ud2hlZWxcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpID8gXCJ3aGVlbFwiIDogLy8gTW9kZXJuIGJyb3dzZXJzIHN1cHBvcnQgXCJ3aGVlbFwiXG4gICAgICAgICAgICBkb2N1bWVudC5vbm1vdXNld2hlZWwgIT09IHVuZGVmaW5lZCA/IFwibW91c2V3aGVlbFwiIDogLy8gV2Via2l0IGFuZCBJRSBzdXBwb3J0IGF0IGxlYXN0IFwibW91c2V3aGVlbFwiXG4gICAgICAgICAgICBcIkRPTU1vdXNlU2Nyb2xsXCI7IC8vIGxldCdzIGFzc3VtZSB0aGF0IHJlbWFpbmluZyBicm93c2VycyBhcmUgb2xkZXIgRmlyZWZveFxuXG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2FsbGJhY2soZWxlbWVudCxjYWxsYmFjayxjYXB0dXJlKSB7XG5cbiAgICB2YXIgZm4gPSBmdW5jdGlvbihvcmlnaW5hbEV2ZW50KSB7XG5cbiAgICAgICFvcmlnaW5hbEV2ZW50ICYmICggb3JpZ2luYWxFdmVudCA9IHdpbmRvdy5ldmVudCApO1xuXG4gICAgICAvLyBjcmVhdGUgYSBub3JtYWxpemVkIGV2ZW50IG9iamVjdFxuICAgICAgdmFyIGV2ZW50ID0ge1xuICAgICAgICAvLyBrZWVwIGEgcmVmIHRvIHRoZSBvcmlnaW5hbCBldmVudCBvYmplY3RcbiAgICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudCxcbiAgICAgICAgdGFyZ2V0OiBvcmlnaW5hbEV2ZW50LnRhcmdldCB8fCBvcmlnaW5hbEV2ZW50LnNyY0VsZW1lbnQsXG4gICAgICAgIHR5cGU6IFwid2hlZWxcIixcbiAgICAgICAgZGVsdGFNb2RlOiBvcmlnaW5hbEV2ZW50LnR5cGUgPT0gXCJNb3pNb3VzZVBpeGVsU2Nyb2xsXCIgPyAwIDogMSxcbiAgICAgICAgZGVsdGFYOiAwLFxuICAgICAgICBkZWxhdFo6IDAsXG4gICAgICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0ID9cbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKSA6XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIGNhbGN1bGF0ZSBkZWx0YVkgKGFuZCBkZWx0YVgpIGFjY29yZGluZyB0byB0aGUgZXZlbnRcbiAgICAgIGlmICggc3VwcG9ydCA9PSBcIm1vdXNld2hlZWxcIiApIHtcbiAgICAgICAgZXZlbnQuZGVsdGFZID0gLSAxLzQwICogb3JpZ2luYWxFdmVudC53aGVlbERlbHRhO1xuICAgICAgICAvLyBXZWJraXQgYWxzbyBzdXBwb3J0IHdoZWVsRGVsdGFYXG4gICAgICAgIG9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YVggJiYgKCBldmVudC5kZWx0YVggPSAtIDEvNDAgKiBvcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFYICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldmVudC5kZWx0YVkgPSBvcmlnaW5hbEV2ZW50LmRldGFpbDtcbiAgICAgIH1cblxuICAgICAgLy8gaXQncyB0aW1lIHRvIGZpcmUgdGhlIGNhbGxiYWNrXG4gICAgICByZXR1cm4gY2FsbGJhY2soIGV2ZW50ICk7XG5cbiAgICB9O1xuXG4gICAgZm5zLnB1c2goe1xuICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgIGZuOiBmbixcbiAgICAgIGNhcHR1cmU6IGNhcHR1cmVcbiAgICB9KTtcblxuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENhbGxiYWNrKGVsZW1lbnQsY2FwdHVyZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZm5zW2ldLmVsZW1lbnQgPT09IGVsZW1lbnQgJiYgZm5zW2ldLmNhcHR1cmUgPT09IGNhcHR1cmUpIHtcbiAgICAgICAgcmV0dXJuIGZuc1tpXS5mbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCl7fTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUNhbGxiYWNrKGVsZW1lbnQsY2FwdHVyZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZm5zW2ldLmVsZW1lbnQgPT09IGVsZW1lbnQgJiYgZm5zW2ldLmNhcHR1cmUgPT09IGNhcHR1cmUpIHtcbiAgICAgICAgcmV0dXJuIGZucy5zcGxpY2UoaSwxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfYWRkV2hlZWxMaXN0ZW5lciggZWxlbSwgZXZlbnROYW1lLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSApIHtcblxuICAgIHZhciBjYjtcblxuICAgIGlmIChzdXBwb3J0ID09PSBcIndoZWVsXCIpIHtcbiAgICAgIGNiID0gY2FsbGJhY2s7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNiID0gY3JlYXRlQ2FsbGJhY2soZWxlbSxjYWxsYmFjayx1c2VDYXB0dXJlKTtcbiAgICB9XG5cbiAgICBlbGVtWyBfYWRkRXZlbnRMaXN0ZW5lciBdKCBwcmVmaXggKyBldmVudE5hbWUsIGNiLCB1c2VDYXB0dXJlIHx8IGZhbHNlICk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIF9yZW1vdmVXaGVlbExpc3RlbmVyKCBlbGVtLCBldmVudE5hbWUsIGNhbGxiYWNrLCB1c2VDYXB0dXJlICkge1xuXG4gICAgdmFyIGNiO1xuXG4gICAgaWYgKHN1cHBvcnQgPT09IFwid2hlZWxcIikge1xuICAgICAgY2IgPSBjYWxsYmFjaztcbiAgICB9IGVsc2Uge1xuICAgICAgY2IgPSBnZXRDYWxsYmFjayhlbGVtLHVzZUNhcHR1cmUpO1xuICAgIH1cblxuICAgIGVsZW1bIF9yZW1vdmVFdmVudExpc3RlbmVyIF0oIHByZWZpeCArIGV2ZW50TmFtZSwgY2IsIHVzZUNhcHR1cmUgfHwgZmFsc2UgKTtcblxuICAgIHJlbW92ZUNhbGxiYWNrKGVsZW0sdXNlQ2FwdHVyZSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFdoZWVsTGlzdGVuZXIoIGVsZW0sIGNhbGxiYWNrLCB1c2VDYXB0dXJlICkge1xuICAgIF9hZGRXaGVlbExpc3RlbmVyKCBlbGVtLCBzdXBwb3J0LCBjYWxsYmFjaywgdXNlQ2FwdHVyZSApO1xuXG4gICAgLy8gaGFuZGxlIE1vek1vdXNlUGl4ZWxTY3JvbGwgaW4gb2xkZXIgRmlyZWZveFxuICAgIGlmKCBzdXBwb3J0ID09IFwiRE9NTW91c2VTY3JvbGxcIiApIHtcbiAgICAgICAgX2FkZFdoZWVsTGlzdGVuZXIoIGVsZW0sIFwiTW96TW91c2VQaXhlbFNjcm9sbFwiLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlV2hlZWxMaXN0ZW5lcihlbGVtLGNhbGxiYWNrLHVzZUNhcHR1cmUpe1xuICAgIF9yZW1vdmVXaGVlbExpc3RlbmVyKGVsZW0sc3VwcG9ydCxjYWxsYmFjayx1c2VDYXB0dXJlKTtcblxuICAgIC8vIGhhbmRsZSBNb3pNb3VzZVBpeGVsU2Nyb2xsIGluIG9sZGVyIEZpcmVmb3hcbiAgICBpZiggc3VwcG9ydCA9PSBcIkRPTU1vdXNlU2Nyb2xsXCIgKSB7XG4gICAgICAgIF9yZW1vdmVXaGVlbExpc3RlbmVyKGVsZW0sIFwiTW96TW91c2VQaXhlbFNjcm9sbFwiLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBvbjogYWRkV2hlZWxMaXN0ZW5lcixcbiAgICBvZmY6IHJlbW92ZVdoZWVsTGlzdGVuZXJcbiAgfTtcblxufSkoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N2Zy1wYW4tem9vbS9zcmMvdW5pd2hlZWwuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIFN2Z1V0aWxzID0gcmVxdWlyZSgnLi9zdmctdXRpbGl0aWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlbmFibGU6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgLy8gU2VsZWN0IChhbmQgY3JlYXRlIGlmIG5lY2Vzc2FyeSkgZGVmc1xuICAgIHZhciBkZWZzID0gaW5zdGFuY2Uuc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2RlZnMnKVxuICAgIGlmICghZGVmcykge1xuICAgICAgZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdVdGlscy5zdmdOUywgJ2RlZnMnKVxuICAgICAgaW5zdGFuY2Uuc3ZnLmFwcGVuZENoaWxkKGRlZnMpXG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIHN0eWxlIGVsZW1lbnQsIGFuZCBjcmVhdGUgaXQgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgIHZhciBzdHlsZUVsID0gZGVmcy5xdWVyeVNlbGVjdG9yKCdzdHlsZSNzdmctcGFuLXpvb20tY29udHJvbHMtc3R5bGVzJyk7XG4gICAgaWYgKCFzdHlsZUVsKSB7XG4gICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdzdHlsZScpXG4gICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3N2Zy1wYW4tem9vbS1jb250cm9scy1zdHlsZXMnKVxuICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJylcbiAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gJy5zdmctcGFuLXpvb20tY29udHJvbCB7IGN1cnNvcjogcG9pbnRlcjsgZmlsbDogYmxhY2s7IGZpbGwtb3BhY2l0eTogMC4zMzM7IH0gLnN2Zy1wYW4tem9vbS1jb250cm9sOmhvdmVyIHsgZmlsbC1vcGFjaXR5OiAwLjg7IH0gLnN2Zy1wYW4tem9vbS1jb250cm9sLWJhY2tncm91bmQgeyBmaWxsOiB3aGl0ZTsgZmlsbC1vcGFjaXR5OiAwLjU7IH0gLnN2Zy1wYW4tem9vbS1jb250cm9sLWJhY2tncm91bmQgeyBmaWxsLW9wYWNpdHk6IDAuODsgfSdcbiAgICAgIGRlZnMuYXBwZW5kQ2hpbGQoc3R5bGUpXG4gICAgfVxuXG4gICAgLy8gWm9vbSBHcm91cFxuICAgIHZhciB6b29tR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdnJyk7XG4gICAgem9vbUdyb3VwLnNldEF0dHJpYnV0ZSgnaWQnLCAnc3ZnLXBhbi16b29tLWNvbnRyb2xzJyk7XG4gICAgem9vbUdyb3VwLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKCBpbnN0YW5jZS53aWR0aCAtIDcwICkgKyAnICcgKyAoIGluc3RhbmNlLmhlaWdodCAtIDc2ICkgKyAnKSBzY2FsZSgwLjc1KScpO1xuICAgIHpvb21Hcm91cC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1wYW4tem9vbS1jb250cm9sJyk7XG5cbiAgICAvLyBDb250cm9sIGVsZW1lbnRzXG4gICAgem9vbUdyb3VwLmFwcGVuZENoaWxkKHRoaXMuX2NyZWF0ZVpvb21JbihpbnN0YW5jZSkpXG4gICAgem9vbUdyb3VwLmFwcGVuZENoaWxkKHRoaXMuX2NyZWF0ZVpvb21SZXNldChpbnN0YW5jZSkpXG4gICAgem9vbUdyb3VwLmFwcGVuZENoaWxkKHRoaXMuX2NyZWF0ZVpvb21PdXQoaW5zdGFuY2UpKVxuXG4gICAgLy8gRmluYWxseSBhcHBlbmQgY3JlYXRlZCBlbGVtZW50XG4gICAgaW5zdGFuY2Uuc3ZnLmFwcGVuZENoaWxkKHpvb21Hcm91cClcblxuICAgIC8vIENhY2hlIGNvbnRyb2wgaW5zdGFuY2VcbiAgICBpbnN0YW5jZS5jb250cm9sSWNvbnMgPSB6b29tR3JvdXBcbiAgfVxuXG4sIF9jcmVhdGVab29tSW46IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgdmFyIHpvb21JbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdVdGlscy5zdmdOUywgJ2cnKTtcbiAgICB6b29tSW4uc2V0QXR0cmlidXRlKCdpZCcsICdzdmctcGFuLXpvb20tem9vbS1pbicpO1xuICAgIHpvb21Jbi5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMzAuNSA1KSBzY2FsZSgwLjAxNSknKTtcbiAgICB6b29tSW4uc2V0QXR0cmlidXRlKCdjbGFzcycsICdzdmctcGFuLXpvb20tY29udHJvbCcpO1xuICAgIHpvb21Jbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge2luc3RhbmNlLmdldFB1YmxpY0luc3RhbmNlKCkuem9vbUluKCl9LCBmYWxzZSlcbiAgICB6b29tSW4uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKCkge2luc3RhbmNlLmdldFB1YmxpY0luc3RhbmNlKCkuem9vbUluKCl9LCBmYWxzZSlcblxuICAgIHZhciB6b29tSW5CYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z1V0aWxzLnN2Z05TLCAncmVjdCcpOyAvLyBUT0RPIGNoYW5nZSB0aGVzZSBiYWNrZ3JvdW5kIHNwYWNlIGZpbGxlcnMgdG8gcm91bmRlZCByZWN0YW5nbGVzIHNvIHRoZXkgbG9vayBwcmV0dGllclxuICAgIHpvb21JbkJhY2tncm91bmQuc2V0QXR0cmlidXRlKCd4JywgJzAnKTtcbiAgICB6b29tSW5CYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgem9vbUluQmFja2dyb3VuZC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzE1MDAnKTsgLy8gbGFyZ2VyIHRoYW4gZXhwZWN0ZWQgYmVjYXVzZSB0aGUgd2hvbGUgZ3JvdXAgaXMgdHJhbnNmb3JtZWQgdG8gc2NhbGUgZG93blxuICAgIHpvb21JbkJhY2tncm91bmQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMTQwMCcpO1xuICAgIHpvb21JbkJhY2tncm91bmQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzdmctcGFuLXpvb20tY29udHJvbC1iYWNrZ3JvdW5kJyk7XG4gICAgem9vbUluLmFwcGVuZENoaWxkKHpvb21JbkJhY2tncm91bmQpO1xuXG4gICAgdmFyIHpvb21JblNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z1V0aWxzLnN2Z05TLCAncGF0aCcpO1xuICAgIHpvb21JblNoYXBlLnNldEF0dHJpYnV0ZSgnZCcsICdNMTI4MCA1NzZ2MTI4cTAgMjYgLTE5IDQ1dC00NSAxOWgtMzIwdjMyMHEwIDI2IC0xOSA0NXQtNDUgMTloLTEyOHEtMjYgMCAtNDUgLTE5dC0xOSAtNDV2LTMyMGgtMzIwcS0yNiAwIC00NSAtMTl0LTE5IC00NXYtMTI4cTAgLTI2IDE5IC00NXQ0NSAtMTloMzIwdi0zMjBxMCAtMjYgMTkgLTQ1dDQ1IC0xOWgxMjhxMjYgMCA0NSAxOXQxOSA0NXYzMjBoMzIwcTI2IDAgNDUgMTl0MTkgNDV6TTE1MzYgMTEyMHYtOTYwIHEwIC0xMTkgLTg0LjUgLTIwMy41dC0yMDMuNSAtODQuNWgtOTYwcS0xMTkgMCAtMjAzLjUgODQuNXQtODQuNSAyMDMuNXY5NjBxMCAxMTkgODQuNSAyMDMuNXQyMDMuNSA4NC41aDk2MHExMTkgMCAyMDMuNSAtODQuNXQ4NC41IC0yMDMuNXonKTtcbiAgICB6b29tSW5TaGFwZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1wYW4tem9vbS1jb250cm9sLWVsZW1lbnQnKTtcbiAgICB6b29tSW4uYXBwZW5kQ2hpbGQoem9vbUluU2hhcGUpO1xuXG4gICAgcmV0dXJuIHpvb21JblxuICB9XG5cbiwgX2NyZWF0ZVpvb21SZXNldDogZnVuY3Rpb24oaW5zdGFuY2Upe1xuICAgIC8vIHJlc2V0XG4gICAgdmFyIHJlc2V0UGFuWm9vbUNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdnJyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3N2Zy1wYW4tem9vbS1yZXNldC1wYW4tem9vbScpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2wuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDUgMzUpIHNjYWxlKDAuNCknKTtcbiAgICByZXNldFBhblpvb21Db250cm9sLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLXBhbi16b29tLWNvbnRyb2wnKTtcbiAgICByZXNldFBhblpvb21Db250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7aW5zdGFuY2UuZ2V0UHVibGljSW5zdGFuY2UoKS5yZXNldCgpfSwgZmFsc2UpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKCkge2luc3RhbmNlLmdldFB1YmxpY0luc3RhbmNlKCkucmVzZXQoKX0sIGZhbHNlKTtcblxuICAgIHZhciByZXNldFBhblpvb21Db250cm9sQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdVdGlscy5zdmdOUywgJ3JlY3QnKTsgLy8gVE9ETyBjaGFuZ2UgdGhlc2UgYmFja2dyb3VuZCBzcGFjZSBmaWxsZXJzIHRvIHJvdW5kZWQgcmVjdGFuZ2xlcyBzbyB0aGV5IGxvb2sgcHJldHRpZXJcbiAgICByZXNldFBhblpvb21Db250cm9sQmFja2dyb3VuZC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMicpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2xCYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgneScsICcyJyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbEJhY2tncm91bmQuc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxODInKTsgLy8gbGFyZ2VyIHRoYW4gZXhwZWN0ZWQgYmVjYXVzZSB0aGUgd2hvbGUgZ3JvdXAgaXMgdHJhbnNmb3JtZWQgdG8gc2NhbGUgZG93blxuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2xCYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzU4Jyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbEJhY2tncm91bmQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzdmctcGFuLXpvb20tY29udHJvbC1iYWNrZ3JvdW5kJyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbC5hcHBlbmRDaGlsZChyZXNldFBhblpvb21Db250cm9sQmFja2dyb3VuZCk7XG5cbiAgICB2YXIgcmVzZXRQYW5ab29tQ29udHJvbFNoYXBlMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdVdGlscy5zdmdOUywgJ3BhdGgnKTtcbiAgICByZXNldFBhblpvb21Db250cm9sU2hhcGUxLnNldEF0dHJpYnV0ZSgnZCcsICdNMzMuMDUxLDIwLjYzMmMtMC43NDItMC40MDYtMS44NTQtMC42MDktMy4zMzgtMC42MDloLTcuOTY5djkuMjgxaDcuNzY5YzEuNTQzLDAsMi43MDEtMC4xODgsMy40NzMtMC41NjJjMS4zNjUtMC42NTYsMi4wNDgtMS45NTMsMi4wNDgtMy44OTFDMzUuMDMyLDIyLjc1NywzNC4zNzIsMjEuMzUxLDMzLjA1MSwyMC42MzJ6Jyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbFNoYXBlMS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1wYW4tem9vbS1jb250cm9sLWVsZW1lbnQnKTtcbiAgICByZXNldFBhblpvb21Db250cm9sLmFwcGVuZENoaWxkKHJlc2V0UGFuWm9vbUNvbnRyb2xTaGFwZTEpO1xuXG4gICAgdmFyIHJlc2V0UGFuWm9vbUNvbnRyb2xTaGFwZTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdwYXRoJyk7XG4gICAgcmVzZXRQYW5ab29tQ29udHJvbFNoYXBlMi5zZXRBdHRyaWJ1dGUoJ2QnLCAnTTE3MC4yMzEsMC41SDE1Ljg0N0M3LjEwMiwwLjUsMC41LDUuNzA4LDAuNSwxMS44NHYzOC44NjFDMC41LDU2LjgzMyw3LjEwMiw2MS41LDE1Ljg0Nyw2MS41aDE1NC4zODRjOC43NDUsMCwxNS4yNjktNC42NjcsMTUuMjY5LTEwLjc5OFYxMS44NEMxODUuNSw1LjcwOCwxNzguOTc2LDAuNSwxNzAuMjMxLDAuNXogTTQyLjgzNyw0OC41NjloLTcuOTY5Yy0wLjIxOS0wLjc2Ni0wLjM3NS0xLjM4My0wLjQ2OS0xLjg1MmMtMC4xODgtMC45NjktMC4yODktMS45NjEtMC4zMDUtMi45NzdsLTAuMDQ3LTMuMjExYy0wLjAzLTIuMjAzLTAuNDEtMy42NzItMS4xNDItNC40MDZjLTAuNzMyLTAuNzM0LTIuMTAzLTEuMTAyLTQuMTEzLTEuMTAyaC03LjA1djEzLjU0N2gtNy4wNTVWMTQuMDIyaDE2LjUyNGMyLjM2MSwwLjA0Nyw0LjE3OCwwLjM0NCw1LjQ1LDAuODkxYzEuMjcyLDAuNTQ3LDIuMzUxLDEuMzUyLDMuMjM0LDIuNDE0YzAuNzMxLDAuODc1LDEuMzEsMS44NDQsMS43MzcsMi45MDZzMC42NCwyLjI3MywwLjY0LDMuNjMzYzAsMS42NDEtMC40MTQsMy4yNTQtMS4yNDIsNC44NHMtMi4xOTUsMi43MDctNC4xMDIsMy4zNjNjMS41OTQsMC42NDEsMi43MjMsMS41NTEsMy4zODcsMi43M3MwLjk5NiwyLjk4LDAuOTk2LDUuNDAydjIuMzJjMCwxLjU3OCwwLjA2MywyLjY0OCwwLjE5LDMuMjExYzAuMTksMC44OTEsMC42MzUsMS41NDcsMS4zMzMsMS45NjlWNDguNTY5eiBNNzUuNTc5LDQ4LjU2OWgtMjYuMThWMTQuMDIyaDI1LjMzNnY2LjExN0g1Ni40NTR2Ny4zMzZoMTYuNzgxdjZINTYuNDU0djguODgzaDE5LjEyNVY0OC41Njl6IE0xMDQuNDk3LDQ2LjMzMWMtMi40NCwyLjA4Ni01Ljg4NywzLjEyOS0xMC4zNCwzLjEyOWMtNC41NDgsMC04LjEyNS0xLjAyNy0xMC43MzEtMy4wODJzLTMuOTA5LTQuODc5LTMuOTA5LTguNDczaDYuODkxYzAuMjI0LDEuNTc4LDAuNjYyLDIuNzU4LDEuMzE2LDMuNTM5YzEuMTk2LDEuNDIyLDMuMjQ2LDIuMTMzLDYuMTUsMi4xMzNjMS43MzksMCwzLjE1MS0wLjE4OCw0LjIzNi0wLjU2MmMyLjA1OC0wLjcxOSwzLjA4Ny0yLjA1NSwzLjA4Ny00LjAwOGMwLTEuMTQxLTAuNTA0LTIuMDIzLTEuNTEyLTIuNjQ4Yy0xLjAwOC0wLjYwOS0yLjYwNy0xLjE0OC00Ljc5Ni0xLjYxN2wtMy43NC0wLjgyYy0zLjY3Ni0wLjgxMi02LjIwMS0xLjY5NS03LjU3Ni0yLjY0OGMtMi4zMjgtMS41OTQtMy40OTItNC4wODYtMy40OTItNy40NzdjMC0zLjA5NCwxLjEzOS01LjY2NCwzLjQxNy03LjcxMXM1LjYyMy0zLjA3LDEwLjAzNi0zLjA3YzMuNjg1LDAsNi44MjksMC45NjUsOS40MzEsMi44OTVjMi42MDIsMS45MywzLjk2Niw0LjczLDQuMDkzLDguNDAyaC02LjkzOGMtMC4xMjgtMi4wNzgtMS4wNTctMy41NTUtMi43ODctNC40M2MtMS4xNTQtMC41NzgtMi41ODctMC44NjctNC4zMDEtMC44NjdjLTEuOTA3LDAtMy40MjgsMC4zNzUtNC41NjUsMS4xMjVjLTEuMTM4LDAuNzUtMS43MDYsMS43OTctMS43MDYsMy4xNDFjMCwxLjIzNCwwLjU2MSwyLjE1NiwxLjY4MiwyLjc2NmMwLjcyMSwwLjQwNiwyLjI1LDAuODgzLDQuNTg5LDEuNDNsNi4wNjMsMS40M2MyLjY1NywwLjYyNSw0LjY0OCwxLjQ2MSw1Ljk3NSwyLjUwOGMyLjA1OSwxLjYyNSwzLjA4OSwzLjk3NywzLjA4OSw3LjA1NUMxMDguMTU3LDQxLjYyNCwxMDYuOTM3LDQ0LjI0NSwxMDQuNDk3LDQ2LjMzMXogTTEzOS42MSw0OC41NjloLTI2LjE4VjE0LjAyMmgyNS4zMzZ2Ni4xMTdoLTE4LjI4MXY3LjMzNmgxNi43ODF2NmgtMTYuNzgxdjguODgzaDE5LjEyNVY0OC41Njl6IE0xNzAuMzM3LDIwLjE0aC0xMC4zMzZ2MjguNDNoLTcuMjY2VjIwLjE0aC0xMC4zODN2LTYuMTE3aDI3Ljk4NFYyMC4xNHonKTtcbiAgICByZXNldFBhblpvb21Db250cm9sU2hhcGUyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLXBhbi16b29tLWNvbnRyb2wtZWxlbWVudCcpO1xuICAgIHJlc2V0UGFuWm9vbUNvbnRyb2wuYXBwZW5kQ2hpbGQocmVzZXRQYW5ab29tQ29udHJvbFNoYXBlMik7XG5cbiAgICByZXR1cm4gcmVzZXRQYW5ab29tQ29udHJvbFxuICB9XG5cbiwgX2NyZWF0ZVpvb21PdXQ6IGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICAvLyB6b29tIG91dFxuICAgIHZhciB6b29tT3V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFN2Z1V0aWxzLnN2Z05TLCAnZycpO1xuICAgIHpvb21PdXQuc2V0QXR0cmlidXRlKCdpZCcsICdzdmctcGFuLXpvb20tem9vbS1vdXQnKTtcbiAgICB6b29tT3V0LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgzMC41IDcwKSBzY2FsZSgwLjAxNSknKTtcbiAgICB6b29tT3V0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLXBhbi16b29tLWNvbnRyb2wnKTtcbiAgICB6b29tT3V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7aW5zdGFuY2UuZ2V0UHVibGljSW5zdGFuY2UoKS56b29tT3V0KCl9LCBmYWxzZSk7XG4gICAgem9vbU91dC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oKSB7aW5zdGFuY2UuZ2V0UHVibGljSW5zdGFuY2UoKS56b29tT3V0KCl9LCBmYWxzZSk7XG5cbiAgICB2YXIgem9vbU91dEJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU3ZnVXRpbHMuc3ZnTlMsICdyZWN0Jyk7IC8vIFRPRE8gY2hhbmdlIHRoZXNlIGJhY2tncm91bmQgc3BhY2UgZmlsbGVycyB0byByb3VuZGVkIHJlY3RhbmdsZXMgc28gdGhleSBsb29rIHByZXR0aWVyXG4gICAgem9vbU91dEJhY2tncm91bmQuc2V0QXR0cmlidXRlKCd4JywgJzAnKTtcbiAgICB6b29tT3V0QmFja2dyb3VuZC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHpvb21PdXRCYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMTUwMCcpOyAvLyBsYXJnZXIgdGhhbiBleHBlY3RlZCBiZWNhdXNlIHRoZSB3aG9sZSBncm91cCBpcyB0cmFuc2Zvcm1lZCB0byBzY2FsZSBkb3duXG4gICAgem9vbU91dEJhY2tncm91bmQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMTQwMCcpO1xuICAgIHpvb21PdXRCYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLXBhbi16b29tLWNvbnRyb2wtYmFja2dyb3VuZCcpO1xuICAgIHpvb21PdXQuYXBwZW5kQ2hpbGQoem9vbU91dEJhY2tncm91bmQpO1xuXG4gICAgdmFyIHpvb21PdXRTaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTdmdVdGlscy5zdmdOUywgJ3BhdGgnKTtcbiAgICB6b29tT3V0U2hhcGUuc2V0QXR0cmlidXRlKCdkJywgJ00xMjgwIDU3NnYxMjhxMCAyNiAtMTkgNDV0LTQ1IDE5aC04OTZxLTI2IDAgLTQ1IC0xOXQtMTkgLTQ1di0xMjhxMCAtMjYgMTkgLTQ1dDQ1IC0xOWg4OTZxMjYgMCA0NSAxOXQxOSA0NXpNMTUzNiAxMTIwdi05NjBxMCAtMTE5IC04NC41IC0yMDMuNXQtMjAzLjUgLTg0LjVoLTk2MHEtMTE5IDAgLTIwMy41IDg0LjV0LTg0LjUgMjAzLjV2OTYwcTAgMTE5IDg0LjUgMjAzLjV0MjAzLjUgODQuNWg5NjBxMTE5IDAgMjAzLjUgLTg0LjUgdDg0LjUgLTIwMy41eicpO1xuICAgIHpvb21PdXRTaGFwZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1wYW4tem9vbS1jb250cm9sLWVsZW1lbnQnKTtcbiAgICB6b29tT3V0LmFwcGVuZENoaWxkKHpvb21PdXRTaGFwZSk7XG5cbiAgICByZXR1cm4gem9vbU91dFxuICB9XG5cbiwgZGlzYWJsZTogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICBpZiAoaW5zdGFuY2UuY29udHJvbEljb25zKSB7XG4gICAgICBpbnN0YW5jZS5jb250cm9sSWNvbnMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpbnN0YW5jZS5jb250cm9sSWNvbnMpXG4gICAgICBpbnN0YW5jZS5jb250cm9sSWNvbnMgPSBudWxsXG4gICAgfVxuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL2NvbnRyb2wtaWNvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIFN2Z1V0aWxzID0gcmVxdWlyZSgnLi9zdmctdXRpbGl0aWVzJylcbiAgLCBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJylcbiAgO1xuXG52YXIgU2hhZG93Vmlld3BvcnQgPSBmdW5jdGlvbih2aWV3cG9ydCwgb3B0aW9ucyl7XG4gIHRoaXMuaW5pdCh2aWV3cG9ydCwgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBJbml0aWFsaXphdGlvblxuICpcbiAqIEBwYXJhbSAge1NWR0VsZW1lbnR9IHZpZXdwb3J0XG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih2aWV3cG9ydCwgb3B0aW9ucykge1xuICAvLyBET00gRWxlbWVudHNcbiAgdGhpcy52aWV3cG9ydCA9IHZpZXdwb3J0XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcblxuICAvLyBTdGF0ZSBjYWNoZVxuICB0aGlzLm9yaWdpbmFsU3RhdGUgPSB7em9vbTogMSwgeDogMCwgeTogMH1cbiAgdGhpcy5hY3RpdmVTdGF0ZSA9IHt6b29tOiAxLCB4OiAwLCB5OiAwfVxuXG4gIHRoaXMudXBkYXRlQ1RNQ2FjaGVkID0gVXRpbHMucHJveHkodGhpcy51cGRhdGVDVE0sIHRoaXMpXG5cbiAgLy8gQ3JlYXRlIGEgY3VzdG9tIHJlcXVlc3RBbmltYXRpb25GcmFtZSB0YWtpbmcgaW4gYWNjb3VudCByZWZyZXNoUmF0ZVxuICB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IFV0aWxzLmNyZWF0ZVJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLm9wdGlvbnMucmVmcmVzaFJhdGUpXG5cbiAgLy8gVmlld0JveFxuICB0aGlzLnZpZXdCb3ggPSB7eDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMH1cbiAgdGhpcy5jYWNoZVZpZXdCb3goKVxuXG4gIC8vIFByb2Nlc3MgQ1RNXG4gIHZhciBuZXdDVE0gPSB0aGlzLnByb2Nlc3NDVE0oKVxuXG4gIC8vIFVwZGF0ZSB2aWV3cG9ydCBDVE0gYW5kIGNhY2hlIHpvb20gYW5kIHBhblxuICB0aGlzLnNldENUTShuZXdDVE0pXG5cbiAgLy8gVXBkYXRlIENUTSBpbiB0aGlzIGZyYW1lXG4gIHRoaXMudXBkYXRlQ1RNKClcbn1cblxuLyoqXG4gKiBDYWNoZSBpbml0aWFsIHZpZXdCb3ggdmFsdWVcbiAqIElmIG5vIHZpZXdCb3ggaXMgZGVmaW5lZCwgdGhlbiB1c2Ugdmlld3BvcnQgc2l6ZS9wb3NpdGlvbiBpbnN0ZWFkIGZvciB2aWV3Qm94IHZhbHVlc1xuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuY2FjaGVWaWV3Qm94ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdmdWaWV3Qm94ID0gdGhpcy5vcHRpb25zLnN2Zy5nZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnKVxuXG4gIGlmIChzdmdWaWV3Qm94KSB7XG4gICAgdmFyIHZpZXdCb3hWYWx1ZXMgPSBzdmdWaWV3Qm94LnNwbGl0KC9bXFxzXFwsXS8pLmZpbHRlcihmdW5jdGlvbih2KXtyZXR1cm4gdn0pLm1hcChwYXJzZUZsb2F0KVxuXG4gICAgLy8gQ2FjaGUgdmlld2JveCB4IGFuZCB5IG9mZnNldFxuICAgIHRoaXMudmlld0JveC54ID0gdmlld0JveFZhbHVlc1swXVxuICAgIHRoaXMudmlld0JveC55ID0gdmlld0JveFZhbHVlc1sxXVxuICAgIHRoaXMudmlld0JveC53aWR0aCA9IHZpZXdCb3hWYWx1ZXNbMl1cbiAgICB0aGlzLnZpZXdCb3guaGVpZ2h0ID0gdmlld0JveFZhbHVlc1szXVxuXG4gICAgdmFyIHpvb20gPSBNYXRoLm1pbih0aGlzLm9wdGlvbnMud2lkdGggLyB0aGlzLnZpZXdCb3gud2lkdGgsIHRoaXMub3B0aW9ucy5oZWlnaHQgLyB0aGlzLnZpZXdCb3guaGVpZ2h0KVxuXG4gICAgLy8gVXBkYXRlIGFjdGl2ZSBzdGF0ZVxuICAgIHRoaXMuYWN0aXZlU3RhdGUuem9vbSA9IHpvb21cbiAgICB0aGlzLmFjdGl2ZVN0YXRlLnggPSAodGhpcy5vcHRpb25zLndpZHRoIC0gdGhpcy52aWV3Qm94LndpZHRoICogem9vbSkgLyAyXG4gICAgdGhpcy5hY3RpdmVTdGF0ZS55ID0gKHRoaXMub3B0aW9ucy5oZWlnaHQgLSB0aGlzLnZpZXdCb3guaGVpZ2h0ICogem9vbSkgLyAyXG5cbiAgICAvLyBGb3JjZSB1cGRhdGluZyBDVE1cbiAgICB0aGlzLnVwZGF0ZUNUTU9uTmV4dEZyYW1lKClcblxuICAgIHRoaXMub3B0aW9ucy5zdmcucmVtb3ZlQXR0cmlidXRlKCd2aWV3Qm94JylcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNpbXBsZVZpZXdCb3hDYWNoZSgpXG4gIH1cbn1cblxuLyoqXG4gKiBSZWNhbGN1bGF0ZSB2aWV3cG9ydCBzaXplcyBhbmQgdXBkYXRlIHZpZXdCb3ggY2FjaGVcbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLnNpbXBsZVZpZXdCb3hDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYkJveCA9IHRoaXMudmlld3BvcnQuZ2V0QkJveCgpXG5cbiAgdGhpcy52aWV3Qm94LnggPSBiQm94LnhcbiAgdGhpcy52aWV3Qm94LnkgPSBiQm94LnlcbiAgdGhpcy52aWV3Qm94LndpZHRoID0gYkJveC53aWR0aFxuICB0aGlzLnZpZXdCb3guaGVpZ2h0ID0gYkJveC5oZWlnaHRcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdmlld2JveCBvYmplY3QuIFNhZmUgdG8gYWx0ZXJcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHZpZXdib3ggb2JqZWN0XG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5nZXRWaWV3Qm94ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBVdGlscy5leHRlbmQoe30sIHRoaXMudmlld0JveClcbn1cblxuLyoqXG4gKiBHZXQgaW5pdGlhbCB6b29tIGFuZCBwYW4gdmFsdWVzLiBTYXZlIHRoZW0gaW50byBvcmlnaW5hbFN0YXRlXG4gKiBQYXJzZXMgdmlld0JveCBhdHRyaWJ1dGUgdG8gYWx0ZXIgaW5pdGlhbCBzaXplc1xuICpcbiAqIEByZXR1cm4ge0NUTX0gQ1RNIG9iamVjdCBiYXNlZCBvbiBvcHRpb25zXG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5wcm9jZXNzQ1RNID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuZXdDVE0gPSB0aGlzLmdldENUTSgpXG5cbiAgaWYgKHRoaXMub3B0aW9ucy5maXQgfHwgdGhpcy5vcHRpb25zLmNvbnRhaW4pIHtcbiAgICB2YXIgbmV3U2NhbGU7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5maXQpIHtcbiAgICAgIG5ld1NjYWxlID0gTWF0aC5taW4odGhpcy5vcHRpb25zLndpZHRoL3RoaXMudmlld0JveC53aWR0aCwgdGhpcy5vcHRpb25zLmhlaWdodC90aGlzLnZpZXdCb3guaGVpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3U2NhbGUgPSBNYXRoLm1heCh0aGlzLm9wdGlvbnMud2lkdGgvdGhpcy52aWV3Qm94LndpZHRoLCB0aGlzLm9wdGlvbnMuaGVpZ2h0L3RoaXMudmlld0JveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIG5ld0NUTS5hID0gbmV3U2NhbGU7IC8veC1zY2FsZVxuICAgIG5ld0NUTS5kID0gbmV3U2NhbGU7IC8veS1zY2FsZVxuICAgIG5ld0NUTS5lID0gLXRoaXMudmlld0JveC54ICogbmV3U2NhbGU7IC8veC10cmFuc2Zvcm1cbiAgICBuZXdDVE0uZiA9IC10aGlzLnZpZXdCb3gueSAqIG5ld1NjYWxlOyAvL3ktdHJhbnNmb3JtXG4gIH1cblxuICBpZiAodGhpcy5vcHRpb25zLmNlbnRlcikge1xuICAgIHZhciBvZmZzZXRYID0gKHRoaXMub3B0aW9ucy53aWR0aCAtICh0aGlzLnZpZXdCb3gud2lkdGggKyB0aGlzLnZpZXdCb3gueCAqIDIpICogbmV3Q1RNLmEpICogMC41XG4gICAgICAsIG9mZnNldFkgPSAodGhpcy5vcHRpb25zLmhlaWdodCAtICh0aGlzLnZpZXdCb3guaGVpZ2h0ICsgdGhpcy52aWV3Qm94LnkgKiAyKSAqIG5ld0NUTS5hKSAqIDAuNVxuXG4gICAgbmV3Q1RNLmUgPSBvZmZzZXRYXG4gICAgbmV3Q1RNLmYgPSBvZmZzZXRZXG4gIH1cblxuICAvLyBDYWNoZSBpbml0aWFsIHZhbHVlcy4gQmFzZWQgb24gYWN0aXZlU3RhdGUgYW5kIGZpeCtjZW50ZXIgb3BpdG9uc1xuICB0aGlzLm9yaWdpbmFsU3RhdGUuem9vbSA9IG5ld0NUTS5hXG4gIHRoaXMub3JpZ2luYWxTdGF0ZS54ID0gbmV3Q1RNLmVcbiAgdGhpcy5vcmlnaW5hbFN0YXRlLnkgPSBuZXdDVE0uZlxuXG4gIHJldHVybiBuZXdDVE1cbn1cblxuLyoqXG4gKiBSZXR1cm4gb3JpZ2luYWxTdGF0ZSBvYmplY3QuIFNhZmUgdG8gYWx0ZXJcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5nZXRPcmlnaW5hbFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBVdGlscy5leHRlbmQoe30sIHRoaXMub3JpZ2luYWxTdGF0ZSlcbn1cblxuLyoqXG4gKiBSZXR1cm4gYWN0dWFsU3RhdGUgb2JqZWN0LiBTYWZlIHRvIGFsdGVyXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFV0aWxzLmV4dGVuZCh7fSwgdGhpcy5hY3RpdmVTdGF0ZSlcbn1cblxuLyoqXG4gKiBHZXQgem9vbSBzY2FsZVxuICpcbiAqIEByZXR1cm4ge0Zsb2F0fSB6b29tIHNjYWxlXG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5nZXRab29tID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmFjdGl2ZVN0YXRlLnpvb21cbn1cblxuLyoqXG4gKiBHZXQgem9vbSBzY2FsZSBmb3IgcHViaWxjIHVzYWdlXG4gKlxuICogQHJldHVybiB7RmxvYXR9IHpvb20gc2NhbGVcbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLmdldFJlbGF0aXZlWm9vbSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5hY3RpdmVTdGF0ZS56b29tIC8gdGhpcy5vcmlnaW5hbFN0YXRlLnpvb21cbn1cblxuLyoqXG4gKiBDb21wdXRlIHpvb20gc2NhbGUgZm9yIHB1YmlsYyB1c2FnZVxuICpcbiAqIEByZXR1cm4ge0Zsb2F0fSB6b29tIHNjYWxlXG4gKi9cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5jb21wdXRlUmVsYXRpdmVab29tID0gZnVuY3Rpb24oc2NhbGUpIHtcbiAgcmV0dXJuIHNjYWxlIC8gdGhpcy5vcmlnaW5hbFN0YXRlLnpvb21cbn1cblxuLyoqXG4gKiBHZXQgcGFuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuZ2V0UGFuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7eDogdGhpcy5hY3RpdmVTdGF0ZS54LCB5OiB0aGlzLmFjdGl2ZVN0YXRlLnl9XG59XG5cbi8qKlxuICogUmV0dXJuIGNhY2hlZCB2aWV3cG9ydCBDVE0gdmFsdWUgdGhhdCBjYW4gYmUgc2FmZWx5IG1vZGlmaWVkXG4gKlxuICogQHJldHVybiB7U1ZHTWF0cml4fVxuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuZ2V0Q1RNID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzYWZlQ1RNID0gdGhpcy5vcHRpb25zLnN2Zy5jcmVhdGVTVkdNYXRyaXgoKVxuXG4gIC8vIENvcHkgdmFsdWVzIG1hbnVhbGx5IGFzIGluIEZGIHRoZXkgYXJlIG5vdCBpdHRlcmFibGVcbiAgc2FmZUNUTS5hID0gdGhpcy5hY3RpdmVTdGF0ZS56b29tXG4gIHNhZmVDVE0uYiA9IDBcbiAgc2FmZUNUTS5jID0gMFxuICBzYWZlQ1RNLmQgPSB0aGlzLmFjdGl2ZVN0YXRlLnpvb21cbiAgc2FmZUNUTS5lID0gdGhpcy5hY3RpdmVTdGF0ZS54XG4gIHNhZmVDVE0uZiA9IHRoaXMuYWN0aXZlU3RhdGUueVxuXG4gIHJldHVybiBzYWZlQ1RNXG59XG5cbi8qKlxuICogU2V0IGEgbmV3IENUTVxuICpcbiAqIEBwYXJhbSB7U1ZHTWF0cml4fSBuZXdDVE1cbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLnNldENUTSA9IGZ1bmN0aW9uKG5ld0NUTSkge1xuICB2YXIgd2lsbFpvb20gPSB0aGlzLmlzWm9vbURpZmZlcmVudChuZXdDVE0pXG4gICAgLCB3aWxsUGFuID0gdGhpcy5pc1BhbkRpZmZlcmVudChuZXdDVE0pXG5cbiAgaWYgKHdpbGxab29tIHx8IHdpbGxQYW4pIHtcbiAgICAvLyBCZWZvcmUgem9vbVxuICAgIGlmICh3aWxsWm9vbSkge1xuICAgICAgLy8gSWYgcmV0dXJucyBmYWxzZSB0aGVuIGNhbmNlbCB6b29taW5nXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmJlZm9yZVpvb20odGhpcy5nZXRSZWxhdGl2ZVpvb20oKSwgdGhpcy5jb21wdXRlUmVsYXRpdmVab29tKG5ld0NUTS5hKSkgPT09IGZhbHNlKSB7XG4gICAgICAgIG5ld0NUTS5hID0gbmV3Q1RNLmQgPSB0aGlzLmFjdGl2ZVN0YXRlLnpvb21cbiAgICAgICAgd2lsbFpvb20gPSBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGVDYWNoZShuZXdDVE0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMub25ab29tKHRoaXMuZ2V0UmVsYXRpdmVab29tKCkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQmVmb3JlIHBhblxuICAgIGlmICh3aWxsUGFuKSB7XG4gICAgICB2YXIgcHJldmVudFBhbiA9IHRoaXMub3B0aW9ucy5iZWZvcmVQYW4odGhpcy5nZXRQYW4oKSwge3g6IG5ld0NUTS5lLCB5OiBuZXdDVE0uZn0pXG4gICAgICAgICAgLy8gSWYgcHJldmVudCBwYW4gaXMgYW4gb2JqZWN0XG4gICAgICAgICwgcHJldmVudFBhblggPSBmYWxzZVxuICAgICAgICAsIHByZXZlbnRQYW5ZID0gZmFsc2VcblxuICAgICAgLy8gSWYgcHJldmVudCBwYW4gaXMgQm9vbGVhbiBmYWxzZVxuICAgICAgaWYgKHByZXZlbnRQYW4gPT09IGZhbHNlKSB7XG4gICAgICAgIC8vIFNldCB4IGFuZCB5IHNhbWUgYXMgYmVmb3JlXG4gICAgICAgIG5ld0NUTS5lID0gdGhpcy5nZXRQYW4oKS54XG4gICAgICAgIG5ld0NUTS5mID0gdGhpcy5nZXRQYW4oKS55XG5cbiAgICAgICAgcHJldmVudFBhblggPSBwcmV2ZW50UGFuWSA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNPYmplY3QocHJldmVudFBhbikpIHtcbiAgICAgICAgLy8gQ2hlY2sgZm9yIFggYXhlcyBhdHRyaWJ1dGVcbiAgICAgICAgaWYgKHByZXZlbnRQYW4ueCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyBQcmV2ZW50IHBhbm5pbmcgb24geCBheGVzXG4gICAgICAgICAgbmV3Q1RNLmUgPSB0aGlzLmdldFBhbigpLnhcbiAgICAgICAgICBwcmV2ZW50UGFuWCA9IHRydWVcbiAgICAgICAgfSBlbHNlIGlmIChVdGlscy5pc051bWJlcihwcmV2ZW50UGFuLngpKSB7XG4gICAgICAgICAgLy8gU2V0IGEgY3VzdG9tIHBhbiB2YWx1ZVxuICAgICAgICAgIG5ld0NUTS5lID0gcHJldmVudFBhbi54XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBmb3IgWSBheGVzIGF0dHJpYnV0ZVxuICAgICAgICBpZiAocHJldmVudFBhbi55ID09PSBmYWxzZSkge1xuICAgICAgICAgIC8vIFByZXZlbnQgcGFubmluZyBvbiB4IGF4ZXNcbiAgICAgICAgICBuZXdDVE0uZiA9IHRoaXMuZ2V0UGFuKCkueVxuICAgICAgICAgIHByZXZlbnRQYW5ZID0gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzTnVtYmVyKHByZXZlbnRQYW4ueSkpIHtcbiAgICAgICAgICAvLyBTZXQgYSBjdXN0b20gcGFuIHZhbHVlXG4gICAgICAgICAgbmV3Q1RNLmYgPSBwcmV2ZW50UGFuLnlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBVcGRhdGUgd2lsbFBhbiBmbGFnXG4gICAgICAvLyBDaGVjayBpZiBuZXdDVE0gaXMgc3RpbGwgZGlmZmVyZW50XG4gICAgICBpZiAoKHByZXZlbnRQYW5YICYmIHByZXZlbnRQYW5ZKSB8fCAhdGhpcy5pc1BhbkRpZmZlcmVudChuZXdDVE0pKSB7XG4gICAgICAgIHdpbGxQYW4gPSBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGVDYWNoZShuZXdDVE0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMub25QYW4odGhpcy5nZXRQYW4oKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgYWdhaW4gaWYgc2hvdWxkIHpvb20gb3IgcGFuXG4gICAgaWYgKHdpbGxab29tIHx8IHdpbGxQYW4pIHtcbiAgICAgIHRoaXMudXBkYXRlQ1RNT25OZXh0RnJhbWUoKVxuICAgIH1cbiAgfVxufVxuXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUuaXNab29tRGlmZmVyZW50ID0gZnVuY3Rpb24obmV3Q1RNKSB7XG4gIHJldHVybiB0aGlzLmFjdGl2ZVN0YXRlLnpvb20gIT09IG5ld0NUTS5hXG59XG5cblNoYWRvd1ZpZXdwb3J0LnByb3RvdHlwZS5pc1BhbkRpZmZlcmVudCA9IGZ1bmN0aW9uKG5ld0NUTSkge1xuICByZXR1cm4gdGhpcy5hY3RpdmVTdGF0ZS54ICE9PSBuZXdDVE0uZSB8fCB0aGlzLmFjdGl2ZVN0YXRlLnkgIT09IG5ld0NUTS5mXG59XG5cblxuLyoqXG4gKiBVcGRhdGUgY2FjaGVkIENUTSBhbmQgYWN0aXZlIHN0YXRlXG4gKlxuICogQHBhcmFtIHtTVkdNYXRyaXh9IG5ld0NUTVxuICovXG5TaGFkb3dWaWV3cG9ydC5wcm90b3R5cGUudXBkYXRlQ2FjaGUgPSBmdW5jdGlvbihuZXdDVE0pIHtcbiAgdGhpcy5hY3RpdmVTdGF0ZS56b29tID0gbmV3Q1RNLmFcbiAgdGhpcy5hY3RpdmVTdGF0ZS54ID0gbmV3Q1RNLmVcbiAgdGhpcy5hY3RpdmVTdGF0ZS55ID0gbmV3Q1RNLmZcbn1cblxuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLnBlbmRpbmdVcGRhdGUgPSBmYWxzZVxuXG4vKipcbiAqIFBsYWNlIGEgcmVxdWVzdCB0byB1cGRhdGUgQ1RNIG9uIG5leHQgRnJhbWVcbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLnVwZGF0ZUNUTU9uTmV4dEZyYW1lID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5wZW5kaW5nVXBkYXRlKSB7XG4gICAgLy8gTG9ja1xuICAgIHRoaXMucGVuZGluZ1VwZGF0ZSA9IHRydWVcblxuICAgIC8vIFRocm90dGxlIG5leHQgdXBkYXRlXG4gICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUuY2FsbCh3aW5kb3csIHRoaXMudXBkYXRlQ1RNQ2FjaGVkKVxuICB9XG59XG5cbi8qKlxuICogVXBkYXRlIHZpZXdwb3J0IENUTSB3aXRoIGNhY2hlZCBDVE1cbiAqL1xuU2hhZG93Vmlld3BvcnQucHJvdG90eXBlLnVwZGF0ZUNUTSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY3RtID0gdGhpcy5nZXRDVE0oKVxuXG4gIC8vIFVwZGF0ZXMgU1ZHIGVsZW1lbnRcbiAgU3ZnVXRpbHMuc2V0Q1RNKHRoaXMudmlld3BvcnQsIGN0bSwgdGhpcy5kZWZzKVxuXG4gIC8vIEZyZWUgdGhlIGxvY2tcbiAgdGhpcy5wZW5kaW5nVXBkYXRlID0gZmFsc2VcblxuICAvLyBOb3RpZnkgYWJvdXQgdGhlIHVwZGF0ZVxuICBpZih0aGlzLm9wdGlvbnMub25VcGRhdGVkQ1RNKSB7XG4gICAgdGhpcy5vcHRpb25zLm9uVXBkYXRlZENUTShjdG0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2aWV3cG9ydCwgb3B0aW9ucyl7XG4gIHJldHVybiBuZXcgU2hhZG93Vmlld3BvcnQodmlld3BvcnQsIG9wdGlvbnMpXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmctcGFuLXpvb20vc3JjL3NoYWRvdy12aWV3cG9ydC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9