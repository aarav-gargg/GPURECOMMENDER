export const scaleBenchmarkByGpuCount = (benchmark, multiplier) => {
    return {
      ...benchmark,
      fp16: benchmark.fp16 * multiplier,
      tf32: benchmark.tf32 * multiplier,
      bandwidth: benchmark.bandwidth * multiplier,
      memory: benchmark.memory * multiplier,
    };
  };
  