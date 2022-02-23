import { Router } from "express";
const router = Router();
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/categories";
const { authAdminJwt } = require("../helpers/jwt");
const {verifyUser} = require("../authenticate")

router.get("/", getCategories);

router.get("/:id", getCategory);

router.post("/", verifyUser, authAdminJwt, addCategory);

router.put("/:id", verifyUser, authAdminJwt,updateCategory);

router.delete("/:id", verifyUser, authAdminJwt,deleteCategory);

module.exports = router;
