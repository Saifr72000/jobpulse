import type { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service.js";
import type { ProductType } from "../models/product.model.js";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, price, type, description, logo, isActive } = req.body;

    const product = await productService.createProduct(
      title,
      price,
      type,
      description,
      logo,
      isActive
    );

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = req.query.type as ProductType | undefined;
    const products = await productService.getAllProducts(type);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductsByType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.params;
    
    if (type !== "package" && type !== "service") {
      res.status(400).json({ error: "Invalid product type. Must be 'package' or 'service'" });
      return;
    }

    const products = await productService.getProductsByType(type as ProductType);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await productService.updateProduct(id, updateData);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await productService.deleteProduct(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
