import { db } from "./firebase.js";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

const usersCollection = collection(db, "users");

export const findUserByEmail = async (email) => {
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
};

export const createUser = async (email, password) => {
    const newDocRef = doc(usersCollection); 
    const newUser = {
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    await setDoc(newDocRef, newUser);

    return { id: newDocRef.id, email: newUser.email };
};
