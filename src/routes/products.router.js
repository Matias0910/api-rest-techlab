import { Router } from "express";
import * as Controller from "../controllers/products.controller.js";

const router = Router();

// Rutas de búsqueda y filtrado deben ir antes de /:id
router.get("/search", Controller.searchProducts);
router.get("/", Controller.getAllProducts); 

// Rutas CRUD
router.get("/:id", Controller.getProductById);
router.post("/", Controller.createProduct); // El controller maneja /api/products por defecto, no /create
router.put("/:id", Controller.updateProduct);
router.patch("/:id", Controller.updatePatchProduct);
router.delete("/:id", Controller.deleteProduct);

export default router;