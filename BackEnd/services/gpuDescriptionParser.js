export const parseGpuDescription = (desc) => {
    const match = desc.match(/^(\d+)x\s*(\w+)/);
    if (!match) return null;
  
    const multiplier = parseInt(match[1], 10);
    const model = match[2];
  
    return {
      model,
      multiplier,
    };
  };