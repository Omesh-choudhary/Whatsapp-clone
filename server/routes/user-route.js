import express from "express"
import { handleAddMessage, handleAudioMessage, handleGetIntialContacts, handleGetMessages, handleGetUsers, handleImageMessage } from "../controllers/user-controllers.js"
import multer from "multer"


const userRouter = express.Router()

const uploadImage = multer({dest:"uploads/images"})
const uploadAudio = multer({dest:"uploads/recordings"})

userRouter.route("/get-users/:id").get(handleGetUsers)
userRouter.route("/add-message").post(handleAddMessage)
userRouter.route("/add-image-message/:from/:to").post(uploadImage.single("image"),handleImageMessage)
userRouter.route("/add-audio-message/:from/:to").post(uploadAudio.single("audio"),handleAudioMessage)
userRouter.route("/get-messages/:from/:to").get(handleGetMessages)
userRouter.route("/get-intial-contacts/:from").get(handleGetIntialContacts)


export default userRouter