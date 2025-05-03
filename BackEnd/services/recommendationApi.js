import { gpuBenchmarks, COMPATIBILITY_INDEX } from "../helpers/gpuRequirements.js"
import { computePerformanceScore } from "./performaceScoreCalculator.js";

export const recommendationsApi = (pricingData, useCase, budget, requiredMemory , workloadType) => {
    const useCaseIndex = COMPATIBILITY_INDEX[useCase];
    const enrichedData = pricingData.data
        .map(instance => {
            const gpuType = instance.gpu_description?.replace("1x ", "").trim();

            if (!gpuType || !gpuBenchmarks[gpuType]) return null;

            const benchmark = gpuBenchmarks[gpuType];

            if (!benchmark) return null;

            const isCompatible = benchmark.compatibility[useCaseIndex];
            if (!isCompatible) return null;

            const price = instance.price_per_month;
            if (!price || price > budget) return null;

            const utilizationFactor = Math.min(requiredMemory / benchmark.memory, 1);

            const performanceScore = computePerformanceScore(benchmark, workloadType);
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
}