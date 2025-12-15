import { Router } from "express";
import * as messageService from "./message.service.js"
import { authentication } from "../../Middlewares/auth.js";
const router = Router({
    mergeParams:true  //Preserve the req.params values from the parent router[user].
})


router.post('/send-message{/:from}',messageService.sendMessage)
router.get('/get-all-messages',authentication,messageService.getALLMessages)
router.get('/get-message/:id',authentication,messageService.getMessage)
router.delete('/delete-message/:id',authentication,messageService.deleteMessage)
router.get('/',messageService.getUserMessages)

export default router