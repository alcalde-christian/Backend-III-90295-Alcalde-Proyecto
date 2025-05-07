import { Schema, model } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    thumbnail: {
        type: Array,
        default: []
    }
})

productSchema.plugin(mongoosePaginate)

const productModel = model("products", productSchema)

export default productModel