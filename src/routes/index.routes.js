import { Router } from "express"
import sessionRouter from "./sessions.routes.js"
import viewsRoutes from "./views.routes.js"
import productRouter from "./products.routes.js"
import cartRouter from "./carts.routes.js"

const indexRouter = Router()

indexRouter.use("/api/sessions", sessionRouter)
indexRouter.use("/api/products", productRouter)
indexRouter.use("/api/carts", cartRouter)
indexRouter.use("/", viewsRoutes)

export default indexRouter