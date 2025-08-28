import Review from "../infrastructure/db/entities/Review";
import Product from "../infrastructure/db/entities/Product";
import { Request, Response, NextFunction } from "express";

/**
 * Creates a new review and associates it with a product.
 * @param req Express request object containing review data and productId.
 * @param res Express response object.
 * @param next Express next middleware function.
 */
const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { review, rating, productId } = req.body;

    // Create a new review document
    const newReview = await Review.create({ review, rating });

    // Find the product by ID and add the review reference
    const product = await Product.findById(productId);
    if (product) {
      product.reviews.push(newReview._id);
      await product.save();
    }

    // Send a success response
    res.status(201).send({ message: "Review created successfully." });
  } catch (error) {
    // Pass errors to the error handler middleware
    next(error);
  }
};

export { createReview };
