import * as CartModel from "../models/Cart.js";
import * as ProductModel from "../models/Product.js";

// Obtener el carrito de un usuario
export const getCart = async (req, res) => {
    const userId = req.user.id; 
    
    try {
        const cart = await CartModel.getOrCreateCart(userId);
        res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el carrito." });
    }
};

// Añadir un producto al carrito
export const addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    
    if (!productId || quantity === undefined || quantity <= 0) {
        return res.status(422).json({ error: "productId y quantity (mayor que 0) son obligatorios." });
    }
    
    try {
        const product = await ProductModel.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        const item = {
            productId,
            quantity: parseInt(quantity),
            priceAtPurchase: product.price 
        };

        const updatedCart = await CartModel.addItemToCart(userId, item);
        
        res.status(200).json(updatedCart);

    } catch (error) {
        console.error("Error al añadir al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor al añadir al carrito." });
    }
};

// Eliminar un ítem del carrito
export const removeItem = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
        return res.status(422).json({ error: "El productId es obligatorio para eliminar un ítem." });
    }

    try {
        const updatedCart = await CartModel.removeItemFromCart(userId, productId);
        res.json(updatedCart);
    } catch (error) {
        console.error("Error al eliminar ítem del carrito:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el ítem." });
    }
};

// Actualizar la cantidad de un ítem
export const updateQuantity = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined || quantity < 0) {
        return res.status(422).json({ error: "El productId y la cantidad (quantity >= 0) son obligatorios." });
    }

    try {
        // Si la cantidad es 0, lo eliminamos
        if (quantity === 0) {
            const updatedCart = await CartModel.removeItemFromCart(userId, productId);
            return res.json(updatedCart);
        }

        const updatedCart = await CartModel.updateItemQuantity(userId, productId, parseInt(quantity));
        
        if (!updatedCart) {
            return res.status(404).json({ error: "Ítem no encontrado en el carrito." });
        }

        res.json(updatedCart);
    } catch (error) {
        console.error("Error al actualizar cantidad del carrito:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar la cantidad." });
    }
};

// Vaciar el carrito
export const clearCart = async (req, res) => {
    const userId = req.user.id;
    
    try {
        await CartModel.clearCart(userId);
        res.status(200).json({ message: "Carrito vaciado exitosamente." });
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor al vaciar el carrito." });
    }
};

// 🛑 Proceso de Checkout (Checkout Process)
export const checkoutProcess = async (req, res) => {
    const userId = req.user.id;
    const shippingInfo = req.body.shippingInfo || {}; 

    try {
        const order = await CartModel.checkout(userId, shippingInfo);
        
        res.status(201).json({ 
            message: "Orden creada y stock reducido exitosamente.", 
            order 
        });
    } catch (error) {
        // Manejo de errores específicos de la transacción (Stock insuficiente o Carrito vacío)
        if (error.message.includes("Stock insuficiente") || error.message.includes("El carrito está vacío")) {
             return res.status(400).json({ error: error.message });
        }
        
        console.error("Error durante el checkout:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar el checkout." });
    }
};