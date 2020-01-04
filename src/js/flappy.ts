import NeuralNet from "./NeuralNet";
import Ctx from "./Ctx";
import { Resources, Dimensions } from './Game';

const PIPE_GAP = 100;
const PIPE_SPEED = -3;
const BIRD_AMOUNT = 50;
const BIRD_GRAVITY = 0.25;
const BIRD_FORCE = -6;

export interface FlappyParams {
    net: NeuralNet,
    ctx: Ctx
};

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

    public dead: boolean = false;
    
    constructor(x, y, g, force) {
        const dims = Resources.bird.dimensions();
        this.pos = new Movable(x, y, dims[0], dims[1]);
        this.g = g;
        this.force = force;
    }

    public loop(pipes: Pipe[]): void {
        if(this.pos.y > Dimensions[1] || this.pos.y < 0) this.dead = true;
        if(pipes.some(pipe => pipe.collides(this.pos))) this.dead = true;

        if(this.dead) return;

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
}

export default class Flappy {
    private ctx: Ctx;
    private net: NeuralNet;

    private birds: Bird[] = [];
    private birdAmount: number = BIRD_AMOUNT;

    private pipes: Pipe[] = [];

    private score: number = 0;

    constructor(params: FlappyParams) {
        this.ctx = params.ctx;
        this.net = params.net;
        this.init();
    }

    private init(): void {
        setInterval(this.loop.bind(this), 1e3/60);
        this.ctx.queue(this.render.bind(this), () => true);

        this.ctx.queueText(() => `Score: ${this.score}`, () => true);

        document.addEventListener('keydown', this.event.bind(this));
    }

    private event(e: KeyboardEvent) {
        if(e.code == 'Space') {
            this.birds[0].jump();
        }
    }

    private loop() {
        this.birds = this.birds.filter(({ dead }) => !dead);
        this.pipes = this.pipes.filter(({ dead }) => !dead);

        if(this.birds.length <= 0) {
            this.pipes = [];
            this.score = 0;

            this.birds = [...Array(this.birdAmount)]
                .map(() => new Bird(50, Dimensions[1] / 2, BIRD_GRAVITY, BIRD_FORCE));
        }

        if(this.pipes.length <= 0) {
            this.pipes = [...Array(1)]
                .map(() => new Pipe(Dimensions[0], Math.random() * (Dimensions[1] - PIPE_GAP * 2) + PIPE_GAP, PIPE_SPEED));
        }

        this.birds.forEach(bird => bird.loop(this.pipes));
        this.pipes.forEach(pipe => pipe.loop());

        this.score++;
    }

    private render(ctx: CanvasRenderingContext2D) {
        this.birds.forEach(bird => bird.draw(ctx));
        this.pipes.forEach(pipe => pipe.draw(ctx));
    }
}