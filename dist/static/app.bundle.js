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
/*! exports provided: TextPosition, RenderPriority, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextPosition", function() { return TextPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderPriority", function() { return RenderPriority; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Ctx; });
let TextPosition;

(function (TextPosition) {
  TextPosition[TextPosition["TopLeft"] = 0] = "TopLeft";
  TextPosition[TextPosition["Middle"] = 1] = "Middle";
})(TextPosition || (TextPosition = {}));

;
;
const RenderPriority = {
  Important: 30,
  Text: 20,
  Normal: 10
};
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
      }) => alive()).sort((a, b) => +a.priority - +b.priority).forEach(({
        func
      }) => func(this.ctx));

      now = time;
      req();
    });

    req();
  }

  queue(func, alive, priority = RenderPriority.Normal) {
    this._queue.push({
      func,
      alive,
      priority
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
    }, alive, RenderPriority.Text);
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
/* harmony import */ var _NeuralNet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NeuralNet */ "./src/js/NeuralNet.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Game */ "./src/js/Game.ts");


const PIPE_GAP = 100;
const PIPE_MARGIN = 0;
const PIPE_SPEED = -3;
const PIPE_ACCELERATION = -0.01;
const BIRD_AMOUNT = 50;
const BIRD_GRAVITY = 0.25;
const BIRD_FORCE = -6;
const DEFAULT_FPS = 60.0;
const NETWORK_INPUTS = 3;
const NETWORK_OUTPUTS = 1;

const NETWORK_STRUCTURE = hidden => [NETWORK_INPUTS, ...hidden, NETWORK_OUTPUTS];

;

(function () {
  var timeouts = [];
  var messageName = "zero-timeout-message";

  function setZeroTimeout(fn) {
    timeouts.push(fn);
    window.postMessage(messageName, "*");
  }

  function handleMessage(event) {
    if (event.source == window && event.data == messageName) {
      event.stopPropagation();

      if (timeouts.length > 0) {
        var fn = timeouts.shift();
        fn();
      }
    }
  }

  window.addEventListener("message", handleMessage, true);
  window.setZeroTimeout = setZeroTimeout;
})();

class Movable {
  constructor(x, y, w, h) {
    this.vY = 0;
    this.vX = 0;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  loop() {
    this.y += this.vY;
    this.x += this.vX;
  }

  collides(pos) {
    return !(pos.x > this.x + this.w || pos.x + pos.w < this.x || pos.y > this.y + this.h || pos.y + pos.h < this.y);
  }

}

class Bird {
  constructor(x, y, g, force, net) {
    this.dead = false;
    this.score = 0;
    const dims = _Game__WEBPACK_IMPORTED_MODULE_1__["Resources"].bird.dimensions();
    this.pos = new Movable(x, y, dims[0], dims[1]);
    this.g = g;
    this.force = force;
    this.net = net;
  }

  loop(pipes) {
    const [screenWidth, screenHeight] = _Game__WEBPACK_IMPORTED_MODULE_1__["Dimensions"];
    if (this.pos.y > screenHeight || this.pos.y < 0) this.dead = true;
    if (pipes.some(pipe => pipe.collides(this.pos))) this.dead = true;
    if (this.dead) return;
    this.score++;
    const inputs = [this.pos.y / screenHeight, pipes[0].getHeight() / screenHeight, pipes[0].getX() / screenWidth]; // console.log(inputs);

    const netResult = this.net.forward(inputs);
    if (netResult[0] > .5) this.jump();
    this.pos.vY += this.g;
    this.pos.loop();
  }

  jump() {
    this.pos.vY = this.force;
  }

  draw(ctx) {
    _Game__WEBPACK_IMPORTED_MODULE_1__["Resources"].bird.draw(ctx, this.pos.x, this.pos.y, null, null, Math.PI / 2 * this.pos.vY / 20);
  }

}

class Pipe {
  constructor(x, h, vX) {
    this.padding = PIPE_GAP;
    this.dead = false;
    const dims = _Game__WEBPACK_IMPORTED_MODULE_1__["Resources"].pipeTop.dimensions();
    this.top = new Movable(x, h - dims[1], dims[0], dims[1]);
    this.bottom = new Movable(x, h + this.padding, dims[0], dims[1]);
    this.top.vX = vX;
    this.bottom.vX = vX;
    this.h = h;
  }

  loop() {
    if (this.top.x + _Game__WEBPACK_IMPORTED_MODULE_1__["Resources"].pipeTop.dimensions()[0] < 0) this.dead = true;
    this.top.loop();
    this.bottom.loop();
  }

