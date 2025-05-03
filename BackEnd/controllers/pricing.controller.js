import { pricingApi } from "../services/pricingApi.js";
import { recommendationsHandler } from "./recommendations.controller.js";

export const workLoadInputHandler = async (req, res) => {
  try {
    const {region , datasetSize , budget , useCase , workloadType} = req.body;
    const pricingData = await pricingApi(region);

    const response = await recommendationsHandler(pricingData , useCase , budget , datasetSize , workloadType);

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

