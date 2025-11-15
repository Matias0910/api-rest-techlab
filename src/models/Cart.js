import { db } from "./firebase.js";
import { 
    collection, 
    doc, 
    getDoc, 
    setDoc,
    runTransaction, // 🔑 Esencial para el Checkout
    updateDoc
} from "firebase/firestore";

const cartsCollection = collection(db, "carts");
const ordersCollection = collection(db, "orders"); // Colección para guardar órdenes
const productsCollection = collection(db, "products"); // Referencia a productos

// --------------------------------------------------------------------------------------------------
// FUNCIONES CRUD BÁSICAS DEL CARRITO
// --------------------------------------------------------------------------------------------------

export const getOrCreateCart = async (userId) => {
    const cartRef = doc(cartsCollection, userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        return { id: cartSnap.id, ...cartSnap.data() };
    } else {
        const newCart = {
            userId: userId,
            items: [],
            createdAt: new Date().toISOString()
        };
        await setDoc(cartRef, newCart);
        return { id: userId, ...newCart };
    }
};

export const addItemToCart = async (userId, item) => {
    const cart = await getOrCreateCart(userId);
    const cartRef = doc(cartsCollection, userId);
    
    const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);

    if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += item.quantity;
    } else {
        cart.items.push(item);
    }

    await setDoc(cartRef, { ...cart, items: cart.items, updatedAt: new Date().toISOString() });
    
    return { id: userId, ...cart };
};

export const removeItemFromCart = async (userId, productId) => {
    const cart = await getOrCreateCart(userId);
    const cartRef = doc(cartsCollection, userId);

    const updatedItems = cart.items.filter(item => item.productId !== productId);

    if (updatedItems.length !== cart.items.length) {
        await setDoc(cartRef, { 
            ...cart, 
            items: updatedItems, 
            updatedAt: new Date().toISOString() 
        });
    }

    return { id: userId, ...cart, items: updatedItems };
};

export const updateItemQuantity = async (userId, productId, newQuantity) => {
    const cart = await getOrCreateCart(userId);
    const cartRef = doc(cartsCollection, userId);

    const existingItemIndex = cart.items.findIndex(i => i.productId === productId);

    if (existingItemIndex === -1) {
        return null; 
    }

    cart.items[existingItemIndex].quantity = newQuantity;

    await setDoc(cartRef, { ...cart, items: cart.items, updatedAt: new Date().toISOString() });
    
    return { id: userId, ...cart };
};

export const clearCart = async (userId) => {
    const cartRef = doc(cartsCollection, userId);
    await setDoc(cartRef, {
        userId: userId,
        items: [],
        updatedAt: new Date().toISOString()
    });
    return true;
};


// --------------------------------------------------------------------------------------------------
// 🛑 FUNCIÓN CRÍTICA: PROCESO DE CHECKOUT CON TRANSACCIÓN
// --------------------------------------------------------------------------------------------------

export const checkout = async (userId, shippingInfo = {}) => {
    const cartRef = doc(cartsCollection, userId);

    try {
        const order = await runTransaction(db, async (transaction) => {
            const cartSnap = await transaction.get(cartRef);

            if (!cartSnap.exists) {
                throw new Error("Carrito no encontrado.");
            }
            
            const cartData = cartSnap.data();
            const items = cartData.items;

            if (items.length === 0) {
                throw new Error("El carrito está vacío. Agrega productos antes de intentar el checkout.");
            }

            let totalAmount = 0;
            const orderItems = [];
            
            // 1. Verificar Stock y Reducir para cada ítem
            for (const item of items) {
                const productRef = doc(productsCollection, item.productId);
                const productSnap = await transaction.get(productRef);

                if (!productSnap.exists) {
                    throw new Error(`Producto ${item.productId} no encontrado en la base de datos.`);
                }
                
                const productData = productSnap.data();
                const currentStock = productData.stock;
                
                if (currentStock < item.quantity) {
                    throw new Error(`Stock insuficiente para ${productData.name}. Disponible: ${currentStock}, Solicitado: ${item.quantity}`);
                }

                const newStock = currentStock - item.quantity;
                
                // Reducir stock DENTRO de la transacción
                transaction.update(productRef, { stock: newStock });

                // Calcular total y preparar el ítem para la orden
                const itemPrice = item.priceAtPurchase * item.quantity;
                totalAmount += itemPrice;
                orderItems.push({
                    productId: item.productId,
                    name: productData.name, 
                    quantity: item.quantity,
                    price: item.priceAtPurchase 
                });
            }

            // 2. Crear la Orden
            const newOrderRef = doc(ordersCollection); 
            const newOrderData = {
                userId,
                items: orderItems,
                total: totalAmount,
                status: 'Pending',
                shippingInfo,
                createdAt: new Date().toISOString()
            };
            transaction.set(newOrderRef, newOrderData);

            // 3. Vaciar el Carrito
            transaction.set(cartRef, { userId, items: [], updatedAt: new Date().toISOString() });
            
            return { id: newOrderRef.id, ...newOrderData };
        });
        
        return order;

    } catch (error) {
        throw error;
    }
};