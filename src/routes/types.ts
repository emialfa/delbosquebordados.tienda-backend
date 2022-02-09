import { Router } from "express";
const router = Router();
import { addType, deleteType, getType, getTypes, updateType } from "../controllers/types";
const { authAdminJwt } = require("../helpers/jwt");

router.get("/", getTypes)

router.get("/:id", getType)

router.post("/", authAdminJwt, addType)

router.put("/:id", authAdminJwt, updateType)

router.delete("/:id", authAdminJwt, deleteType)


module.exports= router;