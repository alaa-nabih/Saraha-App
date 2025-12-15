import Joi from "joi"
import { generalValidation } from "../../utils/generalRules.js"

export const signupSchema = Joi.object({
  name: generalValidation.name.required(),
  email: generalValidation.email.required(),
  password: generalValidation.password.required(),
  Cpassword:generalValidation.Cpassword.required(),
  age: generalValidation.age,
  gender: generalValidation.gender.required(),
  role: generalValidation.role.required(),
  phone: generalValidation.phone.required()
})

export const loginSchema = Joi.object({
  name: generalValidation.name,
  email: generalValidation.email.required(),
  password:Joi.string()
})

export const confirmEmailSchema = Joi.object({
  email: generalValidation.email.required(),
  otp:generalValidation.otp.required()
})

export const resendEmailOtpSchema = Joi.object({
  email: generalValidation.email.required(),
})