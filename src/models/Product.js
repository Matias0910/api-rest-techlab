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

// Trae todos y filtra localmente (case-insensitive)
export const getProductsByCategory = async (category) => {
    try {
        const allProducts = await getAllProducts(); 

        const filteredProducts = allProducts.filter(product => 
            product.categories && product.categories.some(cat => 
                cat.toLowerCase() === category.toLowerCase()
            )
        );

        return filteredProducts;
    } catch (error) {
        console.error("Error al buscar productos por categoría:", error);
        return [];
    }
}

// CORRECCIÓN: Asegura devolver null en caso de error
export const createProduct = async (data) => {
    try {
        const docRef = await addDoc(productsCollection, data);
        return {id: docRef.id, ...data};
    } catch (error) {
        console.error(error);
        return null; // Devuelve NULL si hay error
    }
};

// CORRECCIÓN: Asegura devolver false en caso de error
export const updateProduct = async (id, productData) => {
    try {
        const productRef = doc(productsCollection, id);
        const snapshot = await getDoc(productRef);
        if (!snapshot.exists()) {
            return false;
        }

        await setDoc(productRef, productData);
        return {id, ...productData};
    } catch (error) {
        console.error(error);
        return false;
    }
};

// CORRECCIÓN: Asegura devolver false en caso de error
export const updatePatchProduct = async (id, productData) => {
    try {
        const productRef = doc(productsCollection, id);
        const snapshot = await getDoc(productRef);
        if (!snapshot.exists()) {
            return false;
        }

        await updateDoc(productRef, productData);
        return {id, ...productData};
    } catch (error) {
        console.error(error);
        return false;
    }
};

// CORRECCIÓN: Asegura devolver false en caso de error
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
        return false;
    }
};
