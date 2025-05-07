import { Router } from "express"
import { getProducts } from "../controllers/productsController.js"

const router = Router()

router.get("/login", async (req, res) => {
    res.render("templates/login", {})
})

router.get("/register", async (req, res) => {
    res.render("templates/register", {})
})

router.get("/", getProducts)

export default router