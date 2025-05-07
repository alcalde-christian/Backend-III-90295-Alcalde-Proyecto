import { Router } from "express"
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from "../controllers/productsController.js"
import { auth } from "../config/middlewares.js"

const productRouter = Router()

productRouter.get("/", getProducts)
productRouter.get("/:pid", getProduct)
productRouter.post("/", auth("admin"), addProduct)
productRouter.put("/:pid", auth("admin"), updateProduct)
productRouter.delete("/:pid", auth("admin"), deleteProduct)

export default productRouter