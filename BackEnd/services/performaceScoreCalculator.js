export const computePerformanceScore = (benchmark, workloadType) => {
    if (workloadType === "Training") {
      return benchmark.fp16 * 0.4 + benchmark.tf32 * 0.4 + benchmark.memory * 0.2;
    } else if (workloadType === "Inference") {
      return benchmark.fp16 * 0.5 + benchmark.bandwidth * 0.3 + benchmark.memory * 0.2;
    } else {
      return benchmark.score;
    }
  };
  