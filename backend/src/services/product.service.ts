import { Product, type IProduct, type ProductType } from "../models/product.model.js";

export const createProduct = async (
  title: string,
  price: number,
  type: ProductType,
  description?: string,
  logo?: string,
  isActive?: boolean
): Promise<IProduct> => {
  const newProduct = new Product({
    title,
    price,
    type,
    description,
    logo,
    isActive: isActive ?? true,
  });

  await newProduct.save();
  return newProduct;
};

export const getProductById = async (productId: string): Promise<IProduct | null> => {
  return await Product.findById(productId);
};

export const getAllProducts = async (type?: ProductType): Promise<IProduct[]> => {
  const filter: Record<string, unknown> = { isActive: true };
  if (type) {
    filter.type = type;
  }
  return await Product.find(filter).sort({ createdAt: -1 });
};

export const getAllProductsAdmin = async (type?: ProductType): Promise<IProduct[]> => {
  const filter: Record<string, unknown> = {};
  if (type) {
    filter.type = type;
  }
  return await Product.find(filter).sort({ createdAt: -1 });
};

export const getProductsByType = async (type: ProductType): Promise<IProduct[]> => {
  return await Product.find({ type, isActive: true }).sort({ createdAt: -1 });
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
