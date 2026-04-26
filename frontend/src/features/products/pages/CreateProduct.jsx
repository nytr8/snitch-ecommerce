import React from "react";
import useProduct from "../hooks/useproduct";
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  return <div>CreateProduct</div>;
};

export default CreateProduct;
