import { v2 as cloudinary } from "cloudinary"
import "dotenv/config"//`cloudinary` runs before dotenv so we need to import it here to load env variables before cloudinary config

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.CLOUD_API_SECRET,
  api_key: process.env.CLOUD_API_KEY
})
export default cloudinary