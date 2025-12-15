import { messageModel } from "../../DB/models/message.mode.js"
import { userModel } from "../../DB/models/user.model.js"
import { findOne } from "../../DB/Repository.js"
import { NotFoundException } from "../../utils/exceptions.js"
import { successHandler } from "../../utils/successHandler.js"


export const sendMessage = async (req, res, next) => {
    const { to, content } = req.body
    const receiver = await userModel.findById(to)
    if (!receiver) {
        throw new NotFoundException('receiver id')
    }
    const from = req.params.from
    const data = {
        to,
        content
    }
    if (from) {
        const sender = await userModel.findById(from)
        if (!sender) {
            throw new NotFoundException('send id')
        }
        data.from = sender._id
    }
    const message = await messageModel.create(data)
    return successHandler({ res, message })
}

export const getALLMessages = async (req, res) => {
  const user = req.user
  const messages = await messageModel.find({ to: user._id }) .select('-to').populate([{
    path:'from',
    select:"firstName lastName email gender  profileImage.secure-url"
  }])
  return successHandler({ res, data: messages })
}

export const getMessage = async (req, res) => {
  const messageId = req.params.id
  const message = await findOne(messageModel,{ _id: messageId, to: req.user._id })
  .select('-to').populate([{
    path:'from',
    select:"firstName lastName email gender  profileImage.secure-url"
  }])
  if (!message) {
    throw new NotFoundException('message')
  }
  return successHandler({ res, data: message })
}

export const deleteMessage = async (req, res) => {
  const { id } = req.params
  const message = await findOne(messageModel,{ _id: id, to: req.user._id })
  if (!message) {
    throw new NotFoundException('message')
  }
  await message.deleteOne()
  return successHandler({ res })
}

export const getUserMessages = async (req, res) => {
  console.log({ params: req.params })
  const messages = await messageModel.find({ to: req.params.id })
  return successHandler({ res, data: messages })
}