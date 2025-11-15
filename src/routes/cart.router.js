import { Router } from 'express';
import * as CartController from '../controllers/cart.controller.js';

const router = Router();

// Obtener el carrito del usuario actual
router.get('/', CartController.getCart);

// Añadir un producto al carrito
router.post('/add', CartController.addToCart);

// Eliminar un producto específico del carrito
router.delete('/remove', CartController.removeItem); 

// Actualizar la cantidad de un producto específico
router.patch('/update', CartController.updateQuantity); 

// PROCESAR CHECKOUT (CREAR ORDEN Y REDUCIR STOCK)
router.post('/checkout', CartController.checkoutProcess);

// Vaciar el carrito
router.delete('/clear', CartController.clearCart);

export default router;