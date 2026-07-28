import express from "express"
import { photoUpload } from '../middleware/fileUploads.js'
import genVideo from "../controllers/controller.js"

const router = express.Router()


router.post(
    "/genVideo",
    photoUpload.single("photo"),
    genVideo);

export {
    router
}