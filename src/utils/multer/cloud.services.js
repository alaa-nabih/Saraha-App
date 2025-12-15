import cloudinary from "./cloudConfig.js"

export const uploadSingleFile = async ({ path, dest="" }) => {//when upload to cloudinary it return an object contain many info about the uploaded file.
    const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
        folder: `${process.env.CLOUD_FOLDERNAME}/${dest}`
    })
    return { secure_url, public_id }
}


export const destroyFile = async ({public_id}) => {
    await cloudinary.uploader.destroy(public_id)
}


export const uploadMultiFiles = async ({ paths = [], dest = "" }) => {
    if (paths.length == 0) {
        throw new Error('No files exist')
    }
    
    const images = []
    
    for (const path of paths) {
        const { public_id, secure_url } = await uploadSingleFile({ 
            path, 
            dest: `${process.env.CLOUD_FOLDERNAME}/${dest}` 
        })
        
        images.push({ public_id, secure_url })
    }
    
    return images
}

export const deleteByPrefix = async ({prefix=""}) => {
    await cloudinary.api.delete_resources_by_prefix(prefix)//delete all files in a specific folder
}