import jwt from 'jsonwebtoken'
import userModel from '../DB/models/userModel.js'
import { notAuthorized , notFoundException , NotConfirmedEmailException , LoginAgainException} from '../utils/exceptions.js'
import { findById, findOne } from '../DB/Repository.js'

export const tokenTypes = {
  access: "access",
  refresh: "refresh"
}
Object.freeze(tokenTypes)

export const decodeToken = async ({ authorization , type=tokenTypes.access , next }) => {  
  
  if (!authorization || !authorization.startsWith(process.env.BEARER)) {
    return next(new notAuthorized("no refresh token"))
  }

  let signature = process.env.ACCESS_SIGNITURE
  if (type == tokenTypes.refresh) {
    signature = process.env.REFRESH_SIGNITURE
  }
  
  const token=authorization.split(' ')[1]

  
  const data = jwt.verify(token,signature)
  
  const user = await findOne(userModel,{
    _id:data.id,
    isDeleted:false
  })

  if(!user){
    return next(new notFoundException('user'))
  }

  if(!user.confirmed)
    return next(new NotConfirmedEmailException())
  
  if(user.changedCredentialsAt?.getTime() >= data.iat*1000)
    return next(new LoginAgainException())

  return user
}

export const authentication = async (req, res, next) => {
    const authorization = req.headers.authorization
    const user = await decodeToken({ authorization:authorization ,type:tokenTypes.access , next})
    
      if (!user) {
        return next(new notFoundException('user'))    }   
    req.user=user//here i send the data of user to next middleware
    next()
}

export const allowTo = (...roles) => {
  return async (req, res, next) => {
    const user = req.user //always after auth func.
    if (!roles.includes(user.role)) {
      throw  new notAuthorized()
    }
    next()
  }
}