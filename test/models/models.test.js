import { connectToMongoDB } from "../../src/app.js"
import { expect } from "chai"
import mongoose from "mongoose"
import cartModel from "../../src/models/cart.js"
import productModel from "../../src/models/product.js"
import ticketModel from "../../src/models/ticket.js"
import userModel from "../../src/models/user.js"

describe("Modelo: carts", () => {
    before(async () => {
        await connectToMongoDB()
        console.log("MongoDB conectado para pruebas")
    })

    after(async () => {
        await mongoose.disconnect()
        console.log("MongoDB desconectado")
    })

    it("Debería retornar un array de CARRITOS almacenados en la base de datos", async () => {
        const carts = await cartModel.find()
        expect(carts).to.be.an("array")
    })

    it("Debería retornar un array de PRODUCTOS almacenados en la base de datos", async () => {
        const products = await productModel.find()
        expect(products).to.be.an("array")
    })

    it("Debería retornar un array de TICKETS almacenados en la base de datos", async () => {
        const tickets = await ticketModel.find({})
        expect(tickets).to.be.an("array")
    })

    it("Debería retornar un array de USUARIOS almacenados en la base de datos", async () => {
        const users = await userModel.find()
        expect(users).to.be.an("array")
    })
})