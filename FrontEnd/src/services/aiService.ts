import { WorkloadRequirements } from '../types';
import { usecaseOptions, datasetSizeOptions, regionOptions } from '../data/gpuModels';

// Simulated AI service - in a real application, this would call an OpenAI API endpoint
export const analyzeWorkloadDescription = async (description: string): Promise<Partial<WorkloadRequirements>> => {
  // This is a simulated response that would normally come from an OpenAI API call
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  
  // Simple keyword matching for demonstration purposes
  const usecase = determineusecase(description);
  const datasetSize = determineDatasetSize(description);
  const workloadType = description.toLowerCase().includes('inference') ? 'inference' : 'training';
  const region = determineRegion(description);
  const maxBudget = extractBudget(description);
  
  return {
    usecase,
    datasetSize,
    workloadType,
    region,
    maxBudget,
    additionalRequirements: ''
  };
};

// Simple chatbot service - would integrate with OpenAI in a real application
export const getChatbotResponse = async (message: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('recommend') || lowercaseMessage.includes('suggest')) {
    return "Based on your workload, I'd recommend focusing on GPUs with high memory capacity like the NVIDIA A100 or AMD MI250 for large models. For smaller workloads, the NVIDIA T4 offers a good balance of cost and performance.";
  }
  
  if (lowercaseMessage.includes('cost') || lowercaseMessage.includes('price') || lowercaseMessage.includes('budget')) {
    return "GPU costs vary widely depending on the model. For budget-conscious workloads, consider NVIDIA T4 ($0.45-0.65/hr) or L4 ($0.85-1.20/hr). Premium options like H100 can cost $4.50-7.80/hr but offer significantly higher performance.";
  }
  
  if (lowercaseMessage.includes('memory') || lowercaseMessage.includes('ram')) {
    return "Memory requirements depend on your model size. For large language models (>70B parameters), you'll need at least 80GB of VRAM (A100-80GB, H100, or MI250). Medium models (10-70B) can run on 40GB devices like A100-40GB with techniques like model parallelism.";
  }
  
  if (lowercaseMessage.includes('training') || lowercaseMessage.includes('fine-tune')) {
    return "For training workloads, key factors include memory capacity, compute power, and interconnect bandwidth for multi-GPU setups. NVIDIA H100 and A100 are excellent for training due to their Tensor Cores and NVLink. AMD MI250 is also a strong contender for certain workloads.";
  }
  
  if (lowercaseMessage.includes('inference')) {
    return "For inference, the optimal GPU depends on your throughput needs and batch size. For high-throughput, low-latency requirements, NVIDIA L4 offers an excellent price-performance ratio. For larger models, A100 provides a good balance. T4 can be sufficient for smaller models at lower cost.";
  }
  
  // Default response
  return "I'm here to help you choose the best GPU for your AI workload. You can ask me about specific models, cost comparisons, memory requirements, or the differences between training and inference workloads.";
};

// Helper functions for keyword matching
function determineusecase(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('llm') || lowerText.includes('language model')) {
    if (lowerText.includes('large') || lowerText.includes('>70b') || lowerText.includes('over 70b')) {
      return 'llm-large';
    } else if (lowerText.includes('medium') || lowerText.includes('10-70b')) {
      return 'llm-medium';
    } else {
      return 'llm-small';
    }
  }
  
  if (lowerText.includes('vision') || lowerText.includes('image') || lowerText.includes('cv')) {
    if (lowerText.includes('large')) {
      return 'cv-large';
    } else {
      return 'cv-small';
    }
  }
  
  if (lowerText.includes('diffusion') || lowerText.includes('stable diffusion') || lowerText.includes('image generation')) {
    return 'diffusion';
  }
  
  if (lowerText.includes('reinforcement learning') || lowerText.includes('rl')) {
    return 'rl';
  }
  
  // Default to a common case
  return 'llm-medium';
}

function determineDatasetSize(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('tb') || lowerText.includes('terabyte')) {
    if (lowerText.includes('10tb') || lowerText.includes('10 tb') || lowerText.includes('>10tb') || lowerText.includes('over 10tb')) {
      return 'xlarge';
    } else {
      return 'large';
    }
  }
  
  if (lowerText.includes('gb') || lowerText.includes('gigabyte')) {
    const matches = lowerText.match(/(\d+)\s*gb/);
    if (matches && parseInt(matches[1]) > 100) {
      return 'medium';
    } else if (matches && parseInt(matches[1]) > 10) {
      return 'small';
    } else {
      return 'xsmall';
    }
  }
  
  // Default to a common case
  return 'medium';
}

function determineRegion(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('us east') || lowerText.includes('east coast') || lowerText.includes('virginia')) {
    return 'us-east';
  }
  
  if (lowerText.includes('us west') || lowerText.includes('west coast') || lowerText.includes('california')) {
    return 'us-west';
  }
  
  if (lowerText.includes('europe') || lowerText.includes('eu')) {
    if (lowerText.includes('west')) {
      return 'eu-west';
    } else {
      return 'eu-central';
    }
  }
  
  if (lowerText.includes('asia') || lowerText.includes('pacific')) {
    if (lowerText.includes('southeast')) {
      return 'ap-southeast';
    } else {
      return 'ap-northeast';
    }
  }
  
  // Default to a common region
  return 'us-east';
}

function extractBudget(text: string): number {
  const lowerText = text.toLowerCase();
  
  // Look for dollar amount patterns
  const dollarRegex = /\$\s*(\d+(\.\d+)?)/;
  const dollarMatch = lowerText.match(dollarRegex);
  
  if (dollarMatch) {
    return parseFloat(dollarMatch[1]);
  }
  
  // Look for budget mentions
  if (lowerText.includes('budget')) {
    if (lowerText.includes('high') || lowerText.includes('large')) {
      return 10.0;
    } else if (lowerText.includes('medium')) {
      return 5.0;
    } else if (lowerText.includes('low') || lowerText.includes('small')) {
      return 2.0;
    }
  }
  
  // Default budget
  return 3.0;
}