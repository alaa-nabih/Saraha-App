import { StatusCodes } from "http-status-codes"


export const validation = (schema) => {
  return (req, res, next) => {

    const data={ //collect data from anywhere
      ...req.body,
      ...req.params,
      ...req.query,
      ...req.file  //if there is any file uploaded 
    }

    const result = schema.validate(data, { abortEarly: false }) //abortEarly => show all errors depend on validation rules in the same time
    if (result.error) {
      throw new Error(result.error, { cause: StatusCodes.BAD_REQUEST })
    }
    next()
  }
}