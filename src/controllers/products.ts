import { Request, Response } from "express";
import Product from "../models/product";
import { removeFileToCloudinary, uploadFiletoCloudinary, urlDefaultImage } from "../helpers/cloudinaryFiles";
import {UploadedFile} from "express-fileupload";

export const getProducts = async (req: Request, res: Response) => {
    if (req.query.type && req.query.category) {
      const filter = `${req.query.category}`.replace("+", " ");
      const products = await Product.find({
        category: filter,
        type: req.query.type,
      });

      if (!products) res.status(400).json({ success: false });
      
      res.send(products);
    } else if (req.query.type) {
      const products = await Product.find({ type: req.query.type });

      if (!products) res.status(400).json({ success: false });
      
      res.send(products);
    } else if (req.query.category) {
      const filter = `${req.query.category}`.replace("+", " ");
      const products = await Product.find({ category: filter });

      if (!products) res.status(400).json({ success: false });

      res.send(products);
    } else {
      const products = await Product.find();
      if (!products) res.status(400).json({ success: false });
      res.send(products);
    }
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) res.status(400).json({ success: false });

  res.send(product);
};

export const addProduct = async (req: Request, res: Response) => {
  const arr: string[] = [];
  if (req.body.urls) arr.push(...req.body.urls.split(","));
  
  //SI LLEGAN ARCHIVOS, SE SUBEN A CLOUDINARY Y SE GUARDAN LAS URLS
  if (req.files) {
    const files: UploadedFile | UploadedFile[] = req.files.image;

    if (Array.isArray(files)) {
      for (const file of files) {
        const url = await uploadFiletoCloudinary(file);
        arr.push(url)
      }
    } else if (files) {
      const url = await uploadFiletoCloudinary(files);
      arr.push(url)
    }
  }
  if (arr.indexOf(urlDefaultImage) >= 0 && arr.length > 1) {
    arr.shift();
  }
  let product = new Product({
    ...req.body,
    image: arr[0],
    images: arr.length > 1 ? arr.filter((i, indice) => indice !== 0) : [],
  });
  product = await product.save();

  if (!product) return res.status(400).send({success: false, message: "The product cannot be created"});

  res.send(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const productFind = await Product.findById(req.params.id);
  if (!productFind) return res.status(400).send({success: false});
  
  const arr: string[] = [];
  //BORRANDO IMAGENES DE CLOUDIFY SI ES NECESARIO
  if (req.body.urls) {
    arr.push(...req.body.urls.split(","));
    if (arr.indexOf(`${productFind.image}`) < 0) {
      await removeFileToCloudinary(`${productFind.image}`)
    }
    productFind.images?.forEach(async (p) => {
      if (arr.indexOf(p) < 0) {
        await removeFileToCloudinary(p);
      }
    });
  }
  //SI LLEGAN ARCHIVOS, SE SUBEN A CLOUDINARY Y SE GUARDAN LAS URLS
  if (req.files) {
    const files: UploadedFile | UploadedFile[] = req.files.image;

    if (Array.isArray(files)) {
      for(const file of files){
        const url = await uploadFiletoCloudinary(file)
        arr.push(url)
      }
    } else if (files) {
      const url = await uploadFiletoCloudinary(files);
      arr.push(url)
    }
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      image: arr.length > 0 ? arr[0] : "",
      images: arr.length > 1 ? arr.filter((i, indice) => indice !== 0) : [],
    },
    { new: true }
  );

  if (!product) return res.status(400).send({success: false, message: "The product cannot be updated"});

  res.send(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productFind = await Product.findById(req.params.id);
  if (!productFind) return res.status(400).send({success: false});
  
  if (productFind.image && productFind.image !== urlDefaultImage) {
    await removeFileToCloudinary(`${productFind.image}`)
  }

  if (productFind.images && productFind.images.length > 0) {
    productFind.images?.forEach(async (im) => {
      await removeFileToCloudinary(im);
    });
  }

  const productDeleteResponse = await Product.findByIdAndRemove(req.params.id)
  if (!productDeleteResponse) return res.status(400).json({ success: false, message: "product not found!" });
      
  return res.status(200).json({ success: true, message: "the product is deleted!" });  
};
