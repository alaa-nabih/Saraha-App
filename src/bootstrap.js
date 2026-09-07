import express from "express"
import connectDB from "./DB/connection.js"
import authRouter from "./Modules/authModule/auth.Controller.js"
import userRouter from "./Modules/userModule/userController.js"
import messageModel from "./Modules/messageModule/message.controller.js"
import { notFoundException } from "./utils/exceptions.js"
import  corse from 'cors'
import { upLoadFileLocal } from "./utils/multer/multer.local.js"
import { authentication } from "./Middlewares/auth.js"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import morgan from 'morgan'

const bootstrap = async () => {
  const app = express()
  const port = process.env.PORT
  
  app.use(express.json())
  app.use(corse())
  app.use(morgan('combined'))
  app.use(helmet())//for security http headers 

  app.use(rateLimit({//to limit requests from same IP
  windowMs: 2 * 60 * 1000,
  limit: 10,
  legacyHeaders: false,
  standardHeaders: true,
}))

  await connectDB()

  app.get('/upload-file', authentication, upLoadFileLocal('user').single('image'), (req,res)=> {
    res.json({msg:'Done'})
  })

    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/message",messageModel)
  

    app.use('/uploads',express.static('./uploads'))
  
    app.all("{/*s}", (req, res, next) => {
    return next(new notFoundException('url'))
  }) 

  app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(err.statusCode || 500).json({
      error: err.message || "Internal Server Error",
      status: err.cause || 500,
    })
  })

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

export default bootstrap