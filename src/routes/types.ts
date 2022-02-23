import { Router } from "express";
const router = Router();
import { addType, deleteType, getType, getTypes, updateType } from "../controllers/types";
const { authAdminJwt } = require("../helpers/jwt");
const {verifyUser} = require("../authenticate")

router.get("/", getTypes)

router.get("/:id", getType)

router.post("/", verifyUser, authAdminJwt, addType)

router.put("/:id", verifyUser, authAdminJwt, updateType)

router.delete("/:id", verifyUser, authAdminJwt, deleteType)


module.exports= router;