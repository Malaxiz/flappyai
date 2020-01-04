import { Dimensions } from "./Game";

export interface LoadStatus {
    status: string,
    value?: any
};

export default class Resource {
    private img: HTMLImageElement;
    private loaded: boolean = false;
    private didLoad: Promise<LoadStatus>;

    constructor(file: string) {
        this.init(file);
    }

    private async init(file: string) {
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
        })
        await this.didLoad;
        this.loaded = true;
    }

    public load(): Promise<LoadStatus> {
        return this.didLoad;
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number, w?: number, h?: number, angle?: number) {
        if(!this.loaded) {
            console.warn('Image tried to draw when not loaded', this.img.src);
            return;
        }

        let _x = x;
        let _y = y;

        if(angle) {
            ctx.save();
            ctx.translate(x + this.img.width / 2, y + this.img.height / 2);
            ctx.rotate(angle);

            _x = -this.img.width / 2;
            _y = -this.img.height / 2;
        }

        if(w && h) ctx.drawImage(this.img, _x, _y, w, h);
        else ctx.drawImage(this.img, _x, _y);

        if(angle)
            ctx.restore();
    }

    public dimensions(): [number, number] {
        if(!this.loaded) {
            console.warn('Image tried to get dimensions when not loaded', this.img.src);
            return;
        }
        return [this.img.width, this.img.height];
    }
}