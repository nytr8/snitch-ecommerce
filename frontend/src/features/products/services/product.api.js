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
export async function getAllProducts() {
  try {
    const response = await productApiInstance.get("/all");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all products:",
      error.response?.data || error.message,
    );
    throw error.response?.data || new Error("Failed to fetch all products");
  }
}

export async function getProductById(productId) {
  try {
    const response = await productApiInstance.get(`/details/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching product with ID ${productId}:`,
      error.response?.data || error.message,
    );
    throw (
      error.response?.data ||
      new Error(`Failed to fetch product with ID ${productId}`)
    );
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await productApiInstance.delete(`/delete/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting product with ID ${productId}:`,
      error.response?.data || error.message,
    );
    throw (
      error.response?.data ||
      new Error(`Failed to delete product with ID ${productId}`)
    );
  }
}
