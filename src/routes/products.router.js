import {Router} from "express";

const router = Router();

import { 
    getAllProducts,
    searchProducts,
    getProductById, 
    createProduct,
    updateProduct,
    updatePatchProduct,
    deleteProduct,  
} from "../controllers/products.controller.js";

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

router.post('/create', createProduct);

router.put('/:id', updateProduct);
router.patch('/:id', updatePatchProduct)

router.delete('/:id', deleteProduct);

export default router;