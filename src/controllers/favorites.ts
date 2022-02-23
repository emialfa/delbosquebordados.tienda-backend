import { Request, Response } from "express";
import User from "../models/user";

export const getFavorites = async (req:Request, res:Response) => {
  const user = await User.findOne({email: req.user?.email}).select("favorites")
  if (!user) res.status(400).send({success: false});
  
  res.status(200).json({favorites : user?.favorites})
};


export const addFavorites = async (req:Request, res:Response) => {
  const user = await User.findOne({email: req.user?.email});
  if (!user) res.status(400).send({success: false});
  
  const userUpdated = await User.findByIdAndUpdate(user?._id, {
  favorites: req.body.favorites,
  });
  if (!userUpdated) return res.status(400).send({success: false, message: "The favorites cannot be updated"});

  res.status(200).send({success: true, message: "Added product successfully"});
};

