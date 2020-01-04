import Flappy from "./Flappy";
import NeuralNet from "./NeuralNet";
import Resource from "./Resource";
import Ctx, { TextPosition } from "./Ctx";

export const createGame = async () => {
    const ctx = new Ctx({
        showFps: true
    });

    const resources = {
        pipeBottom: new Resource('./static/pipebottom.png'),
        pipeTop: new Resource('./static/pipetop.png'),
        bird: new Resource('./static/bird.png'),
        background: new Resource('./static/background.png')
    };
    
    const files = Object.entries(resources);
    let loadedFiles = 0;

    const loading = files.map(([,v]) => v.load());
    loading.forEach(v => v.then(() => loadedFiles++).catch(() => loadedFiles++));

    const remove = [
        ctx.queueText(() => `Loading...`, () => true, TextPosition.Middle),
        ctx.queueText(() => `${loadedFiles}/${files.length}`, () => true, TextPosition.Middle)
    ]

    await Promise.all(loading);

    remove.forEach(v => v());

    return new Flappy({
        net: new NeuralNet(),
        ctx,
        resources
    });
}