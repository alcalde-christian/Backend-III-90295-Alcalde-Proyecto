import { generateToken } from "../utils/jwt.js"


// Función para loguear usuario ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).render("templates/error", {error: "Ups! Algún dato no es correcto"})
        } else {
            const token = generateToken(req.user)
            req.session.user = {
                email: req.user.email,
                firstName: req.user.firstName
            }

            res.cookie("projectCookie", token, {
                httpOnly: true,
                secure: false,
                maxAge: 3600000
            })

            res.status(200).redirect("/")
        }
    } catch (error) {
        console.log("Error en el login del usuario:\n", error)
        res.status(500).render("templates/error", {error: "Error al loguear usuario"})
    }
}


// Función para registrar usuario /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const register = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).render("templates/error", {error: "El correo electrónico ya se ha registrado"})
        } else {
            res.status(201).redirect("/login")
        }
    } catch (error) {
        console.log("Error en el registro del usuario:\n", error)
        res.status(500).render("templates/error", {error: "Error al registrar usuario"})
    }
}


// Función para registrar o loguear usuario a través de GitHub ////////////////
///////////////////////////////////////////////////////////////////////////////
export const githubLogin = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(400).render("templates/error", {error: "Ups! Algún dato no es correcto"})
        } else {
            req.session.user = {
                email: req.user.email,
                firstName: req.user.firstName
            }
            res.status(200).redirect("/")
        }
    } catch (error) {
        console.log("Error al ingresar a través de Github:\n", error)
        res.status(500).render("templates/error", {error: "Error al ingresar a través de Github"})
    }
}