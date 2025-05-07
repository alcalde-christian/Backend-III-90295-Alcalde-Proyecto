import 'dotenv/config'
import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import userModel from "../models/user.js"
import { createHash, validatePassword } from "../utils/bcrypt.js"
import jwt from "passport-jwt"


const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt


const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies["projectCookie"]
    }
    return token
}


const initializePassport = () => {
    // Estrategia PASSPORT para registrar nuevos usuarios /////////////////////
    ///////////////////////////////////////////////////////////////////////////
    passport.use("register", new localStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        
        try {
            const {firstName, lastName, email, age, password} = req.body

            const userExists = await userModel.findOne({ email: email })

            if (!userExists) {
                const newUser = await userModel.create({
                    firstName,
                    lastName,
                    email,
                    password: createHash(password),
                    age
                })
                //console.log("Datos del nuevo usuario registrado:\n", newUser)
                return done(null, newUser)
            } else {
                return done(null, false)
            }
        } catch (error) {
            console.log(error)
            return done(error)
        }
    }))


    // Estrategia PASSPORT para loguear usuarios //////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    passport.use("login", new localStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })

            if (user && validatePassword(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch (error) {
            console.log(error)
            return done(error)
        }
    }))


    // Estrategia PASSPORT para loguear usuarios mediante Github //////////////
    ///////////////////////////////////////////////////////////////////////////
    passport.use("github", new GithubStrategy({
        clientID: "Iv23li6s2aEEYiF1UJXH",
        clientSecret: process.env.SECRET_GITHUB,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log("Github profile:\n", profile)
            console.log("Github access token:\n", accessToken)
            console.log("Github refresh token:\n", refreshToken)
            
            const user = await userModel.findOne({ email: profile._json.email})
            
            // N/A: Dato no proporcionado por Github

            if (!user) {
                const newUser = await userModel.create({
                    firstName: profile._json.name,
                    lastName: " ", // N/A
                    email: profile._json.email,
                    password: "1234", // N/A
                    age: 18 // N/A
                })
                return done(null, user)
            } else {
                return done(null, user)
            }
        } catch (error) {
            console.log(error)
            return done(error)
        }
    }))


    // Estrategia PASSPORT para sesiones de usuarios //////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_JWT
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            return console.log(error)
        }
    }))

    passport.serializeUser((user, done) => {
        console.log(user)
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport