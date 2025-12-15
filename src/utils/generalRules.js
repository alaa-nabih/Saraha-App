import  { Types } from 'mongoose'
import Joi from 'joi'
import { Gender, Roles } from '../DB/models/userModel.js'
import { fileTypes } from "../utils/multer/multer.cloud.js"


export const customId = (value, helper) => {
  let data = Types.ObjectId.isValid(value) //OR => mongoose.isValidObjectId(value)
  return data ? value : helper.message("id is not valid")
}//helper=>hold the error // data=>hold a boolen value


export const generalRules = {
  objectId: Joi.string().custom(customId),
  headers: Joi.object({
    authorization: Joi.string().required(),
    'cache-control': Joi.string(),
    'postman-token': Joi.string(),
    'content-type': Joi.string(),
    'content-length': Joi.string(),
    host: Joi.string(),
    'user-agent': Joi.string(),
    accept: Joi.string(),
    'accept-encoding': Joi.string(),
    connection: Joi.string()
  })//these are the 9 hidden headers + token "authorization"
}

export const generalValidation={
    id: Joi.string().custom(customId),
    name: Joi.string().min(3).max(15),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(20),
    Cpassword:Joi.string().valid(Joi.ref('password')),
    age: Joi.number().min(18).max(90),
    gender: Joi.string().valid(Gender.male, Gender.female),
    role: Joi.string().valid(Roles.admin, Roles.user),
    phone: Joi.string().min(10).max(13).regex(/^(\+201|0?1)[0125]\d{8}/),
    otp:Joi.string().length(6),
    fieldname: Joi.string().valid('profileImage'),
      originalname: Joi.string(),
      encoding: Joi.string(),
      mimetype: Joi.string().valid(...fileTypes.image),//'...' spread operator to convert array to list of values
      destination: Joi.string(),
      filename: Joi.string(),
      path: Joi.string(),
      size: Joi.number().max(1 * 1024) 
}