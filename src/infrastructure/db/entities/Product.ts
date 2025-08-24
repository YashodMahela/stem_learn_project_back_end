
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stripePriceId: {
        type: String,
        required: true,
    },
    color_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
        required: false,
    },
    image: {
        type: String,
        required: true,
    },
    
    stock: {
        type: Number,
        required: false,
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

