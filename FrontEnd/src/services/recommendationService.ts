import { GPUModel, WorkloadRequirements, Recommendation } from '../types';
import { gpuModels } from '../data/gpuModels';

export const generateRecommendations = (
  requirements: WorkloadRequirements
): Recommendation[] => {
  // Filter GPUs by region
  const availableGpus = gpuModels.filter(gpu => 
    gpu.availability.includes(requirements.region)
  );
  
  if (availableGpus.length === 0) {
    return [];
  }
  
  // Score and select the best GPU models
  const scoredGpus = availableGpus.map(gpu => {
    const score = scoreGpu(gpu, requirements);
    
    // Calculate estimated cost based on workload
    const hourlyRate = requirements.workloadType === 'training' 
      ? gpu.trainingCostPerHour 
      : gpu.inferenceCostPerHour;
    
    // Simulate workload completion time based on model performance and dataset size
    const estimatedTime = estimateCompletionTime(
      gpu,
      requirements.workloadType,
      requirements.datasetSize,
      requirements.modelType
    );
    
    // Total cost for the workload
    const estimatedCost = hourlyRate;
    
    // Generate reasons why this GPU is a good match
    const reasons = generateReasons(gpu, requirements, score);
    
    return {
      model: gpu,
      score,
      estimatedCost,
      estimatedTime,
      reasons
    };
  });
  
  // Sort by score (descending) and filter out low-scoring options
  const threshold = 0.4; // Only include GPUs with at least 40% score
  return scoredGpus
    .filter(recommendation => recommendation.score > threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // Return top 6 recommendations
};

// Score GPU based on requirements
const scoreGpu = (
  gpu: GPUModel,
  requirements: WorkloadRequirements
): number => {
  let score = 0;
  const maxScore = 10;
  
  // Check budget constraints (very important)
  const costPerHour = requirements.workloadType === 'training'
    ? gpu.trainingCostPerHour
    : gpu.inferenceCostPerHour;
  
  if (requirements.maxBudget > 0 && costPerHour > requirements.maxBudget) {
    // Over budget, significant penalty
    return 0;
  }
  
  // Performance score (up to 3 points)
  score += (gpu.performance / 200) * 3; // Normalize to 0-3 range
  
  // Memory score based on workload (up to 4 points)
  const memoryNeed = getMemoryRequirementForWorkload(requirements.modelType);
  if (gpu.memory >= memoryNeed * 1.5) {
    score += 4; // Exceeds requirements by 50%+
  } else if (gpu.memory >= memoryNeed) {
    score += 3; // Meets requirements
  } else if (gpu.memory >= memoryNeed * 0.75) {
    score += 2; // Meets 75% of requirements (may work with optimizations)
  } else if (gpu.memory >= memoryNeed * 0.5) {
    score += 1; // Barely meets requirements
  }
  
  // Cost efficiency score (up to 3 points)
  // Higher score for better performance/$ ratio
  const perfPerDollar = gpu.performance / costPerHour;
  const maxPerfPerDollar = 150; // Approximate max perf/$ ratio in our dataset
  score += (perfPerDollar / maxPerfPerDollar) * 3;
  
  // Ensure score is in the 0-10 range
  return Math.min(Math.max(score, 0), maxScore);
};

// Helper functions
const getMemoryRequirementForWorkload = (modelType: string): number => {
  switch (modelType) {
    case 'llm-large':
      return 80; // Large language models need lots of VRAM
    case 'llm-medium':
      return
      40; // Medium language models
    case 'llm-small':
      return 16; // Small language models
    case 'cv-large':
      return 32; // Large computer vision models
    case 'cv-small':
      return 16; // Small computer vision models
    case 'diffusion':
      return 24; // Diffusion models
    case 'rl':
      return 24; // Reinforcement learning
    default:
      return 16; // Default requirement
  }
};

const estimateCompletionTime = (
  gpu: GPUModel,
  workloadType: string,
  datasetSize: string,
  modelType: string
): number => {
  // Base time in hours
  let baseTime = 1;
  
  // Scale based on dataset size
  switch (datasetSize) {
    case 'xsmall':
      baseTime *= 0.5;
      break;
    case 'small':
      baseTime *= 1;
      break;
    case 'medium':
      baseTime *= 2.5;
      break;
    case 'large':
      baseTime *= 6;
      break;
    case 'xlarge':
      baseTime *= 12;
      break;
  }
  
  // Scale based on model type
  switch (modelType) {
    case 'llm-large':
      baseTime *= 2.5;
      break;
    case 'llm-medium':
      baseTime *= 1.5;
      break;
    case 'diffusion':
      baseTime *= 1.2;
      break;
  }
  
  // Training takes longer than inference
  if (workloadType === 'training') {
    baseTime *= 5;
  }
  
  // Adjust for GPU performance
  return baseTime * (100 / gpu.performance);
};

const generateReasons = (
  gpu: GPUModel,
  requirements: WorkloadRequirements,
  score: number
): string[] => {
  const reasons: string[] = [];
  
  // Memory-related reason
  const memoryNeed = getMemoryRequirementForWorkload(requirements.modelType);
  if (gpu.memory >= memoryNeed * 1.5) {
    reasons.push(`Exceeds memory requirements (${gpu.memory}GB) for your ${requirements.modelType} workload`);
  } else if (gpu.memory >= memoryNeed) {
    reasons.push(`Sufficient memory (${gpu.memory}GB) for your ${requirements.modelType} workload`);
  }
  
  // Performance reason
  if (gpu.performance > 150) {
    reasons.push('Exceptional computational performance for accelerated processing');
  } else if (gpu.performance > 100) {
    reasons.push('High-performance computing capabilities well-suited for your task');
  } else if (gpu.performance > 50) {
    reasons.push('Balanced performance suitable for your workload requirements');
  } else {
    reasons.push('Cost-effective performance for your specific workload');
  }
  
  // Cost-related reason
  const costPerHour = requirements.workloadType === 'training'
    ? gpu.trainingCostPerHour
    : gpu.inferenceCostPerHour;
  
  if (requirements.maxBudget > 0) {
    const budgetPercentage = (costPerHour / requirements.maxBudget) * 100;
    if (budgetPercentage <= 50) {
      reasons.push(`Significantly under your budget at only ${budgetPercentage.toFixed(0)}% of maximum`);
    } else if (budgetPercentage <= 80) {
      reasons.push(`Comfortably within your budget at ${budgetPercentage.toFixed(0)}% of maximum`);
    } else {
      reasons.push(`Maximizes your budget utilization at ${budgetPercentage.toFixed(0)}% of maximum`);
    }
  }
  
  // Workload type reason
  if (requirements.workloadType === 'training') {
    if (gpu.performance > 120) {
      reasons.push('Optimized architecture for training deep learning models');
    } else {
      reasons.push('Sufficient for training with reasonable completion times');
    }
  } else {
    if (gpu.performance / gpu.inferenceCostPerHour > 70) {
      reasons.push('Excellent price-to-performance ratio for inference workloads');
    } else {
      reasons.push('Balanced capabilities for reliable inference tasks');
    }
  }
  
  return reasons.slice(0, 4); // Return top 4 reasons
};