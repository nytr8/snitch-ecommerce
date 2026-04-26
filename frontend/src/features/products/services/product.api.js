import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/product",
  withCredentials: true,
});

export async function createProduct(productData) {
  try {
    const response = await productApiInstance.post("/create", productData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating product:",
      error.response?.data || error.message,
    );
    throw error.response?.data || new Error("Failed to create product");
  }
}

export async function getSellerProducts() {
  try {
    const response = await productApiInstance.get("/seller/products");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching seller products:",
      error.response?.data || error.message,
    );
    throw error.response?.data || new Error("Failed to fetch seller products");
  }
}
