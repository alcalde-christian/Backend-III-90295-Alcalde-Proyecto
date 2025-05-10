import swaggerJSDoc from "swagger-jsdoc"
import __dirname from "../path.js"

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title: 'Phonemart APIs',
            description: 'Documentación de APIs para el proyecto Backend III de Coderhouse'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

export const swaggerSpecs = swaggerJSDoc(swaggerOptions)