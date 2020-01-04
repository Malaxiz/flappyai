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
}