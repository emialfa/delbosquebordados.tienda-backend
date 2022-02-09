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

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post("/", authAdminJwt, addProduct);

router.put("/:id", authAdminJwt, updateProduct);

router.delete("/:id", authAdminJwt, deleteProduct);

module.exports = router;
