import { Schema, model } from "mongoose"
import cartModel from "./cart.js"

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts"
    }
})

/*

Si en algún momento el usuario modifica alguno de sus datos personales,
¿se crearía un nuevo carrito?

*/

userSchema.post("save", async function (doc) {
    try {
        if (!doc.cart) {
            const newCart = await cartModel.create({ products: [] })
            const newUser = await model("users").findByIdAndUpdate(
                doc._id, 
                { cart: newCart._id },
                { new: true }
            )
            console.log("Datos del nuevo usuario registrado:\n", newUser)
        }
    } catch (e) {
        console.log("Error al crear el carrito del usuario", error)
    }
})

const userModel = model("users", userSchema)

export default userModel