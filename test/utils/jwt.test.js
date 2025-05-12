import { generateToken } from "../../src/utils/jwt.js"
import { expect } from "chai"
import jwt from 'jsonwebtoken'

describe("Función: generateToken", () => {

    const testUser = {
        firstName: "Johann",
        email: "johann.zarzo@fake.com",
        role: "admin",
    }
    
    it("Debería generar un token JWT correctamente", () => {
        const token = generateToken(testUser)
        expect(token).to.be.a("string")
    })
    
    it("El token debería contener el payload esperado", () => {
        const token = generateToken(testUser)
        const decoded = jwt.verify(token, "JWTSecret")

        expect(decoded.user).to.deep.equal({
            firstName: testUser.firstName,
            email: testUser.email,
            role: testUser.role,
        })
      })
    
    it("El token debería expirar en 24 horas", () => {
        const token = generateToken(testUser)
        const decoded = jwt.verify(token, "JWTSecret")
        const currentTime = Math.floor(Date.now() / 1000)

        expect(decoded.exp - decoded.iat).to.equal(86400)
        expect(decoded.exp).to.be.greaterThan(currentTime)
    })
    
    it("Debería mostrar un error si el token es inválido", () => {
        const invalidToken = "fake.invalid.token"

        expect(() => jwt.verify(invalidToken, "JWTSecret")).to.throw(
            jwt.JsonWebTokenError
        )
    })
})