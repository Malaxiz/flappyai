import NeuralNet from "./NeuralNet";
import Ctx from "./Ctx";
import { Resources, Dimensions } from './Game';

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

export interface FlappyParams {
    ctx: Ctx
};

(function() {
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

	(window as any).setZeroTimeout = setZeroTimeout;
})();

class Movable {
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    public vY: number = 0;
    public vX: number = 0;

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    public loop() {
        this.y += this.vY;
        this.x += this.vX;
    }

    public collides(pos: Movable): boolean {
        return !(pos.x > this.x + this.w
            || pos.x + pos.w < this.x
            || pos.y > this.y + this.h
            || pos.y + pos.h < this.y);
    }
}

class Bird {
    private pos: Movable;
    private force: number;
    private g: number;

    public net: NeuralNet;
    public dead: boolean = false;
    public score: number = 0;
    
    constructor(x: number, y: number, g: number, force: number, net: NeuralNet) {
        const dims = Resources.bird.dimensions();
        this.pos = new Movable(x, y, dims[0], dims[1]);
        this.g = g;
        this.force = force;
        this.net = net;
    }

    public loop(pipes: Pipe[]): void {
        const [screenWidth, screenHeight] = Dimensions;

        if(this.pos.y > screenHeight || this.pos.y < 0) this.dead = true;
        if(pipes.some(pipe => pipe.collides(this.pos))) this.dead = true;

        if(this.dead) return;
        this.score++;

        const inputs = [this.pos.y / screenHeight, pipes[0].getHeight() / screenHeight, pipes[0].getX() / screenWidth];
        // console.log(inputs);
        const netResult = this.net.forward(inputs);
        if(netResult[0] > .5) this.jump();

        this.pos.vY += this.g;
        this.pos.loop();
    }

    public jump(): void {
        this.pos.vY = this.force;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        Resources.bird.draw(ctx, this.pos.x, this.pos.y, null, null, Math.PI/2 * this.pos.vY/20);
    }
}

class Pipe {
    private h: number;
    private padding: number = PIPE_GAP;

    private top: Movable;
    private bottom: Movable;

    public dead: boolean = false;

    constructor(x, h, vX) {
        const dims = Resources.pipeTop.dimensions();

        this.top = new Movable(x, h - dims[1], dims[0], dims[1]);
        this.bottom = new Movable(x, h + this.padding, dims[0], dims[1]);
        this.top.vX = vX;
        this.bottom.vX = vX;
        this.h = h;
    }

    public loop() {
        if(this.top.x + Resources.pipeTop.dimensions()[0] < 0) this.dead = true;
        this.top.loop();
        this.bottom.loop();
    }

    public draw(ctx: CanvasRenderingContext2D) {
        Resources.pipeTop.draw(ctx, this.top.x, this.h - Resources.pipeTop.dimensions()[1]);
        Resources.pipeBottom.draw(ctx, this.bottom.x, this.h + this.padding);
        // ctx.fillRect(this.pos.x, this.h, Resources.pipeTop.dimensions()[0], this.padding);
    }

    public collides(pos: Movable): boolean {
        return this.top.collides(pos) || this.bottom.collides(pos);
    }

    public getHeight(): number {
        return this.h;
    }

    public getX(): number {
        return this.bottom.x;
    }
}

export default class Flappy {
    private ctx: Ctx;

    private birds: Bird[] = [];
    private pipes: Pipe[] = [];

    private pipeSpeed = PIPE_SPEED;
    private score: number = 0;
    private maxScore: number = 0;
    private generation: number = 0;
    private FPS: number = DEFAULT_FPS;
    private pauseWhenHighscore: boolean = true;
    private desiredStructure: number[] = [2, 2];

    constructor(params: FlappyParams) {
        this.ctx = params.ctx;
        this.init();
    }

