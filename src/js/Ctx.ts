
export enum TextPosition {
    TopLeft,
    Middle
};

export interface CtxOptions {
    w?: number,
    h?: number,
    size?: number,
    showFps?: boolean,
};

export type RenderFunction = (ctx: CanvasRenderingContext2D) => void;
export type RenderTextFunction = () => string;
export type RemoveRenderFunction = () => void;
export type AliveFunction = () => boolean;

export default class Ctx {
    private w: number = 500;
    private h: number = 500;
    private size: number = 24; // font size

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private _queue: {
        func: RenderFunction,
        alive: AliveFunction
    }[] = [];

    private fps: number;
    private options: CtxOptions = {
        showFps: false
    };

    private text: {
        [position in TextPosition]?: RenderTextFunction[]
    } = {};

    private textCoordinates: {
        [position in TextPosition]: () => [number, number, number, number] // w, h, padding-vertical, padding-horizontal
    } = {
        [TextPosition.TopLeft]: () => [0, 0, this.size / 2, this.size / 2],
        [TextPosition.Middle]: () => [this.w / 2, this.h / 2, this.size / 2, 0],
    };

    constructor(options: CtxOptions = {}) {
        this.options = options;
        this.w = options.w || this.w;
        this.h = options.h || this.h;
        this.size = options.size || this.size;

        this.options = {...options, ...this.options};

        this.init();
        this.loop();
    }

    private init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.w;
        this.canvas.height = this.h;

        this.ctx = document.body.appendChild(this.canvas).getContext('2d');
        this.ctx.font = `${this.size}px Arial`;

        this.queueText(() => `Fps: ${this.fps.toFixed(1)}`, () => this.options.showFps);
    }

    private loop(): void {
        let now;
        const req = () => requestAnimationFrame(time => {
            this.fps = 1e3 / (time - now);
            this.ctx.clearRect(0, 0, this.w, this.h);
            this._queue.filter(({alive}) => alive())
                .forEach(({func}) => func(this.ctx));

            now = time;
            req();
        });
        req();
    }

    public queue(func: RenderFunction, alive: AliveFunction): RemoveRenderFunction {
        this._queue.push({ func, alive });
        return () => {
            const i = this._queue.findIndex(v => v.func == func);
            if(i == -1)
                console.error(`Failed to remove render function`, func, alive);
            else
                this._queue.splice(i, 1);
        };
    }

    public queueText(text: RenderTextFunction, alive: AliveFunction, position: TextPosition = TextPosition.TopLeft): RemoveRenderFunction {
        if(!this.text[position]) this.text[position] = [];
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