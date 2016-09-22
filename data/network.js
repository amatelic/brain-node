var trainingSet = [
  {
    input: [0, 1, 0, 0, 1],
    output: [0, 0, 1, 0, 0]
  },
  {
    input: [1, 0, 1, 0, 1],
    output: [0, 0, 1, 0, 0]
  },
  {
    input: [1, 1, 1, 0, 1],
    output: [0, 0, 0, 1, 0]
  },
  {
    input: [1, 1, 0, 1, 0],
    output: [0, 0, 1, 0, 0]
  },
  {
    input: [0, 0, 1, 1, 1],
    output: [0, 1, 0, 0, 0]
  },
  {
    input:  [1, 0, 0, 0, 1],
    output: [0, 1, 0, 0, 0]
  },
  {
    input:  [0, 0, 1, 0, 1],
    output: [0, 0, 0, 1, 0]
  },
  {
    input:  [0, 0, 1, 1, 0],
    output: [0, 0, 0, 0, 1]
  },
  {
    input:  [0, 1, 0, 1, 0],
    output: [1, 0, 0, 0, 0]
  }
];

var trainingOptions = {
  rate: .1,
  iterations: 20000,
  error: .005,
}

module.exports = {
  trainingData: trainingSet,
  options: trainingOptions
};
