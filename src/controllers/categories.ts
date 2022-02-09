import { Request, Response } from "express";
import { removeFileToCloudinary, uploadFiletoCloudinary } from "../helpers/cloudinaryFiles";
import Category from "../models/category";

export const getCategories = async (req: Request, res: Response) => {
    const categories = await Category.find();
    if(!categories) res.status(400).json({success: false})
    
    res.send(categories);
};

export const getCategory = async(req: Request,res: Response)=>{
    const category = await Category.findById(req.params.id);
    if(!category) res.status(400).json({success: false})
    
    res.status(200).send(category);
}

export const addCategory = async (req: Request,res: Response)=>{
    let iconImage;
    if(req.body.icon) iconImage = req.body.icon;

    if(req.files){
        const file: any = req.files.image;
        iconImage = await uploadFiletoCloudinary(file)
    }
     
    let category = new Category({
        name: req.body.name,
        icon: iconImage,
        color: req.body.color
    })
    category = await category.save();

    if(!category) return res.status(400).send({success: false, message: 'The category cannot be created!'})

    res.send(category);
}


export const updateCategory = async (req: Request,res: Response)=> {
    let iconImage;
    const categoryFind = await Category.findById(req.params.id)
    if (!categoryFind) res.status(400).send({success: false})
    
    if(req.body.icon){
        iconImage = req.body.icon;
    }

    if(req.files){
        const file: any = req.files.image;
        iconImage = await uploadFiletoCloudinary(file)
        removeFileToCloudinary(`${categoryFind?.icon}`);
    }
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: iconImage,
            color: req.body.color,
        },
        { new: true}
    )

    if(!category) return res.status(400).send({success: false})

    res.send(category);
}

export const deleteCategory = async (req: Request,res: Response)=>{
    const categoryFind = await Category.findById(req.params.id)
    if (!categoryFind) {
        return res.status(404).send('category not found')
    }
    if (`${categoryFind.icon}`.length > 0){
        removeFileToCloudinary(`${categoryFind.icon}`)
    }

    const categoryUpdateResponse = await Category.findByIdAndRemove(req.params.id)
    if(!categoryUpdateResponse) return res.status(400).json({success: false , message: "The category cannot be deleted!"})
    
    return res.status(200).json({success: true, message: 'the category is deleted!'})
}

