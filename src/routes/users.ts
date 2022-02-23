import { Router } from "express";
const router = Router();
const { authAdminJwt } = require("../helpers/jwt");
import {
  changepassword,
  confirm,
  deleteTestUser,
  deleteUser,
  emailconfirm,
  emailresetpassword,
  getAllUsers,
  getUserFromEmail,
  getUserFromId,
  login,
  loginGoogleAuth,
  register,
  refreshToken,
  update,
  logout
} from "../controllers/users";
const passport = require("passport")
const {verifyUser} = require("../authenticate")

router.get("/all", verifyUser, authAdminJwt, getAllUsers);

router.get("/logout", verifyUser, logout);

router.get("/:id", verifyUser, getUserFromId);

router.get("/", verifyUser, getUserFromEmail);

router.put("/update", verifyUser, update);

router.put("/changepassword", verifyUser, changepassword);

router.post("/login", passport.authenticate("local"), login);

router.post("/login/googleAuth", loginGoogleAuth);

router.post("/register", register);

router.post("/refreshToken", refreshToken)

router.post("/emailconfirm", verifyUser, emailconfirm);

router.post("/confirm", verifyUser, confirm);

router.post("/emailresetpassword", emailresetpassword);

router.delete("/usertest", deleteTestUser);

router.delete("/:id", verifyUser, authAdminJwt, deleteUser);

module.exports = router;