  draw(ctx) {
    _Game__WEBPACK_IMPORTED_MODULE_1__["Resources"].pipeTop.draw(ctx, this.top.x, this.h - _Game__WEBPACK_IMPORTED_MODULE_1__["Resources"].pipeTop.dimensions()[1]);
    _Game__WEBPACK_IMPORTED_MODULE_1__["Resources"].pipeBottom.draw(ctx, this.bottom.x, this.h + this.padding); // ctx.fillRect(this.pos.x, this.h, Resources.pipeTop.dimensions()[0], this.padding);
  }

  collides(pos) {
    return this.top.collides(pos) || this.bottom.collides(pos);
  }

  getHeight() {
    return this.h;
  }

  getX() {
    return this.bottom.x;
  }

}

class Flappy {
  constructor(params) {
    this.birds = [];
    this.pipes = [];
    this.pipeSpeed = PIPE_SPEED;
    this.score = 0;
    this.maxScore = 0;
    this.generation = 0;
    this.FPS = DEFAULT_FPS;
    this.pauseWhenHighscore = true;
    this.desiredStructure = [2, 2];
    this.ctx = params.ctx;
    this.init();
  }

  init() {
    this.ctx.queue(this.render.bind(this), () => true);
    this.ctx.queueText(() => `Score: ${this.score}`, () => true);
    this.ctx.queueText(() => `Max score: ${this.maxScore}`, () => true);
    this.ctx.queueText(() => `Birds: ${this.birds.filter(({
      dead
    }) => !dead).length}/${BIRD_AMOUNT}`, () => true);
    this.ctx.queueText(() => `Generation: ${this.generation}`, () => true);
    document.addEventListener('keydown', this.event.bind(this));
    document.querySelector('#speed-normal').addEventListener('click', () => this.FPS = DEFAULT_FPS);
    document.querySelector('#speed-super').addEventListener('click', () => this.FPS = -1);
    document.querySelector('#pause').addEventListener('click', ({
      target
    }) => this.pauseWhenHighscore = target.checked);
    document.querySelector('#respawn').addEventListener('click', () => this.respawn());
    document.querySelector('#reset').addEventListener('click', () => this.reset());
    document.querySelector('#structure').addEventListener('input', ({
      target
    }) => this.desiredStructure = target.value);
    document.querySelector('#set-structure').addEventListener('click', () => {
      this.desiredStructure = JSON.parse(`[${this.desiredStructure}]`);
      this.reset();
    });

    this._loop();
  }

  event(e) {
    if (e.code == 'Space') {
      this.birds[0].jump();
    }
  }

  reset() {
    this.pipes = [];
    this.maxScore = 0;
    this.score = 0;
    this.generation = 0;
    this.birds = [];
    this.respawn();
  }

  createBirds(amount, getNet) {
    return [...Array(amount)].map(() => new Bird(50, _Game__WEBPACK_IMPORTED_MODULE_1__["Dimensions"][1] / 2, BIRD_GRAVITY, BIRD_FORCE, getNet()));
  }

  respawn() {
    this.pipeSpeed = PIPE_SPEED;
    this.pipes = [];
    this.maxScore = Math.max(this.maxScore, this.score);
    this.score = 0;
    const birds = this.birds.sort((a, b) => b.score - a.score);
    const [best] = birds;

    const firstGen = () => new _NeuralNet__WEBPACK_IMPORTED_MODULE_0__["default"](NETWORK_STRUCTURE(this.desiredStructure));

    if (best) {
      this.birds = [...this.createBirds(BIRD_AMOUNT / 2, () => best.net.nextGeneration()), ...this.createBirds(BIRD_AMOUNT / 2, firstGen)];
    } else {
      this.birds = this.createBirds(BIRD_AMOUNT, firstGen);
    }
  }

  _loop() {
    this.loop();

    if (this.FPS <= 0) {
      window.setZeroTimeout(() => {
        this._loop();
      });
    } else {
      setTimeout(() => {
        this._loop();
      }, 1e3 / this.FPS);
    }
  }

  loop() {
    const birds = this.birds.filter(({
      dead
    }) => !dead);
    this.pipes = this.pipes.filter(({
      dead
    }) => !dead);

    if (birds.length <= 0) {
      this.generation++;
      this.respawn();
      return;
    }

    if (this.pipes.length <= 0) {
      this.pipeSpeed += PIPE_ACCELERATION;
      this.pipes = [...Array(1)].map(() => new Pipe(_Game__WEBPACK_IMPORTED_MODULE_1__["Dimensions"][0], Math.random() * (_Game__WEBPACK_IMPORTED_MODULE_1__["Dimensions"][1] - PIPE_GAP * 2 - PIPE_MARGIN * 2) + PIPE_GAP + PIPE_MARGIN, this.pipeSpeed));
    }

    birds.forEach(bird => bird.loop(this.pipes));
    this.pipes.forEach(pipe => pipe.loop());
    this.score++;
    if (this.score > this.maxScore && this.pauseWhenHighscore) this.FPS = DEFAULT_FPS;
  }

