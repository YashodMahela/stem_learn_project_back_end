//Create product data table schema in mongodb
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, require: true },
    image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    reviews: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Review",
        default: [],
    },
    description: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

export default Product;