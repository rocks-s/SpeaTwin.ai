import axios from "axios";
import { time } from "console";
import FormData from "form-data";
import fs from "fs";
import crypto from "crypto"


const headers = {
    "x-api-key": process.env.HEYGEN_KEY,
    "Content-Type": "application/json"
}

const videoPayload = {
    "type": "avatar",
    "title": crypto.randomBytes(8).toString("hex"),
    "output_format": "mp4",
    "script": null,
    "voice_id": "453c20e1525a429080e2ad9e4b26f2cd",
    "aspect_ratio": "16:9",
}

const avatarPayload = { 
        "type": "photo",
        "name": crypto.randomBytes(8).toString("hex"),
        "file": {
            "type": "asset_id",
            "asset_id": null
        }
    }

const delay = async () => {

    await new Promise(resolve => setTimeout(resolve, 6000))

}

const genVideo = async (req, res) => {

    if (!req.file) {
        res.status(400).json(
            {message: 'Photo is required'})
        return
    }

    if (!req.body.script) {
        res.status(400).json(
            {message: 'Script is required'})
        return
    }

    const form = new FormData();

    form.append(
        "file",
        fs.createReadStream(req.file.path),
        req.file.originalname
    );

    // const assetUpload = await axios.post(
    //     "https://api.heygen.com/v3/assets",
    //     form,
    //     {
    //         headers: {
    //             ...headers,
    //             ...form.getHeaders()
    //         }
    //     }
    // );
    // const assetId = assetUpload.data.data.asset_id

    // await delay()

    // console.log('Asset is uploaded')

    // avatarPayload.file.asset_id = assetId

    // const makeAvatar = await axios.post(
    //         "https://api.heygen.com/v3/avatars",
    //         avatarPayload,
    //         {
    //             headers: headers
    //         }
    //     )

    // const avatarId = makeAvatar.data.data.avatar_item.id

    // videoPayload.avatar_id = avatarId

    // console.log('Avatar is created')

    // await delay()

    // videoPayload.script = req.body.script

    // const makeVideo = await axios.post(
    //         "https://api.heygen.com/v3/videos",
    //         videoPayload,
    //         {
    //             headers: headers
    //         }
        
    //     )

    // console.log(makeVideo.data)
    // const videoId = makeVideo.data.data.video_id
    // let videoStatus = makeVideo.data.data.status

    // if (videoStatus === 'failed') {
    //    res.status(500).json({'message': 'video creation failed'})
    //    return
    // }

    // let timeout = 7 * 60 // secs
    // let fetchDelay = 0
    // while (true) {

    //     if (delay >= timeout) {
    //         res.status(500).json({'message': 'video creation failed'})
    //         break
    //     }

    //     const getAvatar = await axios.get(
    //         `https://api.heygen.com/v3/videos/${videoId}`,
    //         {
    //             headers: headers
    //         }
            
    //     )

    //     videoStatus = getAvatar.data.status

    //     if (videoStatus === 'completed') {
    //         res.status(200).json({"data": {"video_url": getAvatar.data.video_url}})
    //         break
    //     }
    //     await new Promise(resolve => setTimeout(resolve, 10 * 1000))
    //     fetchDelay += 10
    // }
    console.log(req.file.path)
    console.log(req.body.script)

    res.status(200).json({"data": {"video_url": `
        https://files2.heygen.ai/aws_pacific/avatar_tmp/7421cf5cb12e4812a63c93a0bc360479/29339ca8706f41a085df8f077061971c.mp4?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Me%2520testwe%2520videdso.mp4%3B&x-s=vp&Expires=1785571062&Signature=B5YSP50Cdr8C15Y-XsU5fgmL7oJSHs9Aemn9-4P2vJtxfe8lhxyYQctqLJdKydfJ3tSy-XOT-uBwFRa4L~j9dgYaj7lZo9JR3TqADaJkFPHuWmo1dtSLD2baXNsQNNY3FTNlbI7tnyJCgsOJJ9IEqa2a-8AMmK8vIzMbLfe22gIwVIvo1zdy6sVpLlyowF5WmslAAgihP0Iim8Wj5HlPPu1wf4PzLlr0742b-jDeHUrMUx3qBNmslvTTTcR6zSJoNOTbisCTSeJGG4abcanuIe3UfH95lPIC0AtftUSe1PdEJLrtPX7LNAorKJ0VcHwUnJ6n-9Pdi1ve-VjW47tFMw__&Key-Pair-Id=K38HBHX5LX3X2H`}})
}


export default genVideo