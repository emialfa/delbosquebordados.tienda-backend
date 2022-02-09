import { Request, Response } from "express";
const sucursalesCA = require('../helpers/sucursalesCA.json')

export const getCodPostal = async (req: Request, res: Response) =>{
    if (!req.params.codpostal) return res.status(400).json({success: false})
        
    let search = (suc:{codpostal:string|number}) => suc.codpostal == req.params.codpostal
    const listSucursalesCA = sucursalesCA.filter(search)

    if(!listSucursalesCA) return res.status(400).json({success: false})
     
    res.status(200).send(listSucursalesCA);
}
