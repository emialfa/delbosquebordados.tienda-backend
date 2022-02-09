import { v2 as cloudinary } from "cloudinary";
import {UploadedFile} from "express-fileupload";

export const uploadFiletoCloudinary = async (image: UploadedFile) => {
    try {
      const result = await cloudinary.uploader.upload(image.tempFilePath);
      return result.secure_url;
    } catch (err) {
      throw err;
    }
};

export const removeFileToCloudinary = async (urlIcon: string) => {    
    try {
    let url = urlIcon.split('/')
    await cloudinary.uploader.destroy(`${url[url.length-1].slice(0, -4)}`)
    } catch (err) {
        throw err;
    }
}

export const urlDefaultImage = "https://res.cloudinary.com/delbosque-tienda/image/upload/v1634497960/noImage_w4m5hg.png";
