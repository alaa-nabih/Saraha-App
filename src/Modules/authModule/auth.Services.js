import userModel, { Providers } from "../../DB/models/userModel.js"
import { notValidEmail , InvalidCredentialsException, notFoundException, otpExpiredException , inValidOtp , InValidLoginMethodException , NotConfirmedEmailException} from "../../utils/exceptions.js"
import  successHandler  from "../../utils/successHandler.js"
import jwt from "jsonwebtoken"
import { findOne , create , findByEmail , update } from "../../DB/Repository.js"
import { decodeToken, tokenTypes } from "../../Middlewares/auth.js"
import { compare, compareSync,  hashSync } from "bcrypt"
import { sendEmail , createOtp } from "../../utils/send-email.js"
import { template } from "../../utils/generateHtml.js"
import { OAuth2Client } from 'google-auth-library'
import { StatusCodes } from "http-status-codes"
const client = new OAuth2Client()


export const SignUp = async (req, res, next) => {
    const { name, email, password,Cpassword, phone, age, gender, role } = req.body
    const isExist = await findOne(userModel,{email})
    if (isExist) {
      return next(new notValidEmail())
    }

   const otp = createOtp()

    const html=template(otp,name,"email confirmation")
    await sendEmail({to:email,subject:"hello hakora",html:html})

    const user = await create(userModel,{
      name,
      email,
      password,
      Cpassword,
      age,
      gender,
      phone,
      role,
      emailOtp:{
        otp:otp,
        expiredAt:Date.now() + 1000*30
      }
    })
    successHandler({res, status:201,msg: "User created successfully",data:user})
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await findOne(userModel,{ email })

    if (!user) {
     throw new notFoundException('user')
   }

    if (!user || !compareSync(password,user.password)) {
      return next(new InvalidCredentialsException())
    }

    if (!user.confirmed) {
     throw new NotConfirmedEmailException()
   }

    if (user?.provider === Providers.google) {
    throw new InValidLoginMethodException()
}
   
    const acsessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_SIGNITURE, {
      expiresIn: "3h",
    })

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SIGNITURE,
      { expiresIn: "7d" }
    )

    successHandler({res,status:200,msg: "Login successful",
      data: {
       acsessToken,
       refreshToken,
    }})
}

export const refreshToken = async (req, res, next) => {
   const refreshToken = req.headers['refreshtoken']
    const user = await decodeToken({authorization:refreshToken , type:tokenTypes.refresh , next})
    const acsessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_SIGNITURE, {
      expiresIn: "3h",
    })

  successHandler({res,status: 200,msg: "Token refreshed successfully",data: {
      acsessToken,
    }})
}

export const getUserProfile = async (req, res) => {
    const user = req.user
    successHandler({res,status: 200,msg: "User retrieved successfully",data: { user }})
}

export const confirmEmail = async (req, res, next) => {
  // get data from req
  const { email,otp } = req.body

  // find and update user
  
  const user = await  findByEmail(userModel,email)
  if (!user)
   return next(new notFoundException('user'))

  if(!user.emailOtp.otp)
    throw new Error('emailOtp is not exist',{cause:409})
  //                1:03        1:06
  if(user.emailOtp.expiredAt < Date.now())
     return next(new otpExpiredException())

  if(!compareSync(otp,user.emailOtp.otp))    
    return next(new inValidOtp())

  //update "confirmed" to be 'true'
  await user.updateOne({
    confirmed:true,
    $unset:{
      emailOtp:""
    }
  })
  
    // send response
     successHandler({res, status:200,msg: "congratulations 🎉"})
}

export const reSendEmailOtp = async (req, res, next) => {
  const { email } = req.body
  const user = await findByEmail(userModel,email)
  if (!user) {
    throw new notFoundException('email')
  }

  if (user.confirmed) {
    throw new Error("already confirmed", { cause: 400 })
  }
//                   1:03          1:06
  if (user.emailOtp.expiredAt > Date.now()) {
    throw new Error("use last sendend otp", { cause: 400 })
  }

   const custom=customAlphabet('0123456789')
   const otp=custom(5)
   const subject = 'email confirmation (resend otp)'
   const html=template(otp,user.name,subject)
    await sendEmail({to:user.email,subject,html:html})

    await user.updateOne({
     emailOtp:{
        otp:otp,
        expiredAt:Date.now() + 1000*300
      }
  })

  return successHandler({ res })
}

