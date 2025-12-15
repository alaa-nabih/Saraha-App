import { Router } from 'express'
const authRouter = Router() 
import * as authServices from './auth.Services.js'
import { authentication } from '../../Middlewares/auth.js'
import { validation } from '../../Middlewares/validation.js'
import {loginSchema,signupSchema} from './authValidation.js'
 

authRouter.post("/signup",validation(signupSchema), authServices.SignUp)
authRouter.post("/confirm-email",authServices.confirmEmail)
authRouter.post("/resend-email",authServices.reSendEmailOtp)

authRouter.post("/login",validation(loginSchema), authServices.login)

authRouter.get("/", authentication, authServices.getUserProfile)

authRouter.post("/refresh-token", authServices.refreshToken)

authRouter.post("/forget-password",authServices.forgetPass)
authRouter.post("/change-password",authServices.changePass)
authRouter.patch("/update-password",authentication,authServices.updatePass)

authRouter.post("/social-Login",authServices.socialLogin)

authRouter.patch("/update-email", authentication, authServices.updateEmail)
authRouter.patch("/confirm-new-email", authentication, authServices.confirmNewEmail)

export default authRouter 