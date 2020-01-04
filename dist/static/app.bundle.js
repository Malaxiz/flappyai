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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/App.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/App.ts":
/*!***********************!*\
  !*** ./src/js/App.ts ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ "./src/js/Game.ts");

Object(_Game__WEBPACK_IMPORTED_MODULE_0__["createGame"])();

/***/ }),

/***/ "./src/js/Ctx.ts":
/*!***********************!*\
  !*** ./src/js/Ctx.ts ***!
  \***********************/
/*! exports provided: TextPosition, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextPosition", function() { return TextPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Ctx; });
let TextPosition;

(function (TextPosition) {
  TextPosition[TextPosition["TopLeft"] = 0] = "TopLeft";
  TextPosition[TextPosition["Middle"] = 1] = "Middle";
})(TextPosition || (TextPosition = {}));

;
;
class Ctx {
  // font size
  constructor(options = {}) {
    this.w = 500;
    this.h = 500;
    this.size = 24;
    this._queue = [];
    this.options = {
      showFps: false
    };
    this.text = {};
    this.textCoordinates = {
      [TextPosition.TopLeft]: () => [0, 0, this.size / 2, this.size / 2],
      [TextPosition.Middle]: () => [this.w / 2, this.h / 2, this.size / 2, 0]
    };
    this.options = options;
    this.w = options.w || this.w;
    this.h = options.h || this.h;
    this.size = options.size || this.size;
    this.options = { ...options,
      ...this.options
    };
    this.init();
    this.loop();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx = document.body.appendChild(this.canvas).getContext('2d');
    this.ctx.font = `${this.size}px Arial`;
    this.queueText(() => `Fps: ${this.fps.toFixed(1)}`, () => this.options.showFps);
  }

  loop() {
    let now;

    const req = () => requestAnimationFrame(time => {
      this.fps = 1e3 / (time - now);
      this.ctx.clearRect(0, 0, this.w, this.h);

      this._queue.filter(({
        alive
      }) => alive()).forEach(({
        func
      }) => func(this.ctx));

      now = time;
      req();
    });

    req();
  }

  queue(func, alive) {
    this._queue.push({
      func,
      alive
    });

    return () => {
      const i = this._queue.findIndex(v => v.func == func);

      if (i == -1) console.error(`Failed to remove render function`, func, alive);else this._queue.splice(i, 1);
    };
  }

  queueText(text, alive, position = TextPosition.TopLeft) {
    if (!this.text[position]) this.text[position] = [];
    this.text[position].push(text);
    const remove = this.queue(ctx => {
      const i = this.text[position].findIndex(v => v == text);
      const [w, h, padv, padh] = this.textCoordinates[position]();
      ctx.fillText(text(), w + padh, h + (i + 1) * (this.size + padv));
    }, alive);
    return () => {
      remove();
    };
  }

}

/***/ }),

/***/ "./src/js/Flappy.ts":
/*!**************************!*\
  !*** ./src/js/Flappy.ts ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Flappy; });
;
class Flappy {
  constructor(params) {
    console.log(params);
  }

}

/***/ }),

/***/ "./src/js/Game.ts":
/*!************************!*\
  !*** ./src/js/Game.ts ***!
  \************************/
/*! exports provided: createGame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createGame", function() { return createGame; });
/* harmony import */ var _Flappy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Flappy */ "./src/js/Flappy.ts");
/* harmony import */ var _NeuralNet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NeuralNet */ "./src/js/NeuralNet.ts");
/* harmony import */ var _Resource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Resource */ "./src/js/Resource.ts");
/* harmony import */ var _Ctx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Ctx */ "./src/js/Ctx.ts");




const createGame = async () => {
  const ctx = new _Ctx__WEBPACK_IMPORTED_MODULE_3__["default"]({
    showFps: true
  });
  const resources = {
    pipeBottom: new _Resource__WEBPACK_IMPORTED_MODULE_2__["default"]('./static/pipebottom.png'),
    pipeTop: new _Resource__WEBPACK_IMPORTED_MODULE_2__["default"]('./static/pipetop.png'),
    bird: new _Resource__WEBPACK_IMPORTED_MODULE_2__["default"]('./static/bird.png'),
    background: new _Resource__WEBPACK_IMPORTED_MODULE_2__["default"]('./static/background.png')
  };
  const files = Object.entries(resources);
  let loadedFiles = 0;
  const loading = files.map(([, v]) => v.load());
  loading.forEach(v => v.then(() => loadedFiles++).catch(() => loadedFiles++));
  const remove = [ctx.queueText(() => `Loading...`, () => true, _Ctx__WEBPACK_IMPORTED_MODULE_3__["TextPosition"].Middle), ctx.queueText(() => `${loadedFiles}/${files.length}`, () => true, _Ctx__WEBPACK_IMPORTED_MODULE_3__["TextPosition"].Middle)];
  await Promise.all(loading);
  remove.forEach(v => v());
  return new _Flappy__WEBPACK_IMPORTED_MODULE_0__["default"]({
    net: new _NeuralNet__WEBPACK_IMPORTED_MODULE_1__["default"](),
    ctx,
    resources
  });
};

/***/ }),

/***/ "./src/js/NeuralNet.ts":
/*!*****************************!*\
  !*** ./src/js/NeuralNet.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NeuralNet; });
class NeuralNet {}

/***/ }),

/***/ "./src/js/Resource.ts":
/*!****************************!*\
  !*** ./src/js/Resource.ts ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Resource; });
;
class Resource {
  constructor(file) {
    this.loaded = false;
    this.init(file);
  }

  async init(file) {
    this.img = new Image();
    this.img.src = file;
    this.didLoad = new Promise((res, rej) => {
      this.img.onload = value => res({
        status: 'success',
        value
      });

      this.img.onerror = err => res({
        status: 'error',
        value: err
      });
    });
    await this.didLoad;
    this.loaded = true;
  }

  load() {
    return this.didLoad;
  }

}

/***/ })

/******/ });
//# sourceMappingURL=app.bundle.js.map