import { Router } from "express"
import { getCart, createCart, addProductToCart, updateProducts, updateProductQty, removeProduct, emptyCart, checkout } from "../controllers/cartsController.js"
import { auth } from "../config/middlewares.js"

const cartRouter = Router()

cartRouter.get("/:cid", getCart)
cartRouter.post("/", auth("user"), createCart)
cartRouter.post("/:cid/product/:pid", auth("user"), addProductToCart)
cartRouter.put("/:cid", auth("user"), updateProducts)
cartRouter.put("/:cid/product/:pid", auth("user"), updateProductQty)
cartRouter.delete("/:cid/product/:pid", auth("user"), removeProduct)
cartRouter.delete("/:cid", auth("user"), emptyCart)
cartRouter.post("/:cid/checkout", auth("user"), checkout)

export default cartRouter