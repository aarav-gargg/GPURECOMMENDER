export interface GPUModel {
  id: string;
  name: string;
  manufacturer: string;
  memory: number; // GB
  performance: number; // relative score
  trainingCostPerHour: number;
  inferenceCostPerHour: number;
  availability: string[];
}

export interface WorkloadRequirements {
  modelType: string;
  datasetSize: string;
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