import { pricingApi } from "../services/pricingApi.js";
import { computePerformanceScore} from "../services/performaceScoreCalculator.js";
import { COMPATIBILITY_INDEX , gpuBenchmarks } from "../helpers/gpuRequirements.js";

export const workLoadInputHandler = async (req, res) => {
  try {
    const {region , datasetSize , budget , useCase} = req.body;
    const pricingData = await pricingApi(region);

    const response = await recommendationsHandler(pricingData , useCase , budget , datasetSize);

    res.send({
      success : true , 
      instance : response
    })
  } catch (error) {
    console.error("Pricing API error:", error?.response?.data || error.message);

    res.status(error.response?.status || 500).send({
      message: error?.response?.data || "Some error occurred",
      success: false,
    });
  }
};

export const recommendationsHandler = async (pricingData, useCase, budget , requiredMemory) => {
  const useCaseIndex = COMPATIBILITY_INDEX[useCase];
  const enrichedData = pricingData.data
    .map(instance => {
      const gpuType = instance.resource_class.toUpperCase();
      const benchmark = gpuBenchmarks[gpuType];

      if (!benchmark) return null;

      const isCompatible = benchmark.compatibility[useCaseIndex];
      if (!isCompatible) return null;

      const price = instance.price_per_hour;
      if (!price || price > budget / (31 * 40)) return null;

      const utilizationFactor = Math.min(requiredMemory / benchmark.memory, 1);

      const performanceScore = computePerformanceScore(benchmark , useCase);
      const costEfficiency = (performanceScore / price) * utilizationFactor;

      return {
        ...instance,
        performanceScore,
        costEfficiency,
        utilizationFactor,
        adjustedScore: costEfficiency.toFixed(2)
      };
    })
    .filter(Boolean) 
    .sort((a, b) => b.costEfficiency - a.costEfficiency);

  return enrichedData;
};