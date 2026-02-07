import { Product, type IProduct } from "../models/product.model.js";

export const createProduct = async (
  name: string,
  price: number,
  description?: string,
  category?: string,
  sku?: string,
  inStock?: boolean
): Promise<IProduct> => {
  const newProduct = new Product({
    name,
    price,
    description,
    category,
    sku,
    inStock: inStock ?? true,
  });

  await newProduct.save();
  return newProduct;
};

export const getProductById = async (productId: string): Promise<IProduct | null> => {
  return await Product.findById(productId);
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  return await Product.find({ inStock: true });
};

export const getAllProductsAdmin = async (): Promise<IProduct[]> => {
  return await Product.find();
};

export const updateProduct = async (
  productId: string,
  updateData: Partial<IProduct>
): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(productId, updateData, { new: true });
};

export const deleteProduct = async (productId: string): Promise<IProduct | null> => {
  return await Product.findByIdAndDelete(productId);
};

export const getProductsByIds = async (productIds: string[]): Promise<IProduct[]> => {
  return await Product.find({ _id: { $in: productIds } });
};
