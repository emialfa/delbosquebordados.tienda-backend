import User from "../models/user";
import { Request, Response } from "express";
import fetch from 'cross-fetch';
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerMail = require("../templates/registerMail");
const resetPasswordMail = require("../templates/resetPassword");
const passport = require("passport")
const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require("../authenticate")
const {google} = require('googleapis')
const {OAuth2} = google.auth

const client = new OAuth2(process.env.GOOGLE_EMAIL_CLIENT_ID)

export const getAllUsers = async (req: Request, res: Response) => {
  const userList = await User.find().select("email name isAdmin");
  const emailList = userList.filter((u) => u.email !== req.user?.email);
  if (!userList) return res.status(400).json({ success: false });
  
  return res.send(emailList);
};

export const getUserFromId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) return res.status(400).send({ success: false });
  
  return res.status(200).send(user);
};

export const getUserFromEmail = async (req: Request, res: Response) => {
  const user = await User.find({ email: req.user?.email }).select("-passwordHash");
  if (!user) return res.status(400).json({ success: false });
  
  return res.status(200).send(user);
};

export const update = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.user?.email });
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
  const userExist = await User.findOne({ email: req.user?.email });
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
  const user = await User.findById(req.user?._id)
  
  if (!user) return res.status(400).send({success: false}); 
  
  const token = getToken({ _id: req.user?._id })
  const refreshToken = getRefreshToken({ _id: req.user?._id })
  user.refreshToken?.push({ refreshToken })
  await user.save()
  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
  res.status(200)
      .send({
        success: true,
        user: user.email,
        token: token,
        favorites: user.favorites,
        cart: user.cart,
        isAdmin: user.isAdmin,
      });
};

export const loginGoogleAuth = async (req: Request, res: Response) => {
  const verify = await client.verifyIdToken({idToken: req.body.tokenId, audience: process.env.GOOGLE_EMAIL_CLIENT_ID})
            
  const {email_verified, email, name} = verify.payload
  if(!email_verified) return res.status(400).json({success:false, message: "Email verification failed."})

  const user = await User.findOne({email: email });
  
  if (user) {
    const token = getToken({ _id: user._id })
    const refreshToken = getRefreshToken({ _id: user._id })
    user.refreshToken?.push({ refreshToken })
    await user.save()
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    return res.status(200).send({
        success: true,
        user: user.email,
        token: token,
        favorites: user.favorites,
        cart: user.cart,
        isAdmin: user.isAdmin,
      });
  } else {
    let newUser = new User({
      success: true,
      email,
      name,
      favorites: req.body.favorites,
      cart: req.body.cart,
      refreshToken: [],
      passwordHash: bcrypt.hashSync(process.env.GOOGLE_PASSWORD, 10),
      isAdmin: false,
      activation: true,
    });
    const token = getToken({ _id: newUser._id })
    const refreshToken = getRefreshToken({ _id: newUser._id })
    newUser.refreshToken?.push({ refreshToken })
    await newUser.save()
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    return res.status(200).send({
        success: true,
        token: token,
        favorites: newUser.favorites,
        cart: newUser.cart,
        isAdmin: newUser.isAdmin,
      });
  }
};

export const loginFacebookAuth = async (req: Request, res: Response) => {
  const {accessToken, userID} = req.body

  const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
  
  const data:any = await fetch(URL).then((res:any) => res.json()).then((res:any) => {return res})

  const {email, name} = data            

  const user = await User.findOne({email: email });
  
  if (user) {
    const token = getToken({ _id: user._id })
    const refreshToken = getRefreshToken({ _id: user._id })
    user.refreshToken?.push({ refreshToken })
    await user.save()
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    return res.status(200).send({
        success: true,
        user: user.email,
        token: token,
        favorites: user.favorites,
        cart: user.cart,
        isAdmin: user.isAdmin,
      });
  } else {
    let newUser = new User({
      success: true,
      email,
      name,
      favorites: req.body.favorites,
      cart: req.body.cart,
      refreshToken: [],
      passwordHash: bcrypt.hashSync(process.env.GOOGLE_PASSWORD, 10),
      isAdmin: false,
      activation: true,
    });
    const token = getToken({ _id: newUser._id })
    const refreshToken = getRefreshToken({ _id: newUser._id })
    newUser.refreshToken?.push({ refreshToken })
    await newUser.save()
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    return res.status(200).send({
        success: true,
        token: token,
        favorites: newUser.favorites,
        cart: newUser.cart,
        isAdmin: newUser.isAdmin,
      });
  }
}
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

export const refreshToken = async (req: Request, res:Response) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (!refreshToken) return res.status(401).send({success:false,  message: "Unauthorized"})
  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const userId = payload._id;
  const user:any = await User.findOne({ _id: userId })
  if (!user) return res.status(401).send({success:false,  message: "Unauthorized"})
            // Find the refresh token against the user record in database
  const tokenIndex = user.refreshToken?.findIndex(
      (item:any) => item.refreshToken === refreshToken
  );

  if (tokenIndex === -1) res.status(401).send({success: false, message: "Unauthorized"});
            
  const token = getToken({ _id: userId });
  // If the refresh token exists, then create new one and replace it.
  const newRefreshToken = getRefreshToken({ _id: userId });
  user.refreshToken[Number(tokenIndex)] = { refreshToken: newRefreshToken }
  user.save()
  res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
  res.send({ success: true, token, isAdmin: user.isAdmin });                      
};

export const emailconfirm = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.user?.email });
  if (!userExist) return res.status(400).send("User dont exist.");
  if (userExist.activation) return res.status(200).json({ activation: true });
  
  const secret = process.env.secret;
  const token = jwt.sign(
    {
      userEmail: req.user?.email,
    },
    secret
  );

  const registerMailResponse = await registerMail(userExist.name, req.user?.email, token)
  if(!registerMailResponse) return res.status(400).json({success: false, message: registerMailResponse})

  return res.status(200).json({success: true, message: registerMailResponse})
};

export const confirm = async (req: Request, res: Response) => {
  const userExist = await User.findOne({ email: req.user?.email });
  if (!userExist) res.status(400).send({success: false});
  
  const user = await User.findByIdAndUpdate(
    userExist?._id,
    {
      activation: true,
    },
    { new: true }
  );
  return res.status(200).send(req.user?.email);
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

export const logout = async (req: Request, res: Response) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  const user:any = await User.findById(req.user?._id)
  const tokenIndex = user.refreshToken.findIndex(
    (item:any) => item.refreshToken === refreshToken
  );

  if (tokenIndex !== -1) {
    user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
  }

  user.save()
      
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.send({ success: true });
};
