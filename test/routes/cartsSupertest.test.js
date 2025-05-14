import { expect } from "chai"
import supertest from "supertest"

const requester = supertest("http://localhost:8080")

describe("Supertest: carts.routes.js", () => {
    let testProductId = ""
    let testCartId = ""
    let testTicketId = ""

    before(async () => {
        const testProduct = {
            title: "Producto de prueba",
            description: "Descripción del producto de prueba",
            code: "TEST123",
            price: 999,
            stock: 1,
            category: "test"
        }

        const addTestProduct = await requester.post("/api/products").send(testProduct)
        testProductId = addTestProduct.body.payload._id
    })

    after(async () => {
        await requester.delete(`/api/products/${testProductId}`)

        await requester.delete(`/api/carts/${testCartId}`)
    })

    it("Debería crear un carrito vacío [POST]", async () => {
        const { statusCode, _body } = await requester.post("/api/carts")

        expect(statusCode).to.be.eq(201)
        expect(_body.payload).to.have.property("_id")

        testCartId = _body.payload._id
        console.log("ID del carrito para chequear en BBDD: ", testCartId)
    })

    it("Debería obtener un carrito por ID en api/carts/:cid [GET]", async () => {
        const { statusCode, _body } = await requester.get(`/api/carts/${testCartId}`)

        expect(statusCode).to.be.eq(200)
        expect(_body.payload).to.have.property("_id").that.eql(testCartId)
    })

    it("Debería agregar un producto al carrito en api/carts/:cid/product/:pid [POST]", async () => {
        const { statusCode, _body } = await requester.post(`/api/carts/${testCartId}/product/${testProductId}`).send({ quantity: 2 })

        const addedProduct = _body.payload.products.find(prod => prod.id_prod === testProductId)

        expect(statusCode).to.be.eq(200)
        expect(addedProduct).to.exist
        expect(addedProduct.qty).to.be.eq(2)
    })

    it("Debería actualizar la cantidad de productos en el carrito en api/carts/:pid/product/:cid [PUT]", async () => {
        const { statusCode, _body } = await requester.put(`/api/carts/${testCartId}/product/${testProductId}`).send({ quantity: 5 })

        const updatedProduct = _body.payload.products.find(prod => prod.id_prod._id === testProductId)
        
        expect(statusCode).to.be.eq(200)
        expect(updatedProduct.qty).to.be.eq(5)
    })

    it("Debería vaciar el carrito en api/carts/:cid [DELETE]", async () => {
        const { statusCode, _body } = await requester.delete(`/api/carts/${testCartId}`)

        expect(statusCode).to.be.eq(200)
        expect(_body.payload.products).to.be.empty
    })
})