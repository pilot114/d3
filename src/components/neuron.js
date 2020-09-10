const activation = (inputs, weights) => {
    inputs = inputs.map((x,i) => x * weights[i]);
    return inputs.reduce((a, b) => a + b, 0) >= 0.5;
}

const train = (input, expected) => {
    const smooth = 0.001;

    let cur = input * weight;
    let err = expected - cur;
    weight += (err / cur) * smooth;
}

let res = activation(
    [1, 1, 0],
    [0.3, 0.2, 0.6],
);

console.log(res);