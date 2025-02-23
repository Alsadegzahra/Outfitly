import axios from "axios";

const API_URL = "http://localhost:5000/api/clothing";

export const getClothes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothing items:", error);
    return [];
  }
};

export const addClothing = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding clothing item:", error);
  }
};
