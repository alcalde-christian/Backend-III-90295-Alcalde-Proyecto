import 'dotenv/config'
import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import path from 'path'
import passport from "passport"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { engine } from "express-handlebars"

import initializePassport from "./config/passport.config.js"
import __dirname from "./path.js"
import indexRouter from "./routes/index.routes.js"
import cookieParser from "cookie-parser"
import { insertLog } from './utils/winston.js'
import { swaggerSpecs } from "./utils/swagger.js"


// Inicialización de servidor express, asignación de puerto y ruta de BDD /////
const app = express()
const PORT = 8080


// Middlewares de configuración ///////////////////////////////////////////////
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(process.env.SECRET_COOKIE))
app.use(cors())
app.use(insertLog)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))


// Configuración de las sesiones vía Mongo Atlas (MongoStore) /////////////////
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.DBPATH,
        mongoOptions: {},
        ttl: 86400 // 1 día
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true
}))


// Middleware para inicializar Passport ///////////////////////////////////////
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


// Configuración de Handlebars ////////////////////////////////////////////////
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set('views', path.join(__dirname, 'views'))


// Conexión con la base de datos //////////////////////////////////////////////
export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DBPATH)
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

connectToMongoDB()


// Rutas //////////////////////////////////////////////////////////////////////
app.use("/public", express.static(__dirname + "/public"))
app.use("/", indexRouter)

app.listen(PORT, () => console.log(`Escuchando en el puerto: ${PORT}`))