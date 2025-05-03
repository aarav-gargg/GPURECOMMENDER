import { recommendationsApi } from "../services/recommendationApi.js";

export const recommendationsHandler = async (pricingData, useCase, budget , requiredMemory) => {
    return recommendationsApi(pricingData , useCase , budget , requiredMemory)
  };