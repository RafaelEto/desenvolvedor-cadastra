import express from "express";
import FilterController from "./app/controllers/FilterController";
import ProductController from "./app/controllers/ProductController";
const router = express.Router();

router.get("/filters", FilterController.index);
router.get("/products", ProductController.index);

export default router;
