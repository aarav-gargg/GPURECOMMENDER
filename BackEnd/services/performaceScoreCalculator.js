export const computePerformanceScore = (benchmark, workloadType) => {
    if (workloadType === "Training") {
      // prioritize memory and FP16 throughput
      return benchmark.fp16 * 0.4 + benchmark.tf32 * 0.4 + benchmark.memory * 0.2;
    } else if (workloadType === "Inference") {
      // prioritize speed, memory, and bandwidth
      return benchmark.fp16 * 0.5 + benchmark.bandwidth * 0.3 + benchmark.memory * 0.2;
    } else {
      // fallback to default score
      return benchmark.score;
    }
  };
  