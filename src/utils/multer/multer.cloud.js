import multer , {diskStorage} from 'multer'

export const fileTypes = {
  image: ['image/jpeg', 'image/png', 'image/jpg'],
  video: ['video/mp4']
}

export const upLoadToCloud =  (types=fileTypes.image) => {
  const storage = diskStorage({ })//no need to set destination because we are uploading to cloudinary not local storage.
 
    const fileFilter = (req, file, cb) => {
     if (!types.includes(file.mimetype)){  
    return cb(new Error('invalid file type'), false)
  }
  return cb(null, true)
}

  return multer({ storage, fileFilter })
}