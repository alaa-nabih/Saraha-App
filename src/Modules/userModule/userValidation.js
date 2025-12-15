import Joi from "joi"
import { generalValidation } from '../../utils/generalRules.js'

export const getUserProfileByIdSchema = Joi.object().keys({
  id: generalValidation.id.required()
})

export const updateBasicInfoSchema=Joi.object().keys({
  name:generalValidation.name,
  age:generalValidation.age,
  phone:generalValidation.phone
})

export const profileImageSchema = Joi.object({//validate the file object that multer creates to store file info
  filename: generalValidation.filename.required(),
  originalname: generalValidation.originalname.required(),
  encoding: generalValidation.encoding.required(),
  mimetype: generalValidation.mimetype.required(),
  destination: generalValidation.destination.required(),
  filename: generalValidation.filename.required(),
  path: generalValidation.path.required(),
  size: generalValidation.size.required(),
  buffer:Joi.binary()
})