    private init(): void {
        this.ctx.queue(this.render.bind(this), () => true);
        this.ctx.queueText(() => `Score: ${this.score}`, () => true);
        this.ctx.queueText(() => `Max score: ${this.maxScore}`, () => true);
        this.ctx.queueText(() => `Birds: ${this.birds.filter(({ dead }) => !dead).length}/${BIRD_AMOUNT}`, () => true);
        this.ctx.queueText(() => `Generation: ${this.generation}`, () => true);

        document.addEventListener('keydown', this.event.bind(this));
        document.querySelector('#speed-normal').addEventListener('click', () => this.FPS = DEFAULT_FPS);
        document.querySelector('#speed-super').addEventListener('click', () => this.FPS = -1);
        document.querySelector('#pause').addEventListener('click', ({ target }) => this.pauseWhenHighscore = (target as any).checked);
        document.querySelector('#respawn').addEventListener('click', () => this.respawn());
        document.querySelector('#reset').addEventListener('click', () => this.reset());
        document.querySelector('#structure').addEventListener('input', ({ target }) => this.desiredStructure = (target as any).value);
        document.querySelector('#set-structure').addEventListener('click', () => {
            this.desiredStructure = JSON.parse(`[${this.desiredStructure}]`);
            this.reset();
        });

        this._loop();
    }

    private event(e: KeyboardEvent) {
        if(e.code == 'Space') {
            this.birds[0].jump();
        }
    }

    private reset(): void {
        this.pipes = [];
        this.maxScore = 0;
        this.score = 0;
        this.generation = 0;
        this.birds = [];
        this.respawn();
    }

    private createBirds(amount: number, getNet: () => NeuralNet): Bird[] {
        return [...Array(amount)]
            .map(() => new Bird(50, Dimensions[1] / 2, BIRD_GRAVITY, BIRD_FORCE, getNet()));
    }

    private respawn(): void {
        this.pipeSpeed = PIPE_SPEED;
        this.pipes = [];
        this.maxScore = Math.max(this.maxScore, this.score);
        this.score = 0;

        const birds = this.birds.sort((a, b) => b.score - a.score);
        const [best] = birds;

        const firstGen = () => new NeuralNet(NETWORK_STRUCTURE(this.desiredStructure));

        if(best) {
            this.birds = [
                ...this.createBirds(BIRD_AMOUNT / 2, () => best.net.nextGeneration()),
                ...this.createBirds(BIRD_AMOUNT / 2, firstGen)
            ];
        } else {
            this.birds = this.createBirds(BIRD_AMOUNT, firstGen);
        }
    }

    private _loop(): void {
        this.loop();
        if(this.FPS <= 0) {
            (window as any).setZeroTimeout(() => {
                this._loop();
            });
        } else {
            setTimeout(() => {
                this._loop();
            }, 1e3/ this.FPS );
        }
    }

    private loop(): void {
        const birds = this.birds.filter(({ dead }) => !dead);
        this.pipes = this.pipes.filter(({ dead }) => !dead);

        if(birds.length <= 0) {
            this.generation++;
            this.respawn();
            return;
        }

        if(this.pipes.length <= 0) {
            this.pipeSpeed += PIPE_ACCELERATION;
            this.pipes = [...Array(1)]
                .map(() => new Pipe(Dimensions[0], Math.random() * (Dimensions[1] - PIPE_GAP * 2 - PIPE_MARGIN * 2) + PIPE_GAP + PIPE_MARGIN, this.pipeSpeed));
        }

        birds.forEach(bird => bird.loop(this.pipes));
        this.pipes.forEach(pipe => pipe.loop());

        this.score++;
        if(this.score > this.maxScore && this.pauseWhenHighscore)
            this.FPS = DEFAULT_FPS;
    }

    private render(ctx: CanvasRenderingContext2D) {
        const dead = ({ dead }) => !dead;

        this.birds.filter(dead).forEach(bird => bird.draw(ctx));
        this.pipes.filter(dead).forEach(pipe => pipe.draw(ctx));
    }
}