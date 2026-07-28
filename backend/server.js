import express from "express"
import "dotenv/config";
import { router } from "./routes/routes.js"
import cors from "cors";

const app = express()
const port = 5000

app.use(cors());

app.use(express.json())
app.use('/api', router)

app.listen(port, () => {
    console.log('server started')
})