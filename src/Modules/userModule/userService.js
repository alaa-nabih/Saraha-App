import  userModel, { Roles }  from '../../DB/models/userModel.js'
import {  notFoundException } from '../../utils/exceptions.js'
import successHandler from '../../utils/successHandler.js'
import fs from 'fs/promises'
import { deleteByPrefix, destroyFile, uploadSingleFile , deleteFolder  } from '../../utils/multer/cloud.services.js'

export const updateBasicInfo = async (req, res, next) => {
  const { name, age, phone } = req.body
  const user = req.user

  user.age = age || user.age
  user.name = name || user.name
  user.phone = phone || user.phone

  await user.save()
  return successHandler({ res })
}

export const getUserProfile = async (req, res, next) => {
  const id = req.params.id
  const user = await userModel.findOne({
    isDeleted: false,
    _id: id
  }).select('name email phone password profileImage')
  if (!user) {
    throw new notFoundException('user')
  }
  user.profileImage = `${req.protocol}://${req.host}/${user.profileImage}`
  return successHandler({ res, data: user })
}

export const shareProfile = async (req, res, next) => {
  const user = req.user
  const link = `${req.protocol}://${req.host}/user/${user._id}`
  return successHandler({ res, data: link })
}

export const softDelete = async (req, res) => {
  const { id } = req.params
  const user = await userModel.findOne({
    isDeleted: false,
    _id: id
  })

  if(!user){
    throw new notFoundException('user')
  }

  if (user.role == Roles.admin) {
    throw new Error('admin can not be deleted')
  }

  user.isDeleted = true
  user.deletedBy = req.user._id

  await user.save()
  return successHandler({ res })
}

export const restoreAccount = async (req, res) => {
  const id = req.params.id
  const user = await userModel.findById(id)
  if (!user) {
    throw new notFoundException('user')
  }

  if (!user.isDeleted) {
    throw new Error('user not deleted', { cause: 400 })
  }

  if (user.deletedBy.toString() !== req.user._id.toString()) { 
    throw new Error("You can't restore this account", { cause: 401 })
  }
  user.deletedBy = undefined
  user.isDeleted = false
  await user.save()
  return successHandler({res})
}

export const hardDelete = async (req, res) => {
 const user = req.user
 if(user.profileImage.length > 0 || user.coverImages?.length > 0) {
  await deleteByPrefix({ prefix: `${process.env.CLOUD_FOLDERNAME}/users/${user._id}` })
  await deleteFolder( {folder:`./users/${user._id}`})
 }
 await userModel.deleteOne(user._id)
 return successHandler({res})
}

export const profileImageLocal = async (req, res) => { 
  console.log(req.file)
   
  const user = req.user
   if (user.profileImage) {
    try {
      await fs.access(user.profileImage) 
      await fs.unlink(user.profileImage) 
    } catch (error) {
      console.log("Old image does not exist, skipping delete.")
    }
  }
 
  return successHandler({ res })
}

export const profileImageCloud = async (req, res) => { 
  console.log(req.file)

  const user = req.user
  
    if (user.profileImage?.public_id) {
     await destroyFile({ public_id: user.profileImage.public_id }) // Delete old image from cloudinary
  }

  const { secure_url , public_id } = await uploadSingleFile({ path: req.file.path, dest: `users/${req.user._id}/profileImages` })
  
  user.profileImage = { secure_url, public_id }
  await user.save()
  return successHandler({ res })
}

export const coverImages = async (req, res) => {
    const user = req.user
    const paths = []
    
    req.files.map(file => {
        paths.push(file.path)
    })
    
    const coverImages = await uploadMultiFiles({ 
        paths, 
        dest: `users/${user._id}/coverImages` 
    })
    
    user.coverImages.push(...coverImages) 
    await user.save()
    
    successHandler({
        res,
        data: user
    })
}

export const getUserById = async (req, res) => {
  const { id } = req.params
  const user = await userModel.findById(id)
  return successHandler({
    res,
    data: user,
  })
}