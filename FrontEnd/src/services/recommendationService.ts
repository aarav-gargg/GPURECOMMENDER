import { WorkloadRequirements, Recommendation } from '../types';

export interface GPUModel {
  country: string;
  operating_system: string;
  resource_class: string;
  resource_name: string;
  vcpus: number;
  ram: number;
  price_per_hour: number;
  price_per_month: number;
  price_per_half_year: number;
  price_per_year: number;
  price_per_spot: number;
  currency: string;
  is_gpu: number;
  is_spot: number;
  resource: string;
  resource_type: string;
  region: string;
  gpu_description: string;
  is_public: number;
  performanceScore: number;
  costEfficiency: number;
  utilizationFactor: number;
  adjustedScore: string;
}

export interface GPUResponse {
  success: boolean;
  instance: GPUModel[];
}

export const generateRecommendations = async (
  requirements: WorkloadRequirements
): Promise<Recommendation[]> => {
  try {
    const response = await fetch('https://gpurecommender.onrender.com/api/recommendations/gpu' ,  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requirements),
    });
    const gpuModels: GPUResponse = await response.json();
    
    if(gpuModels.instance.length == 0) return [];

    const availableGpus = gpuModels.instance.filter(gpu =>
      gpu.region.toLowerCase() === requirements.region.toLowerCase()
    );

    if (availableGpus.length === 0) return [];

    const scoredGpus = availableGpus.map(gpu => {
      const score = scoreGpu(gpu, requirements);

      const costPerHour = gpu.price_per_hour;
      const estimatedTime = estimateCompletionTime(
        gpu,
        requirements.workloadType,
        requirements.datasetSize,
        requirements.usecase
      );
      const estimatedCost = costPerHour * estimatedTime;

      const reasons = generateReasons(gpu, requirements, score);

      return {
        model: gpu,
        score,
        estimatedCost,
        estimatedTime,
        reasons
      };
    });

    return scoredGpus
      .filter(r => r.score > 0.4)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  } catch (error) {
    console.error('Failed to fetch GPU data:', error);
    return [];
  }
};

// Scoring logic
const scoreGpu = (gpu: GPUModel, requirements: WorkloadRequirements): number => {
  let score = 0;
  const maxScore = 10;

  const costPerHour = gpu.price_per_hour;
  if (requirements.maxBudget > 0 && costPerHour > requirements.maxBudget) return 0;

  score += (gpu.performanceScore / 200) * 3;

  const memoryNeed = getMemoryRequirementForWorkload(requirements.usecase);
  if (gpu.ram >= memoryNeed * 1.5) {
    score += 4;
  } else if (gpu.ram >= memoryNeed) {
    score += 3;
  } else if (gpu.ram >= memoryNeed * 0.75) {
    score += 2;
  } else if (gpu.ram >= memoryNeed * 0.5) {
    score += 1;
  }

  const perfPerDollar = gpu.performanceScore / costPerHour;
  const maxPerfPerDollar = 150;
  score += (perfPerDollar / maxPerfPerDollar) * 3;

  return Math.min(Math.max(score, 0), maxScore);
};

const getMemoryRequirementForWorkload = (usecase: string): number => {
  switch (usecase) {
    case 'llm-large': return 80;
    case 'llm-medium': return 40;
    case 'llm-small': return 16;
    case 'cv-large': return 32;
    case 'cv-small': return 16;
    case 'diffusion': return 24;
    case 'rl': return 24;
    default: return 16;
  }
};

const estimateCompletionTime = (
  gpu: GPUModel,
  workloadType: string,
  datasetSize: number,
  modelType: string
): number => {
  let baseTime = 1;
  switch (datasetSize) {
    case 0.5 : baseTime *= 0.5; break;
    case 1: baseTime *= 1; break;
    case 2.5 : baseTime *= 2.5; break;
    case 6 : baseTime *= 6; break;
    case 12 : baseTime *= 12; break;
  }

  switch (modelType) {
    case 'llm-large': baseTime *= 2.5; break;
    case 'llm-medium': baseTime *= 1.5; break;
    case 'diffusion': baseTime *= 1.2; break;
  }

  if (workloadType === 'training') baseTime *= 5;

  return baseTime * (100 / gpu.performanceScore);
};

const generateReasons = (
  gpu: GPUModel,
  requirements: WorkloadRequirements,
  score: number
): string[] => {
  const reasons: string[] = [];
  const memoryNeed = getMemoryRequirementForWorkload(requirements.usecase);

  if (gpu.ram >= memoryNeed * 1.5) {
    reasons.push(`Exceeds memory requirements (${gpu.ram}GB) for your ${requirements.usecase} workload`);
  } else if (gpu.ram >= memoryNeed) {
    reasons.push(`Sufficient memory (${gpu.ram}GB) for your ${requirements.usecase} workload`);
  }

  if (gpu.performanceScore > 150) {
    reasons.push('Exceptional computational performance for accelerated processing');
  } else if (gpu.performanceScore > 100) {
    reasons.push('High-performance computing capabilities well-suited for your task');
  } else if (gpu.performanceScore > 50) {
    reasons.push('Balanced performance suitable for your workload requirements');
  } else {
    reasons.push('Cost-effective performance for your specific workload');
  }

  const costPerHour = gpu.price_per_hour;
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

  if (requirements.workloadType === 'training') {
    if (gpu.performanceScore > 120) {
      reasons.push('Optimized architecture for training deep learning models');
    } else {
      reasons.push('Sufficient for training with reasonable completion times');
    }
  } else {
    if (gpu.performanceScore / costPerHour > 70) {
      reasons.push('Excellent price-to-performance ratio for inference workloads');
    } else {
      reasons.push('Balanced capabilities for reliable inference tasks');
    }
  }

  return reasons.slice(0, 4);
};
