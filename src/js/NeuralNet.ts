type NetworkStructure = number[]; // input, hidden[], output

// const sigmoid = z => 1 / (1 + Math.pow(Math.E, -z));

const random = () => Math.random() * 2 - 1;
const sigmoid = z => (1 / (1 + Math.exp((-z)/1)));

const MUTATION_CHANCE = .2;
const MUTATION_FORCE = .1;

class Neuron {
    private weights: number[];

    constructor(inputs: number, weights?: number[]) {
        this.weights = weights || [...Array(inputs)].map(() => random());
    }

    public forward(values: number[]): number {
        return sigmoid(
            values.map((v, i) => this.weights[i] * values[i])
                .reduce((a, v) => a + v, 0)
        );
    }

    public randomize(): Neuron {
        return new Neuron(null, this.weights.map(v => Math.random() > MUTATION_CHANCE ? v : v + random() * MUTATION_FORCE));
    }
}

export default class NeuralNet {
    private structure: NetworkStructure;
    private neurons: Neuron[][];

    constructor(structure: NetworkStructure, neurons?: Neuron[][]) {
        this.structure = structure;
        this.neurons = neurons || structure.map((v, i, a) =>
            [...Array(v)].map(() => new Neuron(i == 0 ? 0 : a[i - 1]))
        );
    }

    public forward(values: number[]): number[] {
        if(values.length != this.neurons[0].length) {
            console.error('Input length not equal to input neuron layer');
            return;
        }

        const result = [...Array(this.neurons.length)];
        this.neurons.forEach((layer, i) => result[i] = i == 0 ? values : layer.map(neuron => neuron.forward(result[i - 1])));

        // console.log(result);
        return result[result.length - 1];
    }

    public nextGeneration(): NeuralNet {
        return new NeuralNet(this.structure, this.neurons.map(layer => layer.map(neuron => neuron.randomize())));
    }

    // public breed(a: NeuralNet, b: NeuralNet): NeuralNet {
    //     return new NeuralNet(this.structure, this.neurons.map(layer => layer.map(neuron => )))
    // }
}