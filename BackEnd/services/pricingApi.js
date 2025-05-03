import axios from "axios";

export const pricingApi = async (region) => {
  try {
    const response = await axios.get(
        `https://customer.acecloudhosting.com/api/v1/pricing?is_gpu=true&resource=instances&region=${region}`
      );
    return response.data;
  } catch (error) {
    throw error;
  }
};
