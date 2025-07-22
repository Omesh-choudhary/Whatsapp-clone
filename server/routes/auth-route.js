import express from "express"
import { GenerateToken, handleLogin, handleSignup } from "../controllers/auth-contollers.js"


const authRouter = express.Router()


authRouter.route("/signup").post(handleSignup)
authRouter.route("/login").post(handleLogin)
authRouter.route("/generate-token/:userId").get(GenerateToken)

export default authRouter