  render(ctx) {
    const dead = ({
      dead
    }) => !dead;

    this.birds.filter(dead).forEach(bird => bird.draw(ctx));
    this.pipes.filter(dead).forEach(pipe => pipe.draw(ctx));
  }

}

/***/ }),

/***/ "./src/js/Game.ts":
/*!************************!*\
  !*** ./src/js/Game.ts ***!
  \************************/
/*! exports provided: Resources, Dimensions, createGame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Resources", function() { return Resources; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dimensions", function() { return Dimensions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createGame", function() { return createGame; });
/* harmony import */ var _Flappy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Flappy */ "./src/js/Flappy.ts");
/* harmony import */ var _Resource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Resource */ "./src/js/Resource.ts");
/* harmony import */ var _Ctx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Ctx */ "./src/js/Ctx.ts");



const Resources = {
  pipeBottom: new _Resource__WEBPACK_IMPORTED_MODULE_1__["default"]('./static/pipebottom.png'),
  pipeTop: new _Resource__WEBPACK_IMPORTED_MODULE_1__["default"]('./static/pipetop.png'),
  bird: new _Resource__WEBPACK_IMPORTED_MODULE_1__["default"]('./static/bird.png'),
  background: new _Resource__WEBPACK_IMPORTED_MODULE_1__["default"]('./static/background.png')
};
const Dimensions = [300, 500];
const createGame = async () => {
  const ctx = new _Ctx__WEBPACK_IMPORTED_MODULE_2__["default"]({
    showFps: true,
    size: 18,
    w: Dimensions[0],
    h: Dimensions[1]
  });
  const files = Object.entries(Resources);
  let loadedFiles = 0;
  const loading = files.map(([, v]) => v.load());
  loading.forEach(v => v.then(() => loadedFiles++));
  const remove = [ctx.queueText(() => `Loading...`, () => true, _Ctx__WEBPACK_IMPORTED_MODULE_2__["TextPosition"].Middle), ctx.queueText(() => `${loadedFiles}/${files.length}`, () => true, _Ctx__WEBPACK_IMPORTED_MODULE_2__["TextPosition"].Middle)];
  await Promise.all(loading);
  remove.forEach(v => v());
  return new _Flappy__WEBPACK_IMPORTED_MODULE_0__["default"]({
    ctx
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
// input, hidden[], output
// const sigmoid = z => 1 / (1 + Math.pow(Math.E, -z));
const random = () => Math.random() * 2 - 1;

const sigmoid = z => 1 / (1 + Math.exp(-z / 1));

const MUTATION_CHANCE = .2;
const MUTATION_FORCE = .1;

class Neuron {
  constructor(inputs, weights) {
    this.weights = weights || [...Array(inputs)].map(() => random());
  }

  forward(values) {
    return sigmoid(values.map((v, i) => this.weights[i] * values[i]).reduce((a, v) => a + v, 0));
  }

  randomize() {
    return new Neuron(null, this.weights.map(v => Math.random() > MUTATION_CHANCE ? v : v + random() * MUTATION_FORCE));
  }

}

class NeuralNet {
  constructor(structure, neurons) {
    this.structure = structure;
    this.neurons = neurons || structure.map((v, i, a) => [...Array(v)].map(() => new Neuron(i == 0 ? 0 : a[i - 1])));
  }

  forward(values) {
    if (values.length != this.neurons[0].length) {
      console.error('Input length not equal to input neuron layer');
      return;
    }

    const result = [...Array(this.neurons.length)];
    this.neurons.forEach((layer, i) => result[i] = i == 0 ? values : layer.map(neuron => neuron.forward(result[i - 1]))); // console.log(result);

    return result[result.length - 1];
  }

  nextGeneration() {
    return new NeuralNet(this.structure, this.neurons.map(layer => layer.map(neuron => neuron.randomize())));
  } // public breed(a: NeuralNet, b: NeuralNet): NeuralNet {
  //     return new NeuralNet(this.structure, this.neurons.map(layer => layer.map(neuron => )))
  // }


}

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

  draw(ctx, x, y, w, h, angle) {
    if (!this.loaded) {
      console.warn('Image tried to draw when not loaded', this.img.src);
      return;
    }

    let _x = x;
    let _y = y;

    if (angle) {
      ctx.save();
      ctx.translate(x + this.img.width / 2, y + this.img.height / 2);
      ctx.rotate(angle);
      _x = -this.img.width / 2;
      _y = -this.img.height / 2;
    }

    if (w && h) ctx.drawImage(this.img, _x, _y, w, h);else ctx.drawImage(this.img, _x, _y);
    if (angle) ctx.restore();
  }

  dimensions() {
    if (!this.loaded) {
      console.warn('Image tried to get dimensions when not loaded', this.img.src);
      return;
    }

    return [this.img.width, this.img.height];
  }

}

/***/ })

/******/ });
//# sourceMappingURL=app.bundle.js.map