export const forgetPass = async (req, res, next) => {
  const { email } = req.body
  const user = await findOne(userModel,{email})
  if (!user) {
    return next(new notFoundException('email')) 
  }

  if(!user.confirmed)
    throw new Error('user not confirmed',{cause:409})

  const custom = customAlphabet('01234567')
  const otp = custom(6)
  const subject = 'forget password'
  const html = template(otp, user.name, subject)
  await sendEmail({ to: user.email, html, subject })

user.passwordOtp = {
  otp: hashSync(otp, Number(process.env.BCRYPT_SALT_ROUNDS)),
  expiredAt: Date.now() + 1000 * 30
}

await user.save() 

  return successHandler({res})
}

export const changePass = async (req, res) => {
  const { email, otp, password } = req.body
  const user = await findByEmail(userModel,email)
  if (!user) {
    throw new notFoundException('user')
  }
  if (!user.passwordOtp.otp) {
    throw new Error('no otp exist', { cause: 409 });
  }
  
  if (user.passwordOtp.expiresAt <= Date.now()) {
    throw new otpExpiredException()
  }

  if (!compare(otp, user.passwordOtp.otp)) {
    throw new inValidOtp()
  }

  await update(userModel, { _id: user._id },{
    password,
    $unset: {
      passwordOtp: ""
    },
    changedCredentialsAt:Date.now()
  })

  return successHandler({ res })
}

export const updatePass= async(req,res)=>{
  const user=req.user
const isExist = await findByEmail(userModel,user.email)
 if (!isExist) {
    throw new notValidEmail()
  }

  const {password} = req.body
  user.password=password
  user.save()
return successHandler({res})

}

export const socialLogin = async (req, res) => {
  const idToken = req.body.idToken
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  })

  const data = ticket.getPayload()
  const { email, email_verified, given_name:name} = data

let user = await findByEmail(email) // null || {}
if (user?.provider === Providers.system) {
    throw new InValidLoginMethodException();
}

if (!user) {
  user = await userModel.create({
    email,
    firstName,
    lastName,
    confirmed: email_verified,
    provider: Providers.google
  })
}

if (!user.confirmed) {
  throw new NotConfirmedEmailException()
}

const accessToken = jwt.sign({
  _id: user._id
}, process.env.ACCESS_SIGNATURE, {
  expiresIn: "1 H"
})

const refreshToken = jwt.sign({
  _id: user._id
}, process.env.REFRESH_SIGNATURE, {
  expiresIn: "7 D"
})

return successHandler({
  res, data: {
    accessToken,
    refreshToken,
  },
  status: 200
})
}

export const updateEmail = async (req, res) => {
  const user = req.user
  const { email } = req.body
  if (user.email == email) {
    throw new Error('update your email with new email', { cause: StatusCodes.BAD_REQUEST })
  }

  const isExist = await findByEmail(userModel,email)
  if (isExist) {
    throw new notValidEmail()
  }

  const oldEmailOtp = createOtp()
  const oldEmailHTML = template(oldEmailOtp, user.name, "confirm update email")
  sendEmail({ to: user.email, subject: "confirm update email",html: oldEmailHTML })

  user.oldEmailOtp = {    
  otp: hashSync(oldEmailOtp,Number(process.env.BCRYPT_SALT_ROUNDS)),
  expiredAt: Date.now() + 1 * 60 * 60 * 1024
}

const newEmailOtp = createOtp()
const newEmailHTML = template(newEmailOtp, user.name, "confirm new email")
sendEmail({ to: email, subject: "confirm new email", html:newEmailHTML })

user.newEmailOtp = {
  otp: hashSync(newEmailOtp,Number(process.env.BCRYPT_SALT_ROUNDS)),
  expiredAt: Date.now() + 1 * 60 * 60 * 1024
}

user.newEmail=email
await user.save()
return successHandler({res})

}

export const confirmNewEmail = async (req, res) => {
  const user=req.user
  const { oldEmailOtp, newEmailOtp } = req.body
  
  if (user.oldEmailOtp.expiredAt <= Date.now() || user.newEmailOtp.expiredAt <= Date.now()) {
    throw new otpExpiredException()
  }  
  
  if (!compareSync(oldEmailOtp, user.oldEmailOtp.otp) || !compareSync(newEmailOtp, user.newEmailOtp.otp)) {    
    throw new inValidOtp()
  }
  
   user.email = user.newEmail

   user.newEmail = undefined
   user.newEmailOtp = undefined
   user.oldEmailOtp = undefined

   await user.save()

  return successHandler({ res })
}