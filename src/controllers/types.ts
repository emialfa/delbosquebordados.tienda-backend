import { Request, Response } from "express";
import Type from "../models/type";
import { removeFileToCloudinary, uploadFiletoCloudinary } from "../helpers/cloudinaryFiles";

export const getTypes = async (req: Request, res: Response) => {
    const types = await Type.find();
    if (!types) return res.status(400).json({ success: false });
    
    res.send(types);
};

export const getType = async (req: Request, res: Response) => {
  const typesList = await Type.findById(req.params.id);

  if (!typesList) return res.status(400).json({ success:false });

  res.status(200).send(typesList);
};

export const addType = async (req: Request, res: Response) => {
  let iconImage;
  if (req.body.icon) iconImage = req.body.icon;
  
  if (req.files) {
    const file: any = req.files.image;
    iconImage = await uploadFiletoCloudinary(file)
  }

  const type = new Type({
    name: req.body.name,
    icon: iconImage,
    color: req.body.color,
  });
  
  const typeCreateResponse = await type.save();
  if (!typeCreateResponse) return res.status(400).send({success:false, message: "The type cannot be created!"});

  res.status(200).send(typeCreateResponse);
};

export const updateType = async (req: Request, res: Response) => {
  let iconImage = "";
  const typeFind = await Type.findById(req.params.id);
  if (!typeFind) return res.status(400).send({success: false});
  
  if (req.body.icon) iconImage = req.body.icon;
  
  if (req.files) {
    const file: any = req.files.image;
    iconImage = await uploadFiletoCloudinary(file)
    await removeFileToCloudinary(`${typeFind?.icon}`)
  }

  const type = await Type.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: iconImage,
      color: req.body.color,
    },
    { new: true }
  );

  if (!type) return res.status(400).send({success: false, message: "The type cannot be created"});

  res.send(type);
};

export const deleteType = async (req: Request, res: Response) => {
  const typeFind = await Type.findById(req.params.id);
  if (!typeFind) return res.status(400).send({success: false});
  
  if (`${typeFind.icon}`.length > 0) {
    await removeFileToCloudinary(`${typeFind.icon}`)
  }

  const typeDeleteResponse = await Type.findByIdAndRemove(req.params.id)
  if (!typeDeleteResponse) return res.status(400).json({ success: false, message: "The type cannot be deleted!" });
      
  return res.status(200).json({ success: true, message: "the type is deleted!" });
};

