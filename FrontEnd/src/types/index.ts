// types/index.ts

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


export interface WorkloadRequirements {
  usecase: string;
  datasetSize: number;
  workloadType: 'training' | 'inference';
  region: string;
  maxBudget: number;
  additionalRequirements: string;
}

export interface Recommendation {
  model: GPUModel;
  score: number;
  estimatedCost: number;
  estimatedTime: number;
  reasons: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}