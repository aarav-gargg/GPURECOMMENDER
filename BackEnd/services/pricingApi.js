import axios from "axios";
import { config } from "../config/main.js";

export const pricingApi = async (region) => {
  try {
    const response = await axios.get(
    `${config.apiUrl}/api/v1/pricing?is_gpu=true&resource=instances&region=${region}`
  );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
