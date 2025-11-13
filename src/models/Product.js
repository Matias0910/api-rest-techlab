import { db } from "./firebase.js";

import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    setDoc,
    deleteDoc, 
    updateDoc,
    query,
    where
} from "firebase/firestore";

const productsCollection = collection(db, "products");

// Esta función trae todos los productos
export const getAllProducts = async () => {
    try {
      const snapshot = await getDocs(productsCollection);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching products from Firestore:", error);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const productRef = doc(productsCollection, id);
        const snapshot = await getDoc(productRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// 🛑 FUNCIÓN CORREGIDA: Trae todos y filtra localmente (case-insensitive)
export const getProductsByCategory = async (category) => {
    try {
        // 1. Obtener TODOS los productos (puede ser costoso)
        const allProducts = await getAllProducts(); 
        
        // 2. Definir el término de búsqueda en minúsculas
        const lowerCaseCategory = category.toLowerCase();

        // 3. Filtrar los productos en Node.js
        const filteredProducts = allProducts.filter(item => {
            if (!item.categories || !Array.isArray(item.categories)) {
                return false;
            }

            // Verifica si alguna categoría del producto (convertida a minúsculas)
            // incluye el término de búsqueda (case-insensitive)
            return item.categories.some(cat => 
                cat.toLowerCase().includes(lowerCaseCategory)
            );
        });

        return filteredProducts;
    } catch (error) {
        console.error("Error filtrando productos localmente:", error);
        return [];
    }
};

// Se revierte a la versión original, sin el campo categories_lower
export const createProduct = async (data) => {
    try {
      const docRef = await addDoc(productsCollection, data);
        return {id: docRef.id, ...data};
    } catch (error) {
    console.error(error);
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const productRef = doc(productsCollection, id);
        const snapshot = await getDoc(productRef);
        if (!snapshot.exists()) {
            return false;
        }

        // Se revierte a la versión original, sin lógica de categories_lower
        await setDoc(productRef, productData);
        return {id, ...productData};
    } catch (error) {
        console.error(error);
    }
};

export const updatePatchProduct = async (id, productData) => {
    try {
        const productRef = doc(productsCollection, id);
        const snapshot = await getDoc(productRef);
        if (!snapshot.exists()) {
            return false;
        }

        // Se revierte a la versión original, sin lógica de categories_lower
        await updateDoc(productRef, productData);
        return {id, ...productData};
    } catch (error) {
        console.error(error);
    }
};

export const deleteProduct = async (id) => {
    try {
        const productRef = doc(productsCollection, id);
        const snapshot = await getDoc(productRef);
        if (!snapshot.exists()) {
            return false;
        }

        await deleteDoc(productRef);
        return true;

    } catch (error) {
        console.error(error);
    }
};
