import { Router } from "express";
const router = Router();
const { authAdminJwt } = require("../helpers/jwt");

import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products";
const {verifyUser} = require("../authenticate")

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post("/", verifyUser, authAdminJwt, addProduct);

router.put("/:id", verifyUser, authAdminJwt, updateProduct);

router.delete("/:id", verifyUser, authAdminJwt, deleteProduct);

module.exports = router;
