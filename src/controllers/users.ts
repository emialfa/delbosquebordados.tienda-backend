import User from "../models/user";
import { Request, Response } from "express";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerMail = require("../templates/registerMail");
const resetPasswordMail = require("../templates/resetPassword");

export const getAllUsers = async (req: Request, res: Response) => {
  const userList = await User.find().select("email name isAdmin");
  const emailList = userList.filter((u) => u.email !== req.email);
  if (!userList) return res.status(400).json({ success: false });
  
  return res.send(emailList);
};

export const getUserFromId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) return res.status(400).send({ success: false });
  
  return res.status(200).send(user);
};

export const getUserFromEmail = async (req: Request, res: Response) => {
  const user = await User.find({ email: req.email }).select("-passwordHash");
  if (!user) return res.status(400).json({ success: false });
  
  return res.status(200).send(user);
};

export const update = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.email });
  if (!userExist) return res.status(400).json({ success: false});
  
  let newPassword;
  if (req.body.newPassword && bcrypt.compareSync(req.body.password, userExist.passwordHash)) {
    newPassword = bcrypt.hashSync(req.body.newPassword, 10);
  } else if (!req.body.newPassword) {
    newPassword = userExist.passwordHash;
  } else {
    return res.status(400).send("contraseña incorrecta");
  }

  const user = await User.findByIdAndUpdate(
    userExist._id,
    {...req.body},
    { new: true }
  );

  if (!user) return res.status(400).send({success: false});

  return res.status(200).send(user);
};

export const changepassword = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.email });
  if (!userExist) return res.status(400).json({ success: false});
  
  if (!req.body.password || req.body.password.length == 0) {
    return res.status(400).send("No has especificado ningun password");
  }

  const newPassword = bcrypt.hashSync(req.body.password, 10);
  const user = await User.findByIdAndUpdate(
    userExist._id,
    {
      passwordHash: newPassword,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be created!");

  return res.status(200).send(user);
};
export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({success: false}); 
  
  const secret = process.env.secret;
  if (!user.activation && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userEmail: user.email,
      },
      secret
    );
    return res.status(200).send({ success: true, regtoken: token });
  }
  
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userEmail: user.email,
        isAdmin: user.isAdmin,
      },
      secret
    );

    res
      .status(200)
      .send({
        success: true,
        user: user.email,
        token: token,
        favorites: user.favorites,
        cart: user.cart,
        isAdmin: user.isAdmin,
      });
  
  } else {
    return res.status(400).send({success: false});
  }
};

export const loginGoogleAuth = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({success: false});
  
  const secret = process.env.secret;

  const token = jwt.sign(
    {
      userEmail: user.email,
      isAdmin: user.isAdmin,
    },
    secret
  );

  return res
    .status(200)
    .send({
      user: user.email,
      token: token,
      favorites: user.favorites,
      cart: user.cart,
      isAdmin: user.isAdmin,
    });
};

export const register = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send({success: false});
  
  const secret = process.env.secret;
  const user = new User({
    ...req.body,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    activation: false,
  });
  const registerUserRes = await user.save();

  const token = jwt.sign(
    {
      userEmail: req.body.email,
    },
    secret
  );

  if (!registerUserRes) return res.status(400).send({success:false, message: "the user cannot be created!"});

  const registerMailRes = await registerMail(req.body.name, req.body.email, token)
  if (!registerMailRes) return res.status(400).send({success: false, message: registerMailRes, token });
  
  res.json({ success: true, message: 'The email has been sent.', token })
};

export const registerGoogleAuth = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send({success: false});
  
  let user = new User({
    ...req.body,
    passwordHash: bcrypt.hashSync(process.env.GOOGLE_PASSWORD, 10),
    isAdmin: false,
    activation: true,
  });

  const registerUserRes = await user.save();
  if (!registerUserRes) return res.status(400).send({success: false, message: "the user cannot be created!"});

  return res.status(200).send({success: true, message: user});
};

export const emailconfirm = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.email });
  if (!userExist) return res.status(400).send("User dont exist.");
  if (userExist.activation) return res.status(200).json({ activation: true });
  
  const secret = process.env.secret;
  const token = jwt.sign(
    {
      userEmail: req.email,
    },
    secret
  );

  const registerMailResponse = await registerMail(userExist.name, req.email, token)
  if(!registerMailResponse) return res.status(400).json({success: false, message: registerMailResponse})

  return res.status(200).json({success: true, message: registerMailResponse})
};

export const confirm = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.email });
  if (!userExist) res.status(400).send({success: false});
  
  const user = await User.findByIdAndUpdate(
    userExist?._id,
    {
      activation: true,
    },
    { new: true }
  );
  return res.status(200).send(req.email);
};

export const emailresetpassword = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!userExist) return res.status(400).send({success: false});
  
  const token = jwt.sign(
    {
      userEmail: req.body.email,
    },
    secret
  );

  const mailResponse = await resetPasswordMail(userExist.name, req.body.email, token)
  if (!mailResponse) return res.status(400).send({success: false, message: mailResponse});
  return res.status(200).send({success: false, mailResponse})
};

export const deleteTestUser = async (req: Request, res: Response) => {
  const userTest = await User.findOne({ email: "test@test.com" });
  if (!userTest) return res.status(400).json({ success: false });

  const userDeleteRes = await User.findByIdAndRemove(userTest._id)
  if (!userDeleteRes) return res.status(400).json({ success: false, message: "The user cannot be deleted." });
    
  return res.status(200).json({ success: true, message: "The user is deleted!" });  
};

export const deleteUser = async (req: Request, res: Response) => {
  const userDeleteRes = await User.findByIdAndRemove(req.params.id)
  if (!userDeleteRes) return res.status(400).json({ success: false, message: "The user cannot be deleted!" });
  
  return res.status(200).json({ success: true, message: "The user is deleted!" });     
};
