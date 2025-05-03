export const gpuBenchmarks = {
  "A100-80GB": {
    tf32: 312,
    fp16: 624,
    memory: 80,
    bandwidth: 2039,
    score: 95,
    compatibility: [true, false, true, true, true]
  },
  "A30": {
    tf32: 165,
    fp16: 330,
    memory: 24,
    bandwidth: 933,
    score: 75,
    compatibility: [true, false, true, true, true]
  },
  "A10-24GB": {
    tf32: 124,
    fp16: 248,
    memory: 24,
    bandwidth: 600,
    score: 70,
    compatibility: [true, true, true, true, true]
  },
  "V100-32GB": {
    tf32: 130,
    fp16: 260,
    memory: 32,
    bandwidth: 900,
    score: 73,
    compatibility: [true, false, true, true, true]
  },
  "T4-16GB": {
    tf32: 65,
    fp16: 130,
    memory: 16,
    bandwidth: 320,
    score: 55,
    compatibility: [true, false, false, true, true]
  },
  "L4": {
    tf32: 130,
    fp16: 260,
    memory: 24,
    bandwidth: 600,
    score: 72,
    compatibility: [true, true, true, true, true]
  },
  "HGX H100": {
    tf32: 500,
    fp16: 1000,
    memory: 80,
    bandwidth: 3000,
    score: 100,
    compatibility: [true, false, true, true, true]
  },
  "RTX A6000": {
    tf32: 150,
    fp16: 300,
    memory: 48,
    bandwidth: 960,
    score: 80,
    compatibility: [true, true, true, true, true]
  },
  "RTX-4000-20GB": {
    tf32: 80,
    fp16: 160,
    memory: 20,
    bandwidth: 448,
    score: 65,
    compatibility: [true, true, false, true, true]
  }
};


export const COMPATIBILITY_INDEX = {
  AI: 0,
  Rendering: 1,
  Training: 2,
  Inference: 3,
  General: 4
};

