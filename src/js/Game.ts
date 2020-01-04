import Flappy from "./Flappy";
import NeuralNet from "./NeuralNet";
import Resource from "./Resource";
import Ctx, { TextPosition } from "./Ctx";

export const Resources = {
    pipeBottom: new Resource('./static/pipebottom.png'),
    pipeTop: new Resource('./static/pipetop.png'),
    bird: new Resource('./static/bird.png'),
    background: new Resource('./static/background.png')
};

export const Dimensions = [300, 500];

export const createGame = async () => {
    const ctx = new Ctx({
        showFps: true,
        w: Dimensions[0],
        h: Dimensions[1]
    });

    const files = Object.entries(Resources);
    let loadedFiles = 0;

    const loading = files.map(([,v]) => v.load());
    loading.forEach(v => v.then(() => loadedFiles++));

    const remove = [
        ctx.queueText(() => `Loading...`, () => true, TextPosition.Middle),
        ctx.queueText(() => `${loadedFiles}/${files.length}`, () => true, TextPosition.Middle)
    ]

    await Promise.all(loading);
    remove.forEach(v => v());

    return new Flappy({
        net: new NeuralNet(),
        ctx
    });
}