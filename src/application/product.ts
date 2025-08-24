import Product from "../infrastructure/db/entities/Product";
import ValidationError from "../domain/errors/validation-error";
import NotFoundError from "../domain/errors/not-found-error";

import { Request, Response, NextFunction } from "express";
import { CreateProductDTO } from "../domain/dto/product";
import category from "../api/category";

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, color, sortBy, sortOrder } = req.query;
    
    // Build dynamic filter object
    const filter: any = {};
    
    // Add category filter if provided
    if (category) {
      filter.categoryId = category;
    }
    
    // Add color filter if provided
    if (color) {
      filter.color_id = color;
    }
    let sort: any = {};
    if (sortOrder && sortOrder !== 'default') {
      // Sort by price when sortOrder is specified
      const order = sortOrder === 'desc' ? -1 : 1;
      sort.price = order;
    }
    // Execute query with filters and sorting
    let query = Product.find(filter);
    
    // Apply sorting if specified
    if (Object.keys(sort).length > 0) {
      query = query.sort(sort);
    }
    
    const products = await query;
    res.json(products);
  } catch (error) {
    next(error);
  }
};


const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = CreateProductDTO.safeParse(req.body);
    console.log(result);
    if (!result.success) {
      throw new ValidationError(result.error.message);
    }

    await Product.create(result.data);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const updateProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
};
