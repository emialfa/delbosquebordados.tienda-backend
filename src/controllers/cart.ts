import { Request, Response } from "express";
import User from "../models/user";

export const getCart = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.user?.email }).select("cart");
  if (!user) res.status(400).send({ success: false });

  res.status(200).json({ cart: user?.cart });
};

export const addCart = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.user?.email });
  if (!user) res.status(400).send({ success: false });

  const userUpdated = await User.findByIdAndUpdate(user?._id, {
    cart: req.body.cart,
  });

  if (!userUpdated) return res.status(400).send({ success: false, message: "The cart cannot be updated" });

  res.status(200).send({ success: true, message: "Cart update successfully" });
};
