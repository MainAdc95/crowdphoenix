import { Request, Response, NextFunction } from "express"
import { mode, jwtSecret } from "../config"
import valid from "../utils/validators"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getUserDB } from "../utils/db"
import { IUser } from "../types/user"



export const signup = async function(req: Request, res: Response, next: NextFunction) {
    try {
        // getting the data base object from ../utils/db
        const db = getUserDB()

        let { username, firstName, lastName, email, phone, password, password2 } = req.body
        
        // data manipulation
        username = username?.trim()
        firstName = firstName?.trim()
        lastName = lastName?.trim()
        email = email?.trim().toLowerCase()
        phone = phone?.trim()
        password = password?.trim()
        password2 = password2?.trim()

        interface IError {
            username: string[]
            firstName: string[]
            lastName: string[]
            email: string[]
            phone: string[]
            password: string[]
            password2: string[]
        }

        const errors: IError = {
            username: [],
            firstName: [],
            lastName: [],
            email: [],
            phone: [],
            password: [],
            password2: []
        }
    
        // validation ______________ START
        if(username) {
            if(valid.range(username, 3, 20)) errors.username.push("please enter a username between 3 and 20 characters.")
            const foundUsername = await db.collection("users").findOne({ username })
            if(foundUsername) errors.username.push("this username already exists in our system.")
        } else errors.username.push("please enter a username.")
    
        if(firstName) {
            if(valid.maxLength(firstName, 20)) errors.firstName.push("please enter your first name and it must be less than 20 characters.")
        } else errors.firstName.push("please enter your first name.")
    
        if(lastName) {
            if(valid.maxLength(firstName, 20)) errors.lastName.push("please enter your last name and it must be less than 20 characters.")
        } else errors.lastName.push("please enter your last name.")
    
        if(phone) {
            if(valid.range(phone, 10, 10)) errors.phone.push("please enter your phone number and it must be 10 characters.")
        } else errors.phone.push("please enter your phone number.")

        if(email) {
            if(valid.isEmail(email)) errors.email.push("please enter a valid email address.")
            const foundEmail = await db.collection("users").findOne({ email })
            if(foundEmail) errors.email.push("this email address already exists in our system.")
        } else errors.email.push("please enter your email address.")
        
        if(password) {
            if(valid.minLength(password, 8)) errors.password.push("please enter a password that is at least 8 characters.")
        } else errors.password.push("please enter a password.")

        if(password2) {
            if(password !== password2) errors.password2.push("those passwords didn't match.")
        } else errors.password2.push("please repeat your password.")

        for(let v of Object.values(errors)) {
            if(v.length) return next({
                status: 400,
                message: errors
            })
        }
        // validation ______________ END

        // hashing the password to be stored in the data base.
        const hashPassword = await bcrypt.hash(password, 10)

        // creating a user in the data base
        const newUser = await db.collection("users").insertOne({
            username,
            firstName,
            lastName,
            email,
            phone,
            version: 1,
            isAdmin: false,
            isSuperAdmin: false,
            password: hashPassword,
        })

        const user: IUser = newUser.ops[0]

        // user detials to be stored in the token
        const { _id, version, isAdmin, isSuperAdmin } = user

        
        // generating a jsonwebtoken for authentication
        if(jwtSecret) {
            let token: string = jwt.sign({
                version,
                isAdmin,
                isSuperAdmin,
                _id
            }, jwtSecret)

            if(mode === "development") {
                res.cookie("jwt", token, { httpOnly: true, expires: new Date(9999, 99, 9) })
            } else if(mode === "production") {
                res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "none", expires: new Date(9999, 99, 9) })
            }

            res.cookie("isAuth", true, { expires: new Date(9999, 99, 9) })
        }

        return res.status(201).json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            version: user.version,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin,
        })
    } catch(err) {
        return next(err)
    }
}


export const signin = async function(req: Request, res: Response, next: NextFunction) {
    try {
        // getting the data base object from ../utils/db
        const db = getUserDB()

        let { identity, password } = req.body
        
        // data manipulation
        identity = identity?.trim()
        password = password?.trim()

        const users = await db.collection("users").find({})
        console.log(await users.toArray())

        // validating data
        if(!identity || !password) return next({
            status: 400,
            message: "please fill in all the empty blanks."
        })

        let user: IUser

        user = await db.collection("users").findOne({ username: identity })
        if(!user) user = await db.collection("users").findOne({ email: identity.toLowerCase() })
        if(!user) return next({
            status: 401,
            message: "your login credentials don't match an account in our system."
        })


        // comparing the password with the user password in db.
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) return next({
            status: 401,
            message: "your login credentials don't match an account in our system."
        })

        // user detials to be stored in the token
        const { _id, version, isAdmin, isSuperAdmin } = user

        // generating a jsonwebtoken for authentication
        if(jwtSecret) {
            
            let token: string = jwt.sign({
                isAdmin,
                isSuperAdmin,
                version,
                _id
            }, jwtSecret)

            if(mode === "development") {
                res.cookie("jwt", token, { httpOnly: true, expires: new Date(9999, 99, 9) })
            } else if(mode === "production") {
                res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "none", expires: new Date(9999, 99, 9) })
            }

            res.cookie("isAuth", true, { expires: new Date(9999, 99, 9) })
        }

        return res.status(200).json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            version: user.version,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin,
        })
    } catch(err) {
        return next(err)
    }
}