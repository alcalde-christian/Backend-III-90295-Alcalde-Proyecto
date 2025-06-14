import 'dotenv/config'

export const auth = (role) => {
    return async (req, res, next) => {
        if (process.env.TEST_ROLE == "test") {
            req.user = { role: "admin" }
            return next()
        }

        if (!req.user) return res.status(401).json({success: false, payload: "Usuario no autenticado"})
        if (req.user.role != role) return res.status(403).json({success: false, payload: "Usuario no autorizado"})
        next()
    }
}