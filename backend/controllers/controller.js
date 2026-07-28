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

    const assetUpload = await axios.post(
        "https://api.heygen.com/v3/assets",
        form,
        {
            headers: {
                ...headers,
                ...form.getHeaders()
            }
        }
    );
    const assetId = assetUpload.data.data.asset_id

    await delay()

    console.log('Asset is uploaded')

    avatarPayload.file.asset_id = assetId

    const makeAvatar = await axios.post(
            "https://api.heygen.com/v3/avatars",
            avatarPayload,
            {
                headers: headers
            }
        )

    const avatarId = makeAvatar.data.data.avatar_item.id

    videoPayload.avatar_id = avatarId

    console.log('Avatar is created')

    await delay()

    videoPayload.script = req.body.script

    const makeVideo = await axios.post(
            "https://api.heygen.com/v3/videos",
            videoPayload,
            {
                headers: headers
            }
        
        )

    const videoId = makeVideo.data.data.video_id
    let videoStatus = makeVideo.data.data.status

    if (videoStatus === 'failed') {
       res.status(500).json({'message': 'video creation failed'})
       return
    }

    console.log('Video is inited')

    const timeout = 7 // mins
    const fetchDelay = 10 // secs
    let fetchTime = 0
    console.log('Start fetching')
    while (true) {
        console.log(timeout)

        if (fetchTime >= timeout * 60) {
            res.status(500).json({'message': 'video creation failed'})
            break
        }

        const getVideo = await axios.get(
            `https://api.heygen.com/v3/videos/${videoId}`,
            {
                headers: headers
            }
            
        )
        const videoStatus = getVideo.data.data.status

        if (videoStatus === 'completed') {
            res.status(200).json({"data": {"video_url": getVideo.data.data.video_url}})
            console.log("Video sended to client")
            break
        }
        await new Promise(resolve => setTimeout(resolve, fetchDelay * 1000))
        fetchTime += 10
    }


}


export default genVideo