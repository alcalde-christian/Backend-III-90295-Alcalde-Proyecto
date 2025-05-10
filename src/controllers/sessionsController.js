import { generateToken } from "../utils/jwt.js"


// Función para loguear usuario ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const login = async (req, res) => {
    try {
        if (!req.user) {
            req.logger.warn("Función: login | Algún dato de ingreso no es correcto")
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

            req.logger.info(`Función: login | El usuario ${req.user.email} ha ingresado al sistema`)
            res.status(200).redirect("/")
        }
    } catch (error) {
        req.logger.error(`Función: login | Error interno durante el inicio de sesión del usuario: ${error}`)
        res.status(500).render("templates/error", {error: "Error al loguear usuario"})
    }
}


// Función para registrar usuario /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const register = async (req, res) => {
    try {
        if (!req.user) {
            req.logger.warn("Función: register | El correo electrónico ya se encuentra registrado")
            return res.status(400).render("templates/error", {error: "El correo electrónico ya se ha registrado"})
        } else {
            req.logger.info("Función: register | Usuario registrado correctamente")
            res.status(200).redirect("/login")
        }
    } catch (error) {
        req.logger.error(`Función: register | Error interno al intentar registrar un usuario: ${error}`)
        res.status(500).render("templates/error", {error: "Error al registrar usuario"})
    }
}


// Función para registrar o loguear usuario a través de GitHub ////////////////
///////////////////////////////////////////////////////////////////////////////
export const githubLogin = async (req, res) => {
    try {
        if(!req.user) {
            req.logger.warn("Función: githubLogin | Algún dato ingresado es incorrecto")
            return res.status(400).render("templates/error", {error: "Ups! Algún dato no es correcto"})
        } else {
            req.session.user = {
                email: req.user.email,
                firstName: req.user.firstName
            }
            req.logger.info(`Función: githubLogin | El usuario ${req.user.email} se ha registrado mediante Github`)
            res.status(200).redirect("/")
        }
    } catch (error) {
        req.logger.error(`Función: githubLogin | Error interno al intentar registrarse mediante Github: ${error}`)
        res.status(500).render("templates/error", {error: "Error al ingresar a través de Github"})
    }
}