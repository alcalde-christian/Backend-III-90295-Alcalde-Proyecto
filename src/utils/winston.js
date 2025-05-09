import winston from "winston"

const customs = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3
    }, 
    colors: {
        error: "red",
        warn: "yellow",
        info: "blue",
        http: "grey"
    }
}

export const logger = winston.createLogger({
    levels: customs.levels,

    transports: [
        new winston.transports.Console({ 
            level: "http",
            format: winston.format.combine(
                winston.format.colorize({ colors: customs.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: "warn",
            filename: "./warnLogs.log",
            format: winston.format.json()
        })
    ]
})

export const insertLog = (req, res, next) => {
    // Excluir solicitudes a recursos estáticos como CSS, JS, imágenes o favicon
    const staticExtensions = /\.(css|js|png|jpg|jpeg|ico|svg)$/

    if (staticExtensions.test(req.url)) {
        return next()
    }

    req.logger = logger
    req.logger.http(`Method: ${req.method} | URL: ${req.url} | Date: ${new Date().toISOString()}`)
    next()
}
