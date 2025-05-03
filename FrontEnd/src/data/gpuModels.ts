import { GPUModel } from '../types';

// Sample GPU data - in a real application, this would come from an API
export const gpuModels: GPUModel[] = [
  {
    id: 'a100-40gb',
    name: 'A100',
    manufacturer: 'NVIDIA',
    memory: 40,
    performance: 100,
    trainingCostPerHour: 3.15,
    inferenceCostPerHour: 2.21,
    availability: ['us-east', 'us-west', 'eu-west']
  },
  {
    id: 'a100-80gb',
    name: 'A100',
    manufacturer: 'NVIDIA',
    memory: 80,
    performance: 110,
    trainingCostPerHour: 4.10,
    inferenceCostPerHour: 2.85,
    availability: ['us-east', 'us-west']
  },
  {
    id: 'h100-80gb',
    name: 'H100',
    manufacturer: 'NVIDIA',
    memory: 80,
    performance: 200,
    trainingCostPerHour: 7.80,
    inferenceCostPerHour: 4.50,
    availability: ['us-east']
  },
  {
    id: 'l4',
    name: 'L4',
    manufacturer: 'NVIDIA',
    memory: 24,
    performance: 60,
    trainingCostPerHour: 1.20,
    inferenceCostPerHour: 0.85,
    availability: ['us-east', 'us-west', 'eu-west', 'ap-southeast']
  },
  {
    id: 't4',
    name: 'T4',
    manufacturer: 'NVIDIA',
    memory: 16,
    performance: 40,
    trainingCostPerHour: 0.65,
    inferenceCostPerHour: 0.45,
    availability: ['us-east', 'us-west', 'eu-west', 'ap-southeast']
  },
  {
    id: 'v100',
    name: 'V100',
    manufacturer: 'NVIDIA',
    memory: 16,
    performance: 70,
    trainingCostPerHour: 2.48,
    inferenceCostPerHour: 1.70,
    availability: ['us-east', 'us-west', 'eu-west']
  },
  {
    id: 'mi250',
    name: 'MI250',
    manufacturer: 'AMD',
    memory: 128,
    performance: 120,
    trainingCostPerHour: 3.75,
    inferenceCostPerHour: 2.60,
    availability: ['us-east', 'eu-west']
  },
  {
    id: 'mi100',
    name: 'MI100',
    manufacturer: 'AMD',
    memory: 32,
    performance: 75,
    trainingCostPerHour: 2.10,
    inferenceCostPerHour: 1.50,
    availability: ['us-east', 'us-west']
  },
  {
    id: 'tpu-v4',
    name: 'TPU v4',
    manufacturer: 'Google',
    memory: 32,
    performance: 140,
    trainingCostPerHour: 3.22,
    inferenceCostPerHour: 2.15,
    availability: ['us-central', 'eu-west']
  }
];

export const modelTypeOptions = [
  { value: 'llm-small', label: 'Small Language Model (<10B parameters)' },
  { value: 'llm-medium', label: 'Medium Language Model (10-70B parameters)' },
  { value: 'llm-large', label: 'Large Language Model (>70B parameters)' },
  { value: 'cv-small', label: 'Computer Vision - Small' },
  { value: 'cv-large', label: 'Computer Vision - Large' },
  { value: 'diffusion', label: 'Diffusion Model' },
  { value: 'rl', label: 'Reinforcement Learning' }
];

export const datasetSizeOptions = [
  { value: 'xsmall', label: 'Extra Small (<10GB)' },
  { value: 'small', label: 'Small (10-100GB)' },
  { value: 'medium', label: 'Medium (100GB-1TB)' },
  { value: 'large', label: 'Large (1-10TB)' },
  { value: 'xlarge', label: 'Extra Large (>10TB)' }
];

export const regionOptions = [
  { value: 'us-east', label: 'US East' },
  { value: 'us-west', label: 'US West' },
  { value: 'us-central', label: 'US Central' },
  { value: 'eu-west', label: 'Europe West' },
  { value: 'eu-central', label: 'Europe Central' },
  { value: 'ap-southeast', label: 'Asia Pacific Southeast' },
  { value: 'ap-northeast', label: 'Asia Pacific Northeast' }
];