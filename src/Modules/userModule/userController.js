import { Router } from 'express'
const userRouter = Router()
import * as userervices from './userService.js'
import { getUserProfileByIdSchema , profileImageSchema, updateBasicInfoSchema} from './userValidation.js'
import { validation } from '../../Middlewares/validation.js'
import { allowTo, authentication } from '../../Middlewares/auth.js'
import { Roles } from '../../DB/models/userModel.js'
import { upLoadFileLocal } from '../../utils/multer/multer.local.js'
import {upLoadToCloud } from '../../utils/multer/multer.cloud.js'
import { storeFile } from '../../Middlewares/storeFile.middleware.js'
import messageRouter from '../messageModule/message.controller.js'

userRouter.use('/user/:id/messages',messageRouter)

userRouter.get('/share-profile',authentication,userervices.shareProfile)
userRouter.get('/:id',validation(getUserProfileByIdSchema),userervices.getUserProfile)

userRouter.patch('/update-basic-info',authentication,validation(updateBasicInfoSchema),userervices.updateBasicInfo)

userRouter.patch('/soft-delete/:id',authentication,allowTo(Roles.admin),userervices.softDelete)//allowTo is a middleware to allow only admin to soft delete users
userRouter.patch('/restore-account/:id',authentication,allowTo(Roles.admin),userervices.restoreAccount)//only admin can restore accounts
userRouter.delete('/hard-delete',authentication,userervices.hardDelete)

userRouter.patch(
    '/profile-image-upload',
    authentication,
    upLoadFileLocal('profile-images').single('profile-image'),
    //storeFile(),
   // validation(profileImageSchema),
    userervices.profileImageLocal)

userRouter.patch(
    '/profile-image-upload',
    authentication,
    upLoadToCloud().single('profile-image'),
    validation(profileImageSchema),
    userervices.profileImageCloud)

  userRouter.patch(
    '/cover-image-upload',
    authentication,
    upLoadToCloud().array('coverImage', 5),//max 5 images
    userervices.coverImages)  
   
   userRouter.get("/get-user/:id",userervices.getUserById) 
export default userRouter