import { createHash, validatePassword } from "../../src/utils/bcrypt.js"
import { expect } from "chai"

describe("Función: bcrypt", () => {
    const testPassword = "1234"
    let hashedPassword = ""

    before(() => {
        hashedPassword = createHash(testPassword)
    })

    it("Debería hashear correctamente una contraseña", () => {
        expect(hashedPassword).to.be.a("string")
        expect(hashedPassword).to.not.equal(testPassword)
    })

    it("Debería validar correctamente la contraseña con el hash generado", () => {
        const isValid = validatePassword(testPassword, hashedPassword)
        expect(isValid).to.be.true
    })

    it("Debería dar error cuando la contraseña es incorrecta", () => {
        const isValid = validatePassword("wrongPassword", hashedPassword)
        expect(isValid).to.be.false
    })

    it("Debería generar hashes únicos cada vez que se crea una contraseña", () => {
        const anotherHash = createHash(testPassword)
        expect(anotherHash).to.not.equal(hashedPassword)
    })
})