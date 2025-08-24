//Create category data table schema in mongodb
import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hex: { type: String },

});

const Color = mongoose.model("Color", colorSchema);

export default Color;
