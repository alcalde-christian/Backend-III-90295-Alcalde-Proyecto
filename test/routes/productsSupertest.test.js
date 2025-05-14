import { expect } from "chai"
import supertest from "supertest"

const requester = supertest("http://localhost:8080")

describe("Supertest: product.routes.js", () => {
    let testProductId = ""
    const testProduct = {
        title: "Producto de prueba",
        description: "Descripción del producto de prueba",
        code: "TEST123",
        price: 999,
        stock: 1,
        category: "test"
    }


    it("Debería crear correctamente un producto en /api/products [POST]", async () => {
        const { statusCode, _body } = await requester.post("/api/products").send(testProduct)

        expect(statusCode).to.be.eq(201)
        expect(_body.payload).to.have.property("_id")
        testProductId = _body.payload._id
    })

    it("Debería obtener el producto creado en /api/products/:pid [GET]", async () => {
        const { statusCode, _body } = await requester.get(`/api/products/${testProductId}`)

        expect(statusCode).to.be.eq(200)
        expect(_body.payload).to.include({ title: testProduct.title, code: testProduct.code })
    })

    it("Debería actualizar el producto en /api/products/:pid [PUT]", async () => {
        const updatedTestProduct = { ...testProduct, price: 150, stock: 20 }

        const { statusCode, _body } = await requester.put(`/api/products/${testProductId}`).send(updatedTestProduct)

        expect(statusCode).to.be.eq(200)
        expect(_body.payload).to.include({ price: 150, stock: 20 })
    })

    it("Debería eliminar el producto en /api/products/:pid [DELETE]", async () => {
        const { statusCode, _body } = await requester.delete(`/api/products/${testProductId}`)

        expect(statusCode).to.be.eq(200)
    })
})