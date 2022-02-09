import { Router } from "express";
const router = Router();
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/categories";

router.get("/", getCategories);

router.get("/:id", getCategory);

router.post("/", addCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;
