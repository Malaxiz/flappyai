import NeuralNet from "./NeuralNet";
import Resource from "./Resource";
import Ctx from "./Ctx";

export interface FlappyParams {
    net: NeuralNet,
    ctx: Ctx,
    resources: {
        pipeBottom: Resource,
        pipeTop: Resource,
        bird: Resource,
        background: Resource
    }
};

export default class Flappy {
    private ctx: Ctx;
    private net: NeuralNet;

    private resources: {
        [key: string]: Resource
    };

    constructor(params: FlappyParams) {
        console.log(params);
    }
}