import multer , {diskStorage, memoryStorage} from 'multer'

export const fileTypes = {
  image: ['image/jpeg', 'image/png', 'image/jpg'],
  video: ['video/mp4']
}

export const upLoadFileLocal =  (folderName = 'general',types=fileTypes.image) => {  
  const storage = memoryStorage()//files will be stored in memory as Buffer objects meaning they are not saved to disk immediately[not hard drive but in RAM]
    const fileFilter = (req, file, cb) => {
     if (!types.includes(file.mimetype)){  //check if the uploaded file type is in the allowed types[image/jpeg,image/png,image/jpg].
    return cb(new Error('invalid file type'), false)//mean that there is an error and reject the file
  }
  return cb(null, true)//mean that there is no error and accept the file
}
  return multer({ storage, fileFilter })
}