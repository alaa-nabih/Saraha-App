import nodemailer from 'nodemailer'
import { customAlphabet } from "nanoid"

export const sendEmail = async({to,subject,html}) => {
  // transporter >> generate
const transporter= nodemailer.createTransport({
    // service >> outlook , gmail , yahoo
    service:"gmail", 
    secure: false,
    auth: {
       user: process.env.EMAIL,
       pass: process.env.PASS
},
  tls:{rejectUnauthorized:false}
  })
  // send email
const info=await transporter.sendMail({
  from: process.env.EMAIL,
  to,
  subject,
  html,
//   attachments:[
//      {
//         filename:"text.txt",
//         content:"hajar"
//      }
// ],
})
if (info.rejected.length > 0) return false;
return true
}

export const createOtp = () => {
  const custom = customAlphabet('0123456789')
  const otp = custom(6)
  return otp
}