import { db } from "./firebase.js";
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";

const productsCollection = collection(db, "products");

export const getProductsCollection = () => productsCollection;

// READ: Obtener todos los productos
export const getAllProducts = async () => {
    const productsSnapshot = await getDocs(productsCollection);
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// READ: Obtener productos por categoría (Filtrado en el servidor)
export const getProductsByCategory = async (category) => {
    const allProducts = await getAllProducts();
    const normalizedCategory = category.toLowerCase();
    
    return allProducts.filter(product => 
        product.categories.some(cat => cat.toLowerCase().includes(normalizedCategory))
    );
};

// READ: Obtener un producto por ID
export const getProductById = async (id) => {
    const productRef = doc(productsCollection, id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
        return null;
    }
    return { id: productSnap.id, ...productSnap.data() };
};

// CREATE: Crear un producto
export const createProduct = async (data) => {
    const newProductRef = doc(productsCollection); 
    await setDoc(newProductRef, { 
        ...data, 
        createdAt: new Date().toISOString()
    });
    const productSnap = await getDoc(newProductRef);
    return { id: newProductRef.id, ...productSnap.data() };
};

// UPDATE: Actualizar todo el producto (PUT)
export const updateProduct = async (id, data) => {
    const productRef = doc(productsCollection, id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return null;
    }

    await setDoc(productRef, { 
        ...data,
        updatedAt: new Date().toISOString()
    });
    
    const updatedSnap = await getDoc(productRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
};

// UPDATE: Actualizar parcialmente el producto (PATCH)
export const updatePatchProduct = async (id, data) => {
    const productRef = doc(productsCollection, id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return null;
    }

    await updateDoc(productRef, { 
        ...data,
        updatedAt: new Date().toISOString()
    });
    
    const updatedSnap = await getDoc(productRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
};

// DELETE: Eliminar un producto
export const deleteProduct = async (id) => {
    const productRef = doc(productsCollection, id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return false;
    }

    await deleteDoc(productRef);
    return true;
};
