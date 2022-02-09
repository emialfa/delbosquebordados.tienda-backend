import { Router } from "express";
const router = Router();
const { authJwt, authAdminJwt } = require("../helpers/jwt");
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
  registerGoogleAuth,
  update,
} from "../controllers/users";

router.get("/all", authAdminJwt, getAllUsers);

router.get("/:id", authJwt, getUserFromId);

router.get("/", authJwt, getUserFromEmail);

router.put("/update", authJwt, update);

router.put("/changepassword", authJwt, changepassword);

router.post("/login", login);

router.post("/login/googleAuth", loginGoogleAuth);

router.post("/register", register);

router.post("/register/googleAuth", registerGoogleAuth);

router.post("/emailconfirm", authJwt, emailconfirm);

router.post("/confirm", authJwt, confirm);

router.post("/emailresetpassword", emailresetpassword);

router.delete("/usertest", deleteTestUser);

router.delete("/:id", authAdminJwt, deleteUser);

module.exports = router;